# Document Summarizer Web App

A web application that scans documents and generates easy-to-understand summaries using Groq AI.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Web Server
```bash
python app.py
```

### 3. Open Browser
Navigate to: **http://localhost:5000**

## Features

- **🌐 Web Interface**: Clean, modern UI with drag-and-drop file upload
- **📄 Multiple Formats**: Supports PDF, DOCX, TXT, and Markdown files
- **🤖 AI Summaries**: Powered by Groq's fast LLM API
- **📊 Detail Levels**: Choose from Brief, Medium, or Detailed summaries
- **💾 Export Options**: Copy to clipboard or download as text file
- **📱 Responsive**: Works on desktop and mobile devices

## Usage

1. **Upload**: Drag & drop or click to select a document (max 10MB)
2. **Choose Detail Level**: Select Brief, Medium, or Detailed
3. **Generate**: Click "Generate Summary" and wait for AI processing
4. **Export**: Copy or download the summary

## API Endpoints

- `GET /` - Web interface
- `POST /summarize` - Document summarization API

## Supported File Formats

- **PDF** (.pdf) - Text extraction from PDF documents
- **Word** (.docx) - Microsoft Word documents  
- **Text** (.txt) - Plain text files
- **Markdown** (.md) - Markdown files

## Requirements

- Python 3.8+
- Groq API key (configured in `.env`)
- Web browser

## Troubleshooting

- **API Key Error**: Ensure `GROQ_API_KEY` is set in `.env` file
- **File Upload Error**: Check file size (max 10MB) and format
- **Server Not Running**: Make sure to run `python app.py` first
