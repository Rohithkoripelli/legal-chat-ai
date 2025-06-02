// Create a new GuestDocumentsPage.tsx
import React, { useState } from 'react';
import { Upload, FileText, MessageSquare, Brain, Shield, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

const GuestDocumentsPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploadedFiles(files);
    setAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const analyzeDocument = () => {
    window.location.href = '/chat';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Guest Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900">Free Trial Mode</h3>
            <p className="text-blue-800 text-sm">
              You can analyze up to 3 documents today without signing up. 
              <button className="text-blue-600 underline ml-1 hover:text-blue-800">
                Create free account for unlimited access
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Legal Documents for Free AI Analysis
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Upload your contracts, NDAs, and legal documents for instant AI analysis. 
          Get professional insights, risk assessment, and contract review - completely free.
        </p>
      </header>

      {!analysisComplete ? (
        <>
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Upload Your Legal Documents
              </h2>
              <p className="text-gray-600 mb-8">
                Drag and drop your legal documents here or click to browse. 
                Supports PDF, Word, and text formats.
              </p>
              
              {/* Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-lg p-12 mb-6 transition-colors cursor-pointer ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {analyzing ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 mb-2">Analyzing your document with AI...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </div>
                ) : uploadedFiles.length > 0 ? (
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-900 font-medium mb-2">
                      {uploadedFiles.length} file(s) uploaded successfully
                    </p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          📄 {file.name} ({Math.round(file.size / 1024)} KB)
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX, TXT files supported</p>
                  </>
                )}
              </div>

              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
              />

              {!analyzing && uploadedFiles.length === 0 && (
                <button 
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Files
                </button>
              )}
            </div>
          </div>

          {/* Features Preview */}
          <section className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Document Analysis</h3>
              <p className="text-blue-800 text-sm">
                Advanced AI analyzes your legal documents for key terms, risks, and compliance issues
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Legal AI Chat</h3>
              <p className="text-green-800 text-sm">
                Chat with AI about your documents to get instant answers and explanations
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Secure Processing</h3>
              <p className="text-purple-800 text-sm">
                Enterprise-grade security ensures your legal documents remain private and protected
              </p>
            </div>
          </section>
        </>
      ) : (
        /* Analysis Complete */
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Analysis Complete!
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Your document has been successfully analyzed by our AI. You can now chat with our AI assistant 
            to get detailed insights, ask questions, and understand your legal documents better.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={analyzeDocument}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Chat with AI About Your Document
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
            <button
              onClick={() => {
                setUploadedFiles([]);
                setAnalysisComplete(false);
              }}
              className="inline-flex items-center px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Another Document
            </button>
          </div>

          {/* Usage Notice */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Free Trial:</strong> You have 2 more free analyses remaining today. 
              <button className="text-blue-600 underline ml-1 hover:text-blue-800">
                Sign up for unlimited access
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDocumentsPage;