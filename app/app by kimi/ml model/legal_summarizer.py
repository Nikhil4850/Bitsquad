import os
from dotenv import load_dotenv
from groq import Groq
from typing import Optional
from legal_analyzer import LegalDocumentAnalyzer, LegalDocumentInfo

# Load environment variables
load_dotenv()


class LegalSummarizer:
    """Specialized summarizer for legal documents using enhanced prompts and analysis"""

    def __init__(self, api_key: Optional[str] = None):
        """Initialize with Groq API key."""
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise ValueError("Groq API key is required. Set GROQ_API_KEY environment variable or pass it directly.")

        self.client = Groq(api_key=self.api_key)
        self.model = "llama-3.3-70b-versatile"  # Updated model for complex legal documents
        self.analyzer = LegalDocumentAnalyzer()

    def summarize_legal_document(self, text: str, detail_level: str = "comprehensive") -> str:
        """Generate comprehensive legal document summary with specialized analysis"""
        if not text.strip():
            return "No content to summarize."

        # First, perform legal analysis
        doc_info = self.analyzer.analyze_document(text)

        # Truncate if text is too long
        max_chars = 12000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        # Get specialized prompt
        prompt_template = self.analyzer.get_specialized_prompt(doc_info, detail_level)
        prompt = prompt_template.replace("{text}", text)

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert legal document analyst specializing in making complex legal documents accessible. You understand various legal document types including contracts, court filings, corporate documents, property agreements, employment documents, and regulatory filings. You excel at identifying key provisions, obligations, rights, risks, and explaining them in plain language while maintaining legal accuracy."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,  # Lower temperature for more consistent legal analysis
                max_tokens=2048,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error generating legal summary: {str(e)}")

    def quick_legal_summary(self, text: str) -> str:
        """Generate a quick executive summary for legal documents"""
        if not text.strip():
            return "No content to summarize."

        max_chars = 8000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        prompt = f"""Provide a brief executive summary of this legal document:

{text}

Executive Summary (2-3 sentences on each):
1. Document Type & Purpose
2. Key Parties & Their Relationship
3. Most Important Terms
4. Critical Dates or Deadlines
5. Main Risks or Concerns
6. Bottom Line - What Should the Reader Know?"""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal executive summary expert. Provide concise, high-level summaries that capture the essence of legal documents for busy professionals."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=1024,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error generating executive summary: {str(e)}")

    def analyze_contract(self, text: str) -> str:
        """Specialized analysis for contracts"""
        if not text.strip():
            return "No content to analyze."

        doc_info = self.analyzer.analyze_document(text)

        max_chars = 12000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        prompt = f"""Analyze this contract comprehensively:

PARTIES: {', '.join(doc_info.parties[:5]) if doc_info.parties else 'See document'}

CONTRACT TEXT:
{text}

Please provide:

**CONTRACT ANALYSIS REPORT**

1. **CONTRACT OVERVIEW**
   - Type of agreement
   - Brief purpose

2. **PARTIES & ROLES**
   - Who each party is
   - Their respective roles and responsibilities

3. **KEY TERMS & CONDITIONS**
   - Payment terms (if any)
   - Deliverables or services
   - Duration and renewal
   - Termination conditions

4. **FINANCIAL PROVISIONS**
   - Compensation structure
   - Fee schedules
   - Penalties or liquidated damages

5. **OBLIGATIONS BY PARTY**
   - What Party A must do
   - What Party B must do
   - Shared obligations

6. **PROTECTIONS & SAFEGUARDS**
   - Warranties and representations
   - Indemnification
   - Limitation of liability
   - Insurance requirements

7. **RISK FACTORS**
   - Potential issues
   - Unusual or onerous terms
   - Missing protections

8. **COMPLIANCE REQUIREMENTS**
   - Reporting obligations
   - Standards to maintain
   - Audit rights

9. **ACTION ITEMS**
   - Immediate next steps
   - Ongoing monitoring needs
   - Documentation requirements

10. **RED FLAGS** (if any)
    - Unusual terms requiring attention
    - Potential problems
    - Recommendations for negotiation

Format for easy reading with bullet points and clear sections."""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a contract law expert with extensive experience in commercial agreements. You excel at identifying key terms, risks, and practical implications in contracts."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=2048,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error analyzing contract: {str(e)}")

    def analyze_court_document(self, text: str) -> str:
        """Specialized analysis for court filings and legal proceedings"""
        if not text.strip():
            return "No content to analyze."

        max_chars = 10000
        if len(text) > max_chars:
            text = text[:max_chars] + "..."

        prompt = f"""Analyze this court document or legal filing:

{text}

Please provide:

**COURT DOCUMENT ANALYSIS**

1. **DOCUMENT IDENTIFICATION**
   - Type of filing (motion, brief, complaint, etc.)
   - Court or jurisdiction
   - Case information if available

2. **PARTIES INVOLVED**
   - Plaintiffs/Petitioners
   - Defendants/Respondents
   - Other relevant parties

3. **PROCEDURAL CONTEXT**
   - What stage of litigation
   - What is being requested
   - Deadlines or hearing dates

4. **LEGAL CLAIMS/ARGUMENTS**
   - Main legal theories
   - Key factual allegations
   - Primary arguments

5. **RELIEF SOUGHT**
   - What outcome is requested
   - Remedies being pursued

6. **KEY EVIDENCE/FACTS**
   - Important factual assertions
   - Evidence referenced

7. **LEGAL ISSUES**
   - Core legal questions
   - Precedents cited
   - Statutes involved

8. **STRATEGIC IMPLICATIONS**
   - Strengths of the position
   - Potential weaknesses
   - What to watch for

9. **NEXT STEPS/TIMELINE**
   - Response deadlines
   - Scheduled hearings
   - Required actions

10. **PRACTICAL NOTES**
    - Unusual aspects
    - Important details
    - Recommendations for review

Keep the analysis practical and actionable."""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a litigation expert familiar with court procedures and legal pleadings. You provide clear analysis of legal filings and their strategic implications."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=2048,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error analyzing court document: {str(e)}")

    def compare_documents(self, doc1_text: str, doc2_text: str) -> str:
        """Compare two legal documents and identify key differences"""

        max_chars = 6000
        doc1 = doc1_text[:max_chars] if len(doc1_text) > max_chars else doc1_text
        doc2 = doc2_text[:max_chars] if len(doc2_text) > max_chars else doc2_text

        prompt = f"""Compare these two legal documents and identify key differences:

DOCUMENT 1:
{doc1}

DOCUMENT 2:
{doc2}

Please provide:

**DOCUMENT COMPARISON**

1. **SIMILARITIES**
   - Common provisions
   - Shared parties or structure
   - Identical clauses

2. **KEY DIFFERENCES**
   - Different terms
   - Changed provisions
   - Added or removed sections

3. **SUBSTANTIVE CHANGES**
   - Changes that affect rights or obligations
   - Financial differences
   - Timeline modifications

4. **RISK IMPLICATIONS**
   - How changes affect risk allocation
   - New protections or exposures
   - Impact on original intent

5. **RECOMMENDATIONS**
   - Which version is preferable
   - Areas requiring negotiation
   - Red flags in either version

Note: This is an automated comparison and should be reviewed by legal counsel."""

        try:
            response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal document comparison specialist. You excel at identifying substantive differences between legal documents and explaining their implications."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=2048,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error comparing documents: {str(e)}")
