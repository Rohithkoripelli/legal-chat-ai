// frontend/src/App.tsx - COMPLETE FREEMIUM VERSION WITH GUEST ACCESS
import React, { useState } from 'react';
import { FileText, MessageSquare, AlertTriangle, BarChart3, ClipboardList, Star, Users, Crown, ArrowRight } from 'lucide-react';
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

// Feature data for navigation
const features = [
  {
    id: 'documents' as Page,
    label: 'Documents',
    icon: <FileText className="h-5 w-5" />,
    description: 'Upload and analyze legal documents',
    guestAllowed: true,
    isPremium: false
  },
  {
    id: 'chat' as Page,
    label: 'AI Chat',
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Chat with AI about your documents',
    guestAllowed: true,
    isPremium: false
  },
  {
    id: 'contracts' as Page,
    label: 'Risk Analysis',
    icon: <AlertTriangle className="h-5 w-5" />,
    description: 'Advanced risk assessment',
    guestAllowed: false,
    isPremium: true
  },
  {
    id: 'dashboard' as Page,
    label: 'Dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Analytics and insights',
    guestAllowed: false,
    isPremium: true
  },
  {
    id: 'create-document' as Page,
    label: 'Generate',
    icon: <ClipboardList className="h-5 w-5" />,
    description: 'Create legal documents',
    guestAllowed: false,
    isPremium: true
  }
];

// Premium Feature Upgrade Component
const PremiumFeaturePrompt: React.FC<{
  featureName: string;
  featureDescription: string;
  icon: React.ReactNode;
}> = ({ featureName, featureDescription, icon }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center">
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-6 text-white">
          {icon}
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">{featureName} - Premium Feature</h2>
        </div>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {featureDescription} Create a free account to unlock this powerful feature and many more!
        </p>
        
        {/* Free account benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What you get with a free account:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Unlimited document uploads</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Permanent secure storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Advanced risk analysis</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Analytics dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Document generation tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Chat history & more</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/sign-up'}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            Create Free Account
          </button>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
          >
            Sign In
          </button>
        </div>

        {/* Continue as guest option */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-3">
            Want to try our free features first? You can upload documents and chat with AI without signing up!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => window.location.href = '/documents'}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              Try Free Document Upload
            </button>
            <button
              onClick={() => window.location.href = '/chat'}
              className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
            >
              Try Free AI Chat
            </button>
          </div>
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

  // RENDER PAGE FUNCTION - FREEMIUM LOGIC
  const renderPage = () => {
    const feature = features.find(f => f.id === currentPage);
    
    // For premium features without authentication, show upgrade prompt
    if (!isSignedIn && feature?.isPremium) {
      return (
        <PremiumFeaturePrompt
          featureName={feature.label}
          featureDescription={feature.description}
          icon={feature.icon}
        />
      );
    }

    // Route to appropriate pages
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      
      case 'documents':
        return isSignedIn ? (
          <DocumentsPage onNavigateToChat={() => setCurrentPage('chat')} />
        ) : (
          <GuestDocumentsPage />
        );
      
      case 'chat':
        return <ChatPage />; // Works for both guest and auth users
      
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
        return process.env.NODE_ENV === 'development' ? <DocumentTest /> : <LandingPage />;
      
      default:
        return currentPage === 'landing' ? <LandingPage /> : <GuestDocumentsPage />;
    }
  };

  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header - Always visible */}
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              {/* Left side - Logo and Brand */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={() => setCurrentPage('landing')}
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                >
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <h1 className="text-2xl font-bold text-gray-900">Legal Chat AI</h1>
                    <p className="text-sm text-gray-600">
                      {isSignedIn ? 'Professional AI Legal Assistant' : 'Free AI Legal Document Analysis'}
                    </p>
                  </div>
                  <div className="sm:hidden">
                    <h1 className="text-xl font-bold text-gray-900">Legal AI</h1>
                  </div>
                </button>
              </div>
              
              {/* Center - Feature Navigation (Desktop) */}
              <nav className="hidden lg:flex items-center space-x-1">
                {/* Show Home for guests, skip for authenticated users */}
                {!isSignedIn && (
                  <button
                    onClick={() => setCurrentPage('landing')}
                    className={`
                      flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${currentPage === 'landing' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <FileText size={16} />
                    <span>Home</span>
                  </button>
                )}

                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setCurrentPage(feature.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative
                      ${currentPage === feature.id 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                    title={feature.description}
                  >
                    {feature.icon}
                    <span className="hidden xl:inline">{feature.label}</span>
                    <span className="xl:hidden">{feature.id === 'create-document' ? 'Create' : feature.label}</span>
                    
                    {/* Premium badge for non-authenticated users */}
                    {!isSignedIn && feature.isPremium && (
                      <Crown className="h-3 w-3 text-yellow-500 ml-1" />
                    )}
                    
                    {/* Free badge for guest-allowed features */}
                    {!isSignedIn && feature.guestAllowed && !feature.isPremium && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded ml-1">
                        FREE
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Mobile Navigation */}
              <nav className="flex lg:hidden items-center space-x-1">
                {!isSignedIn && (
                  <button
                    onClick={() => setCurrentPage('landing')}
                    className={`p-2 rounded-lg ${currentPage === 'landing' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                  >
                    <FileText size={20} />
                  </button>
                )}
                
                {features.slice(0, 3).map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setCurrentPage(feature.id)}
                    className={`p-2 rounded-lg relative ${
                      currentPage === feature.id ? 'bg-blue-600 text-white' : 'text-gray-600'
                    }`}
                  >
                    {feature.icon}
                    {!isSignedIn && feature.isPremium && (
                      <Crown className="h-2 w-2 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                    {!isSignedIn && feature.guestAllowed && !feature.isPremium && (
                      <div className="h-1 w-1 bg-green-500 rounded-full absolute -top-1 -right-1"></div>
                    )}
                  </button>
                ))}
              </nav>
              
              {/* Right side - Auth Buttons or User Button */}
              <div className="flex-shrink-0">
                {isSignedIn ? <UserButton /> : <HeaderAuthButtons />}
              </div>
            </div>
          </div>
        </header>

        {/* Feature Navigation Bar - Mobile Only */}
        <div className="lg:hidden bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm overflow-x-auto">
          <div className="flex items-center space-x-1 px-6 py-2">
            {!isSignedIn && (
              <button
                onClick={() => setCurrentPage('landing')}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${currentPage === 'landing' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                  }
                `}
              >
                <FileText className="h-4 w-4" />
                <span>Home</span>
              </button>
            )}
            
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setCurrentPage(feature.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap relative
                  ${currentPage === feature.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-blue-600'
                  }
                `}
              >
                {feature.icon}
                <span>{feature.label}</span>
                {!isSignedIn && feature.isPremium && (
                  <Crown className="h-3 w-3 text-yellow-500" />
                )}
                {!isSignedIn && feature.guestAllowed && !feature.isPremium && (
                  <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                    FREE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Guest Feature Banner - Only for non-authenticated users */}
        {!isSignedIn && currentPage !== 'landing' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 py-3">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-green-800">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      You're using free features! No signup required.
                    </span>
                  </div>
                  <div className="hidden md:flex items-center space-x-4 text-xs text-green-700">
                    <span>✓ Free document upload</span>
                    <span>✓ AI chat analysis</span>
                    <span>✓ No credit card needed</span>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/sign-up'}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Users className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Upgrade Free</span>
                  <span className="sm:hidden">Upgrade</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
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
              <p className="text-gray-600 mb-4">
                {isSignedIn 
                  ? 'Professional AI Legal Document Analysis Assistant'
                  : 'Free AI Legal Document Analysis - No Signup Required'
                }
              </p>
              {!isSignedIn && (
                <div className="mb-4 space-y-2">
                  <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-blue-600" />
                      Free document upload
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-green-600" />
                      Free AI chat
                    </span>
                    <span className="flex items-center">
                      <Crown className="h-4 w-4 mr-1 text-yellow-500" />
                      Premium features available
                    </span>
                  </div>
                  <button
                    onClick={() => window.location.href = '/sign-up'}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Free Account for Premium Features
                  </button>
                </div>
              )}
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