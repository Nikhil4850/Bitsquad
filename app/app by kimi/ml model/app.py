from flask import Flask, request, jsonify, render_template, send_from_directory
import os
from dotenv import load_dotenv
from document_scanner import DocumentScanner
from groq_summarizer import GroqSummarizer
from legal_summarizer import LegalSummarizer
from document_classifier import DocumentClassifier
from werkzeug.utils import secure_filename
import tempfile

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'md', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Initialize components
try:
    scanner = DocumentScanner()
    summarizer = GroqSummarizer()
    legal_summarizer = LegalSummarizer()
    classifier = DocumentClassifier()
    print("Document classifier loaded successfully!")
    print("Legal document summarizer loaded successfully!")
except Exception as e:
    print(f"Error initializing components: {e}")
    exit(1)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/classify', methods=['POST'])
def classify_document():
    """Auto-detect document type and category"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed'}), 400

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            content = scanner.scan_document(filepath)
            if not content:
                return jsonify({'error': 'Could not extract text from document'}), 400

            # Classify the document
            classification = classifier.quick_detect(content)

            return jsonify({
                'is_legal': classification['is_legal'],
                'confidence': classification['confidence'],
                'category': classification['category'],
                'subcategory': classification['subcategory'],
                'category_display': classification['category_display'],
                'subcategory_display': classification['subcategory_display'],
                'suggested_mode': classification['suggested_mode'],
                'indicators_count': classification['indicators_count'],
                'full_classification': classification
            })

        finally:
            if os.path.exists(filepath):
                os.remove(filepath)

    except Exception as e:
        return jsonify({'error': f'Classification error: {str(e)}'}), 500


@app.route('/api/summarize', methods=['POST'])
def summarize():
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Save file temporarily
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Scan document
            content = scanner.scan_document(filepath)
            if not content:
                return jsonify({'error': 'Could not extract text from document'}), 400
            
            # Get parameters
            detail_level = request.form.get('detail_level', 'medium')
            document_type = request.form.get('document_type', 'general')  # 'general' or 'legal'
            
            # Generate summary based on document type
            if document_type == 'legal':
                summary = legal_summarizer.summarize_legal_document(content, detail_level)
            else:
                summary = summarizer.summarize_with_details(content, detail_level)
            
            return jsonify({'summary': summary, 'document_type': document_type})
            
        finally:
            # Clean up temporary file
            if os.path.exists(filepath):
                os.remove(filepath)
                
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


@app.route('/api/summarize-legal', methods=['POST'])
def summarize_legal():
    """Specialized endpoint for legal documents"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            content = scanner.scan_document(filepath)
            if not content:
                return jsonify({'error': 'Could not extract text from document'}), 400
            
            analysis_type = request.form.get('analysis_type', 'comprehensive')
            
            # Route to appropriate legal analysis
            if analysis_type == 'contract':
                summary = legal_summarizer.analyze_contract(content)
            elif analysis_type == 'court':
                summary = legal_summarizer.analyze_court_document(content)
            elif analysis_type == 'executive':
                summary = legal_summarizer.quick_legal_summary(content)
            else:
                summary = legal_summarizer.summarize_legal_document(content, analysis_type)
            
            return jsonify({
                'summary': summary,
                'document_type': 'legal',
                'analysis_type': analysis_type
            })
            
        finally:
            if os.path.exists(filepath):
                os.remove(filepath)
                
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large. Maximum size is 10MB'}), 413

if __name__ == '__main__':
    print("Starting Document Summarizer Web App...")
    print("Open http://localhost:5001 in your browser")
    app.run(debug=False, host='0.0.0.0', port=5001)
