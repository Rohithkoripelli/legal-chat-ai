// src/pages/ChatPage.tsx - Enhanced with authentication, better UX, and SEO optimization
import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useChat } from '../hooks/useChat';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '@clerk/clerk-react';
import { MessageSquare, FileText, Shield, Zap, CheckCircle, ArrowRight, Upload, Brain, Clock, Star, AlertCircle, Users } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  const { messages, isLoading, error, sendMessage, isAuthenticated } = useChat();
  const { documents, loading: documentsLoading } = useDocuments();
  const [localError, setLocalError] = useState<string | null>(null);

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
            Legal Chat AI - Free AI Legal Document Analysis & Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            Chat with our advanced AI assistant for instant legal document analysis, contract review, 
            and risk assessment. Upload your legal documents and get professional AI insights in seconds. 
            {isSignedIn ? 'Start analyzing your uploaded documents now.' : 'Sign in to access personalized legal AI chat.'}
          </p>
          
          {/* Authentication & Document Status */}
          {isSignedIn ? (
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              documents.length > 0 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                documents.length > 0 ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              {documents.length > 0 
                ? `${documents.length} document${documents.length !== 1 ? 's' : ''} ready for AI analysis`
                : 'No documents uploaded yet - upload documents to start'
              }
            </div>
          ) : (
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Users className="w-4 h-4 mr-2" />
              Sign in required for personalized AI chat analysis
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
                <span className="text-gray-700"><strong>Personalized AI Legal Assistant</strong> - Context-aware analysis of your documents</span>
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
                <span className="text-gray-700"><strong>Authenticated Access</strong> - Your documents stay private and secure</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AUTHENTICATION CHECK - MAJOR UX IMPROVEMENT */}
      {!isSignedIn ? (
        <section className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <Users className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sign In Required for Legal Chat AI
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            To chat with our AI about your legal documents, please sign in to your account. 
            Your chat history and document analysis will be securely saved and personalized.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/sign-in'}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Sign In to Start Chat
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
            <button
              onClick={() => window.location.href = '/sign-up'}
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
            >
              Create Free Account
            </button>
          </div>
          
          {/* Preview for non-authenticated users */}
          <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Can Do With Legal Chat AI:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>• Ask: "What are the payment terms in this contract?"</li>
                <li>• Ask: "Identify any liability clauses"</li>
                <li>• Ask: "What is the termination notice period?"</li>
              </ul>
              <ul className="space-y-2">
                <li>• Ask: "Summarize the key obligations"</li>
                <li>• Ask: "What are the potential risks?"</li>
                <li>• Ask: "How does this compare to standard terms?"</li>
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* MAIN CHAT INTERFACE - IMPROVED */}
          <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col mb-8">
            {/* Error Display */}
            {displayError && (
              <div className="border-b border-red-200 bg-red-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
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
                      {documents.length > 0 
                        ? `You have ${documents.length} document${documents.length !== 1 ? 's' : ''} ready for AI analysis. Start asking questions about your legal content.`
                        : 'Upload your legal documents first, then return here to chat with our AI assistant for instant analysis.'
                      }
                    </p>
                    
                    {/* EXAMPLE QUERIES FOR SEO */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Try these example questions:</h4>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="space-y-1">
                          <p>• "What are the payment terms in this contract?"</p>
                          <p>• "Identify any liability clauses"</p>
                          <p>• "What is the termination notice period?"</p>
                        </div>
                        <div className="space-y-1">
                          <p>• "Summarize the key obligations"</p>
                          <p>• "What are the potential risks?"</p>
                          <p>• "Explain this clause in simple terms"</p>
                        </div>
                      </div>
                    </div>

                    {documents.length === 0 && (
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

            {/* Message Input - Enhanced */}
            <div className="border-t bg-gray-50 p-4">
              {documents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">No documents uploaded yet. Upload documents to start chatting with AI.</p>
                  <button
                    onClick={() => window.location.href = '/documents'}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </button>
                </div>
              ) : (
                <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              )}
            </div>
          </div>
        </>
      )}

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
                Our legal chat AI uses advanced natural language processing to analyze your uploaded legal 
                documents and provides instant insights, risk assessments, and answers to your legal 
                questions in plain English with full context awareness.
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
                professional legal review for important decisions.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Why do I need to sign in for legal chat AI?
              </h3>
              <p className="text-gray-700">
                Signing in ensures your documents and chat history are securely stored and only accessible 
                to you. It also enables personalized AI analysis based on your specific uploaded documents.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How fast is AI legal document analysis?
              </h3>
              <p className="text-gray-700">
                Legal chat AI provides instant analysis within seconds of asking your question. 
                The AI can process and analyze complex documents in real-time during your conversation.
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
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign In</h3>
            <p className="text-gray-600">
              Create a free account or sign in to access personalized legal AI chat with document context.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Documents</h3>
            <p className="text-gray-600">
              Upload your contract, NDA, or legal document in PDF, Word, or text format 
              for AI analysis context.
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Ask Questions</h3>
            <p className="text-gray-600">
              Use the AI chat to ask specific questions about clauses, terms, risks, 
              or any part of your legal document.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Get AI Analysis</h3>
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
          {isSignedIn 
            ? "Start chatting with our AI about your uploaded documents for instant legal insights and analysis."
            : "Join thousands of users who trust our AI for fast, accurate legal document analysis. Sign up free to get started!"
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isSignedIn ? (
            <>
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
                Sign In to Start Chat
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </>
          )}
        </div>
      </section>

      {/* ENHANCED USAGE INSTRUCTIONS */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">💡 Pro Tips for Using Legal Chat AI:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="text-sm text-blue-800 space-y-2">
            {!isSignedIn ? (
              <>
                <li>• <strong>Step 1:</strong> Create a free account to access personalized AI chat</li>
                <li>• <strong>Step 2:</strong> Upload your legal documents securely</li>
                <li>• <strong>Step 3:</strong> Ask specific questions about your documents</li>
              </>
            ) : documents.length === 0 ? (
              <>
                <li>• <strong>First:</strong> Upload your legal documents in the Documents section</li>
                <li>• <strong>Then:</strong> Return here and ask specific questions about your documents</li>
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