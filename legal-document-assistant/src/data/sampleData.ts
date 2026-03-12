import { LegalDocument, DocumentAnalysis, ChatMessage, User } from '../types';

export const sampleUser: User = {
  id: 'default_user_001',
  name: 'Harshadip Vijay Umbarkar',
  email: 'umbarkarharshadip@gmail.com',
  plan: 'free',
  documentsAnalyzed: 0,
  joinDate: new Date('2024-01-01'),
};

export const sampleDocument: LegalDocument = {
  id: '1',
  name: 'Software_License_Agreement_v2.pdf',
  type: 'PDF',
  size: 2457600,
  uploadDate: new Date(),
  content: `SOFTWARE LICENSE AGREEMENT

This Software License Agreement ("Agreement") is entered into as of January 1, 2024 ("Effective Date") between TechCorp Inc. ("Licensor") and the end user ("Licensee").

1. LICENSE GRANT
Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use the Software solely for Licensee's internal business purposes.

2. RESTRICTIONS
Licensee shall not: (a) modify, adapt, or create derivative works; (b) reverse engineer or decompile; (c) sublicense, rent, lease, or lend the Software; (d) use the Software for any illegal purpose.

3. PAYMENT TERMS
Licensee shall pay all fees within thirty (30) days of invoice date. Late payments subject to 1.5% monthly service charge.

4. TERM AND TERMINATION
This Agreement commences on the Effective Date and continues until terminated. Either party may terminate with ninety (90) days written notice.

5. LIMITATION OF LIABILITY
LICENSOR'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY LICENSEE FOR THE SOFTWARE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.

6. INDEMNIFICATION
Licensee agrees to indemnify and hold harmless Licensor from any claims arising from Licensee's use of the Software.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware, USA.`,
  status: 'analyzed',
};

export const sampleAnalysis: DocumentAnalysis = {
  summary: `This is a standard Software License Agreement that grants non-exclusive usage rights while imposing several important restrictions. Key points include: (1) limited internal use only, (2) strict prohibitions on modification and reverse engineering, (3) payment terms with late fees, and (4) significant liability caps favoring the Licensor.`,
  keyClauses: [
    {
      id: '1',
      title: 'License Grant - Limited Rights',
      originalText: 'Licensor hereby grants to Licensee a non-exclusive, non-transferable license to use the Software solely for Licensee\'s internal business purposes.',
      plainExplanation: 'You get permission to use the software only for your company\'s own operations. You cannot give this right to anyone else or use it for external clients.',
      section: 'Section 1',
      importance: 'high',
    },
    {
      id: '2',
      title: 'Payment Terms - Late Fees',
      originalText: 'Licensee shall pay all fees within thirty (30) days of invoice date. Late payments subject to 1.5% monthly service charge.',
      plainExplanation: 'You must pay within 30 days of receiving the bill. If you\'re late, you\'ll be charged an extra 1.5% per month (18% annually) on the overdue amount.',
      section: 'Section 3',
      importance: 'high',
    },
    {
      id: '3',
      title: 'Termination - 90 Day Notice',
      originalText: 'Either party may terminate with ninety (90) days written notice.',
      plainExplanation: 'Either you or the software company can end this agreement by giving 90 days written notice. Plan ahead as you\'ll need 3 months to transition.',
      section: 'Section 4',
      importance: 'medium',
    },
  ],
  obligations: [
    {
      id: '1',
      description: 'Pay all license fees within 30 days of invoice',
      deadline: '30 days from invoice date',
      party: 'Licensee (You)',
      consequence: '1.5% monthly late fee + potential license suspension',
      isCritical: true,
    },
    {
      id: '2',
      description: 'Use software only for internal business purposes',
      party: 'Licensee (You)',
      consequence: 'Breach of contract, license termination, potential legal action',
      isCritical: true,
    },
    {
      id: '3',
      description: 'Provide 90 days notice before terminating agreement',
      party: 'Both parties',
      consequence: 'Agreement continues until notice period expires',
      isCritical: false,
    },
    {
      id: '4',
      description: 'Indemnify Licensor against claims from your use',
      party: 'Licensee (You)',
      consequence: 'You must pay for any lawsuits resulting from your misuse',
      isCritical: true,
    },
  ],
  risks: [
    {
      id: '1',
      description: 'Liability cap limits your recovery to 12 months of fees',
      severity: 'high',
      mitigation: 'Consider negotiating higher liability limits or purchasing additional insurance',
      section: 'Section 5',
    },
    {
      id: '2',
      description: 'No warranties provided about software performance',
      severity: 'medium',
      mitigation: 'Request warranty provisions or test software thoroughly before signing',
      section: 'Implied',
    },
    {
      id: '3',
      description: 'Cannot modify or customize software for your needs',
      severity: 'medium',
      mitigation: 'Evaluate if current features meet your requirements or negotiate customization rights',
      section: 'Section 2',
    },
  ],
  recommendations: [
    'Negotiate the liability cap to at least 2-3 years of fees or unlimited liability for gross negligence',
    'Request a warranty period (e.g., 90 days) where software is guaranteed to function as documented',
    'Add a clause allowing modifications for integration with your existing systems',
    'Clarify what constitutes "internal business purposes" - can affiliates use it? Remote employees?',
    'Consider adding a data portability clause for when you terminate',
  ],
};

export const sampleChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: 'What happens if I pay late?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'According to Section 3 of the agreement, if you pay late, you\'ll be charged a 1.5% monthly service fee on the overdue amount. This compounds monthly, which equals roughly 18% annually. Additionally, the Licensor may suspend your license access until payment is received.',
    timestamp: new Date(Date.now() - 1000 * 60 * 29),
  },
  {
    id: '3',
    role: 'user',
    content: 'Can I share this software with my subsidiary company?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '4',
    role: 'assistant',
    content: 'The license grant in Section 1 specifies "Licensee\'s internal business purposes" but doesn\'t explicitly address subsidiaries. This is a gray area that could be risky. The license is non-transferable, which suggests subsidiaries may need their own licenses. I recommend:\n\n1. Asking the Licensor to clarify if subsidiaries are included\n2. Requesting an amendment if you need affiliate usage rights\n3. Getting written confirmation before allowing subsidiary access\n\nSharing without clarification could constitute a breach of contract.',
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
  },
];
