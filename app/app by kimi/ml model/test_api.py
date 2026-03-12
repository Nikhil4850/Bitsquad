"""
Temporary test endpoint for ML model without authentication
"""
import os
import tempfile
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from document_scanner import DocumentScanner
from document_classifier import DocumentClassifier

# Global components
scanner: Optional[DocumentScanner] = None
classifier: Optional[DocumentClassifier] = None

# Create FastAPI app
app = FastAPI(
    title="Test ML API",
    description="Test endpoint for ML model without authentication",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize components"""
    global scanner, classifier
    try:
        scanner = DocumentScanner()
        classifier = DocumentClassifier()
        print("✅ Test ML API started successfully")
    except Exception as e:
        print(f"❌ Error initializing components: {e}")

@app.get("/")
async def root():
    return {"status": "Test ML API is running", "endpoints": ["/test-classify"]}

@app.get("/test-classify")
async def test_classify_get():
    return {"message": "Test classify endpoint is working"}

@app.post("/test-classify")
async def test_classify_document(file: UploadFile = File(...)):
    """Test document classification without authentication"""
    try:
        # Validate file type
        allowed_extensions = {'pdf', 'docx', 'txt', 'md', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'}
        file_ext = file.filename.split('.')[-1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            # Process with ML model
            if scanner and classifier:
                # Extract text
                extracted_text = scanner.extract_text(temp_file_path)
                
                # Classify document
                classification = classifier.classify_document(temp_file_path, extracted_text)
                
                return {
                    "success": True,
                    "document_type": classification.get("document_type", "Unknown"),
                    "category": classification.get("category", "Unknown"),
                    "confidence": classification.get("confidence", 0.0),
                    "extracted_text": extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
                    "summary": f"This document was classified as {classification.get('document_type', 'unknown')} with {classification.get('confidence', 0):.2f} confidence."
                }
            else:
                return {
                    "success": True,
                    "document_type": "TEST",
                    "category": "Test Document",
                    "confidence": 1.0,
                    "extracted_text": "Test extracted text from ML model",
                    "summary": "This is a test summary from the ML model."
                }
                
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)

    except Exception as e:
        print(f"Error processing document: {e}")
        return {
            "success": False,
            "error": str(e),
            "document_type": "Error",
            "category": "Processing Error",
            "confidence": 0.0,
            "extracted_text": "Error occurred during processing",
            "summary": f"Processing error: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run(
        "test_api:app",
        host="0.0.0.0",
        port=5001,
        reload=True,
    )
