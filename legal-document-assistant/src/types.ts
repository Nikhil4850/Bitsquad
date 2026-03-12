export interface LegalDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  content: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'error';
}

export interface DocumentAnalysis {
  summary: string;
  keyClauses: Clause[];
  obligations: Obligation[];
  risks: Risk[];
  recommendations: string[];
}

export interface Clause {
  id: string;
  title: string;
  originalText: string;
  plainExplanation: string;
  section: string;
  importance: 'high' | 'medium' | 'low';
}

export interface Obligation {
  id: string;
  description: string;
  deadline?: string;
  party: string;
  consequence: string;
  isCritical: boolean;
}

export interface Risk {
  id: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
  section: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium' | 'enterprise';
  documentsAnalyzed: number;
  joinDate: Date;
}
