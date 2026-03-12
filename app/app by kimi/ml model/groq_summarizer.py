import os
from dotenv import load_dotenv
from groq import Groq
from typing import Optional

# Load environment variables
load_dotenv()


class GroqSummarizer:
    """Uses Groq AI API to generate simple language summaries of documents."""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize with Groq API key."""
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise ValueError("Groq API key is required. Set GROQ_API_KEY environment variable or pass it directly.")

        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.1-8b-instant"  # Fast and cost-effective model

    def summarize(self, text: str, max_length: Optional[int] = None) -> str:
        """Generate a simple language summary of the given text."""
        if not text.strip():
            return "No content to summarize."

        # Truncate if text is too long (Groq has token limits)
        max_chars = max_length or 15000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        prompt = f"""Please provide a clear and simple summary of the following document in plain language.
        Make it easy to understand for a general audience. Focus on the main points and key takeaways.

        Document:
        {text}

        Summary:"""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that creates simple, easy-to-understand summaries of documents."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.5,
                max_tokens=1024,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error generating summary: {str(e)}")

    def summarize_with_details(self, text: str, detail_level: str = "medium") -> str:
        """Generate summary with specified detail level (brief/medium/detailed)."""
        detail_instructions = {
            "brief": "Provide a brief 2-3 sentence summary highlighting only the most important points.",
            "medium": "Provide a concise summary covering the main points and key information.",
            "detailed": "Provide a comprehensive summary covering all major points, context, and implications."
        }

        instruction = detail_instructions.get(detail_level, detail_instructions["medium"])

        prompt = f"""{instruction}

        Make the summary easy to understand for someone without technical background.

        Document:
        {text}

        Summary:"""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that creates clear, accessible summaries."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.5,
                max_tokens=1024,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error generating summary: {str(e)}")
