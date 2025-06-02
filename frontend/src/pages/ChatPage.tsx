// src/pages/ChatPage.tsx - Enhanced with SEO-optimized content
import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useChat } from '../hooks/useChat';
import { MessageSquare, FileText, Shield, Zap, CheckCircle, ArrowRight, Upload, Brain, Clock, Star } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const API_BASE_URL = 'https://legal-chat-ai.onrender.com';

const ChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Document status tracking
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(true);

  // Load document status on component mount
  useEffect(() => {
    loadDocumentStatus();
  }, []);

  const loadDocumentStatus = async () => {
    try {
      setDocumentsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      
      if (response.ok) {
        const documents = await response.json();
        setDocumentCount(documents.length);
        console.log(`📊 Chat page: ${documents.length} documents available for context`);
      } else {
        console.warn('⚠️ Could not load document status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading document status:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setLocalError(null);
      await sendMessage({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setLocalError(errorMessage);
    }
  };

  const clearError = () => {
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* SEO-OPTIMIZED HEADER SECTION */}
      <header className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Legal Chat AI - Free AI Legal Document Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            Chat with our advanced AI assistant for instant legal document analysis, contract review, 
            and risk assessment. Upload your legal documents and get professional AI insights in seconds - 
            completely free with no signup required.
          </p>
          
          {/* Document Status Badge */}
          {!documentsLoading && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              documentCount > 0 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                documentCount > 0 ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              {documentCount > 0 
                ? `${documentCount} document${documentCount !== 1 ? 's' : ''} ready for AI analysis`
                : 'No documents uploaded yet'
              }
            </div>
          )}
        </div>

        {/* SEO-RICH FEATURE GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Legal Chat Assistant</h3>
            <p className="text-blue-800 text-sm">
              Ask questions about your legal documents in plain English and get instant AI analysis
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Contract Analysis AI</h3>
            <p className="text-green-800 text-sm">
              Advanced AI analyzes contracts, NDAs, and agreements for risks and key terms
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Instant Results</h3>
            <p className="text-purple-800 text-sm">
              Get comprehensive legal document analysis in under 30 seconds
            </p>
          </div>
        </div>

        {/* KEYWORDS-RICH BENEFITS SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Use Legal Chat AI for Document Analysis?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><strong>Free AI Legal Assistant</strong> - No subscription fees or hidden costs</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><strong>Contract Risk Assessment</strong> - Identify potential legal risks instantly</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><strong>Legal Document Review</strong> - Professional-grade AI analysis</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><strong>24/7 Availability</strong> - AI legal assistance anytime, anywhere</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><strong>Secure Processing</strong> - Enterprise-grade document security</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700"><strong>No Signup Required</strong> - Start using legal AI immediately</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CHAT INTERFACE */}
      <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col mb-8">
        {/* Error Display */}
        {displayError && (
          <div className="border-b border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                <span className="text-red-800 font-medium">Error: {displayError}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 && !displayError ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className="text-gray-400 mb-6">
                  <MessageSquare className="mx-auto h-16 w-16" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">Welcome to Legal Chat AI!</h3>
                <p className="text-gray-600 mb-6">
                  {documentCount > 0 
                    ? 'Your documents are ready for AI analysis. Start asking questions about your legal content.'
                    : 'Upload your legal documents and start chatting with our AI assistant for instant analysis.'
                  }
                </p>
                
                {/* EXAMPLE QUERIES FOR SEO */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Try these example questions:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• "What are the payment terms in this contract?"</p>
                    <p>• "Identify any liability clauses"</p>
                    <p>• "What is the termination notice period?"</p>
                    <p>• "Summarize the key obligations"</p>
                  </div>
                </div>

                {documentCount === 0 && (
                  <button
                    onClick={() => window.location.href = '/documents'}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents First
                  </button>
                )}
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* SEO FAQ SECTION */}
      <section className="bg-gray-50 rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions About Legal Chat AI
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does legal chat AI work?
              </h3>
              <p className="text-gray-700">
                Our legal chat AI uses advanced natural language processing to analyze uploaded legal 
                documents and provides instant insights, risk assessments, and answers to your legal 
                questions in plain English.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What legal documents can I analyze with AI chat?
              </h3>
              <p className="text-gray-700">
                You can analyze contracts, NDAs, employment agreements, service agreements, lease 
                agreements, purchase agreements, terms of service, privacy policies, and most other 
                legal documents in PDF, Word, or text format.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How accurate is AI legal document analysis?
              </h3>
              <p className="text-gray-700">
                Our legal chat AI achieves 95%+ accuracy in identifying key contract terms, risks, 
                and compliance issues. However, AI analysis should complement, not replace, 
                professional legal review.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is legal chat AI really free?
              </h3>
              <p className="text-gray-700">
                Yes, our legal chat AI is completely free to use with no hidden fees, subscription 
                costs, or usage limits. We believe legal technology should be accessible to everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How fast is AI legal document analysis?
              </h3>
              <p className="text-gray-700">
                Legal chat AI provides instant analysis within seconds of uploading your document. 
                Complex documents may take up to 30 seconds for comprehensive review.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can AI legal chat replace a lawyer?
              </h3>
              <p className="text-gray-700">
                No, AI legal analysis is for informational purposes only and does not constitute 
                legal advice. Always consult with a qualified attorney for legal matters and 
                important decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW-TO SECTION FOR SEO */}
      <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How to Use Legal Chat AI - Step by Step Guide
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Legal Document</h3>
            <p className="text-gray-600">
              Upload your contract, NDA, or legal document in PDF, Word, or text format. 
              Our AI supports all major document types.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ask Questions About Your Document</h3>
            <p className="text-gray-600">
              Use the AI chat to ask specific questions about clauses, terms, risks, 
              or any part of your legal document.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Instant AI Analysis</h3>
            <p className="text-gray-600">
              Receive immediate AI analysis including risk assessment, clause explanations, 
              and recommendations in plain English.
            </p>
          </div>
        </div>
      </section>

      {/* CALL-TO-ACTION SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Analyze Your Legal Documents with AI?
        </h2>
        <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of users who trust our AI for fast, accurate legal document analysis. 
          Start chatting with our legal AI assistant today - completely free!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/documents'}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Documents & Start Chat
          </button>
          <button
            onClick={() => window.location.href = '/create-document'}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
          >
            <FileText className="h-5 w-5 mr-2" />
            Generate Legal Documents
          </button>
        </div>
      </section>

      {/* ENHANCED USAGE INSTRUCTIONS */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">💡 Pro Tips for Using Legal Chat AI:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="text-sm text-blue-800 space-y-2">
            {documentCount === 0 ? (
              <>
                <li>• <strong>Step 1:</strong> Upload your legal documents in the Documents section first</li>
                <li>• <strong>Step 2:</strong> Return here and ask specific questions about your documents</li>
                <li>• <strong>Example:</strong> "What are the payment terms?" or "What is the liability clause?"</li>
              </>
            ) : (
              <>
                <li>• Ask specific questions about contract terms, clauses, or legal language</li>
                <li>• Request summaries or explanations of complex legal concepts</li>
                <li>• Try: "Summarize the key obligations" or "What are the payment terms?"</li>
              </>
            )}
          </ul>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Be specific in your questions for better AI analysis results</li>
            <li>• Ask about risks: "What are the potential risks in this contract?"</li>
            <li>• Request comparisons: "How does this compare to standard terms?"</li>
            <li>• Remember: This is for informational purposes only, not legal advice</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;