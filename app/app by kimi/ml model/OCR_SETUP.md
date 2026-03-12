# OCR Setup Instructions

To enable image text extraction (OCR), you need to install Tesseract OCR:

## Windows Installation

1. **Download Tesseract OCR:**
   - Go to: https://github.com/UB-Mannheim/tesseract/wiki
   - Download and run the installer

2. **Install with English language pack:**
   - During installation, make sure to select "English" language pack

3. **Restart the server** after installation

## Alternative: Quick Install with Chocolatey

```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Tesseract
choco install tesseract
```

## Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png) 
- **BMP** (.bmp)
- **GIF** (.gif)
- **TIFF** (.tiff)
- **WebP** (.webp)

## Notes

- OCR works best with clear, high-contrast text
- Handwritten text may have lower accuracy
- Images are automatically processed for optimal OCR results
- If Tesseract is not found, the app will still work for non-image files
