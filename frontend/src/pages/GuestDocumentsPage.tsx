// src/pages/GuestDocumentsPage.tsx - FIXED with backend API integration
import React, { useState, useEffect } from 'react';
import { Upload, FileText, MessageSquare, Brain, Shield, CheckCircle, ArrowRight, Trash2, Download, Eye, AlertCircle, Zap, Clock, Star, Users } from 'lucide-react';

// Simple in-memory storage for guest users (resets on page reload)
interface GuestDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content: string;
}

// FIXED: File upload component that calls backend API
const GuestFileUpload: React.FC<{
  onUploadSuccess: (document: GuestDocument) => void;
}> = ({ onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      // Limit to 3 files for free users
      if (files.length > 3) {
        setUploadError('Free users can upload up to 3 documents at once. Sign up for unlimited uploads!');
        return;
      }
      setSelectedFiles(files);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 3) {
      setUploadError('Free users can upload up to 3 documents at once. Sign up for unlimited uploads!');
      return;
    }
    setSelectedFiles(files);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  // FIXED: Upload files to backend API instead of processing locally
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      console.log('📤 Starting guest document upload to backend...');
      
      // Create FormData for file upload
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('documents', file);
      });

      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/guest/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Backend upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to upload files`);
      }

      const result = await response.json();
      console.log('✅ Backend upload successful:', result);
      
      // Process uploaded documents
      const uploadedDocs: GuestDocument[] = result.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        type: doc.type,
        uploadedAt: new Date(doc.uploadedAt),
        content: doc.content
      }));

      // Notify parent and store in session
      uploadedDocs.forEach(doc => {
        onUploadSuccess(doc);
      });
      
      setUploadSuccess(`Successfully uploaded ${uploadedDocs.length} file(s) for free AI analysis! Documents are now vectorized and ready for chat.`);
      setSelectedFiles([]);
      
      // Clear success message after 5 seconds
      setTimeout(() => setUploadSuccess(null), 5000);
      
    } catch (error) {
      console.error('❌ Backend upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.');
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
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('guest-file-input')?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag and drop files here or click to select files</p>
        <p className="text-sm text-gray-500">
          Free: Up to 3 documents • PDF, Word (.doc, .docx), Text (.txt), RTF
        </p>
        <p className="text-xs text-blue-600 mt-2">
          ✨ Documents will be processed with AI and ready for instant chat analysis!
        </p>
        <input
          id="guest-file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.rtf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Selected Files:</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
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
                  <ArrowRight className="h-4 w-4 rotate-45" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 mt-4">
            <button
              onClick={uploadFiles}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing & Vectorizing...</span>
                </>
              ) : (
                <span>Upload for Free AI Analysis</span>
              )}
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Upload Failed</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Upload Successful!</p>
            <p className="text-sm">{uploadSuccess}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Guest document list component
const GuestDocumentList: React.FC<{
  documents: GuestDocument[];
  onDeleteDocument: (id: string) => void;
  onNavigateToChat: () => void;
}> = ({ documents, onDeleteDocument, onNavigateToChat }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
          <FileText className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h3>
        <p className="text-gray-600">Upload your first legal document to get started with free AI analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
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
                  <span>Type: {document.type}</span>
                  <span>Uploaded: {document.uploadedAt.toLocaleString()}</span>
                  <span className="text-green-600 font-medium">✅ Vectorized & Ready for AI Chat</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onNavigateToChat}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Analyze with AI Chat"
              >
                <MessageSquare size={18} />
              </button>
              <button
                onClick={() => onDeleteDocument(document.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Action buttons for uploaded documents */}
      {documents.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                🎯 Ready for AI Analysis ({documents.length} documents)
              </h3>
              <p className="text-blue-800 text-sm">
                Your documents have been processed and vectorized. You can now chat with AI about them!
              </p>
            </div>
            <button
              onClick={onNavigateToChat}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Start AI Chat</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Upgrade prompt */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-900 mb-2">🚀 Want Unlimited Features?</h3>
            <p className="text-green-800 text-sm mb-3">
              Sign up for permanent storage, unlimited uploads, advanced analytics, and premium features!
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/sign-up'}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Upgrade Free</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const GuestDocumentsPage: React.FC = () => {
  const [guestDocuments, setGuestDocuments] = useState<GuestDocument[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Load documents from session storage on component mount
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

  // Save documents to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem('guestDocuments', JSON.stringify(guestDocuments));
  }, [guestDocuments]);

  const handleUploadSuccess = (document: GuestDocument) => {
    setGuestDocuments(prev => [...prev, document]);
    setUploadSuccess('Document uploaded and vectorized successfully! You can now analyze it with AI chat.');
  };

  const handleDeleteDocument = (id: string) => {
    setGuestDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleNavigateToChat = () => {
    // Store current documents in sessionStorage for chat page
    sessionStorage.setItem('guestDocuments', JSON.stringify(guestDocuments));
    window.location.href = '/chat';
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => setUploadSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* SEO-OPTIMIZED HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Free Legal Document Upload & AI Analysis - No Signup Required
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
          Upload your contracts, NDAs, and legal documents for instant free AI analysis with advanced vectorization. 
          No registration required! Get professional insights, risk assessment, and contract review 
          with our advanced legal AI assistant - completely free to try.
        </p>
        
        {/* Document Stats */}
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <FileText className="w-4 h-4 mr-2" />
          {guestDocuments.length} document{guestDocuments.length !== 1 ? 's' : ''} uploaded • Vectorized & ready for AI chat
        </div>
      </header>

      {/* SEO-RICH BENEFITS SECTION */}
      <section className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">No Signup Required</h3>
          <p className="text-blue-800 text-sm">
            Upload and analyze legal documents instantly with AI vectorization
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">Advanced Vector Search</h3>
          <p className="text-green-800 text-sm">
            AI vectorizes documents for precise semantic search and analysis
          </p>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Instant Results</h3>
          <p className="text-purple-800 text-sm">
            Get comprehensive analysis and insights in under 30 seconds
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-600 rounded-lg mb-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-orange-900 mb-2">AI Chat Assistant</h3>
          <p className="text-orange-800 text-sm">
            Chat with AI about your documents using vector-powered search
          </p>
        </div>
      </section>

      {/* SUCCESS MESSAGE */}
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">{uploadSuccess}</span>
          </div>
        </div>
      )}

      {/* MAIN UPLOAD SECTION */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Legal Documents for Free AI Analysis
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            No signup required! Upload contracts, NDAs, agreements, or any legal document. 
            Our AI will vectorize and analyze them instantly for risks, key terms, and compliance issues.
          </p>
        </div>
        
        {/* Document Upload Component */}
        <GuestFileUpload onUploadSuccess={handleUploadSuccess} />

        {/* Free vs Premium Comparison */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3">✨ Free Features (No Signup)</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Upload up to 3 documents</li>
              <li>• AI vectorization & analysis</li>
              <li>• Chat with AI assistant</li>
              <li>• Risk assessment</li>
              <li>• Temporary session storage</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">🚀 Premium Features (Free Account)</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Unlimited document uploads</li>
              <li>• Permanent secure storage</li>
              <li>• Advanced analytics dashboard</li>
              <li>• Document generation tools</li>
              <li>• Priority support</li>
            </ul>
            <button
              onClick={() => window.location.href = '/sign-up'}
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Upgrade Free →
            </button>
          </div>
        </div>
      </section>

      {/* UPLOADED DOCUMENTS SECTION */}
      <section className="bg-white rounded-xl shadow-lg border border-gray-200 mb-12">
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Uploaded Documents</h2>
              <p className="text-gray-600">
                Manage your uploaded documents and analyze them with our free AI chat assistant
              </p>
            </div>
            {guestDocuments.length > 0 && (
              <button
                onClick={handleNavigateToChat}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Analyze with Free AI Chat
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          <GuestDocumentList
            documents={guestDocuments}
            onDeleteDocument={handleDeleteDocument}
            onNavigateToChat={handleNavigateToChat}
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Analyze Your Legal Documents with Free AI?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          No signup required! Upload your contracts, NDAs, and legal documents now for instant AI vectorization and analysis, 
          or create a free account for unlimited uploads and premium features.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Start Free Analysis Now
          </button>
          <button
            onClick={handleNavigateToChat}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Try Free AI Chat
          </button>
        </div>
      </section>

      {/* LEGAL DISCLAIMER */}
      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Important Legal Notice</h4>
            <p className="text-yellow-700 text-sm">
              This free AI document analysis tool is for informational purposes only and does not constitute legal advice. 
              The AI analysis should supplement, not replace, consultation with qualified legal professionals. 
              Always consult with a licensed attorney for legal matters and important decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDocumentsPage;