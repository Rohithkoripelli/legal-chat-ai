// frontend/src/App.tsx - CLEANED VERSION
import React, { useState } from 'react';
import { FileText, MessageSquare, AlertTriangle, BarChart3, ClipboardList } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { useClerkAuth } from './hooks/useClerk';
import LandingPage from './components/auth/LandingPage';
import UserButton from './components/auth/UserButton';
import HeaderAuthButtons from './components/auth/HeaderAuthButtons';
import ContractAnalysisPage from './components/contracts/ContractAnalysisPage';
import RiskDashboard from './components/contracts/RiskDashboard';
import DocumentSelectionForAnalysis from './components/contracts/DocumentSelection';
import CreateDocumentPage from './components/create/CreateDocumentPage';
import DocumentTest from './components/test/DocumentTest';
import { ChatProvider } from './contexts/ChatContext';

// Import your enhanced pages
import DocumentsPage from './pages/DocumentPage';
import ChatPage from './pages/ChatPage';

type Page = 'documents' | 'chat' | 'contracts' | 'dashboard' | 'create-document' | 'test';

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

  // Show authentication page if not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                <div className="sm:hidden">
                  <h1 className="text-xl font-bold text-gray-900">Legal AI</h1>
                </div>
              </div>
              
              {/* Right side - Auth Buttons */}
              <div className="flex-shrink-0">
                <HeaderAuthButtons />
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          <LandingPage />
        </main>

        <Analytics />
      </div>
    );
  }

  // SIMPLIFIED RENDER PAGE FUNCTION
  const renderPage = () => {
    switch (currentPage) {
      case 'documents':
        return <DocumentsPage />;
      case 'chat':
        return <ChatPage />;
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
        return <DocumentsPage />;
    }
  };

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header - Always shown for authenticated users */}
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
                <div className="sm:hidden">
                  <h1 className="text-xl font-bold text-gray-900">Legal AI</h1>
                </div>
              </div>
              
              {/* Center - Navigation Menu */}
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
              
              {/* Right side - User Button */}
              <div className="flex-shrink-0">
                <UserButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">
          {renderPage()}
        </main>

        {/* Footer */}
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

        <Analytics />
      </div>
    </ChatProvider>
  );
}

export default App;