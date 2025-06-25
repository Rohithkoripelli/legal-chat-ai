// frontend/src/components/contracts/IndividualAnalysisPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { ArrowLeft, AlertCircle, FileText, Brain, Calendar, User, CheckCircle, AlertTriangle } from 'lucide-react';

interface ContractAnalysis {
  documentId: string;
  documentName: string;
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  executiveSummary: {
    overview: string;
    keyDates: Array<{
      date: string;
      description: string;
      importance: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    obligations: Array<{
      party: string;
      obligation: string;
      deadline?: string;
    }>;
    recommendedActions: string[];
  };
  riskAssessment?: {
    overallScore: number;
    riskFactors: Array<{
      category: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
      clause: string;
      recommendation: string;
    }>;
  };
  keyTerms: Array<{
    term: string;
    value: string;
    category: string;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  problematicClauses: Array<{
    clause: string;
    issue: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    suggestion: string;
  }>;
  analyzedAt: string;
}

const IndividualAnalysisPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/contract-analysis');
      return;
    }

    if (documentId) {
      fetchAnalysis();
    }
  }, [documentId, isSignedIn, navigate]);

  const fetchAnalysis = async () => {
    if (!documentId) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/contracts/analysis/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analysis: ${response.status}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-100 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return <AlertTriangle className="h-5 w-5" />;
      case 'MEDIUM': return <AlertCircle className="h-5 w-5" />;
      case 'LOW': return <CheckCircle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Analysis...</h3>
            <p className="text-gray-600">Please wait while we fetch your contract analysis.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-red-800 font-medium">Error Loading Analysis</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <div className="mt-4 space-x-4">
                <button 
                  onClick={fetchAnalysis}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Not Found</h3>
          <p className="text-gray-600">The requested contract analysis could not be found.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
        <button 
          onClick={() => navigate('/dashboard')}
          className="hover:text-blue-600 transition-colors"
        >
          Dashboard
        </button>
        <span>›</span>
        <span className="text-gray-900 font-medium">Contract Analysis</span>
        <span>›</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{analysis.documentName}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contract Analysis</h1>
            <p className="text-gray-600 mt-1">{analysis.documentName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getRiskColor(analysis.riskScore)}`}>
            {getRiskIcon(analysis.riskScore)}
            <span className="font-medium">{analysis.riskScore} RISK</span>
          </div>
          <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            ✨ AI Analysis Complete
          </div>
        </div>
      </div>

      {/* Risk Score */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{analysis.riskAssessment?.overallScore || 0}</div>
              <div className="text-sm text-gray-600">Risk Score</div>
            </div>
            <div className="h-16 w-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getRiskColor(analysis.riskScore)}`}>
              {getRiskIcon(analysis.riskScore)}
              <span className="font-medium">{analysis.riskScore} RISK</span>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
        <div className="text-gray-700 leading-relaxed">
          <p>{analysis.executiveSummary.overview}</p>
        </div>
      </div>

      {/* Key Dates & Obligations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Dates */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Key Dates
          </h3>
          {analysis.executiveSummary.keyDates.length > 0 ? (
            <div className="space-y-3">
              {analysis.executiveSummary.keyDates.map((date, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    date.importance === 'HIGH' ? 'bg-red-500' : 
                    date.importance === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{date.date}</div>
                    <div className="text-sm text-gray-600">{date.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No key dates identified</p>
          )}
        </div>

        {/* Obligations */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Key Obligations
          </h3>
          {analysis.executiveSummary.obligations.length > 0 ? (
            <div className="space-y-3">
              {analysis.executiveSummary.obligations.map((obligation, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="font-medium text-gray-900">{obligation.party}</div>
                  <div className="text-sm text-gray-600">{obligation.obligation}</div>
                  {obligation.deadline && (
                    <div className="text-xs text-gray-500 mt-1">Due: {obligation.deadline}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No key obligations identified</p>
          )}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Factors</h2>
        {(analysis.riskAssessment?.riskFactors?.length || 0) > 0 ? (
          <div className="space-y-4">
            {analysis.riskAssessment?.riskFactors?.map((factor, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-r-lg ${
                factor.severity === 'HIGH' ? 'border-red-400 bg-red-50' :
                factor.severity === 'MEDIUM' ? 'border-yellow-400 bg-yellow-50' :
                'border-green-400 bg-green-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{factor.category}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(factor.severity)}`}>
                      {factor.severity}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{factor.description}</p>
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Clause:</strong> "{factor.clause.length > 100 ? factor.clause.substring(0, 100) + '...' : factor.clause}"
                </div>
                <div className="text-xs text-blue-600">
                  <strong>Recommendation:</strong> {factor.recommendation}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No specific risk factors identified</p>
        )}
      </div>

      {/* Key Terms */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Terms</h2>
        {analysis.keyTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.keyTerms.map((term, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{term.term}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(term.riskLevel)}`}>
                    {term.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{term.value}</p>
                <p className="text-xs text-gray-500">{term.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No key terms extracted</p>
        )}
      </div>

      {/* Problematic Clauses */}
      {analysis.problematicClauses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Areas for Review</h2>
          <div className="space-y-4">
            {analysis.problematicClauses.map((clause, index) => (
              <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(clause.severity)}`}>
                    {clause.severity} PRIORITY
                  </span>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">Issue: {clause.issue}</h4>
                  <p className="text-sm text-gray-700 italic">"{clause.clause.length > 200 ? clause.clause.substring(0, 200) + '...' : clause.clause}"</p>
                </div>
                <div className="bg-white border border-green-200 rounded p-3">
                  <h5 className="text-sm font-medium text-green-800 mb-1">Suggestion:</h5>
                  <p className="text-sm text-green-700">{clause.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Actions</h2>
        <div className="space-y-2">
          {analysis.executiveSummary.recommendedActions.map((action, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">{action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Important Legal Notice</h4>
            <p className="text-yellow-700 text-sm">
              This AI-powered contract analysis is for informational purposes only and does not constitute legal advice. 
              Always consult with a licensed attorney for legal matters and important decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualAnalysisPage;