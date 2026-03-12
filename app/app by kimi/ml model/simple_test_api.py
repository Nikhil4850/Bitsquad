"""
Simple test endpoint without OCR dependencies
"""
import os
import tempfile
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Simple Test ML API",
    description="Simple test endpoint without OCR",
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

@app.get("/")
async def root():
    return {"status": "Simple Test ML API is running", "endpoints": ["/test-classify"]}

@app.post("/test-classify")
async def test_classify_document(file: UploadFile = File(...)):
    """Test document classification without OCR"""
    try:
        # Validate file type
        allowed_extensions = {'pdf', 'docx', 'txt', 'md', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'}
        file_ext = file.filename.split('.')[-1].lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")

        # Read file content
        content = await file.read()
        file_size = len(content)
        
        # Simulate ML processing
        if file_ext in ['jpg', 'jpeg', 'png']:
            document_type = "Image Document"
            category = "Scanned Document"
            confidence = 0.85
            extracted_text = f"This is a simulated text extraction from a {file_ext} image file (Size: {file_size} bytes). In a real implementation, this would use OCR to extract text from the image."
            summary = f"The uploaded image file ({file_ext}) has been processed and classified as a {document_type} with {confidence:.1%} confidence."
        elif file_ext == 'pdf':
            document_type = "PDF Document"
            category = "Digital Document"
            confidence = 0.95
            extracted_text = f"This is a simulated text extraction from a PDF file (Size: {file_size} bytes). In a real implementation, this would extract text from the PDF content."
            summary = f"The PDF document has been processed and classified as a {document_type} with {confidence:.1%} confidence."
        else:
            document_type = "Text Document"
            category = "Document"
            confidence = 0.90
            extracted_text = f"This is a simulated text extraction from a {file_ext} file (Size: {file_size} bytes)."
            summary = f"The text document has been processed and classified as a {document_type} with {confidence:.1%} confidence."

        return {
            "success": True,
            "document_type": document_type,
            "category": category,
            "confidence": confidence,
            "extracted_text": extracted_text,
            "summary": summary
        }

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
        "simple_test_api:app",
        host="0.0.0.0",
        port=5002,
        reload=True,
    )
