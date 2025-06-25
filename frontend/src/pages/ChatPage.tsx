// src/pages/ChatPage.tsx - Updated to work for both guests and authenticated users
import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ChatWithHistory from '../components/chat/ChatWithHistory';
import { useChat } from '../hooks/useChat';
import { useGuestChat } from '../hooks/useGuestChat';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '@clerk/clerk-react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { MessageSquare, FileText, Shield, Zap, CheckCircle, ArrowRight, Upload, Brain, Clock, Star, AlertCircle, Users, ChevronDown, ChevronUp, X } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { isSignedIn } = useAuth();
  
  // Use different hooks based on authentication status
  const authenticatedChat = useChat();
  const guestChat = useGuestChat();
  const { documents: authDocuments, loading: documentsLoading, uploadDocument } = useDocuments();
  
  // Choose the appropriate chat interface
  const { messages, isLoading, error, sendMessage } = isSignedIn ? authenticatedChat : guestChat;
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [guestDocuments, setGuestDocuments] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  // Upload handlers for inline upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
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
      if (isSignedIn) {
        // Use authenticated upload
        for (const file of selectedFiles) {
          await uploadDocument(file);
        }
        // Documents will be automatically refreshed by the hook
      } else {
        // Use guest upload
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';
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
        const uploadedDocs = result.documents.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          size: doc.size,
          type: doc.type,
          uploadedAt: new Date(doc.uploadedAt),
          content: doc.content
        }));

        setGuestDocuments(prev => [...prev, ...uploadedDocs]);
        sessionStorage.setItem('guestDocuments', JSON.stringify([...guestDocuments, ...uploadedDocs]));
      }
      
      setSelectedFiles([]);
      setShowUpload(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayError = localError || error;
  
  // Get document count based on user type
  const documentCount = isSignedIn ? authDocuments.length : guestDocuments.length;
  const documents = isSignedIn ? authDocuments : guestDocuments;

  // For signed-in users, use the new chat interface with history
  if (isSignedIn) {
    return (
      <>
        <DocumentHead
          title="AI Legal Chat Assistant | Personal Legal AI | LegalChatAI"
          description="Personal AI legal assistant with chat history, unlimited document uploads, and advanced analysis features. Your conversations are saved and secure."
          keywords="personal legal AI, legal chat history, AI legal assistant, legal conversation history, personal AI lawyer"
          canonical="https://www.legalchatai.com/chat"
          jsonLD={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Personal AI Legal Chat Assistant",
            "description": "Personal AI-powered legal consultation with chat history and unlimited uploads",
            "url": "https://www.legalchatai.com/chat",
            "about": {
              "@type": "Service",
              "name": "Personal AI Legal Chat Assistant",
              "description": "Personal AI-powered legal consultation with advanced features",
              "provider": {
                "@type": "Organization",
                "name": "LegalChatAI",
                "url": "https://www.legalchatai.com"
              },
              "serviceType": "Personal Legal AI Consultation",
              "audience": {
                "@type": "Audience",
                "audienceType": ["Legal Professionals", "Business Owners", "Individuals"]
              }
            }
          }}
        />
        <div className="h-screen overflow-hidden">
          <ChatWithHistory />
        </div>
      </>
    );
  }

  // For guest users, use the existing chat interface
  return (
    <>
      <DocumentHead
        title="AI Legal Chat Assistant | Free Legal AI Consultation | LegalChatAI"
        description="Chat with AI for instant legal document analysis and consultation. Get immediate answers to legal questions, contract reviews, and legal guidance. Free to use."
        keywords="legal AI chat, AI legal consultation, legal chat assistant, AI lawyer chat, legal questions AI, contract chat AI"
        canonical="https://www.legalchatai.com/chat"
        jsonLD={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "AI Legal Chat Assistant",
          "description": "Free AI-powered legal consultation and chat service",
          "url": "https://www.legalchatai.com/chat",
          "about": {
            "@type": "Service",
            "name": "AI Legal Chat Assistant",
            "description": "Free AI-powered legal consultation and chat service",
            "provider": {
              "@type": "Organization",
              "name": "LegalChatAI",
              "url": "https://www.legalchatai.com"
            },
            "serviceType": "Legal AI Consultation",
            "audience": {
              "@type": "Audience",
              "audienceType": ["Legal Professionals", "Business Owners", "Individuals"]
            }
          }
        }}
      />
      <div className="max-w-4xl mx-auto p-4">
      {/* MAIN CHAT INTERFACE - IMPROVED UI */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[85vh] min-h-[600px] max-h-[900px] flex flex-col mb-6 overflow-hidden chat-container">
        {/* Header with Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 p-4 no-mobile-animation">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {isSignedIn ? 'Personal Legal AI Assistant' : 'Free Legal AI Chat'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online • {documentCount} document{documentCount !== 1 ? 's' : ''} loaded</span>
                </div>
              </div>
            </div>
            {!isSignedIn && (
              <button
                onClick={() => window.location.href = '/sign-up'}
                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                Upgrade Free
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {displayError && (
          <div className="bg-red-50 border-b border-red-100 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm font-medium">{displayError}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-hidden bg-gray-50 min-h-0">
          {messages.length === 0 && !displayError ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {documentCount > 0 ? 'Ready to Analyze!' : 'Start Chatting with Legal AI'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {documentCount > 0 
                      ? `${documentCount} document${documentCount !== 1 ? 's' : ''} loaded. Ask anything about your legal documents.`
                      : 'Ask legal questions or upload documents for analysis. No signup required!'
                    }
                  </p>
                </div>
                
                {/* Quick Start Examples */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick examples:</h4>
                  {documentCount > 0 ? (
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleSendMessage('What are the key risks in this contract?')}
                        className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      >
                        📊 "What are the key risks in this contract?"
                      </button>
                      <button 
                        onClick={() => handleSendMessage('Explain the payment terms')}
                        className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      >
                        💰 "Explain the payment terms"
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        onClick={() => handleSendMessage('What should I include in an NDA?')}
                        className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      >
                        📄 "What should I include in an NDA?"
                      </button>
                      <button 
                        onClick={() => handleSendMessage('How do liability clauses work?')}
                        className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      >
                        ⚖️ "How do liability clauses work?"
                      </button>
                    </div>
                  )}
                </div>

                {documentCount === 0 && (
                  <button
                    onClick={() => setShowUpload(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto message-list" id="chat-messages-container">
              <div className="min-h-full flex flex-col justify-end">
                <MessageList 
                  messages={messages} 
                  isLoading={isLoading}
                  containerRef="chat-messages-container"
                />
              </div>
            </div>
          )}
        </div>


        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-3 sm:p-4 flex-shrink-0 mobile-input-fix">
          <div className="space-y-3">
            {/* Message Input with File Upload */}
            <MessageInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              onFileUpload={() => document.getElementById('chat-file-input')?.click()}
              showFileUpload={true}
            />
            
            {/* Hidden file input */}
            <input
              id="chat-file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.rtf"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Selected Files for Upload - Show when files are selected */}
            {selectedFiles.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">Selected Files</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFiles([]);
                      setUploadError(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-3 w-3 text-blue-600" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-gray-500">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <button
                        onClick={uploadFiles}
                        disabled={uploading}
                        className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
                      </button>
                      <button
                        onClick={() => setSelectedFiles([])}
                        disabled={uploading}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded text-xs">
                      <AlertCircle className="h-3 w-3" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Uploaded Files Display - Below Message Input */}
            {documentCount > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Uploaded Files ({documentCount})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isSignedIn ? authDocuments : guestDocuments).map((doc, index) => (
                    <div key={doc.id || index} className="inline-flex items-center space-x-1 bg-white text-gray-700 px-2 py-1 rounded text-xs border border-gray-300">
                      <FileText className="h-3 w-3 text-blue-600" />
                      <span className="max-w-32 truncate">{doc.title || doc.name || `Document ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-400">
                {documentCount === 0 
                  ? 'Ask legal questions or use the 📎 icon to upload documents for analysis'
                  : `Chat about your ${documentCount} document${documentCount !== 1 ? 's' : ''} or ask general legal questions`
                }
              </p>
            </div>
          </div>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-2">💡 Enjoying the Free AI Chat?</h3>
              <p className="text-green-800 mb-3">
                Create a free account to unlock unlimited uploads, permanent storage, advanced analytics, 
                chat history, and document generation tools!
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-green-700">
                <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Unlimited documents</span>
                <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Secure storage</span>
                <span className="flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> Chat history</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => window.location.href = '/sign-up'}
                className="w-full lg:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
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
                onClick={() => setShowUpload(true)}
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
                onClick={() => setShowUpload(true)}
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
    </>
  );
};

export default ChatPage;