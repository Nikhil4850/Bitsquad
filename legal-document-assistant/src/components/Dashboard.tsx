import React from 'react';
import { FileText, MessageSquare, TrendingUp, Clock, Star, ArrowRight, BarChart3, Users, Shield, Upload, Scale } from 'lucide-react';
import { User } from '../types';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {

  const recentActivity = [
    {
      id: 1,
      type: 'document',
      title: 'Employment Contract',
      status: 'Analyzed',
      time: '2 hours ago',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'chat',
      title: 'Asked about termination clause',
      status: 'Answered',
      time: '5 hours ago',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'document',
      title: 'Software License Agreement',
      status: 'Processing',
      time: '1 day ago',
      icon: FileText,
      color: 'text-amber-600'
    }
  ];

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Upload a legal document for analysis',
      icon: Upload,
      action: () => onNavigate('analyze'),
      color: 'bg-primary-500'
    },
    {
      title: 'Lawyer Advice',
      description: 'Connect with expert lawyers for consultation',
      icon: Scale,
      action: () => onNavigate('lawyers'),
      color: 'bg-blue-500'
    },
    {
      title: 'Chat with AI',
      description: 'Ask questions about your documents',
      icon: MessageSquare,
      action: () => onNavigate('chat'),
      color: 'bg-green-500'
    },
    {
      title: 'View Documents',
      description: 'Browse your document library',
      icon: FileText,
      action: () => onNavigate('documents'),
      color: 'bg-purple-500'
    }
  ];

  const stats = [
    {
      label: 'Documents Analyzed',
      value: user.documentsAnalyzed,
      icon: FileText,
      change: '+2 this week',
      color: 'text-blue-600'
    },
    {
      label: 'Days Active',
      value: Math.floor((new Date().getTime() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24)),
      icon: Clock,
      change: 'Since ' + user.joinDate.toLocaleDateString(),
      color: 'text-green-600'
    },
    {
      label: 'Current Plan',
      value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1),
      icon: Star,
      change: user.plan === 'free' ? 'Upgrade available' : 'Active',
      color: 'text-amber-600'
    },
    {
      label: 'AI Queries',
      value: '24',
      icon: MessageSquare,
      change: '+5 today',
      color: 'text-purple-600'
    }
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-slate-100 text-slate-700';
      case 'premium': return 'bg-primary-100 text-primary-700';
      case 'enterprise': return 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-slate-600">
          Here's what's happening with your legal document analysis today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-sm text-slate-500">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-6 rounded-xl border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 text-left group"
                  >
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <button
                onClick={() => onNavigate('documents')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{activity.title}</div>
                      <div className="text-sm text-slate-500">{activity.status} • {activity.time}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Plan Status */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Current Plan
            </h3>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getPlanColor(user.plan)}`}>
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Documents this month</span>
                <span className="font-medium text-slate-900">{user.documentsAnalyzed}/5</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((user.documentsAnalyzed / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            {user.plan === 'free' && (
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all">
                Upgrade Plan
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-primary-50 to-cyan-50 rounded-xl p-6 border border-primary-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              Pro Tips
            </h3>
            <div className="space-y-3">
              <div className="text-sm text-slate-700">
                <div className="font-medium mb-1">📄 Document Analysis</div>
                Upload PDF, DOC, or TXT files for instant AI analysis
              </div>
              <div className="text-sm text-slate-700">
                <div className="font-medium mb-1">💬 Smart Questions</div>
                Ask specific questions about clauses, risks, or obligations
              </div>
              <div className="text-sm text-slate-700">
                <div className="font-medium mb-1">🔒 Privacy First</div>
                All documents are encrypted and never shared
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-soft">
            <h3 className="font-bold text-slate-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>Chat with Support</span>
              </button>
              <button className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>View Documentation</span>
              </button>
              <button className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Community Forum</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
