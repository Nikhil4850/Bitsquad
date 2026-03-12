import React from 'react';
import { Scale, Github, Twitter, Linkedin, Mail, Shield, FileText, MessageSquare, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const productLinks = [
    { label: 'Document Analysis', page: 'analyze' },
    { label: 'AI Assistant', page: 'chat' },
    { label: 'My Documents', page: 'documents' },
    { label: 'Pricing', page: 'pricing' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', page: 'privacy' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', page: 'privacy' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  const handleClick = (page?: string) => {
    if (page) {
      onNavigate?.(page);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Legal</span>
                <span className="text-xl font-bold text-primary-400">AI</span>
              </div>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Making legal documents accessible to everyone through AI-powered analysis and plain-language explanations.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 w-fit">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-300">256-bit Encrypted</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.page)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleClick(link.page)}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-8 border-t border-slate-800 mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="w-5 h-5" />
            <span>SOC 2 Compliant</span>
          </div>
          <div className="w-px h-5 bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Lock className="w-5 h-5" />
            <span>GDPR Ready</span>
          </div>
          <div className="w-px h-5 bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FileText className="w-5 h-5" />
            <span>256-bit Encryption</span>
          </div>
          <div className="w-px h-5 bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MessageSquare className="w-5 h-5" />
            <span>50K+ Users</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500 mb-4 sm:mb-0">
            © 2024 LegalAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
