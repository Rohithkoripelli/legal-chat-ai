// frontend/src/App.tsx
import React, { useState, useRef } from 'react';
import { FileText, MessageSquare, Upload, File, X, AlertCircle, Check, Download, Trash2, RefreshCw, AlertTriangle, BarChart3, ClipboardList, Plus } from 'lucide-react';
import { useClerkAuth } from './hooks/useClerk';
import LandingPage from './components/auth/LandingPage';
import UserButton from './components/auth/UserButton';
import HeaderAuthButtons from './components/auth/HeaderAuthButtons';
import MessageList from './components/chat/MessageList';
import MessageInput from './components/chat/MessageInput';
import DocumentList from './components/documents/DocumentList';
import ContractAnalysisPage from './components/contracts/ContractAnalysisPage';
import RiskDashboard from './components/contracts/RiskDashboard';
import DocumentSelectionForAnalysis from './components/contracts/DocumentSelection';
import CreateDocumentPage from './components/create/CreateDocumentPage';
import { ChatProvider } from './contexts/ChatContext';
import { useChat } from './hooks/useChat';
import { useDocuments } from './hooks/useDocuments';
import DocumentTest from './components/test/DocumentTest';

type Page = 'documents' | 'chat' | 'contracts' | 'dashboard' | 'create-document' | 'test';

// Modern File Upload Component
const ModernFileUpload: React.FC<{ onUploadSuccess: () => void }> = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(files);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setUploadError(null);
    setUploadSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('document', file);

        console.log('Uploading file:', file.name);
        const response = await fetch('http://localhost:3001/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }

        return await response.json();
      });

      await Promise.all(uploadPromises);
      
      setUploadSuccess(`Successfully uploaded ${selectedFiles.length} file(s)!`);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUploadSuccess();
      
      setTimeout(() => setUploadSuccess(null), 4000);
    } catch (error) {
      console.error('Upload error:', error);
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Drag and Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-102'
            : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-colors ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`h-12 w-12 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              {dragActive ? 'Drop files here' : 'Drag and drop files here'}
            </h3>
            <p className="text-gray-500">
              or <span className="text-blue-600 font-medium">click to browse</span>
            </p>
            <p className="text-sm text-gray-400">
              Supports PDF, Word (.doc, .docx), Text (.txt), RTF files
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.rtf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearFiles}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              disabled={uploading}
            >
              Clear all
            </button>
          </div>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <File className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={uploading}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={uploadFiles}
              disabled={uploading || selectedFiles.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-green-800 font-medium">{uploadSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-red-800 font-medium">Upload failed</p>
              <p className="text-red-700 text-sm mt-1">{uploadError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Documents Page
const ModernDocumentsPage: React.FC = () => {
  const { documents, loading, error, deleteDocument, downloadDocument, refreshDocuments } = useDocuments();

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload Legal Documents</h2>
          <p className="text-lg text-gray-600">
            Securely upload your legal documents for AI-powered analysis
          </p>
        </div>
        <ModernFileUpload onUploadSuccess={refreshDocuments} />
      </div>

      {/* Documents List Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Documents</h2>
              <p className="text-gray-600 mt-1">Manage and analyze your uploaded documents</p>
            </div>
            <button
              onClick={refreshDocuments}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
        
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading documents...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load documents</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={refreshDocuments}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
              <p className="text-gray-600">Upload your first legal document to get started with AI analysis</p>
            </div>
          ) : (
            <DocumentList
              documents={documents}
              loading={loading}
              error={error}
              onDeleteDocument={deleteDocument}
              onDownloadDocument={downloadDocument}
              onRetry={refreshDocuments}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Modern Chat Page
const ModernChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage({message});
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-[700px] flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Legal Document Assistant</h2>
        <p className="text-gray-600 text-sm mt-1">Ask questions about your uploaded documents</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Failed to initialize chat session</span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 && !error ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6">
                <MessageSquare className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Legal Document Chat!</h3>
              <p className="text-gray-600 mb-6">
                Start a conversation by asking questions about your legal documents.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Upload documents first in the Documents section if you haven't already.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-gray-50">
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        <div className="px-6 py-2 text-xs text-gray-500 text-center">
          Press Enter to send • Shift+Enter for new line • This tool provides general information only
        </div>
      </div>
    </div>
  );
};

// Main App Component with Authentication
function App() {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const [currentPage, setCurrentPage] = useState<Page>('documents');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Legal AI...</p>
        </div>
      </div>
    );
  }

  // User is signed in - show the main app with all features
  const renderPage = () => {
    switch (currentPage) {
      case 'documents':
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Document Management</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload, manage, and analyze your legal documents with AI-powered insights
              </p>
            </div>
            <ModernDocumentsPage />
          </div>
        );
      case 'chat':
        return (
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Legal Document Chat</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get instant answers and insights about your legal documents
              </p>
            </div>
            <ModernChatPage />
          </div>
        );
      case 'contracts':
        if (selectedDocumentId) {
          return (
            <ContractAnalysisPage 
              documentId={selectedDocumentId}
              onBack={() => setSelectedDocumentId(null)}
            />
          );
        }
        return <DocumentSelectionForAnalysis onSelectDocument={setSelectedDocumentId} />;
      case 'dashboard':
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <RiskDashboard />
          </div>
        );
      case 'create-document':
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <CreateDocumentPage />
          </div>
        );
      case 'test':
        return <DocumentTest />;
      default:
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Document Management</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Upload, manage, and analyze your legal documents with AI-powered insights
              </p>
            </div>
            <ModernDocumentsPage />
          </div>
        );
    }
  };

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header - Always shown */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              {/* Left side - Logo and Brand */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-gray-900">Legal Chat AI</h1>
                  <p className="text-sm text-gray-600">Document Analysis Assistant</p>
                </div>
                {/* Mobile logo text */}
                <div className="sm:hidden">
                  <h1 className="text-xl font-bold text-gray-900">Legal AI</h1>
                </div>
              </div>
              
              {/* Center - Navigation Menu (only show when signed in) */}
              {isSignedIn && (
                <nav className="flex-1 flex justify-center mx-8">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentPage('documents')}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 'documents'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <FileText size={16} />
                      <span className="hidden md:inline">Documents</span>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('chat')}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 'chat'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <MessageSquare size={16} />
                      <span className="hidden md:inline">Chat</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setCurrentPage('contracts');
                        setSelectedDocumentId(null);
                      }}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 'contracts'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <AlertTriangle size={16} />
                      <span className="hidden md:inline">Risk Analysis</span>
                      <span className="md:hidden">Risk</span>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('dashboard')}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 'dashboard'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <BarChart3 size={16} />
                      <span className="hidden lg:inline">Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage('create-document')}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 'create-document'
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <ClipboardList size={16} />
                      <span className="hidden lg:inline">Create Document</span>
                      <span className="lg:hidden">Create</span>
                    </button>
                    
                    {/* Keep test button only in development mode */}
                    {process.env.NODE_ENV === 'development' && (
                      <button
                        onClick={() => setCurrentPage('test')}
                        className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === 'test'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span>Test</span>
                      </button>
                    )}
                  </div>
                </nav>
              )}
              
              {/* Right side - Auth Buttons or User Button */}
              <div className="flex-shrink-0">
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <HeaderAuthButtons />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {isSignedIn ? (
            renderPage()
          ) : (
            <LandingPage />
          )}
        </main>

        {/* Clean Footer - Only shows when signed in */}
        {isSignedIn && (
          <footer className="bg-white border-t border-gray-200 mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Legal Chat AI</span>
                </div>
                <p className="text-gray-600 mb-4">Intelligent Document Analysis Assistant</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-yellow-800">
                    ⚖️ <strong>Important:</strong> This tool is for informational purposes only and does not constitute legal advice. 
                    Always consult with a qualified attorney for legal matters.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </ChatProvider>
  );
}

export default App;