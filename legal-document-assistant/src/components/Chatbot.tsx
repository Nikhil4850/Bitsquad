import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

interface ChatbotProps {
  userName?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userName = 'User' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string, timestamp: Date}[]>([
    { role: 'bot', content: `Hi ${userName}! I'm your LegalAI assistant. How can I help you today?`, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return `Hello ${userName}! How can I assist you with your legal documents today?`;
    }
    if (lowerMsg.includes('help')) {
      return 'I can help you:\n• Upload and analyze legal documents\n• Explain complex legal terms\n• Answer questions about contracts\n• Identify risks and obligations\n• Navigate the platform';
    }
    if (lowerMsg.includes('upload') || lowerMsg.includes('document')) {
      return 'To upload a document, click "Analyze Document" in the navigation menu. I support PDF, DOC, DOCX, and TXT files up to 10MB.';
    }
    if (lowerMsg.includes('pricing') || lowerMsg.includes('plan') || lowerMsg.includes('cost')) {
      return 'We offer:\n• Free Plan: 5 documents/month\n• Premium: Unlimited documents\n• Enterprise: Custom solutions\nCheck your profile for current plan details.';
    }
    if (lowerMsg.includes('security') || lowerMsg.includes('privacy') || lowerMsg.includes('safe')) {
      return 'Your data is secure! We use 256-bit encryption, never store documents permanently, and are GDPR compliant. Your privacy is our priority.';
    }
    if (lowerMsg.includes('thank')) {
      return "You're welcome! I'm here whenever you need help with legal documents.";
    }
    if (lowerMsg.includes('profile') || lowerMsg.includes('account')) {
      return 'You can update your profile by clicking on your name in the top navigation and selecting "Profile Settings". There you can change your name, email, and other details.';
    }
    if (lowerMsg.includes('dashboard')) {
      return 'Your dashboard shows your document statistics, recent activity, and quick actions. Click "Dashboard" in the navigation to view it.';
    }
    
    return "I'm here to help with your legal documents! You can ask me about:\n• How to upload documents\n• Understanding legal terms\n• Platform features\n• Your account settings\n• Or any other questions!";
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', content: botResponse, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-96'}`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">LegalAI Assistant</div>
              <div className="text-white/70 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-slate-50">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-primary-100' : 'bg-gradient-to-br from-primary-500 to-primary-700'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white rounded-br-md'
                          : 'bg-white text-slate-700 border border-slate-200 rounded-bl-md shadow-sm'
                      }`}>
                        {message.content}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-3 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
