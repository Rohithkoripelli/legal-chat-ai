// src/pages/GuestContractAnalysisPage.tsx
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Brain, Shield, CheckCircle, ArrowRight, AlertCircle, AlertTriangle, Calendar, User, DollarSign, Clock, RefreshCw, ArrowLeft, Zap, Users, ChevronDown, ChevronUp, X } from 'lucide-react';

interface GuestDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content: string;
}

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
  riskAssessment: {
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

const GuestContractAnalysisPage: React.FC = () => {
  const [guestDocuments, setGuestDocuments] = useState<GuestDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<GuestDocument | null>(null);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';

  // Load documents from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem('guestDocuments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGuestDocuments(parsed.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt)
        })));
      } catch (error) {
        console.error('Error loading guest documents:', error);
      }
    }
  }, []);


  const analyzeContract = async (document: GuestDocument) => {
    setAnalyzing(true);
    setError(null);
    setSelectedDocument(document);

    try {
      console.log('🤖 Starting guest contract analysis for:', document.name);

      const response = await fetch(`${API_BASE_URL}/api/guest/documents/contracts/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: document.id,
          documentName: document.name,
          documentContent: document.content
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Analysis failed: ${response.status}`);
      }

      const analysisResult = await response.json();
      console.log('✅ Guest contract analysis completed with real AI');
      setAnalysis(analysisResult);
    } catch (err) {
      console.error('❌ Error analyzing contract:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      
      // Only provide fallback analysis if the real API completely fails
      const fallbackAnalysis: ContractAnalysis = {
        documentId: document.id,
        documentName: document.name,
        riskScore: 'MEDIUM',
        executiveSummary: {
          overview: `AI analysis temporarily unavailable for "${document.name}". Our service is currently experiencing high demand. This fallback analysis provides basic insights while we restore full AI-powered analysis. Please try again in a few minutes for comprehensive AI contract review.`,
          keyDates: [
            {
              date: 'Contract effective date',
              description: 'Review the effective date and ensure all parties are aware',
              importance: 'HIGH'
            },
            {
              date: 'Payment due dates',
              description: 'Monitor payment schedule and deadlines',
              importance: 'MEDIUM'
            }
          ],
          obligations: [
            {
              party: 'All Parties',
              obligation: 'Review contract terms and ensure compliance with all provisions',
              deadline: 'Ongoing'
            },
            {
              party: 'Service Provider',
              obligation: 'Deliver services according to contract specifications',
              deadline: 'As specified in contract'
            }
          ],
          recommendedActions: [
            'Review all payment terms and deadlines carefully',
            'Identify any liability limitations and assess risk tolerance',
            'Ensure termination clauses are favorable and clearly understood',
            'Verify compliance requirements are achievable',
            'Consider legal review for high-value or complex agreements'
          ]
        },
        riskAssessment: {
          overallScore: 65,
          riskFactors: [
            {
              category: 'Payment Terms',
              severity: 'MEDIUM',
              description: 'Standard payment terms identified that may require monitoring',
              clause: 'Payment clauses contain standard provisions that should be reviewed for your specific situation',
              recommendation: 'Review payment schedule and ensure cash flow alignment'
            },
            {
              category: 'Liability',
              severity: 'MEDIUM',
              description: 'Liability provisions may limit recourse in case of disputes',
              clause: 'Limitation of liability clauses may restrict available remedies',
              recommendation: 'Consider additional insurance or risk mitigation strategies'
            },
            {
              category: 'Termination',
              severity: 'LOW',
              description: 'Standard termination provisions appear reasonable',
              clause: 'Termination clauses provide standard notice requirements',
              recommendation: 'Ensure termination process aligns with business needs'
            }
          ]
        },
        keyTerms: [
          {
            term: 'Contract Duration',
            value: 'Review the contract for specific term length',
            category: 'Term & Duration',
            riskLevel: 'LOW'
          },
          {
            term: 'Payment Terms',
            value: 'Standard payment provisions identified',
            category: 'Financial',
            riskLevel: 'MEDIUM'
          },
          {
            term: 'Liability Limits',
            value: 'Limitation of liability clauses present',
            category: 'Risk Management',
            riskLevel: 'MEDIUM'
          }
        ],
        problematicClauses: [
          {
            clause: 'Guest mode analysis provides general insights only',
            issue: 'Limited analysis capabilities in guest mode',
            severity: 'LOW',
            suggestion: 'Create a free account for comprehensive AI-powered contract analysis with detailed clause review and compliance checking'
          }
        ],
        analyzedAt: new Date().toISOString()
      };
      
      setAnalysis(fallbackAnalysis);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload handlers for inline upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (files.length > 3) {
        setUploadError('Free users can upload up to 3 documents at once. Sign up for unlimited uploads!');
        return;
      }
      setSelectedFiles(files);
      setUploadError(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('documents', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/guest/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      const uploadedDocs: GuestDocument[] = result.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        type: doc.type,
        uploadedAt: new Date(doc.uploadedAt),
        content: doc.content
      }));

      setGuestDocuments(prev => [...prev, ...uploadedDocs]);
      sessionStorage.setItem('guestDocuments', JSON.stringify([...guestDocuments, ...uploadedDocs]));
      
      setSelectedFiles([]);
      setShowUpload(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
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

  if (analysis) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setAnalysis(null);
                setSelectedDocument(null);
                setError(null);
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Contract Selection</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Guest Contract Analysis</h1>
              <p className="text-gray-600 mt-1">{analysis.documentName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${getRiskColor(analysis.riskScore)}`}>
              {getRiskIcon(analysis.riskScore)}
              <span className="font-medium">{analysis.riskScore} RISK</span>
            </div>
            <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              ✨ Guest Mode Analysis
            </div>
          </div>
        </div>

        {/* Upgrade Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">🔓 Upgrade for Premium Features</h3>
              <p className="text-blue-800 text-sm">
                You just received a full AI contract analysis! Create a free account for unlimited documents, permanent storage, advanced analytics dashboard, and document generation tools.
              </p>
            </div>
            <button
              onClick={() => window.location.href = '/sign-up'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Upgrade Free</span>
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
              <div className="text-xs text-blue-600">AI-Powered Analysis</div>
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
                <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(clause.severity)}`}>
                      {clause.severity} PRIORITY
                    </span>
                  </div>
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">Note: {clause.issue}</h4>
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
                The AI analysis should supplement, not replace, consultation with qualified legal professionals. 
                Always consult with a licensed attorney for legal matters and important decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI is Analyzing Your Contract...
            </h3>
            <p className="text-gray-600">
              Our AI is performing comprehensive analysis of "{selectedDocument?.name}" using OpenAI for risk assessment, key terms extraction, and compliance review. This may take 30-60 seconds.
            </p>
            <div className="mt-4 text-sm text-blue-600">
              ✨ Free AI Analysis • Full contract analysis with real AI • No signup required
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Document Selection or Upload */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
        {/* Inline Upload Section */}
        {showUpload && (
          <div className="border border-blue-200 rounded-lg p-6 mb-6 bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload New Documents (Free)</h3>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFiles([]);
                  setUploadError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById('guest-contract-file-input')?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Click to select files or drag and drop</p>
                <p className="text-sm text-gray-500">Free: Up to 3 documents • PDF, Word (.doc, .docx), Text (.txt), RTF</p>
                <input
                  id="guest-contract-file-input"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-3">
                    <button
                      onClick={uploadFiles}
                      disabled={uploading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} for Free</span>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedFiles([])}
                      disabled={uploading}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {guestDocuments.length === 0 ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Documents Found
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Upload documents to start analyzing them with AI. No signup required - analyze up to 3 documents for free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Documents Free
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Select Contract to Analyze
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Choose a document from your uploaded files for AI contract analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guestDocuments.map((document) => (
                <div
                  key={document.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300 cursor-pointer"
                  onClick={() => analyzeContract(document)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {document.name}
                      </h3>
                      <div className="flex flex-col space-y-1 text-sm text-gray-500">
                        <span>Size: {formatFileSize(document.size)}</span>
                        <span>Uploaded: {document.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="mt-4">
                        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                          <Brain className="h-4 w-4" />
                          <span>Analyze Contract</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload More Documents
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Free Contract Analysis - No Signup Required
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
          Upload your contracts and legal agreements for instant AI analysis. Get risk assessment, 
          key term extraction, and compliance insights - completely free to try with our guest mode.
        </p>
        
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <Brain className="w-4 h-4 mr-2" />
          {guestDocuments.length} document{guestDocuments.length !== 1 ? 's' : ''} ready for analysis
        </div>
      </header>

      {/* Benefits Section */}
      <section className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Risk Analysis</h3>
          <p className="text-blue-800 text-sm">
            Advanced AI examines contracts for potential risks and liability issues
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Clause Review</h3>
          <p className="text-green-800 text-sm">
            Identifies problematic clauses and suggests improvements
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Instant Results</h3>
          <p className="text-purple-800 text-sm">
            Get comprehensive contract analysis in under 60 seconds
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-lg mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-orange-900 mb-2">No Signup Required</h3>
          <p className="text-orange-800 text-sm">
            Start analyzing contracts immediately with guest mode
          </p>
        </div>
      </section>

      {/* Free vs Premium */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-3">✨ Guest Mode Analysis</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Basic risk assessment</li>
            <li>• Key term identification</li>
            <li>• General clause review</li>
            <li>• Standard recommendations</li>
            <li>• No signup required</li>
          </ul>
        </div>
        
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">🚀 Advanced Analysis (Free Account)</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Comprehensive AI risk analysis</li>
            <li>• Detailed compliance checking</li>
            <li>• Clause-by-clause review</li>
            <li>• Industry-specific insights</li>
            <li>• Unlimited analysis</li>
          </ul>
          <button
            onClick={() => window.location.href = '/sign-up'}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Upgrade Free →
          </button>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Important Legal Notice</h4>
            <p className="text-yellow-700 text-sm">
              This free contract analysis tool is for informational purposes only and does not constitute legal advice. 
              The AI analysis should supplement, not replace, consultation with qualified legal professionals. 
              Always consult with a licensed attorney for legal matters and important decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestContractAnalysisPage;