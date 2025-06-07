// src/pages/DocumentPage.tsx - Using your existing hooks and components
import React, { useState, useEffect } from 'react';
import { Upload, FileText, MessageSquare, Brain, Shield, CheckCircle, ArrowRight, Trash2, Download, Eye, AlertCircle, Zap, Clock, Star, Users } from 'lucide-react';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentList from '../components/documents/DocumentList';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '@clerk/clerk-react';
import { DocumentHead } from '../components/SEO/DocumentHead';

interface DocumentsPageProps {
  onNavigateToChat?: () => void;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ onNavigateToChat }) => {
  const { isSignedIn } = useAuth();
  const { documents, loading, error, deleteDocument, downloadDocument, refreshDocuments } = useDocuments();
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleUploadSuccess = () => {
    setUploadSuccess('Document uploaded successfully! You can now analyze it with AI chat.');
    // Refresh documents list
    refreshDocuments();
  };

  return (
    <>
      <DocumentHead
        title="Legal Document Upload & Management | AI Document Analysis | LegalChatAI"
        description="Upload legal documents for AI analysis. Manage contracts, NDAs, agreements securely. Get instant insights and document management in one place. Free to use."
        keywords="legal document upload, document management, AI document analysis, contract upload, legal document storage, document analysis tool"
        canonical="https://www.legalchatai.com/documents"
        jsonLD={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Legal Document Management",
          "description": "AI-powered legal document upload and management platform",
          "applicationCategory": "DocumentManagement",
          "operatingSystem": "Web",
          "provider": {
            "@type": "Organization",
            "name": "LegalChatAI",
            "url": "https://legalchatai.com"
          }
        }}
      />
      <div className="max-w-6xl mx-auto p-6">
      {/* SUCCESS MESSAGE */}
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{uploadSuccess}</span>
          </div>
        </div>
      )}

      {/* MAIN UPLOAD SECTION - MOVED TO TOP */}
      {isSignedIn && (
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Your Legal Documents for AI Analysis
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Upload contracts, NDAs, agreements, or any legal document. 
              Our AI will analyze them instantly for risks, key terms, and compliance issues.
            </p>
          </div>
          
          {/* Document Upload Component */}
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />

          {/* Supported Formats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">Supported Legal Document Formats</h3>
            <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-red-600" />
                <span>PDF Documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Word (.doc, .docx)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span>Text Files (.txt)</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span>RTF Documents</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* UPLOADED DOCUMENTS SECTION - MOVED TO TOP */}
      {isSignedIn && (
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Uploaded Legal Documents</h2>
                <p className="text-gray-600">
                  Manage your uploaded documents and analyze them with AI chat
                </p>
              </div>
              {documents.length > 0 && (
                <button
                  onClick={() => onNavigateToChat ? onNavigateToChat() : window.location.href = '/chat'}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Analyze with AI Chat
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            <DocumentList
              documents={documents}
              loading={loading}
              error={error}
              onDeleteDocument={deleteDocument}
              onDownloadDocument={downloadDocument}
              onRetry={refreshDocuments}
            />
          </div>
        </section>
      )}

      {/* AUTHENTICATION CHECK */}
      {!isSignedIn && (
        <section className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required for Document Upload
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            To upload and analyze your legal documents with AI, please sign in to your account. 
            Your documents will be securely stored and processed with enterprise-grade encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In to Upload Documents
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={() => window.location.href = '/sign-up'}
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
            >
              Create Free Account
            </button>
          </div>
        </section>
      )}

      {/* SEO-OPTIMIZED HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Upload Legal Documents for Free AI Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
          Upload your contracts, NDAs, and legal documents for instant AI analysis. 
          Our legal document AI provides professional insights, risk assessment, and contract review 
          completely free with enterprise-grade security.
        </p>
        
        {/* Document Stats */}
        {isSignedIn && (
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <FileText className="w-4 h-4 mr-2" />
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded • Ready for AI analysis
          </div>
        )}
        
        {!isSignedIn && (
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4 mr-2" />
            Sign in to upload and analyze legal documents
          </div>
        )}
      </header>

      {/* DOCUMENT WORKFLOW SECTION */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How Legal Document AI Analysis Works
        </h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
            <p className="text-gray-600 text-sm">
              Upload your contracts, NDAs, or legal documents in any supported format
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Processing</h3>
            <p className="text-gray-600 text-sm">
              Our AI processes and analyzes your documents for key information and risks
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat with AI</h3>
            <p className="text-gray-600 text-sm">
              Ask questions about your documents and receive instant AI insights
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Results</h3>
            <p className="text-gray-600 text-sm">
              Receive comprehensive analysis, risk assessment, and recommendations
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES COMPARISON */}
      <section className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Why Choose Our Legal Document AI Analysis Platform?
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Traditional Document Review</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-red-600 text-sm">✗</span>
                </span>
                Hours or days per document
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-red-600 text-sm">✗</span>
                </span>
                $300-500+ per hour in legal fees
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-red-600 text-sm">✗</span>
                </span>
                Risk of human error
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-red-600 text-sm">✗</span>
                </span>
                Limited availability
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 shadow-sm border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">LegalChatAI Analysis</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </span>
                Instant analysis in seconds
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </span>
                Secure, authenticated access
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </span>
                AI-powered accuracy
              </li>
              <li className="flex items-center text-gray-700">
                <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </span>
                Available 24/7
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEO FAQ SECTION */}
      <section className="bg-white border border-gray-200 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions About Legal Document Upload & Analysis
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What legal documents can I upload for AI analysis?
              </h3>
              <p className="text-gray-700">
                You can upload contracts, NDAs, employment agreements, service agreements, 
                lease agreements, purchase agreements, terms of service, privacy policies, 
                and most other legal documents in PDF, Word, or text format.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How secure is document upload and storage?
              </h3>
              <p className="text-gray-700">
                We use enterprise-grade security with AES-256 encryption, secure data transmission, 
                and authentication. Your documents are tied to your account and can be deleted anytime.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does AI document analysis take?
              </h3>
              <p className="text-gray-700">
                AI analysis typically completes within 10-30 seconds of upload. Complex documents 
                may take up to 60 seconds for comprehensive analysis and risk assessment.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need to create an account to use the service?
              </h3>
              <p className="text-gray-700">
                Yes, you need to sign in to upload and analyze documents. This ensures your documents 
                are securely stored and only accessible to you. Account creation is free and takes seconds.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What file formats are supported for upload?
              </h3>
              <p className="text-gray-700">
                We support PDF documents, Microsoft Word files (.doc, .docx), text files (.txt), 
                and RTF documents. Maximum file size is 10MB per document.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I delete my uploaded documents?
              </h3>
              <p className="text-gray-700">
                Yes, you have full control over your documents. You can view, download, or delete 
                any uploaded document at any time from your documents dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CAN YOU ANALYZE SECTION */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          What Legal Documents Can You Analyze with AI?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Contracts</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Service agreements</li>
              <li>• Partnership agreements</li>
              <li>• Vendor contracts</li>
              <li>• Consulting agreements</li>
              <li>• Supply agreements</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Documents</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Employment contracts</li>
              <li>• Non-disclosure agreements</li>
              <li>• Non-compete clauses</li>
              <li>• Severance agreements</li>
              <li>• Contractor agreements</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal Agreements</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Purchase agreements</li>
              <li>• Lease agreements</li>
              <li>• License agreements</li>
              <li>• Terms of service</li>
              <li>• Privacy policies</li>
            </ul>
          </div>
        </div>
      </section>


      {/* CALL-TO-ACTION SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Analyze Your Legal Documents with AI?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          {isSignedIn 
            ? "Upload your contracts, NDAs, and legal documents now for instant AI analysis."
            : "Sign up for free and start analyzing your legal documents with professional AI insights."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isSignedIn ? (
            <>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Documents Now
              </button>
              <button
                onClick={() => onNavigateToChat ? onNavigateToChat() : window.location.href = '/chat'}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start AI Chat Analysis
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => window.location.href = '/sign-up'}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Users className="h-5 w-5 mr-2" />
                Create Free Account
              </button>
              <button
                onClick={() => window.location.href = '/sign-in'}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
              >
                Sign In to Upload
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* LEGAL DISCLAIMER */}
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Important Legal Notice</h4>
            <p className="text-yellow-700 text-sm">
              This AI document analysis tool is for informational purposes only and does not constitute legal advice. 
              The AI analysis should supplement, not replace, consultation with qualified legal professionals. 
              Always consult with a licensed attorney for legal matters and important decisions.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default DocumentsPage;