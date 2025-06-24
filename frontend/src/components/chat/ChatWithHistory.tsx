import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useChat } from '../../hooks/useChat';
import { useDocuments } from '../../hooks/useDocuments';
import ConversationSidebar from './ConversationSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageSquare, Brain, AlertCircle, X, Upload, FileText } from 'lucide-react';

// Hamburger Menu Component
const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className="w-6 h-6 flex flex-col justify-center items-center">
    <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
    <div className={`w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
  </div>
);

const ChatWithHistory: React.FC = () => {
  const { isSignedIn } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    conversations,
    currentConversation,
    conversationsLoading,
    createConversation,
    switchConversation,
    deleteConversation
  } = useChat();

  const { documents, uploadDocument } = useDocuments();

  const [sidebarVisible, setSidebarVisible] = useState(() => {
    // Start with sidebar closed on mobile, open on desktop
    return window.innerWidth >= 1024;
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Only show this component for signed-in users
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to access chat history features.</p>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (message: string) => {
    try {
      setLocalError(null);
      await sendMessage({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setLocalError(errorMessage);
    }
  };

  const handleCreateConversation = async (title?: string) => {
    try {
      await createConversation(title);
      // Auto-close sidebar on mobile after creating conversation
      if (window.innerWidth < 1024) {
        setSidebarVisible(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
      setLocalError(errorMessage);
    }
  };

  const handleSwitchConversation = async (conversationId: string) => {
    try {
      await switchConversation(conversationId);
      // Auto-close sidebar on mobile after selecting conversation
      if (window.innerWidth < 1024) {
        setSidebarVisible(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch conversation';
      setLocalError(errorMessage);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation';
      setLocalError(errorMessage);
    }
  };

  const clearError = () => {
    setLocalError(null);
  };

  // Upload handlers
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
      for (const file of selectedFiles) {
        await uploadDocument(file);
      }
      setSelectedFiles([]);
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

  // Render message input component (reusable for both centered and bottom positions)
  const renderMessageInput = () => (
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
      
      {/* Selected Files for Upload */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
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
          
          <div className="space-y-2">
            <div className="space-y-1">
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
      
      {/* Uploaded Files Display */}
      {documents.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              Uploaded Files ({documents.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {documents.map((doc, index) => (
              <div key={doc.id || index} className="inline-flex items-center space-x-1 bg-white text-gray-700 px-2 py-1 rounded text-xs border border-gray-300">
                <FileText className="h-3 w-3 text-blue-600" />
                <span className="max-w-24 truncate">{doc.name || `Document ${index + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-gray-400">
          {documents.length === 0 
            ? 'Ask legal questions or use the 📎 icon to upload documents for analysis'
            : `Chat about your ${documents.length} document${documents.length !== 1 ? 's' : ''} or ask general legal questions`
          }
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 max-h-screen overflow-hidden relative">
      {/* Mobile Overlay */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ConversationSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={handleSwitchConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          isLoading={conversationsLoading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative lg:ml-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                aria-label="Toggle conversation history"
              >
                <HamburgerIcon isOpen={sidebarVisible} />
              </button>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 truncate">
                  {currentConversation ? currentConversation.title : 'Legal AI Chat'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="truncate">
                    <span className="hidden sm:inline">
                      {documents.length} document{documents.length !== 1 ? 's' : ''} • {currentConversation 
                        ? `${currentConversation.messageCount || 0} messages`
                        : 'Start a new conversation'
                      } • {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                    </span>
                    <span className="sm:hidden">
                      {documents.length} docs • {conversations.length} chats
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleCreateConversation()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-shrink-0"
            >
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </button>
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
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Area - Dynamic Layout */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-0 relative">
          {messages.length === 0 && !displayError ? (
            /* Empty State - Centered Content with Input */
            <div className="h-full flex flex-col">
              {/* Centered Content */}
              <div className="flex-1 flex items-center justify-center p-3 sm:p-4 min-h-0">
                <div className="text-center max-w-2xl w-full px-2 sm:px-0">
                  <div className="mb-4 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      {currentConversation ? 'Continue Your Conversation' : 'What can I help you with?'}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3 sm:mb-6">
                      {documents.length > 0 
                        ? `${documents.length} document${documents.length !== 1 ? 's' : ''} loaded. Ask anything about your legal documents.`
                        : 'Ask legal questions, analyze contracts, or upload documents for review.'
                      }
                    </p>
                  </div>
                  
                  {/* Quick Start Examples */}
                  {documents.length > 0 && (
                    <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-6">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Quick examples:</h4>
                      <div className="space-y-1.5 sm:space-y-2">
                        <button 
                          onClick={() => handleSendMessage('What are the key risks in my contracts?')}
                          className="w-full text-left p-2 sm:p-3 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm shadow-sm"
                        >
                          📊 "What are the key risks in my contracts?"
                        </button>
                        <button 
                          onClick={() => handleSendMessage('Explain the payment terms')}
                          className="w-full text-left p-2 sm:p-3 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm shadow-sm"
                        >
                          💰 "Explain the payment terms"
                        </button>
                        <button 
                          onClick={() => handleSendMessage('What should I include in an NDA?')}
                          className="w-full text-left p-2 sm:p-3 bg-white rounded border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs sm:text-sm shadow-sm"
                        >
                          📄 "What should I include in an NDA?"
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Centered Message Input */}
              <div className="flex justify-center px-3 sm:px-6 pb-6 sm:pb-8">
                <div className="w-full max-w-4xl">
                  {renderMessageInput()}
                </div>
              </div>
            </div>
          ) : (
            /* Conversation Mode - Normal Layout */
            <>
              <div className="h-full overflow-y-auto" id="chat-messages-container" style={{ paddingBottom: '120px' }}>
                <MessageList 
                  messages={messages} 
                  isLoading={isLoading}
                  containerRef="chat-messages-container"
                />
              </div>
              
              {/* Fixed Bottom Input */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-2 sm:p-4">
                {renderMessageInput()}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWithHistory;