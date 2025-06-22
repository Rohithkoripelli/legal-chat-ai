// frontend/src/components/contracts/ContractAnalysisPage.tsx - UPDATED WITH AUTH
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { AlertTriangle, CheckCircle, AlertCircle, FileText, Calendar, User, DollarSign, Clock, RefreshCw, ArrowLeft } from 'lucide-react';

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
  contractSnapshot?: {
    title: string;
    contractType: string;
    effectiveDate?: string;
    expirationDate?: string;
    renewalTerms?: string;
    parties: Array<{
      name: string;
      role: string;
      contactInfo?: string;
    }>;
  };
  keyInformationAndClauses?: {
    confidentialityObligations: Array<any>;
    nonCircumvention: Array<any>;
    nonSolicitationOfPersonnel: Array<any>;
    nonCompete: Array<any>;
    intellectualProperty: Array<any>;
    remediesAndEnforcement: Array<any>;
    termsAndTermination: Array<any>;
    limitationAndLiability: Array<any>;
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

interface ContractAnalysisPageProps {
  documentId: string;
  onBack: () => void;
}

const ContractAnalysisPage: React.FC<ContractAnalysisPageProps> = ({ documentId, onBack }) => {
  const { getToken, isSignedIn } = useAuth(); // ADD AUTH HOOK
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documentId && isSignedIn) {
      fetchAnalysis();
    }
  }, [documentId, isSignedIn]);

  const fetchAnalysis = async () => {
    if (!isSignedIn) {
      setError('Please log in to view contract analysis');
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in again');
      }

      console.log('🔍 Fetching contract analysis for document:', documentId);

      const response = await fetch(`https://legal-chat-ai.onrender.com/api/contracts/analysis/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404) {
        // No analysis exists, trigger new analysis
        console.log('📄 No existing analysis found, starting new analysis...');
        await startAnalysis();
        return;
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        throw new Error(`Failed to fetch analysis: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Contract analysis loaded successfully');
      setAnalysis(data);
    } catch (err) {
      console.error('❌ Error fetching analysis:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const startAnalysis = async () => {
    if (!isSignedIn) {
      setError('Please log in to analyze contracts');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in again');
      }

      console.log('🤖 Starting new contract analysis for document:', documentId);

      const response = await fetch(`https://legal-chat-ai.onrender.com/api/contracts/analyze/${documentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        if (response.status === 404) {
          throw new Error('Document not found or access denied');
        }
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Contract analysis completed successfully');
      setAnalysis(data);
    } catch (err) {
      console.error('❌ Error starting analysis:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    if (!isSignedIn) {
      setError('Please log in to refresh analysis');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in again');
      }

      console.log('🔄 Refreshing contract analysis...');

      // For refresh, we'll re-run the analysis
      const response = await fetch(`https://legal-chat-ai.onrender.com/api/contracts/analyze/${documentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        throw new Error(`Refresh failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Contract analysis refreshed successfully');
      setAnalysis(data);
    } catch (err) {
      console.error('❌ Error refreshing analysis:', err);
      setError(err instanceof Error ? err.message : 'Refresh failed');
    } finally {
      setAnalyzing(false);
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

  // Function to format the executive summary with proper structure
  const formatExecutiveSummary = (overview: string) => {
    if (!overview || typeof overview !== 'string') return [];
    
    const sections: { title: string; content: string[] }[] = [];
    
    // Look for **Section:** pattern
    const sectionRegex = /\*\*([^:*]+):\*\*\s*([\s\S]*?)(?=\*\*[^:*]+:\*\*|$)/g;
    let match;

    while ((match = sectionRegex.exec(overview)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      
      // Split content into bullet points
      const items: string[] = [];
      
      // Split by lines and filter out empty ones
      const lines = content.split('\n').filter(line => line.trim().length > 0);
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        // Remove leading dashes/bullets and clean up
        const cleanLine = trimmedLine.replace(/^[-•*]\s*/, '').trim();
        if (cleanLine.length > 5) {
          items.push(cleanLine);
        }
      }
      
      if (items.length > 0) {
        sections.push({ title, content: items });
      }
    }

    // If no sections found, try simple line-by-line parsing
    if (sections.length === 0) {
      const lines = overview.split('\n').filter(line => line.trim().length > 0);
      let currentSection: { title: string; content: string[] } | null = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check if this looks like a header (has bold formatting or ends with :)
        if (trimmedLine.includes('**') || trimmedLine.endsWith(':')) {
          // Save previous section
          if (currentSection && currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          // Start new section
          const title = trimmedLine.replace(/\*\*/g, '').replace(/:/g, '').trim();
          currentSection = { title, content: [] };
        } else if (currentSection && trimmedLine) {
          // Add content to current section
          const cleanContent = trimmedLine.replace(/^[-•*]\s*/, '').trim();
          if (cleanContent.length > 5) {
            currentSection.content.push(cleanContent);
          }
        }
      }
      
      // Don't forget the last section
      if (currentSection && currentSection.content.length > 0) {
        sections.push(currentSection);
      }
    }

    return sections;
  };

  // AUTH CHECK - Show auth required message if not signed in
  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please log in to analyze contracts.</p>
            <button 
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || analyzing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {analyzing ? 'Analyzing Your Contract...' : 'Loading Analysis...'}
            </h3>
            <p className="text-gray-600">
              {analyzing ? 'This may take 30-60 seconds. AI is examining your contract for risks and key terms.' : 'Please wait while we load your analysis.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-red-800 font-medium">Analysis Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <div className="flex space-x-3 mt-3">
                <button 
                  onClick={startAnalysis}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
                <button 
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Contract Analysis</h1>
            <p className="text-gray-600 mt-1">{analysis.documentName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getRiskColor(analysis.riskScore)}`}>
            {getRiskIcon(analysis.riskScore)}
            <span className="font-medium">{analysis.riskScore} RISK</span>
          </div>
          <button 
            onClick={refreshAnalysis}
            disabled={analyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
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
        <div className="space-y-4">
          {formatExecutiveSummary(analysis.executiveSummary.overview).map((section, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-gray-700 leading-relaxed text-sm">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Fallback if no structured content */}
          {formatExecutiveSummary(analysis.executiveSummary.overview).length === 0 && (
            <div className="text-gray-700 leading-relaxed">
              <p>{analysis.executiveSummary.overview}</p>
            </div>
          )}
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
                  <strong>Clause:</strong> "{factor.clause.substring(0, 100)}..."
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Problematic Clauses</h2>
          <div className="space-y-4">
            {analysis.problematicClauses.map((clause, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(clause.severity)}`}>
                    {clause.severity} RISK
                  </span>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">Issue: {clause.issue}</h4>
                  <p className="text-sm text-gray-700 italic">"{clause.clause.substring(0, 200)}..."</p>
                </div>
                <div className="bg-white border border-green-200 rounded p-3">
                  <h5 className="text-sm font-medium text-green-800 mb-1">Suggested Improvement:</h5>
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
    </div>
  );
};

export default ContractAnalysisPage;