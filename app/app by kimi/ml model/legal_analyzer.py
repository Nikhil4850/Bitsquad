import re
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass


@dataclass
class LegalDocumentInfo:
    """Structure for legal document analysis"""
    document_type: str
    parties: List[str]
    key_dates: List[str]
    key_clauses: List[str]
    obligations: List[str]
    rights: List[str]
    risks: List[str]
    summary: str


class LegalDocumentAnalyzer:
    """Specialized analyzer for legal documents with enhanced understanding"""

    LEGAL_DOC_TYPES = {
        'contract': ['agreement', 'contract', 'terms and conditions', 'terms of service'],
        'court_filing': ['motion', 'brief', 'petition', 'complaint', 'answer', 'reply'],
        'corporate': ['bylaws', 'articles of incorporation', 'operating agreement', 'shareholders'],
        'property': ['lease', 'deed', 'mortgage', 'title', 'easement'],
        'employment': ['employment contract', 'non-disclosure', 'nda', 'non-compete'],
        'estate': ['will', 'trust', 'power of attorney', 'probate'],
        'regulatory': ['compliance', 'regulation', 'statute', 'code', 'ordinance'],
        'intellectual_property': ['patent', 'trademark', 'copyright', 'license agreement']
    }

    LEGAL_SECTIONS = [
        'parties', 'recitals', 'definitions', 'terms', 'conditions',
        'obligations', 'representations', 'warranties', 'indemnification',
        'termination', 'governing law', 'jurisdiction', 'signatures'
    ]

    def __init__(self):
        self.document_type = None
        self.legal_entities = []
        self.key_provisions = []

    def detect_document_type(self, text: str) -> str:
        """Detect the type of legal document"""
        text_lower = text.lower()
        scores = {}

        for doc_type, keywords in self.LEGAL_DOC_TYPES.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[doc_type] = score

        # Return the type with highest score, default to 'general_legal'
        if max(scores.values()) > 0:
            return max(scores, key=scores.get)
        return 'general_legal'

    def extract_parties(self, text: str) -> List[str]:
        """Extract parties mentioned in the document"""
        parties = []

        # Common party patterns in legal documents
        party_patterns = [
            r'between\s+([^,]+(?:,\s*[^,]+)*)\s+(?:and|&)\s+([^,]+)',
            r'(?:Party|Parties)[\s\d]*[:\.]\s*([^\n]+)',
            r'(?:Plaintiff|Defendant)[s]*[:\.]\s*([^\n]+)',
            r'("[^"]+"|[^,\n]+)\s*\(the\s*["\']?[^"\']+["\']?\)',
            r'hereinafter\s+(?:called|referred to as|known as)\s+["\']?([^"\']+)["\']?',
        ]

        for pattern in party_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, tuple):
                    parties.extend([m.strip() for m in match if m.strip()])
                else:
                    party = match.strip()
                    if party and len(party) > 2:
                        parties.append(party)

        # Clean and deduplicate
        cleaned_parties = []
        for party in parties:
            # Remove common legal phrases
            party = re.sub(r'\s*\([^)]*\)', '', party)
            party = re.sub(r'hereinafter.*', '', party, flags=re.IGNORECASE)
            party = party.strip('"\'.,; ')
            if party and party not in cleaned_parties and len(party) > 2:
                cleaned_parties.append(party)

        return cleaned_parties[:10]  # Limit to top 10 parties

    def extract_dates(self, text: str) -> List[str]:
        """Extract important dates from legal document"""
        dates = []

        # Date patterns
        date_patterns = [
            r'(?:dated|effective date|as of)\s*:?\s*(\w+\s+\d{1,2},?\s*\d{4})',
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b',
            r'\b(\w+\s+\d{1,2},?\s*\d{4})\b',
            r'(?:term|duration|period)\s*:?\s*(\d+\s+(?:days?|months?|years?))',
            r'(?:expires?|termination|ending)\s*:?\s*(\w+\s+\d{1,2},?\s*\d{4})',
        ]

        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            dates.extend(matches)

        return list(set(dates))[:10]  # Remove duplicates and limit

    def extract_monetary_values(self, text: str) -> List[str]:
        """Extract monetary values and financial terms"""
        monetary_patterns = [
            r'\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|thousand|M|B|K))?',
            r'(?:payment|fee|cost|price|amount)\s*:?\s*\$?[\d,]+(?:\.\d{2})?',
            r'\d+(?:\.\d{2})?\s*(?:percent|%|pct)',
        ]

        values = []
        for pattern in monetary_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            values.extend(matches)

        return list(set(values))[:10]

    def extract_key_provisions(self, text: str) -> List[str]:
        """Extract key legal provisions and clauses"""
        provisions = []

        # Key legal provision indicators
        provision_patterns = [
            r'(?:Section|Article|Clause)\s+\d+[.:]?\s*([^\n]+)',
            r'(?:WHEREAS|NOW, THEREFORE|IN CONSIDERATION OF)([^.]+)',
            r'(?:shall|must|will be required to)\s+([^.;]+)',
            r'(?:may not|shall not|prohibited from)\s+([^.;]+)',
            r'(?:provided, however,|notwithstanding)([^.;]+)',
        ]

        for pattern in provision_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    provision = match.strip()
                    if provision and len(provision) > 10:
                        provisions.append(provision)

        return provisions[:15]

    def extract_obligations(self, text: str) -> List[str]:
        """Extract obligations and duties"""
        obligations = []

        obligation_patterns = [
            r'(?:shall|must|agrees to|is required to|will)\s+([^.;]{10,200})',
            r'(?:obligation|duty|responsibility)\s+(?:to|of)\s+([^.;]{10,200})',
            r'(?:responsible for|in charge of)\s+([^.;]{10,200})',
        ]

        for pattern in obligation_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    obligation = match.strip()
                    if obligation and len(obligation) > 15:
                        obligations.append(obligation)

        return obligations[:10]

    def extract_rights(self, text: str) -> List[str]:
        """Extract rights and entitlements"""
        rights = []

        rights_patterns = [
            r'(?:has the right to|entitled to|may|is permitted to)\s+([^.;]{10,200})',
            r'(?:right|entitlement|privilege)\s+(?:to|of)\s+([^.;]{10,200})',
            r'(?:hereby grants?|conveys?|assigns?)\s+([^.;]{10,200})',
        ]

        for pattern in rights_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    right = match.strip()
                    if right and len(right) > 15:
                        rights.append(right)

        return rights[:10]

    def analyze_risk_factors(self, text: str) -> List[str]:
        """Identify potential risk factors and liabilities"""
        risks = []

        risk_patterns = [
            r'(?:liability|damages|penalty|fine)\s*:?\s*([^\n]{10,150})',
            r'(?:indemnif|hold harmless|defend)\s*:?\s*([^\n]{10,150})',
            r'(?:breach|default|violation)\s*:?\s*([^\n]{10,150})',
            r'(?:limitation of liability|limitation on damages)([^\n]{10,150})',
            r'(?:warranty disclaimer|as is|without warranty)([^\n]{10,150})',
        ]

        for pattern in risk_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                if isinstance(match, str):
                    risk = match.strip()
                    if risk and len(risk) > 10:
                        risks.append(risk)

        return risks[:10]

    def analyze_document(self, text: str) -> LegalDocumentInfo:
        """Complete analysis of a legal document"""
        return LegalDocumentInfo(
            document_type=self.detect_document_type(text),
            parties=self.extract_parties(text),
            key_dates=self.extract_dates(text),
            key_clauses=self.extract_key_provisions(text),
            obligations=self.extract_obligations(text),
            rights=self.extract_rights(text),
            risks=self.analyze_risk_factors(text),
            summary=""  # Will be filled by LLM
        )

    def get_specialized_prompt(self, doc_info: LegalDocumentInfo, detail_level: str) -> str:
        """Generate specialized prompt for legal document summarization"""

        base_prompt = f"""You are a legal document analysis expert. Please provide a comprehensive but accessible summary of the following {doc_info.document_type.replace('_', ' ')} document.

DOCUMENT TYPE: {doc_info.document_type.replace('_', ' ').title()}

KEY INFORMATION EXTRACTED:
- Parties: {', '.join(doc_info.parties[:5]) if doc_info.parties else 'Not clearly identified'}
- Important Dates: {', '.join(doc_info.key_dates[:5]) if doc_info.key_dates else 'Not specified'}

DOCUMENT TEXT:
{{text}}

Please provide a {detail_level} summary that includes:

1. **OVERVIEW**: What this document is about in simple terms
2. **KEY PARTIES**: Who is involved and their roles
3. **MAIN TERMS**: The most important provisions and what they mean
4. **OBLIGATIONS**: What each party must do
5. **RIGHTS**: What each party is entitled to
6. **IMPORTANT DATES**: Deadlines, effective dates, and durations
7. **RISKS & PROTECTIONS**: Potential issues and how they're addressed
8. **PRACTICAL IMPLICATIONS**: What this means for the parties in everyday language

Guidelines:
- Explain legal terms in plain English when first introduced
- Highlight any unusual or particularly important clauses
- Note any provisions that might require special attention
- Identify any potential red flags or concerns
- Keep the tone professional but accessible

Provide the summary now:"""

        return base_prompt
