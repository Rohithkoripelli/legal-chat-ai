// frontend/src/App.tsx - FIXED FREEMIUM VERSION
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
import GuestDocumentsPage from './pages/GuestDocumentsPage';

type Page = 'landing' | 'documents' | 'chat' | 'contracts' | 'dashboard' | 'create-document' | 'test';

// Feature Navigation Bar Component
const FeatureNavigationBar: React.FC<{
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isSignedIn: boolean;
}> = ({ currentPage, setCurrentPage, isSignedIn }) => {
  const features = [
    {
      id: 'documents' as Page,
      label: 'Documents',
      icon: <FileText className="h-5 w-5" />,
      description: 'Upload and analyze legal documents',
      guestAllowed: true
    },
    {
      id: 'chat' as Page,
      label: 'Chat',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Chat with AI about your documents',
      guestAllowed: true
    },
    {
      id: 'contracts' as Page,
      label: 'Risk Analysis',
      icon: <AlertTriangle className="h-5 w-5" />,
      description: 'Comprehensive risk assessment',
      guestAllowed: false
    },
    {
      id: 'dashboard' as Page,
      label: 'Dashboard',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Analytics and insights',
      guestAllowed: false
    },
    {
      id: 'create-document' as Page,
      label: 'Create Document',
      icon: <ClipboardList className="h-5 w-5" />,
      description: 'Generate new legal documents',
      guestAllowed: false
    }
  ];

  const handleFeatureClick = (featureId: Page, guestAllowed: boolean) => {
    if (!isSignedIn && !guestAllowed) {
      // For premium features, still navigate but show upgrade prompt
      setCurrentPage(featureId);
    } else {
      setCurrentPage(featureId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {/* Home/Landing button for guests */}
          {!isSignedIn && (
            <button
              onClick={() => setCurrentPage('landing')}
              className={`
                flex items-center space-x-2 px-6 py-4 rounded-t-lg transition-all duration-200 whitespace-nowrap
                ${currentPage === 'landing' 
                  ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }
              `}
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </button>
          )}
          
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureClick(feature.id, feature.guestAllowed)}
              className={`
                flex items-center space-x-2 px-6 py-4 rounded-t-lg transition-all duration-200 whitespace-nowrap
                ${currentPage === feature.id 
                  ? 'bg-blue-600 text-white shadow-lg transform -translate-y-1' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }
              `}
              title={feature.description}
            >
              {feature.icon}
              <span className="font-medium">{feature.label}</span>
              {!isSignedIn && !feature.guestAllowed && (
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full ml-2">
                  Pro
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Guest Chat Page Component
const GuestChatPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <MessageSquare className="h-16 w-16 text-blue-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Try Legal AI Chat - 3 Free Analyses Daily
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your legal documents first, then chat with our AI for instant analysis. 
          Get 3 free document analyses per day without signing up!
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-900 mb-1">Upload Documents</h3>
            <p className="text-sm text-blue-800">PDF, Word, or text files</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-900 mb-1">Chat with AI</h3>
            <p className="text-sm text-green-800">Ask questions about content</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-900 mb-1">Get Insights</h3>
            <p className="text-sm text-purple-800">Risk assessment & analysis</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/documents'}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Upload Documents First
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <HeaderAuthButtons />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Sign up for unlimited document analysis, chat history, and advanced features!
          </p>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const [currentPage, setCurrentPage] = useState<Page>('landing');
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

  // RENDER PAGE FUNCTION - UPDATED LOGIC
  const renderPage = () => {
    // For authenticated users
    if (isSignedIn) {
      switch (currentPage) {
        case 'landing':
        case 'documents':
          return <DocumentsPage onNavigateToChat={() => setCurrentPage('chat')} />;
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
          return process.env.NODE_ENV === 'development' ? <DocumentTest /> : <DocumentsPage onNavigateToChat={() => setCurrentPage('chat')} />;
        default:
          return <DocumentsPage onNavigateToChat={() => setCurrentPage('chat')} />;
      }
    }

    // For guest users
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'documents':
        return <GuestDocumentsPage />;
      case 'chat':
        return <GuestChatPage />;
      case 'contracts':
        return (
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Risk Analysis - Premium Feature
              </h2>
              <p className="text-gray-600 mb-6">
                Advanced risk analysis and contract scoring requires a free account. 
                Sign up to unlock comprehensive legal document risk assessment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeaderAuthButtons />
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Analytics Dashboard - Premium Feature
              </h2>
              <p className="text-gray-600 mb-6">
                View detailed analytics, document insights, and usage statistics with a free account.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeaderAuthButtons />
              </div>
            </div>
          </div>
        );
      case 'create-document':
        return (
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <ClipboardList className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Document Generator - Premium Feature
              </h2>
              <p className="text-gray-600 mb-6">
                Create professional legal documents with AI assistance. Sign up for free to access our document generator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <HeaderAuthButtons />
              </div>
            </div>
          </div>
        );
      default:
        return <LandingPage />;
    }
  };

  // UNIFIED LAYOUT FOR BOTH AUTHENTICATED AND GUEST USERS
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
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
              
              {/* Center - Navigation for larger screens (guests only) */}
              {!isSignedIn && (
                <nav className="hidden md:flex items-center space-x-8">
                  <button 
                    onClick={() => setCurrentPage('landing')}
                    className={`transition-colors ${currentPage === 'landing' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    Home
                  </button>
                  <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
                  <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
                  <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
                </nav>
              )}
              
              {/* Authenticated user navigation */}
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
                  </div>
                </nav>
              )}
              
              {/* Right side - Auth Buttons or User Button */}
              <div className="flex-shrink-0">
                {isSignedIn ? <UserButton /> : <HeaderAuthButtons />}
              </div>
            </div>
          </div>
        </header>

        {/* Feature Navigation Bar - Only for guests */}
        {!isSignedIn && (
          <FeatureNavigationBar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isSignedIn={!!isSignedIn}
          />
        )}

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