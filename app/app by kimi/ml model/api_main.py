"""
FastAPI Document Summarizer with API Key Authentication
"""
import os
import tempfile
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv
import uvicorn

from document_scanner import DocumentScanner
from groq_summarizer import GroqSummarizer
from legal_summarizer import LegalSummarizer
from document_classifier import DocumentClassifier
from api_key_manager import APIKeyManager, get_api_key_manager

# Load environment variables
load_dotenv()

# Global components
scanner: Optional[DocumentScanner] = None
summarizer: Optional[GroqSummarizer] = None
legal_summarizer: Optional[LegalSummarizer] = None
classifier: Optional[DocumentClassifier] = None
api_key_manager: Optional[APIKeyManager] = None

security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup/shutdown"""
    global scanner, summarizer, legal_summarizer, classifier, api_key_manager

    # Startup
    try:
        scanner = DocumentScanner()
        summarizer = GroqSummarizer()
        legal_summarizer = LegalSummarizer()
        classifier = DocumentClassifier()
        api_key_manager = get_api_key_manager()

        # Generate a default API key if none exist
        if not api_key_manager.list_keys():
            key_id, full_key = api_key_manager.generate_key(
                name="Default API Key",
                expires_days=365,
                permissions=["summarize", "classify", "admin"]
            )
            print("=" * 60)
            print("🚀 DOCUMENT SUMMARIZER API STARTED")
            print("=" * 60)
            print(f"\n📋 Generated Default API Key:")
            print(f"   {full_key}")
            print(f"\n💾 Key ID: {key_id}")
            print("\n⚠️  Save this key - it won't be shown again!")
            print("=" * 60)
        else:
            print("=" * 60)
            print("🚀 DOCUMENT SUMMARIZER API STARTED")
            print("=" * 60)
            print(f"\n📊 Active API Keys: {len(api_key_manager.list_keys())}")
            print("=" * 60)

        yield

    except Exception as e:
        print(f"Error initializing components: {e}")
        raise

    # Shutdown
    print("\n👋 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Document Summarizer API",
    description="AI-powered document summarization with legal document analysis",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API key from Authorization header"""
    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    key_data = api_key_manager.validate_key(token)

    if not key_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired API key",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return key_data


# ============ API KEY MANAGEMENT ENDPOINTS ============

@app.post("/api/keys/generate", response_model=dict)
async def generate_api_key(
    name: str = Form("New API Key"),
    expires_days: Optional[int] = Form(None),
    admin_key: str = Form(...)
):
    """Generate a new API key (requires admin key from environment)"""
    # Verify admin key
    if admin_key != os.getenv("ADMIN_KEY", "admin123"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid admin key"
        )

    key_id, full_key = api_key_manager.generate_key(
        name=name,
        expires_days=expires_days,
        permissions=["summarize", "classify"]
    )

    return {
        "message": "API key generated successfully",
        "key_id": key_id,
        "api_key": full_key,
        "name": name,
        "warning": "Save this key - it won't be shown again!"
    }


@app.get("/api/keys/list", response_model=dict)
async def list_api_keys(
    key_data: APIKeyManager = Depends(verify_api_key)
):
    """List all API keys (admin only)"""
    if "admin" not in key_data.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permission required"
        )

    keys = api_key_manager.list_keys()
    return {
        "total_keys": len(keys),
        "active_keys": sum(1 for k in keys if k["is_active"]),
        "keys": keys
    }


@app.post("/api/keys/{key_id}/revoke", response_model=dict)
async def revoke_api_key(
    key_id: str,
    key_data: APIKeyManager = Depends(verify_api_key)
):
    """Revoke an API key (admin only)"""
    if "admin" not in key_data.permissions:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin permission required"
        )

    if api_key_manager.revoke_key(key_id):
        return {"message": f"API key {key_id} revoked successfully"}
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )


@app.get("/api/keys/my-key", response_model=dict)
async def get_my_key_info(
    key_data: APIKeyManager = Depends(verify_api_key)
):
    """Get information about the currently used API key"""
    return api_key_manager.get_key_info(key_data.key_id)


# ============ DOCUMENT PROCESSING ENDPOINTS ============

@app.post("/api/classify", response_model=dict)
async def classify_document(
    file: UploadFile = File(...),
    key_data: APIKeyManager = Depends(verify_api_key)
):
    """Auto-detect document type and category"""
    # Validate file type
    allowed_extensions = {'pdf', 'docx', 'txt', 'md', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'}
    file_ext = file.filename.split('.')[-1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"
        )

    # Save file temporarily
    temp_path = os.path.join(tempfile.gettempdir(), file.filename)

    try:
        # Save uploaded file
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract text
        text = scanner.scan_document(temp_path)
        if not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from document"
            )

        # Classify document
        classification = classifier.quick_detect(text)

        return {
            "is_legal": classification['is_legal'],
            "confidence": classification['confidence'],
            "category": classification['category'],
            "subcategory": classification['subcategory'],
            "category_display": classification['category_display'],
            "subcategory_display": classification['subcategory_display'],
            "suggested_mode": classification['suggested_mode'],
            "indicators_count": classification['indicators_count']
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification error: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/api/summarize", response_model=dict)
async def summarize_document(
    file: UploadFile = File(...),
    detail_level: str = Form("medium"),
    document_type: str = Form("general"),
    key_data: APIKeyManager = Depends(verify_api_key)
):
    """Generate document summary"""
    # Validate file type
    allowed_extensions = {'pdf', 'docx', 'txt', 'md', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'}
    file_ext = file.filename.split('.')[-1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"
        )

    temp_path = os.path.join(tempfile.gettempdir(), file.filename)

    try:
        # Save uploaded file
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract text
        text = scanner.scan_document(temp_path)
        if not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from document"
            )

        # Generate summary based on document type
        if document_type == "legal":
            summary = legal_summarizer.summarize_legal_document(text, detail_level)
        else:
            summary = summarizer.summarize_with_details(text, detail_level)

        return {
            "summary": summary,
            "document_type": document_type,
            "detail_level": detail_level,
            "filename": file.filename
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Summarization error: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/api/summarize-legal", response_model=dict)
async def summarize_legal_document(
    file: UploadFile = File(...),
    analysis_type: str = Form("comprehensive"),
    key_data: APIKeyManager = Depends(verify_api_key)
):
    """Specialized legal document analysis"""
    # Validate file type
    allowed_extensions = {'pdf', 'docx', 'txt', 'md', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'}
    file_ext = file.filename.split('.')[-1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed: {', '.join(allowed_extensions)}"
        )

    temp_path = os.path.join(tempfile.gettempdir(), file.filename)

    try:
        # Save uploaded file
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract text
        text = scanner.scan_document(temp_path)
        if not text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from document"
            )

        # Route to appropriate legal analysis
        if analysis_type == "contract":
            summary = legal_summarizer.analyze_contract(text)
        elif analysis_type == "court":
            summary = legal_summarizer.analyze_court_document(text)
        elif analysis_type == "executive":
            summary = legal_summarizer.quick_legal_summary(text)
        else:
            summary = legal_summarizer.summarize_legal_document(text, analysis_type)

        return {
            "summary": summary,
            "document_type": "legal",
            "analysis_type": analysis_type,
            "filename": file.filename
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Legal analysis error: {str(e)}"
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# ============ HEALTH & INFO ENDPOINTS ============

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Document Summarizer API",
        "version": "1.0.0",
        "components": {
            "scanner": scanner is not None,
            "summarizer": summarizer is not None,
            "legal_summarizer": legal_summarizer is not None,
            "classifier": classifier is not None
        }
    }


@app.get("/api/info")
async def api_info():
    """API information"""
    return {
        "name": "Document Summarizer API",
        "version": "1.0.0",
        "description": "AI-powered document summarization with Groq AI",
        "features": [
            "Document text extraction (PDF, DOCX, TXT, images)",
            "AI-powered summarization",
            "Legal document analysis",
            "Auto document type detection",
            "API key authentication"
        ],
        "endpoints": {
            "POST /api/classify": "Auto-detect document type",
            "POST /api/summarize": "Generate document summary",
            "POST /api/summarize-legal": "Legal document analysis",
            "GET /api/keys/list": "List API keys (admin)",
            "POST /api/keys/generate": "Generate new API key (admin)"
        }
    }


# ============ STATIC FILES ============

@app.get("/")
async def root():
    """Serve the web interface"""
    return FileResponse("index.html")


@app.get("/{filename}")
async def static_files(filename: str):
    """Serve static files"""
    if os.path.exists(filename):
        return FileResponse(filename)
    raise HTTPException(status_code=404, detail="File not found")


if __name__ == "__main__":
    uvicorn.run(
        "api_main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )
