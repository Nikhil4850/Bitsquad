import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Bell, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  CreditCard,
  Save,
  Check,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser?: (updates: Partial<User>) => void;
  onLogout?: () => void;
  onBack?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences' | 'billing'>('profile');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('emailNotifications') !== 'false';
  });
  const [pushNotifications, setPushNotifications] = useState(() => {
    return localStorage.getItem('pushNotifications') !== 'false';
  });
  const [autoDelete, setAutoDelete] = useState(() => {
    return localStorage.getItem('autoDelete') !== 'false';
  });
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState<'success' | 'error'>('success');

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Save notification preferences
  useEffect(() => {
    localStorage.setItem('emailNotifications', emailNotifications.toString());
  }, [emailNotifications]);

  useEffect(() => {
    localStorage.setItem('pushNotifications', pushNotifications.toString());
  }, [pushNotifications]);

  useEffect(() => {
    localStorage.setItem('autoDelete', autoDelete.toString());
  }, [autoDelete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = () => {
    onUpdateUser?.(formData);
    setSaveMessage('Profile updated successfully!');
    setSaveMessageType('success');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveMessage('Passwords do not match!');
      setSaveMessageType('error');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setSaveMessage('Password must be at least 8 characters!');
      setSaveMessageType('error');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    // Simulate password change
    setSaveMessage('Password changed successfully!');
    setSaveMessageType('success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={onBack} className="text-sm text-slate-600 hover:text-primary-600 mb-4">
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${
          saveMessageType === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <Check className="w-5 h-5" />
          {saveMessage}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-2 sticky top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Account Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Account ID</span>
                    <span className="text-slate-900 font-mono">{user.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Member Since</span>
                    <span className="text-slate-900">{user.joinDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Current Plan</span>
                    <span className="text-slate-900 capitalize">{user.plan}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Documents Analyzed</span>
                    <span className="text-slate-900">{user.documentsAnalyzed}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Change Password</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleChangePassword}
                      className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Two-Factor Authentication</h2>
                <p className="text-slate-600 mb-4">Add an extra layer of security to your account</p>
                <button className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-medium text-slate-900">Email Notifications</h3>
                      <p className="text-sm text-slate-600">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        emailNotifications ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          emailNotifications ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-medium text-slate-900">Push Notifications</h3>
                      <p className="text-sm text-slate-600">Receive browser notifications</p>
                    </div>
                    <button
                      onClick={() => setPushNotifications(!pushNotifications)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        pushNotifications ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          pushNotifications ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium text-slate-900">Document Analysis Complete</h3>
                      <p className="text-sm text-slate-600">Get notified when analysis is ready</p>
                    </div>
                    <button
                      className="relative w-14 h-7 rounded-full bg-primary-600"
                    >
                      <span className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full translate-x-7" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-slate-600" />}
                      <div>
                        <h3 className="font-medium text-slate-900">Dark Mode</h3>
                        <p className="text-sm text-slate-600">Toggle dark theme</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        isDarkMode ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          isDarkMode ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="py-4 border-b border-slate-100">
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Privacy</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium text-slate-900">Auto-Delete Documents</h3>
                      <p className="text-sm text-slate-600">Automatically delete documents after 24 hours</p>
                    </div>
                    <button
                      onClick={() => setAutoDelete(!autoDelete)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        autoDelete ? 'bg-primary-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                          autoDelete ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Current Plan</h2>
                
                <div className="bg-gradient-to-br from-primary-50 to-cyan-50 rounded-xl p-6 border border-primary-200 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-900 capitalize">{user.plan} Plan</h3>
                    {user.plan === 'free' && (
                      <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-slate-700">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 mb-4">
                    {user.plan === 'free' 
                      ? '5 documents per month • Basic AI analysis • Email support'
                      : 'Unlimited documents • Advanced AI • Priority support'}
                  </p>
                  {user.plan === 'free' && (
                    <button className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                      Upgrade to Premium
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">Available Plans</h3>
                  
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">Premium</h4>
                      <span className="text-2xl font-bold text-slate-900">$19<span className="text-sm text-slate-600">/mo</span></span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Unlimited documents, advanced features</p>
                    <button className="w-full px-4 py-2 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors">
                      Select Plan
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">Enterprise</h4>
                      <span className="text-2xl font-bold text-slate-900">Custom</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Custom solutions for teams</p>
                    <button className="w-full px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 mt-8">
            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <div className="space-y-3">
              <button
                onClick={onLogout}
                className="w-full px-6 py-3 bg-white border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
              <button className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
