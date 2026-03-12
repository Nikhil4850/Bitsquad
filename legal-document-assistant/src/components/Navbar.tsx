import React from 'react';
import { Scale, Shield, FileText, MessageSquare, Menu, X, ChevronDown, User, Lock } from 'lucide-react';

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
  currentPage?: 'home' | 'analyze' | 'chat' | 'results' | 'lawyers' | 'settings';
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn = true, 
  userName = 'User',
  currentPage = 'home',
  onNavigate,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: FileText },
    { id: 'lawyers', label: 'Lawyer Advice', icon: Scale },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate?.(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-slate-800">Legal</span>
                <span className="text-xl font-bold text-primary-600">AI</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right side - Security badge & User */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
              <Lock className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-medium text-green-700">256-bit Encrypted</span>
            </div>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">{userName}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-fade-in">
                    <button 
                      onClick={() => { handleNavClick('settings'); setIsUserMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Settings
                    </button>
                    <hr className="my-2 border-slate-100" />
                    <button 
                      onClick={() => { onLogout?.(); setIsUserMenuOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary-600">
                  Sign In
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                      isActive
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
