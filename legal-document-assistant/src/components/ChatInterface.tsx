import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText, Sparkles, Clock, ChevronRight, Upload, FileCheck, AlertCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { sampleChatHistory } from '../data/sampleData';

interface ChatInterfaceProps {
  documentContext?: string;
  initialMessages?: ChatMessage[];
  onBack?: () => void;
  onAnalyzeDocument?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  documentContext = 'Software License Agreement',
  initialMessages = sampleChatHistory,
  onBack,
  onAnalyzeDocument,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const generateAIResponse = (question: string): string => {
    const responses: { [key: string]: string } = {
      'liability': 'According to Section 5, the Licensor\'s liability is capped at the amount you paid in the 12 months before any claim. This is a significant limitation - even if you suffer damages exceeding that amount, you cannot recover more. I\'d recommend negotiating this clause to at least cover 2-3 years of fees or request unlimited liability for gross negligence or willful misconduct.',
      'terminate': 'Yes, Section 4 states that either party can terminate with 90 days written notice. This is a reasonable notice period. However, note that termination doesn\'t excuse you from paying any fees owed up to the termination date, and certain provisions (like confidentiality) may survive termination.',
      'payment': 'Section 3 requires payment within 30 days of invoice. Late payments incur a 1.5% monthly service charge (18% annualized). This is quite steep compared to standard late fees. If you anticipate any cash flow issues, you might want to negotiate longer payment terms or a lower late fee percentage.',
      'modify': 'No, Section 2 explicitly prohibits modifying, adapting, or creating derivative works from the software. This means you cannot customize it for your specific needs. If you need modifications for integration with your existing systems, you should negotiate a clause allowing reasonable modifications or request professional services from the Licensor.',
      'default': 'Based on the document, I\'d need to review the specific sections to give you a complete answer. However, I can tell you that this is a fairly standard software license with some terms that favor the Licensor. Would you like me to focus on a specific section or concern?',
    };

    const lowerQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    return responses.default;
  };

  const suggestedQuestions = [
    'Analyze my document for risks',
    'What is the liability cap?',
    'Can I terminate this agreement early?',
    'What are the payment terms?',
    'Can I modify the software?',
    'What happens if I breach the contract?',
    'Is there an auto-renewal clause?',
    'Upload a new document for analysis'
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">AI Legal Assistant</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="w-4 h-4" />
            <span>Context: {documentContext}</span>
          </div>
        </div>
        {onAnalyzeDocument && (
          <button
            onClick={onAnalyzeDocument}
            className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze Document</span>
          </button>
        )}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700">AI Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Ask me anything about your document
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                I can explain complex legal terms, identify risks, summarize clauses, and help you understand your obligations.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-slate-600 to-slate-700'
                  : 'gradient-primary'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-4 rounded-2xl text-left ${
                  message.role === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className={`mt-1 text-xs text-slate-400 flex items-center gap-1 ${
                  message.role === 'user' ? 'justify-end' : ''
                }`}>
                  <Clock className="w-3 h-3" />
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-4 rounded-2xl bg-slate-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length < 3 && !isTyping && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <div className="text-xs font-medium text-slate-500 mb-2">Suggested questions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (question.includes('Upload a new document') && onAnalyzeDocument) {
                      onAnalyzeDocument();
                    } else {
                      setInputValue(question);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1 ${
                    question.includes('Upload a new document')
                      ? 'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {question.includes('Upload a new document') ? (
                    <>
                      <Upload className="w-3 h-3" />
                      {question}
                    </>
                  ) : (
                    <>
                      {question}
                      <ChevronRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your document..."
                className="w-full px-4 py-3 pr-12 bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 placeholder-slate-400"
              />
              {inputValue && (
                <button
                  onClick={() => setInputValue('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded transition-colors"
                >
                  <span className="sr-only">Clear</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isTyping ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400 text-center">
            AI responses are for informational purposes only and do not constitute legal advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
