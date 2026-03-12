# Simple ML Model Server for Document Analysis
# Save this as: simple_ml_server.py

import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

def extract_text_from_image(image_data):
    """Simulate OCR text extraction"""
    # For demo, return simulated document text
    document_types = [
        {
            "type": "INVOICE",
            "text": f"""INVOICE #{datetime.now().strftime('%Y%m%d%H%M%S')}

Bill To:
Customer Services Inc.
123 Business Avenue
New York, NY 10001

Item Description                Qty    Price    Total
Web Development Services       40    $150.00  $6,000.00
Technical Consulting           20    $200.00  $4,000.00
Software Licensing             1     $2,500.00 $2,500.00

Subtotal: $12,500.00
Tax (8.5%): $1,062.50
Total Due: $13,562.50

Payment Terms: Net 30
Due Date: {(datetime.now() + datetime.timedelta(days=30)).strftime('%m/%d/%Y')}

Thank you for your business!""",
            "summary": "Professional services invoice totaling $13,562.50 for web development, consulting, and software licensing. Payment due within 30 days."
        },
        {
            "type": "RECEIPT", 
            "text": f"""RECEIPT #{datetime.now().strftime('%Y%m%d%H%M%S')}

Store: TechMart Electronics
Date: {datetime.now().strftime('%m/%d/%Y')}
Time: {datetime.now().strftime('%I:%M:%S %p')}

Items Purchased:
Laptop Computer            $899.99
Wireless Mouse             $29.99
USB-C Hub                 $49.99
Extended Warranty         $129.99

Subtotal:                 $1,109.96
Sales Tax (8%):            $88.80
Total:                    $1,198.76

Payment Method: Credit Card
Transaction ID: TXN{datetime.now().strftime('%Y%m%d%H%M%S')}

Thank you for shopping with us!""",
            "summary": "Electronics purchase receipt showing laptop, mouse, USB hub and warranty totaling $1,198.76 paid by credit card."
        },
        {
            "type": "CONTRACT",
            "text": f"""SERVICE AGREEMENT

Agreement Date: {datetime.now().strftime('%m/%d/%Y')}

Parties:
Service Provider: Digital Solutions LLC
Client: Progressive Enterprises

Scope of Work:
1. Custom Software Development
2. System Integration Services
3. Technical Support & Maintenance
4. Project Management

Project Duration: 12 months
Total Contract Value: $75,000
Payment Schedule:
- 25% upon signing: $18,750
- 50% at 6 months: $37,500
- 25% upon completion: $18,750

Deliverables:
- Monthly progress reports
- Quality assurance testing
- User training sessions
- Technical documentation

Terms and Conditions:
- Work to be performed Monday-Friday, 9AM-5PM
- Changes require written approval
- Confidentiality clause applies
- Dispute resolution through arbitration

Signatures:
_____________________
Digital Solutions LLC
Authorized Representative

_____________________
Progressive Enterprises
Authorized Representative""",
            "summary": "12-month service agreement worth $75,000 for software development and integration services with milestone-based payments."
        }
    ]
    
    # Return random document type for demo
    import random
    selected_doc = random.choice(document_types)
    return selected_doc

def extract_entities(text):
    """Extract named entities from text"""
    entities = []
    
    # Extract company names
    if "Digital Solutions LLC" in text:
        entities.append("Digital Solutions LLC")
    if "Progressive Enterprises" in text:
        entities.append("Progressive Enterprises")
    if "Customer Services Inc." in text:
        entities.append("Customer Services Inc.")
    if "TechMart Electronics" in text:
        entities.append("TechMart Electronics")
    
    # Extract monetary values
    amounts = re.findall(r'\$\d+(?:,\d{3})*(?:\.\d{2})?', text)
    if amounts:
        entities.append(f"Amount: {amounts[0]}")
    
    # Extract dates
    dates = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', text)
    if dates:
        entities.append(f"Date: {dates[0]}")
    
    return entities[:5]  # Limit to 5 entities

def extract_key_points(text):
    """Extract key points from text"""
    key_points = []
    
    # Extract totals
    amounts = re.findall(r'\$\d+(?:,\d{3})*(?:\.\d{2})?', text)
    if amounts:
        key_points.append(f"Total Amount: {amounts[0]}")
    
    # Extract dates
    dates = re.findall(r'\d{1,2}/\d{1,2}/\d{4}', text)
    if dates:
        key_points.append(f"Document Date: {dates[0]}")
    
    # Extract document type specific info
    if "invoice" in text.lower():
        key_points.append("Document Type: Invoice")
    elif "receipt" in text.lower():
        key_points.append("Document Type: Receipt")
    elif "contract" in text.lower() or "agreement" in text.lower():
        key_points.append("Document Type: Contract")
    
    return key_points[:3]  # Limit to 3 key points

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "model": "document-analyzer",
        "version": "1.0.0"
    })

@app.route('/analyze', methods=['POST'])
def analyze_document():
    try:
        print(f"📸 Received analysis request at {datetime.now()}")
        
        data = request.json
        image_data = data.get('image', '')
        
        if not image_data:
            return jsonify({"error": "No image data provided"}), 400
        
        # Simulate OCR text extraction
        print("🔍 Extracting text from image...")
        doc_result = extract_text_from_image(image_data)
        
        # Extract entities and key points
        entities = extract_entities(doc_result["text"])
        key_points = extract_key_points(doc_result["text"])
        
        response = {
            "ocr_text": doc_result["text"],
            "classification": doc_result["type"],
            "confidence": 0.92,
            "summary": doc_result["summary"],
            "entities": entities,
            "key_points": key_points
        }
        
        print(f"✅ Analysis completed: {doc_result['type']} document")
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/ocr', methods=['POST'])
def ocr_only():
    try:
        data = request.json
        image_data = data.get('image', '')
        
        doc_result = extract_text_from_image(image_data)
        
        return jsonify({"text": doc_result["text"]})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/classify', methods=['POST'])
def classify_only():
    try:
        data = request.json
        text = data.get('text', '')
        
        # Simple classification based on keywords
        text_lower = text.lower()
        if any(word in text_lower for word in ['invoice', 'bill', 'amount', '$', 'total due']):
            classification = 'INVOICE'
        elif any(word in text_lower for word in ['receipt', 'purchase', 'payment', 'transaction']):
            classification = 'RECEIPT'
        elif any(word in text_lower for word in ['contract', 'agreement', 'terms', 'signature']):
            classification = 'CONTRACT'
        elif any(word in text_lower for word in ['medical', 'patient', 'diagnosis', 'prescription']):
            classification = 'MEDICAL'
        else:
            classification = 'GENERAL'
        
        return jsonify({"classification": classification, "confidence": 0.85})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/summarize', methods=['POST'])
def summarize_only():
    try:
        data = request.json
        text = data.get('text', '')
        
        # Simple summarization
        sentences = text.split('.')
        summary = '. '.join(sentences[:2]) + '.'
        
        return jsonify({"summary": summary.strip()})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Simple ML Model Server")
    print("📍 Server: http://localhost:5000")
    print("🔑 API Key: ml-model-api-key-123")
    print("📋 Available Endpoints:")
    print("   GET  /health - Health check")
    print("   POST /analyze - Full document analysis")
    print("   POST /ocr - Text extraction only")
    print("   POST /classify - Document classification only")
    print("   POST /summarize - Text summarization only")
    print("\n⚠️  This is a demo ML model for testing!")
    print("💡 Replace the simulated logic with real ML models:")
    print("   - Tesseract OCR for text extraction")
    print("   - Transformers for document classification")
    print("   - spaCy for entity extraction")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
