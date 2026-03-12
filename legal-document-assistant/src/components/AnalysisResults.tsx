import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  Scale,
  Clock,
  AlertCircle,
  Shield,
  Download,
  Share2,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { DocumentAnalysis, LegalDocument, Clause, Obligation, Risk } from '../types';
import { sampleAnalysis } from '../data/sampleData';

interface AnalysisResultsProps {
  document?: LegalDocument;
  analysis?: DocumentAnalysis;
  onAskQuestion?: (question: string) => void;
  onBack?: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  document,
  analysis = sampleAnalysis,
  onAskQuestion,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'clauses' | 'obligations' | 'risks'>('summary');
  const [expandedClauses, setExpandedClauses] = useState<string[]>(['1']);

  const toggleClause = (id: string) => {
    setExpandedClauses(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'clauses', label: 'Key Clauses', icon: Scale },
    { id: 'obligations', label: 'Obligations', icon: CheckCircle },
    { id: 'risks', label: 'Risks', icon: AlertTriangle },
  ];

  const suggestedQuestions = [
    'What happens if I breach this contract?',
    'Can I terminate this agreement early?',
    'What are my payment obligations?',
    'Is there an auto-renewal clause?',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <button onClick={onBack} className="hover:text-primary-600">← Back</button>
          <span>/</span>
          <span>Analysis Results</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Document Analysis Complete</h1>
            <p className="text-slate-600 mt-1">
              {document?.name || 'Software_License_Agreement_v2.pdf'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 mb-6">
        <Shield className="w-5 h-5 text-green-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">
            Your document has been analyzed and will be automatically deleted in 23:45:12
          </p>
        </div>
        <button className="text-sm text-green-700 hover:text-green-800 font-medium">
          Delete Now
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6 animate-fade-in">
              {/* Quick Overview Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Executive Summary
                </h2>
                <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700">{analysis.keyClauses.length}</div>
                  <div className="text-sm text-blue-600 mt-1">Key Clauses</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                  <div className="text-3xl font-bold text-amber-700">{analysis.obligations.length}</div>
                  <div className="text-sm text-amber-600 mt-1">Obligations</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                  <div className="text-3xl font-bold text-red-700">{analysis.risks.length}</div>
                  <div className="text-sm text-red-600 mt-1">Risks Found</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Recommendations
                </h2>
                <ul className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-primary-700">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Clauses Tab */}
          {activeTab === 'clauses' && (
            <div className="space-y-4 animate-fade-in">
              {analysis.keyClauses.map((clause: Clause) => {
                const isExpanded = expandedClauses.includes(clause.id);
                return (
                  <div
                    key={clause.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-soft"
                  >
                    <button
                      onClick={() => toggleClause(clause.id)}
                      className="w-full p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getImportanceColor(clause.importance)}`}>
                            {clause.importance.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">{clause.section}</span>
                        </div>
                        <h3 className="font-semibold text-slate-900">{clause.title}</h3>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-slate-100">
                        <div className="pt-4 space-y-4">
                          <div>
                            <div className="text-xs font-medium text-slate-500 uppercase mb-2">Original Text</div>
                            <div className="p-3 bg-slate-100 rounded-lg text-sm text-slate-700 font-mono">
                              "{clause.originalText}"
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-primary-600 uppercase mb-2">Plain Language Explanation</div>
                            <p className="text-slate-700 leading-relaxed">{clause.plainExplanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Obligations Tab */}
          {activeTab === 'obligations' && (
            <div className="space-y-4 animate-fade-in">
              {analysis.obligations.map((obligation: Obligation) => (
                <div
                  key={obligation.id}
                  className={`rounded-xl border p-5 ${obligation.isCritical ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200 shadow-soft'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      obligation.isCritical ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {obligation.isCritical ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{obligation.description}</h3>
                        {obligation.isCritical && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p><span className="font-medium">Party:</span> {obligation.party}</p>
                        {obligation.deadline && (
                          <p className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-medium">Deadline:</span> {obligation.deadline}
                          </p>
                        )}
                        <p className="text-slate-500 italic">Consequence: {obligation.consequence}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Risks Tab */}
          {activeTab === 'risks' && (
            <div className="space-y-4 animate-fade-in">
              {analysis.risks.map((risk: Risk) => (
                <div
                  key={risk.id}
                  className={`rounded-xl border p-5 ${getSeverityColor(risk.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      risk.severity === 'high' ? 'bg-red-100' :
                      risk.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        risk.severity === 'high' ? 'text-red-600' :
                        risk.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                          risk.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {risk.severity.toUpperCase()} RISK
                        </span>
                        <span className="text-xs text-slate-500">{risk.section}</span>
                      </div>
                      <p className="text-slate-800 mb-3">{risk.description}</p>
                      <div className="p-3 bg-white/70 rounded-lg">
                        <div className="text-xs font-medium text-slate-500 uppercase mb-1">Mitigation</div>
                        <p className="text-sm text-slate-700">{risk.mitigation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ask AI Card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask About This Document
            </h3>
            <p className="text-sm text-white/80 mb-4">
              Have questions? Our AI assistant can explain any part of this document.
            </p>
            <div className="space-y-2">
              {suggestedQuestions.slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => onAskQuestion?.(q)}
                  className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <span className="line-clamp-1">{q}</span>
                  <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Document Info */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Document Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-700">Software License</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pages</span>
                <span className="text-slate-700">7 pages</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Word Count</span>
                <span className="text-slate-700">2,450 words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Analyzed</span>
                <span className="text-slate-700">Just now</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                <Download className="w-4 h-4 text-slate-400" />
                <span>Download Summary</span>
              </button>
              <button className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share with Attorney</span>
              </button>
              <button className="w-full p-3 text-left rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>View Original</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
