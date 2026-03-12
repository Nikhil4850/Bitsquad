import os
import sys
from dotenv import load_dotenv
from document_scanner import DocumentScanner
from groq_summarizer import GroqSummarizer


def main():
    """Main application for document scanning and summarization."""
    load_dotenv()

    print("=" * 60)
    print("DOCUMENT SUMMARIZER - Powered by Groq AI")
    print("=" * 60)
    print()

    # Initialize components
    try:
        scanner = DocumentScanner()
        summarizer = GroqSummarizer()
    except ValueError as e:
        print(f"Error: {e}")
        print("\nPlease set your GROQ_API_KEY environment variable or create a .env file:")
        print("GROQ_API_KEY=your_api_key_here")
        return 1
    except Exception as e:
        print(f"Error initializing: {e}")
        return 1

    # Get file path from user
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = input("Enter the path to your document: ").strip()

    # Validate file
    if not os.path.exists(file_path):
        print(f"Error: File not found - {file_path}")
        return 1

    if not scanner.is_supported(file_path):
        print(f"Error: Unsupported file format")
        print(f"Supported formats: {', '.join(scanner.supported_formats)}")
        return 1

    # Scan document
    print(f"\nScanning document: {file_path}")
    try:
        content = scanner.scan_document(file_path)
        if not content:
            print("Error: Could not extract text from document")
            return 1
        print(f"Extracted {len(content)} characters")
    except Exception as e:
        print(f"Error scanning document: {e}")
        return 1

    # Get detail level
    print("\nSelect detail level:")
    print("1. Brief (2-3 sentences)")
    print("2. Medium (concise summary)")
    print("3. Detailed (comprehensive summary)")

    choice = input("Enter choice (1-3) [default: 2]: ").strip() or "2"
    detail_map = {"1": "brief", "2": "medium", "3": "detailed"}
    detail_level = detail_map.get(choice, "medium")

    # Generate summary
    print(f"\nGenerating {detail_level} summary using Groq AI...")
    print("-" * 60)

    try:
        summary = summarizer.summarize_with_details(content, detail_level)
        print("\nSUMMARY:")
        print("=" * 60)
        print(summary)
        print("=" * 60)

        # Option to save
        save_choice = input("\nSave summary to file? (y/n): ").strip().lower()
        if save_choice == 'y':
            output_path = input("Enter output file path: ").strip()
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(summary)
            print(f"Summary saved to: {output_path}")

    except Exception as e:
        print(f"Error generating summary: {e}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
