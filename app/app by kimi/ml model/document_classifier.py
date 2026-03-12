import re
from typing import Dict, Tuple, List
from dataclasses import dataclass


@dataclass
class DocumentClassification:
    """Result of document classification"""
    is_legal: bool
    confidence: float  # 0.0 to 1.0
    category: str
    subcategory: str
    key_indicators: List[str]
    suggested_analysis: str


class DocumentClassifier:
    """Automatically classifies documents as legal or general and identifies categories"""

    # Legal document indicators with weights
    LEGAL_INDICATORS = {
        # High confidence legal terms
        'party': 0.3, 'parties': 0.3, 'plaintiff': 0.8, 'defendant': 0.8,
        'petitioner': 0.8, 'respondent': 0.8, 'hereinafter': 0.7,
        'whereas': 0.6, 'witnesseth': 0.8, 'covenant': 0.7,
        'agreement': 0.4, 'contract': 0.5, 'terms and conditions': 0.6,
        'indemnify': 0.8, 'indemnification': 0.8, 'liability': 0.6,
        'warranty': 0.6, 'warranties': 0.6, 'representation': 0.5,
        'governing law': 0.7, 'jurisdiction': 0.6, 'venue': 0.6,
        'arbitration': 0.7, 'mediation': 0.6, 'litigation': 0.7,
        'breach': 0.6, 'default': 0.5, 'termination': 0.5,
        'confidential': 0.5, 'nda': 0.8, 'non-disclosure': 0.8,
        'non-compete': 0.8, 'intellectual property': 0.6,
        'motion to': 0.8, 'brief': 0.6, 'complaint': 0.7,
        'deposition': 0.8, 'affidavit': 0.8, 'subpoena': 0.9,
        'court': 0.6, 'judge': 0.6, 'honorable': 0.7,
        'docket': 0.8, 'case no': 0.8, 'case number': 0.8,
        'statute': 0.7, 'regulation': 0.5, 'ordinance': 0.7,
        'compliance': 0.5, 'pursuant to': 0.6, 'act of': 0.5,
        'lease': 0.6, 'deed': 0.7, 'mortgage': 0.7,
        'will': 0.6, 'testament': 0.7, 'trust': 0.5,
        'power of attorney': 0.8, 'guardian': 0.5,
        'bylaws': 0.8, 'articles of incorporation': 0.9,
        'operating agreement': 0.8, 'shareholder': 0.6,
        'patent': 0.7, 'trademark': 0.7, 'copyright': 0.6,
        'license agreement': 0.7, 'royalty': 0.6,
    }

    # Document categories with keywords
    CATEGORIES = {
        'contract': {
            'keywords': ['agreement', 'contract', 'terms', 'parties', 'between', 'obligation'],
            'subcategories': {
                'employment': ['employment', 'hire', 'salary', 'wage', 'employee', 'employer'],
                'service': ['service', 'consulting', 'vendor', 'provider'],
                'sales': ['purchase', 'sale', 'goods', 'product', 'price'],
                'lease': ['lease', 'rent', 'tenant', 'landlord', 'property'],
                'licensing': ['license', 'intellectual property', 'patent', 'trademark', 'royalty'],
                'nda': ['non-disclosure', 'confidential', 'nda'],
                'partnership': ['partnership', 'joint venture', 'collaboration'],
            }
        },
        'court_filing': {
            'keywords': ['motion', 'brief', 'complaint', 'petition', 'answer', 'reply', 'court'],
            'subcategories': {
                'motion': ['motion to', 'motion for', 'order to show cause'],
                'brief': ['brief', 'memorandum of law', 'legal argument'],
                'complaint': ['complaint', 'cause of action', 'lawsuit', 'sue'],
                'response': ['answer', 'reply', 'response', 'objection'],
                'discovery': ['deposition', 'subpoena', 'discovery', 'interrogatory'],
            }
        },
        'corporate': {
            'keywords': ['corporation', 'company', 'board', 'shareholder', 'director'],
            'subcategories': {
                'bylaws': ['bylaws', 'corporate governance'],
                'incorporation': ['articles of incorporation', 'certificate of incorporation'],
                'operating': ['operating agreement', 'llc', 'limited liability'],
                'minutes': ['minutes', 'board meeting', 'shareholder meeting'],
                'proxy': ['proxy', 'voting', 'shareholder vote'],
            }
        },
        'property': {
            'keywords': ['property', 'real estate', 'land', 'title'],
            'subcategories': {
                'deed': ['deed', 'grant', 'conveyance'],
                'mortgage': ['mortgage', 'loan', 'deed of trust', 'security'],
                'lease': ['lease', 'rental', 'tenant', 'landlord'],
                'easement': ['easement', 'right of way', 'access'],
            }
        },
        'estate': {
            'keywords': ['will', 'trust', 'estate', 'probate', 'decedent'],
            'subcategories': {
                'will': ['will', 'testament', 'last will'],
                'trust': ['trust', 'trustee', 'beneficiary', 'settlor'],
                'probate': ['probate', 'estate administration', 'executor'],
                'power_of_attorney': ['power of attorney', 'poa', 'attorney in fact'],
            }
        },
        'regulatory': {
            'keywords': ['regulation', 'compliance', 'statute', 'code', 'law'],
            'subcategories': {
                'statute': ['statute', 'act', 'public law', 'code'],
                'regulation': ['regulation', 'rule', 'administrative', 'agency'],
                'compliance': ['compliance', 'policy', 'procedure', 'standard'],
                'guidance': ['guidance', 'advisory', 'opinion', 'directive'],
            }
        },
        'ip_document': {
            'keywords': ['patent', 'trademark', 'copyright', 'intellectual property'],
            'subcategories': {
                'patent': ['patent', 'invention', 'claim', 'prior art'],
                'trademark': ['trademark', 'service mark', 'brand', 'logo'],
                'copyright': ['copyright', 'work of authorship', 'license'],
                'trade_secret': ['trade secret', 'proprietary', 'confidential'],
            }
        },
        'employment': {
            'keywords': ['employment', 'employee', 'employer', 'hire', 'work'],
            'subcategories': {
                'offer_letter': ['offer', 'employment offer', 'position', 'salary'],
                'handbook': ['handbook', 'policy', 'procedure', 'code of conduct'],
                'severance': ['severance', 'termination', 'release', 'separation'],
                'non_compete': ['non-compete', 'non-competition', 'restraint'],
            }
        },
    }

    GENERAL_CATEGORIES = {
        'report': {
            'keywords': ['report', 'analysis', 'findings', 'executive summary', 'conclusion', 'recommendation'],
            'subcategories': {
                'business': ['business', 'market', 'industry', 'financial'],
                'research': ['research', 'study', 'data', 'survey'],
                'technical': ['technical', 'engineering', 'system', 'architecture'],
                'annual': ['annual', 'year end', 'fiscal', 'quarterly'],
            }
        },
        'article': {
            'keywords': ['article', 'introduction', 'abstract', 'journal', 'publication'],
            'subcategories': {
                'academic': ['academic', 'research paper', 'study', 'methodology'],
                'news': ['news', 'breaking', 'update', 'story'],
                'blog': ['blog', 'post', 'opinion', 'commentary'],
            }
        },
        'letter': {
            'keywords': ['dear', 'sincerely', 'regards', 'letter', 'correspondence'],
            'subcategories': {
                'business': ['business', 'professional', 'formal'],
                'personal': ['personal', 'informal', 'family'],
                'cover': ['cover letter', 'application', 'resume'],
            }
        },
        'manual': {
            'keywords': ['manual', 'guide', 'instruction', 'how to', 'tutorial', 'documentation'],
            'subcategories': {
                'user': ['user guide', 'user manual', 'how to use'],
                'technical': ['technical manual', 'api documentation', 'developer guide'],
                'training': ['training', 'course', 'learning', 'curriculum'],
            }
        },
        'presentation': {
            'keywords': ['presentation', 'slides', 'deck', 'overview', 'agenda'],
            'subcategories': {
                'business': ['pitch', 'proposal', 'business plan'],
                'training': ['training', 'workshop', 'seminar'],
                'academic': ['lecture', 'conference', 'paper presentation'],
            }
        },
        'newsletter': {
            'keywords': ['newsletter', 'update', 'bulletin', 'announcement'],
            'subcategories': {
                'company': ['company', 'organization', 'internal'],
                'industry': ['industry', 'sector', 'market'],
                'community': ['community', 'neighborhood', 'group'],
            }
        },
    }

    def __init__(self):
        pass

    def classify(self, text: str) -> DocumentClassification:
        """Classify a document as legal or general and identify its category"""
        text_lower = text.lower()
        text_preview = text[:5000].lower()  # Use first 5000 chars for classification

        # Calculate legal score
        legal_score = 0.0
        indicators_found = []

        for term, weight in self.LEGAL_INDICATORS.items():
            if term in text_preview:
                legal_score += weight
                indicators_found.append(term)

        # Normalize score (cap at 1.0 for confidence calculation)
        max_possible_score = sum(self.LEGAL_INDICATORS.values())
        normalized_score = min(legal_score / 5.0, 1.0)  # Scale: 5+ strong indicators = high confidence

        is_legal = normalized_score > 0.4  # Threshold for legal classification

        if is_legal:
            category, subcategory = self._identify_legal_category(text_preview)
            suggested_analysis = 'legal'
        else:
            category, subcategory = self._identify_general_category(text_preview)
            suggested_analysis = 'general'

        return DocumentClassification(
            is_legal=is_legal,
            confidence=normalized_score,
            category=category,
            subcategory=subcategory,
            key_indicators=indicators_found[:10],  # Top 10 indicators
            suggested_analysis=suggested_analysis
        )

    def _identify_legal_category(self, text: str) -> Tuple[str, str]:
        """Identify the specific category of legal document"""
        best_category = 'general_legal'
        best_subcategory = 'other'
        best_score = 0

        for category, data in self.CATEGORIES.items():
            # Score main category
            cat_score = sum(1 for kw in data['keywords'] if kw in text)

            # Score subcategories
            for subcat, subkeywords in data['subcategories'].items():
                sub_score = sum(1 for kw in subkeywords if kw in text)
                total_score = cat_score + sub_score * 2  # Weight subcategory matches more

                if total_score > best_score:
                    best_score = total_score
                    best_category = category
                    best_subcategory = subcat

        return best_category, best_subcategory

    def _identify_general_category(self, text: str) -> Tuple[str, str]:
        """Identify the category of a general (non-legal) document"""
        best_category = 'general_document'
        best_subcategory = 'other'
        best_score = 0

        for category, data in self.GENERAL_CATEGORIES.items():
            cat_score = sum(1 for kw in data['keywords'] if kw in text)

            for subcat, subkeywords in data['subcategories'].items():
                sub_score = sum(1 for kw in subkeywords if kw in text)
                total_score = cat_score + sub_score * 2

                if total_score > best_score:
                    best_score = total_score
                    best_category = category
                    best_subcategory = subcat

        return best_category, best_subcategory

    def get_classification_summary(self, classification: DocumentClassification) -> str:
        """Generate a human-readable classification summary"""
        confidence_pct = int(classification.confidence * 100)

        if classification.is_legal:
            doc_type = "Legal Document"
            category_name = classification.category.replace('_', ' ').title()
            subcategory_name = classification.subcategory.replace('_', ' ').title()
        else:
            doc_type = "General Document"
            category_name = classification.category.replace('_', ' ').title()
            subcategory_name = classification.subcategory.replace('_', ' ').title()

        summary = f"{doc_type} ({confidence_pct}% confidence)\n"
        summary += f"Category: {category_name}\n"
        if classification.subcategory != 'other':
            summary += f"Type: {subcategory_name}\n"

        if classification.key_indicators:
            summary += f"\nKey indicators: {', '.join(classification.key_indicators[:5])}"

        return summary

    def quick_detect(self, text: str) -> Dict:
        """Quick detection for UI feedback - returns dict with basic info"""
        classification = self.classify(text)

        return {
            'is_legal': classification.is_legal,
            'confidence': round(classification.confidence, 2),
            'category': classification.category,
            'subcategory': classification.subcategory,
            'category_display': classification.category.replace('_', ' ').title(),
            'subcategory_display': classification.subcategory.replace('_', ' ').title(),
            'suggested_mode': 'legal' if classification.is_legal else 'general',
            'indicators_count': len(classification.key_indicators),
        }
