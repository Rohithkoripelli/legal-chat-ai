// src/pages/ChatPage.tsx - Updated to work for both guests and authenticated users
import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useChat } from '../hooks/useChat';
import { useGuestChat } from '../hooks/useGuestChat';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '@clerk/clerk-react';
import { MessageSquare, FileText, Shield, Zap, CheckCircle, ArrowRight, Upload, Brain, Clock, Star, AlertCircle, Users } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  
  // Use different hooks based on authentication status
  const authenticatedChat = useChat();
  const guestChat = useGuestChat();
  const { documents: authDocuments, loading: documentsLoading } = useDocuments();
  
  // Choose the appropriate chat interface
  const { messages, isLoading, error, sendMessage } = isSignedIn ? authenticatedChat : guestChat;
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [guestDocuments, setGuestDocuments] = useState<any[]>([]);

  // Load guest documents if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      const stored = sessionStorage.getItem('guestDocuments');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setGuestDocuments(parsed);
        } catch (error) {
          console.error('Error loading guest documents:', error);
        }
      }
    }
  }, [isSignedIn]);

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
  
  // Get document count based on user type
  const documentCount = isSignedIn ? authDocuments.length : guestDocuments.length;
  const documents = isSignedIn ? authDocuments : guestDocuments;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* MAIN CHAT INTERFACE - MOVED TO TOP */}
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
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {isSignedIn ? 'Welcome to Your Personal Legal AI!' : 'Welcome to Free Legal Chat AI!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {documentCount > 0 
                    ? `You have ${documentCount} document${documentCount !== 1 ? 's' : ''} ready for AI analysis. Start asking questions about your legal content.`
                    : isSignedIn 
                      ? 'Upload your legal documents first, then return here to chat with our AI assistant for comprehensive analysis.'
                      : 'Upload your legal documents for free, then chat with our AI assistant for instant analysis. No signup required!'
                  }
                </p>
                
                {/* EXAMPLE QUERIES */}
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

                {documentCount === 0 && (
                  <button
                    onClick={() => window.location.href = '/documents'}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isSignedIn ? 'Upload Documents First' : 'Upload Documents Free'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Message Input */}
        <div className="border-t bg-gray-50 p-4">
          {documentCount === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                {isSignedIn 
                  ? 'No documents uploaded yet. Upload documents to start chatting with AI.'
                  : 'No documents uploaded yet. Upload documents for free to start AI chat analysis!'
                }
              </p>
              <button
                onClick={() => window.location.href = '/documents'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isSignedIn ? 'Upload Documents' : 'Upload Documents Free'}
              </button>
            </div>
          ) : (
            <div>
              <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              {!isSignedIn && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500">
                    💡 Enjoying free AI chat? <button 
                      onClick={() => window.location.href = '/sign-up'}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >Create a free account</button> for unlimited features!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SEO-OPTIMIZED HEADER SECTION - MOVED AFTER CHAT */}
      <header className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isSignedIn 
              ? 'Legal Chat AI - Your Personal AI Legal Document Assistant' 
              : 'Free Legal Chat AI - No Signup Required | Legal Document Analysis'
            }
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            {isSignedIn 
              ? 'Chat with our advanced AI assistant for instant legal document analysis, contract review, and risk assessment. Your documents are securely stored and analyzed with personalized context.'
              : 'Try our legal AI chat completely free! Upload documents and chat with AI for instant legal analysis. No registration required - just upload and start chatting with our professional AI assistant.'
            }
          </p>
          
          {/* Status indicators */}
          {isSignedIn ? (
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              documentCount > 0 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                documentCount > 0 ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
              {documentCount > 0 
                ? `${documentCount} document${documentCount !== 1 ? 's' : ''} ready for AI analysis • Unlimited storage`
                : 'No documents uploaded yet - upload documents for personalized analysis'
              }
            </div>
          ) : (
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              documentCount > 0 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-orange-100 text-orange-800 border border-orange-200'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                documentCount > 0 ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>
              {documentCount > 0 
                ? `${documentCount} document${documentCount !== 1 ? 's' : ''} uploaded for free analysis • No signup required`
                : 'Upload documents to start free AI chat analysis'
              }
            </div>
          )}
        </div>

        {/* FEATURE GRID - Updated for Guest vs Auth */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {isSignedIn ? 'Personal AI Legal Assistant' : 'Free AI Legal Chat'}
            </h3>
            <p className="text-blue-800 text-sm">
              {isSignedIn 
                ? 'Personalized AI analysis with context from your uploaded documents and chat history'
                : 'Try our AI assistant free! Ask questions about legal documents without any signup'
              }
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              {isSignedIn ? 'Advanced Contract Analysis' : 'Free Contract Analysis'}
            </h3>
            <p className="text-green-800 text-sm">
              {isSignedIn 
                ? 'Comprehensive AI analysis with unlimited documents, history tracking, and advanced features'
                : 'Upload contracts, NDAs, and agreements for instant free AI analysis and insights'
              }
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              {isSignedIn ? 'Instant Professional Results' : 'Instant Free Results'}
            </h3>
            <p className="text-purple-800 text-sm">
              {isSignedIn 
                ? 'Professional-grade analysis with secure storage and unlimited chat history'
                : 'Get comprehensive legal analysis in under 30 seconds - completely free to try'
              }
            </p>
          </div>
        </div>

        {/* BENEFITS SECTION */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {isSignedIn 
              ? 'Your Personal Legal AI Assistant Benefits'
              : 'Why Try Our Free Legal Chat AI?'
            }
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>{isSignedIn ? 'Unlimited Document Analysis' : 'Free Document Analysis'}</strong> - 
                  {isSignedIn ? ' Upload and analyze unlimited legal documents' : ' Try document analysis without any cost'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>{isSignedIn ? 'Personalized Context' : 'No Signup Required'}</strong> - 
                  {isSignedIn ? ' AI remembers your documents and provides contextual analysis' : ' Start analyzing documents immediately'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>{isSignedIn ? 'Secure Storage' : 'Instant Results'}</strong> - 
                  {isSignedIn ? ' Your documents are encrypted and securely stored' : ' Get AI analysis in seconds'}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>{isSignedIn ? 'Chat History' : 'Professional Quality'}</strong> - 
                  {isSignedIn ? ' Access your previous conversations and analysis' : ' Same AI technology used by professionals'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>24/7 Availability</strong> - AI legal assistance anytime, anywhere
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  <strong>{isSignedIn ? 'Premium Features' : 'Risk Assessment'}</strong> - 
                  {isSignedIn ? ' Advanced analytics and document generation tools' : ' Identify potential legal risks for free'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* GUEST UPGRADE PROMPT */}
      {!isSignedIn && (
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-2">💡 Enjoying the Free AI Chat?</h3>
              <p className="text-green-800 mb-3">
                Create a free account to unlock unlimited uploads, permanent storage, advanced analytics, 
                chat history, and document generation tools!
              </p>
              <div className="flex items-center space-x-4 text-sm text-green-700">
                <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Unlimited documents</span>
                <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Secure storage</span>
                <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Chat history</span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-6">
              <button
                onClick={() => window.location.href = '/sign-up'}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Upgrade Free →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CALL-TO-ACTION SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          {isSignedIn 
            ? 'Ready to Analyze More Legal Documents?'
            : 'Ready to Unlock Full Legal AI Power?'
          }
        </h2>
        <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
          {isSignedIn 
            ? "Upload more documents and continue chatting with our AI for comprehensive legal analysis and insights."
            : "Create a free account to unlock unlimited document uploads, permanent storage, chat history, and premium features!"
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
                Upload More Documents
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
                onClick={() => window.location.href = '/documents'}
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
              >
                <Upload className="h-5 w-5 mr-2" />
                Continue Free Analysis
              </button>
            </>
          )}
        </div>
      </section>

      {/* USAGE INSTRUCTIONS */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">
          💡 {isSignedIn ? 'Pro Tips for Legal AI Chat:' : 'How to Use Free Legal AI Chat:'}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="text-sm text-blue-800 space-y-2">
            {isSignedIn ? (
              <>
                <li>• Ask specific questions about contract terms, clauses, or legal language</li>
                <li>• Request summaries or explanations of complex legal concepts</li>
                <li>• Try: "Summarize the key obligations" or "What are the payment terms?"</li>
              </>
            ) : (
              <>
                <li>• <strong>Step 1:</strong> Upload your legal documents above for free</li>
                <li>• <strong>Step 2:</strong> Ask specific questions about your documents</li>
                <li>• <strong>Example:</strong> "What are the payment terms?" or "What risks are there?"</li>
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