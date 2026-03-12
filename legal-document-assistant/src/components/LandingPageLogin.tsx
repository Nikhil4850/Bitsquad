import React, { useState } from 'react';
import { 
  Scale, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, 
  CheckCircle, Star, FileText, MessageSquare, Zap, Users, 
  Target, Heart, Globe, Send, Quote, Menu, X
} from 'lucide-react';

interface LandingPageProps {
  onLogin?: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, name: string) => Promise<string | undefined> | void;
  onGetStarted?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignUp, onGetStarted }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [authMessageType, setAuthMessageType] = useState<'success' | 'error' | 'info'>('info');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthMessage('');
    
    try {
      if (isSignUpMode) {
        const result = await onSignUp?.(formData.email, formData.password, formData.name);
        
        // If signup returned a string, it means confirmation is needed
        if (result === 'signup_success') {
          setAuthMessage('✅ Account created successfully! You can now sign in.');
          setAuthMessageType('success');
          setTimeout(() => {
            setIsSignUpMode(false);
            setFormData({ name: '', email: '', password: '' });
          }, 2000);
        } else {
          // Auto-login successful - parent handles redirect
          return;
        }
      } else {
        await onLogin?.(formData.email, formData.password);
        // Login successful - parent handles redirect
        return;
      }
    } catch (error: any) {
      console.error('Authentication failed:', error);
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('auth/email-already-in-use')) {
          errorMessage = 'An account with this email already exists. Please sign in.';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = 'Invalid email address format.';
        } else if (error.message.includes('auth/weak-password')) {
          errorMessage = 'Password should be at least 6 characters.';
        } else if (error.message.includes('auth/user-not-found')) {
          errorMessage = 'No account found with this email. Please sign up.';
        } else if (error.message.includes('auth/wrong-password')) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.message.includes('auth/invalid-credential')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before logging in.';
        } else if (error.message.includes('Invalid') || error.message.includes('password')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthMessage(errorMessage);
      setAuthMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const switchToSignUp = () => {
    setIsSignUpMode(true);
    setIsLoginMode(true);
    setFormData({ name: '', email: '', password: '' });
  };

  const switchToSignIn = () => {
    setIsSignUpMode(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const features = [
    {
      icon: FileText,
      title: 'Smart Document Analysis',
      description: 'Upload any legal document and get instant AI-powered summaries in plain language.',
    },
    {
      icon: MessageSquare,
      title: 'Conversational Q&A',
      description: 'Ask questions about your documents in natural language and get clear explanations.',
    },
    {
      icon: Shield,
      title: 'Risk Detection',
      description: 'Automatically identify obligations, risks, and unfavorable terms before signing.',
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description: 'Receive actionable recommendations and highlighted key terms within seconds.',
    },
  ];

  const testimonials = [
    {
      quote: "Saved me $2,000 in legal fees just by helping me understand my employment contract.",
      author: "Sarah M.",
      role: "Software Engineer",
      rating: 5,
    },
    {
      quote: "As a small business owner, this is invaluable. I can now review contracts confidently.",
      author: "Michael R.",
      role: "Business Owner",
      rating: 5,
    },
    {
      quote: "The risk detection feature caught a hidden auto-renewal clause that I would have missed.",
      author: "Jennifer L.",
      role: "Marketing Director",
      rating: 5,
    },
  ];

  const stats = [
    { number: '50K+', label: 'Users' },
    { number: '250K+', label: 'Documents Analyzed' },
    { number: '98%', label: 'Satisfaction' },
    { number: '24/7', label: 'AI Available' },
  ];

  if (isLoginMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold text-slate-800">Legal</span>
                <span className="text-2xl font-bold text-primary-600">AI</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
              {isSignUpMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-600 text-center mb-8">
              {isSignUpMode ? 'Sign up to start analyzing your legal documents' : 'Sign in to access your legal document assistant'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUpMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={isSignUpMode}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Smith"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isSignUpMode ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {isSignUpMode ? 'Sign Up' : 'Sign In'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Auth Message Display */}
            {authMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                authMessageType === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : authMessageType === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {authMessage}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={isSignUpMode ? switchToSignIn : switchToSignUp}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isSignUpMode ? 'Sign in' : 'Sign up for free'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-center text-xs text-slate-500">
                <Shield className="w-4 h-4 text-green-600" />
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLoginMode(false)}
            className="mt-4 text-center w-full text-sm text-slate-600 hover:text-primary-600 transition-colors"
          >
            ← Back to landing page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-40">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-soft border border-slate-200 mb-8 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-600">Trusted by 50,000+ users</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in">
              Understand Legal Documents
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500">
                Without the Lawyer Jargon
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Upload any legal document and get instant, plain-language explanations. 
              Our AI identifies risks, explains clauses, and answers your questions in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => setIsLoginMode(true)}
                className="group px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-200 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 text-lg font-semibold text-slate-700 bg-white rounded-xl shadow-soft border border-slate-200 hover:bg-slate-50 transition-all duration-300"
              >
                See Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-600" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-600" />
                <span>Data Never Stored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful AI features designed to make legal documents accessible to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 hover-lift border border-slate-100 shadow-soft"
                >
                  <div className={`w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by Thousands</h2>
            <p className="text-lg text-slate-600">See what our users say about simplifying their legal life</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.author}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Understand Your Legal Documents?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join 50,000+ users who save time and money with AI-powered legal clarity.
          </p>
          <button
            onClick={() => setIsLoginMode(true)}
            className="px-10 py-5 text-lg font-semibold text-primary-700 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Started Free
          </button>
          <p className="mt-4 text-sm text-white/60">No credit card required. 5 free analyses per month.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
