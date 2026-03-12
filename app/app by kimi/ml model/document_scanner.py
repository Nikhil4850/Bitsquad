import os
from pathlib import Path
from typing import Optional
import PyPDF2
from docx import Document
from PIL import Image
import pytesseract
import io


class DocumentScanner:
    """Handles scanning and extracting text from various document formats."""

    SUPPORTED_FORMATS = {'.txt', '.pdf', '.docx', '.md', '.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp'}

    def __init__(self):
        self.supported_formats = self.SUPPORTED_FORMATS
        # Set Tesseract path for Windows if needed
        if os.name == 'nt':  # Windows
            tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
            if os.path.exists(tesseract_path):
                pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def scan_document(self, file_path: str) -> str:
        """Scan a document and extract its text content."""
        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        if path.suffix.lower() not in self.supported_formats:
            raise ValueError(f"Unsupported file format: {path.suffix}. "
                           f"Supported formats: {', '.join(self.supported_formats)}")

        if path.suffix.lower() == '.pdf':
            return self._extract_pdf(file_path)
        elif path.suffix.lower() == '.docx':
            return self._extract_docx(file_path)
        elif path.suffix.lower() in {'.txt', '.md'}:
            return self._extract_text(file_path)
        elif path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff', '.webp'}:
            return self._extract_image_text(file_path)

        return ""

    def _extract_pdf(self, file_path: str) -> str:
        """Extract text from PDF files with OCR fallback for scanned PDFs."""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # First try to extract text normally
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    text += page_text + "\n"
                
                # Check if extracted text is meaningful
                if not text.strip() or len(text.strip()) < 50:
                    # Try OCR for scanned PDFs
                    text = self._extract_pdf_with_ocr(file_path)
                    
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
        
        # Clean up the extracted text
        return self._clean_extracted_text(text.strip())
    
    def _extract_pdf_with_ocr(self, file_path: str) -> str:
        """Extract text from PDF using OCR for scanned documents."""
        try:
            import fitz  # PyMuPDF
            text = ""
            
            with fitz.open(file_path) as doc:
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    
                    # Get page as image
                    pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))  # 2x zoom for better OCR
                    
                    # Convert PIL Image
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    
                    # Extract text using OCR
                    page_text = pytesseract.image_to_string(img, lang='eng')
                    text += page_text + "\n"
                    
            return text
            
        except ImportError:
            # PyMuPDF not available, try basic OCR approach
            return self._extract_pdf_basic_ocr(file_path)
        except Exception as e:
            raise Exception(f"OCR extraction failed: {str(e)}")
    
    def _extract_pdf_basic_ocr(self, file_path: str) -> str:
        """Basic OCR fallback for PDFs without PyMuPDF."""
        try:
            # This is a basic fallback - in practice, you'd need more sophisticated PDF to image conversion
            text = "Warning: This appears to be a scanned PDF. For best results, please install PyMuPDF: pip install PyMuPDF"
            return text
        except Exception as e:
            return f"Could not extract text from scanned PDF: {str(e)}"
    
    def _clean_extracted_text(self, text: str) -> str:
        """Clean and normalize extracted text."""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Fix common OCR/PDF extraction issues
        text = text.replace('NaN', '')
        text = text.replace('AON', '')
        
        # Remove non-printable characters except common punctuation
        import re
        text = re.sub(r'[^\x20-\x7E\n\t.,!?;:()\-\[\]{}"\'/\\]', '', text)
        
        # Fix spacing around punctuation
        text = re.sub(r'\s+([.,!?;:])', r'\1', text)
        
        # Remove multiple consecutive newlines
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        return text.strip()

    def _extract_docx(self, file_path: str) -> str:
        """Extract text from DOCX files."""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return self._clean_extracted_text(text.strip())
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")

    def _extract_text(self, file_path: str) -> str:
        """Extract text from plain text files."""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read().strip()
                return self._clean_extracted_text(text)
        except UnicodeDecodeError:
            try:
                with open(file_path, 'r', encoding='latin-1') as file:
                    text = file.read().strip()
                    return self._clean_extracted_text(text)
            except Exception as e:
                raise Exception(f"Error reading text file: {str(e)}")

    def _extract_image_text(self, file_path: str) -> str:
        """Extract text from image files using OCR."""
        try:
            # Open the image
            image = Image.open(file_path)
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using Tesseract OCR
            text = pytesseract.image_to_string(image, lang='eng')
            
            return self._clean_extracted_text(text.strip())
            
        except Exception as e:
            # Try with different image processing if the first attempt fails
            try:
                image = Image.open(file_path)
                
                # Convert to grayscale for better OCR
                if image.mode != 'L':
                    image = image.convert('L')
                
                # Resize for better OCR if image is too small
                width, height = image.size
                if width < 300 or height < 300:
                    image = image.resize((width * 2, height * 2), Image.Resampling.LANCZOS)
                
                text = pytesseract.image_to_string(image, lang='eng')
                return self._clean_extracted_text(text.strip())
                
            except Exception as e2:
                raise Exception(f"Error extracting text from image: {str(e2)}. Original error: {str(e)}")

    def is_supported(self, file_path: str) -> bool:
        """Check if the file format is supported."""
        return Path(file_path).suffix.lower() in self.supported_formats
