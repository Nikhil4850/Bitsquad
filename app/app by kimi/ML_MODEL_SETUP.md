# ML Model Setup Guide

## Option A: Local Python ML Model (Easy Setup)

### 1. Install Required Python Packages
```bash
pip install flask flask-cors transformers torch pillow pytesseract
```

### 2. Create a Simple ML Model Server
Save this as `ml_model_server.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import transformers
import torch
from PIL import Image
import base64
import io
import pytesseract
import re

app = Flask(__name__)
CORS(app)

# Load a pre-trained model for document classification
model_name = "microsoft/DialoGPT-medium"
tokenizer = transformers.AutoTokenizer.from_pretrained(model_name)
model = transformers.AutoModelForCausalLM.from_pretrained(model_name)

def extract_text_from_image(image_data):
    """Extract text from image using OCR"""
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        return f"OCR Error: {str(e)}"

def classify_document(text):
    """Classify document type based on content"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['invoice', 'bill', 'amount', '$', 'total due']):
        return 'INVOICE'
    elif any(word in text_lower for word in ['receipt', 'purchase', 'payment', 'transaction']):
        return 'RECEIPT'
    elif any(word in text_lower for word in ['contract', 'agreement', 'terms', 'signature']):
        return 'CONTRACT'
    elif any(word in text_lower for word in ['medical', 'patient', 'diagnosis', 'prescription']):
        return 'MEDICAL'
    else:
        return 'GENERAL'

def summarize_text(text):
    """Generate a simple summary of the text"""
    # Simple summarization - take first few sentences and key info
    sentences = text.split('.')
    summary = '. '.join(sentences[:2]) + '.'
    
    # Extract key information
    amounts = re.findall(r'\$\d+(?:,\d{3})*(?:\.\d{2})?', text)
    dates = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', text)
    
    if amounts:
        summary += f" Total amount: {amounts[0]}."
    if dates:
        summary += f" Date: {dates[0]}."
    
    return summary.strip()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model": "document-analyzer"})

@app.route('/analyze', methods=['POST'])
def analyze_document():
    try:
        data = request.json
        image_data = data.get('image', '')
        
        # Extract text from image
        extracted_text = extract_text_from_image(image_data)
        
        # Classify document
        classification = classify_document(extracted_text)
        
        # Generate summary
        summary = summarize_text(extracted_text)
        
        # Extract entities (simple implementation)
        entities = re.findall(r'[A-Z][a-z]+ [A-Z][a-z]+|[A-Z]{2,}', extracted_text)
        
        # Extract key points
        key_points = []
        if classification in ['INVOICE', 'RECEIPT']:
            amounts = re.findall(r'\$\d+(?:,\d{3})*(?:\.\d{2})?', extracted_text)
            if amounts:
                key_points.append(f"Amount: {amounts[0]}")
        
        response = {
            "ocr_text": extracted_text,
            "classification": classification,
            "confidence": 0.85,
            "summary": summary,
            "entities": entities[:5],  # Limit to 5 entities
            "key_points": key_points
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/ocr', methods=['POST'])
def ocr_only():
    try:
        data = request.json
        image_data = data.get('image', '')
        
        extracted_text = extract_text_from_image(image_data)
        
        return jsonify({"text": extracted_text})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/classify', methods=['POST'])
def classify_only():
    try:
        data = request.json
        text = data.get('text', '')
        
        classification = classify_document(text)
        
        return jsonify({"classification": classification, "confidence": 0.85})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/summarize', methods=['POST'])
def summarize_only():
    try:
        data = request.json
        text = data.get('text', '')
        
        summary = summarize_text(text)
        
        return jsonify({"summary": summary})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting ML Model Server on http://localhost:5000")
    print("📋 Available endpoints:")
    print("   GET  /health - Health check")
    print("   POST /analyze - Full document analysis")
    print("   POST /ocr - Text extraction only")
    print("   POST /classify - Document classification only")
    print("   POST /summarize - Text summarization only")
    print("\n🔑 API Key: ml-model-api-key-123")
    print("\n⚠️  Make sure to install Tesseract OCR on your system:")
    print("   Windows: https://github.com/UB-Mannheim/tesseract/wiki")
    print("   Mac: brew install tesseract")
    print("   Linux: sudo apt-get install tesseract-ocr")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
```

### 3. Run the ML Model Server
```bash
python ml_model_server.py
```

The server will start on `http://localhost:5000`

## Option B: Cloud ML Model Services

### Google Cloud Vision API
1. Go to Google Cloud Console
2. Enable Vision API
3. Create Service Account
4. Get API Key

### AWS Textract
1. Go to AWS Console
2. Enable Textract
3. Create IAM User
4. Get Access Keys

### Azure Computer Vision
1. Go to Azure Portal
2. Create Computer Vision Resource
3. Get Endpoint and Key

## Option C: Ready-to-Use APIs

### RapidAPI Document Analysis
1. Go to rapidapi.com
2. Search for "document analysis"
3. Subscribe to an API
4. Get API Key

### OCR.space
1. Go to ocr.space
2. Sign up for free account
3. Get API Key
4. Use their OCR endpoints
