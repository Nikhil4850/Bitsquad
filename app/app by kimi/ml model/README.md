# Document Summarizer with Groq AI

A Python application that scans documents (PDF, DOCX, TXT, MD) and generates easy-to-understand summaries using the Groq AI API.

## Features

- **Document Scanning**: Supports PDF, DOCX, TXT, and Markdown files
- **AI-Powered Summaries**: Uses Groq's fast LLM API for summarization
- **Simple Language**: Converts complex documents into easy-to-understand summaries
- **Multiple Detail Levels**: Choose from brief, medium, or detailed summaries
- **Interactive CLI**: User-friendly command-line interface

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Get Groq API Key

1. Sign up at [https://console.groq.com/](https://console.groq.com/)
2. Create an API key
3. Copy `.env.example` to `.env` and add your API key:

```bash
copy .env.example .env
```

Edit `.env` and replace `your_groq_api_key_here` with your actual key.

## Usage

### Run with interactive prompt:
```bash
python main.py
```

### Run with file path as argument:
```bash
python main.py "path/to/your/document.pdf"
```

## Project Structure

```
ml 1/
├── document_scanner.py    # Handles document text extraction
├── groq_summarizer.py     # Groq AI API integration
├── main.py               # CLI application entry point
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variable template
└── README.md            # This file
```

## Supported File Formats

- **PDF** (.pdf) - Text extraction from PDF documents
- **Word** (.docx) - Microsoft Word documents
- **Text** (.txt) - Plain text files
- **Markdown** (.md) - Markdown files

## Example

```
> python main.py "report.pdf"

Scanning document: report.pdf
Extracted 4500 characters

Select detail level:
1. Brief (2-3 sentences)
2. Medium (concise summary)
3. Detailed (comprehensive summary)
Enter choice (1-3) [default: 2]: 2

Generating medium summary using Groq AI...
------------------------------------------------------------

SUMMARY:
============================================================
This report discusses the quarterly financial performance...
============================================================
```

## Requirements

- Python 3.8+
- Groq API key (free tier available)
- Internet connection for API calls
