// frontend/src/App.tsx - UPDATED WITH REACT ROUTER WHILE PRESERVING EXISTING FUNCTIONALITY
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FileText, MessageSquare, AlertTriangle, BarChart3, ClipboardList, Star, Users, Crown, ArrowRight, Brain } from 'lucide-react';
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
import GuestContractAnalysisPage from './pages/GuestContractAnalysisPage';

// Import the legal pages
import { PrivacyPolicyPage, AboutUsPage, TermsOfServicePage } from './components/auth/LegalPages';

type Page = 'landing' | 'documents' | 'chat' | 'contracts' | 'dashboard' | 'create-document' | 'test';

// Feature data for navigation - KEEPING YOUR EXISTING STRUCTURE
const features = [
  {
    id: 'documents' as Page,
    path: '/documents',
    label: 'Documents',
    icon: <FileText className="h-5 w-5" />,
    description: 'Upload and analyze legal documents',
    guestAllowed: true,
    isPremium: false
  },
  {
    id: 'chat' as Page,
    path: '/chat',
    label: 'AI Chat',
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Chat with AI about your documents',
    guestAllowed: true,
    isPremium: false
  },
  {
    id: 'contracts' as Page,
    path: '/risk-analysis',
    label: 'Risk Analysis',
    icon: <AlertTriangle className="h-5 w-5" />,
    description: 'Advanced risk assessment',
    guestAllowed: false,
    isPremium: true
  },
  {
    id: 'dashboard' as Page,
    path: '/dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="h-5 w-5" />,
    description: 'Analytics and insights',
    guestAllowed: false,
    isPremium: true
  },
  {
    id: 'create-document' as Page,
    path: '/create-document',
    label: 'Generate',
    icon: <ClipboardList className="h-5 w-5" />,
    description: 'Create legal documents',
    guestAllowed: false,
    isPremium: true
  }
];

// Guest-only features (shown for non-authenticated users)
const guestFeatures = [
  {
    id: 'guest-contract-analysis',
    path: '/guest-contract-analysis',
    label: 'Contract Analysis',
    icon: <Brain className="h-5 w-5" />,
    description: 'Free contract analysis for guest users',
    guestAllowed: true,
    isPremium: false
  }
];

// Premium Feature Upgrade Component - KEEPING YOUR EXISTING COMPONENT
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

// Main App Content Component (Router-aware version of your existing app)
const AppContent: React.FC = () => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Convert URL path to Page type for compatibility with existing navigation
  const getPageFromPath = (pathname: string): Page => {
    switch (pathname) {
      case '/documents': return 'documents';
      case '/chat': return 'chat';
      case '/risk-analysis': return 'contracts';
      case '/dashboard': return 'dashboard';
      case '/create-document': return 'create-document';
      case '/test': return 'test';
      default: return 'landing';
    }
  };

  const currentPage = getPageFromPath(location.pathname);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - PRESERVING YOUR EXISTING HEADER DESIGN */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Left side - Logo and Brand */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                onClick={() => navigate('/')}
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
            
            {/* Center - Feature Navigation (Desktop) - FIXED OVERFLOW */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Show Home for guests, skip for authenticated users */}
              {!isSignedIn && (
                <button
                  onClick={() => navigate('/')}
                  className={`
                    flex items-center space-x-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === '/' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <FileText size={16} />
                  <span>Home</span>
                </button>
              )}

              {/* Show only core features to prevent overflow */}
              {features.slice(0, isSignedIn ? 5 : 2).map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => navigate(feature.path)}
                  className={`
                    flex items-center space-x-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative
                    ${location.pathname === feature.path 
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

              {/* Add guest contract analysis for non-authenticated users */}
              {!isSignedIn && guestFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => navigate(feature.path)}
                  className={`
                    flex items-center space-x-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative
                    ${location.pathname === feature.path 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                  title={feature.description}
                >
                  {feature.icon}
                  <span className="hidden xl:inline">{feature.label}</span>
                  <span className="xl:hidden">Analysis</span>
                  
                  <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded ml-1">
                    FREE
                  </span>
                </button>
              ))}

              {/* Premium features dropdown for guests to save space */}
              {!isSignedIn && (
                <button
                  onClick={() => window.location.href = '/sign-up'}
                  className="flex items-center space-x-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200"
                  title="View premium features"
                >
                  <Crown className="h-4 w-4" />
                  <span className="hidden xl:inline">Premium</span>
                  <span className="xl:hidden">Pro</span>
                </button>
              )}

            </nav>

            {/* Mobile Navigation - PRESERVING YOUR EXISTING MOBILE NAV */}
            <nav className="flex lg:hidden items-center space-x-1">
              {!isSignedIn && (
                <button
                  onClick={() => navigate('/')}
                  className={`p-2 rounded-lg ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  <FileText size={20} />
                </button>
              )}
              
              {features.slice(0, 3).map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => navigate(feature.path)}
                  className={`p-2 rounded-lg relative ${
                    location.pathname === feature.path ? 'bg-blue-600 text-white' : 'text-gray-600'
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

      {/* Feature Navigation Bar - Mobile Only - FIXED OVERFLOW */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-1 px-4 py-2 min-w-max">
          {!isSignedIn && (
            <button
              onClick={() => navigate('/')}
              className={`
                flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${location.pathname === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
                }
              `}
            >
              <FileText className="h-4 w-4" />
              <span>Home</span>
            </button>
          )}
          
          {/* Show only essential features for mobile to prevent overflow */}
          {features.slice(0, 2).map((feature) => (
            <button
              key={feature.id}
              onClick={() => navigate(feature.path)}
              className={`
                flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${location.pathname === feature.path 
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
          
          {/* Add guest contract analysis for mobile */}
          {!isSignedIn && guestFeatures.map((feature) => (
            <button
              key={feature.id}
              onClick={() => navigate(feature.path)}
              className={`
                flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0
                ${location.pathname === feature.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-blue-600'
                }
              `}
            >
              {feature.icon}
              <span className="hidden sm:inline">{feature.label}</span>
              <span className="sm:hidden">Analysis</span>
              <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                FREE
              </span>
            </button>
          ))}
          
          {/* Premium features indicator for mobile */}
          {!isSignedIn && (
            <button
              onClick={() => window.location.href = '/sign-up'}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 hover:from-purple-200 hover:to-blue-200"
            >
              <Crown className="h-4 w-4" />
              <span className="hidden sm:inline">Premium</span>
              <span className="sm:hidden">Pro</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Feature Banner - PRESERVING YOUR EXISTING BANNER */}
      {!isSignedIn && location.pathname !== '/' && !location.pathname.match(/\/(about|privacy|terms)/) && (
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

      {/* Main Content with Routes */}
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          
          {/* Document Routes */}
          <Route 
            path="/documents" 
            element={
              isSignedIn ? (
                <DocumentsPage onNavigateToChat={() => navigate('/chat')} />
              ) : (
                <GuestDocumentsPage />
              )
            } 
          />
          
          {/* Chat Route */}
          <Route path="/chat" element={<ChatPage />} />
          
          {/* Guest Contract Analysis Route */}
          <Route path="/guest-contract-analysis" element={<GuestContractAnalysisPage />} />
          
          {/* Premium Routes - Show upgrade prompt for guests */}
          <Route 
            path="/risk-analysis" 
            element={
              isSignedIn ? (
                selectedDocumentId ? (
                  <ContractAnalysisPage 
                    documentId={selectedDocumentId}
                    onBack={() => setSelectedDocumentId(null)}
                  />
                ) : (
                  <DocumentSelectionForAnalysis onSelectDocument={setSelectedDocumentId} />
                )
              ) : (
                <PremiumFeaturePrompt
                  featureName="Risk Analysis"
                  featureDescription="Advanced risk analysis and contract scoring requires a free account."
                  icon={<AlertTriangle className="h-8 w-8" />}
                />
              )
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              isSignedIn ? (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <RiskDashboard />
                </div>
              ) : (
                <PremiumFeaturePrompt
                  featureName="Analytics Dashboard"
                  featureDescription="View detailed analytics, document insights, and usage statistics with a free account."
                  icon={<BarChart3 className="h-8 w-8" />}
                />
              )
            } 
          />
          
          <Route 
            path="/create-document" 
            element={
              isSignedIn ? (
                <div className="max-w-7xl mx-auto px-6 py-8">
                  <CreateDocumentPage />
                </div>
              ) : (
                <PremiumFeaturePrompt
                  featureName="Document Generator"
                  featureDescription="Create professional legal documents with AI assistance. Sign up for free to access our document generator."
                  icon={<ClipboardList className="h-8 w-8" />}
                />
              )
            } 
          />
          
          {/* Test Route - Development Only */}
          {process.env.NODE_ENV === 'development' && (
            <Route path="/test" element={<DocumentTest />} />
          )}
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {/* Footer - PRESERVING YOUR EXISTING FOOTER */}
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
            
            {/* Footer Links */}
            <div className="flex justify-center space-x-6 mb-6 text-sm text-gray-600">
              <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition-colors">
                About Us
              </button>
              <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-blue-600 transition-colors">
                Terms of Service
              </button>
            </div>
            
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
  );
};

// Main App Component with Router - WRAPPING YOUR EXISTING APP
function App() {
  return (
    <Router>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </Router>
  );
}

export default App;