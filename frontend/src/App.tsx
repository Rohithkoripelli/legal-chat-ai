  // frontend/src/App.tsx - UPDATED WITH REACT ROUTER WHILE PRESERVING EXISTING FUNCTIONALITY
  import React, { useState, useEffect } from 'react';
  import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
  import { FileText, MessageSquare, AlertTriangle, BarChart3, ClipboardList, Star, Users, Crown, ArrowRight, Brain, Menu, X, Home, CheckCircle } from 'lucide-react';
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
      label: 'Generator',
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

  // Mobile Navigation Menu Component
  const MobileNavMenu: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isSignedIn: boolean;
    navigate: (path: string) => void;
    handleSignIn: () => void;
    handleSignUp: () => void;
  }> = ({ isOpen, onClose, isSignedIn, navigate, handleSignIn, handleSignUp }) => {
    // Mobile navigation items to match desktop
    const mobileNavItems = [
      { label: 'Home', path: '/', icon: <Home className="h-5 w-5" />, guestAllowed: true, isPremium: false },
      { label: 'Documents', path: '/documents', icon: <FileText className="h-5 w-5" />, guestAllowed: true, isPremium: false, showFree: !isSignedIn },
      { label: 'AI Chat', path: '/chat', icon: <MessageSquare className="h-5 w-5" />, guestAllowed: true, isPremium: false, showFree: !isSignedIn },
      { label: 'Contract Analysis', path: '/guest-contract-analysis', icon: <Brain className="h-5 w-5" />, guestAllowed: true, isPremium: false, showFree: !isSignedIn, showOnlyForGuests: true },
      { label: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="h-5 w-5" />, guestAllowed: false, isPremium: true, showOnlyForSignedIn: true },
      { label: 'Generator', path: '/create-document', icon: <ClipboardList className="h-5 w-5" />, guestAllowed: false, isPremium: true, showOnlyForSignedIn: true },
      { label: 'Premium', path: '/premium', icon: <Crown className="h-5 w-5" />, guestAllowed: true, isPremium: true, showOnlyForGuests: true }
    ];

    // Filter items based on authentication status
    const filteredItems = mobileNavItems.filter(item => {
      if (item.showOnlyForGuests && isSignedIn) return false;
      if (item.showOnlyForSignedIn && !isSignedIn) return false;
      if (item.label === 'Contract Analysis' && isSignedIn) return false;
      return true;
    });

    if (!isOpen) return null;

    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" 
          onClick={onClose}
        />

        {/* Menu Panel */}
        <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Legal AI</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-6">
              <nav className="space-y-2 px-6">
                {filteredItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      // Add explicit parameter for Home navigation
                      if (item.path === '/') {
                        navigate('/?explicit=true');
                      } else {
                        navigate(item.path);
                      }
                      onClose();
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                  >
                    <span className="text-gray-500 group-hover:text-blue-600 transition-colors">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {!isSignedIn && (item.label === 'Documents' || item.label === 'AI Chat' || item.label === 'Contract Analysis') && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        FREE
                      </span>
                    )}
                    {!isSignedIn && item.isPremium && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Auth Buttons */}
            {!isSignedIn && (
              <div className="p-6 border-t border-gray-200">
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleSignIn();
                      onClose();
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleSignUp();
                      onClose();
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Home Page Wrapper Component - Handles smart redirection for signed-in users
  const HomePageWrapper: React.FC<{ 
    isSignedIn: boolean; 
    onSignUp: () => void; 
    onSignIn: () => void; 
  }> = ({ isSignedIn, onSignUp, onSignIn }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
      // If user is signed in and on home page WITHOUT the explicit parameter, redirect to documents
      if (isSignedIn && !location.search.includes('explicit')) {
        navigate('/documents', { replace: true });
      }
    }, [isSignedIn, navigate, location.search]);

    return <LandingPage onSignUp={onSignUp} onSignIn={onSignIn} />;
  };

  // Premium Features Showcase Page
  const PremiumFeaturesPage: React.FC<{ 
    onSignUp?: () => void; 
    onSignIn?: () => void; 
  }> = ({ onSignUp, onSignIn }) => {
    const navigate = useNavigate();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-8">
                <Crown className="w-4 h-4 mr-2" />
                Premium Features
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Unlock the Full Power of<br />
                <span className="text-white">AI Legal Analysis</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-10 max-w-4xl mx-auto leading-relaxed">
                Get unlimited access to advanced AI document generation, risk analysis dashboard, 
                and professional-grade legal tools. <strong className="text-white">Completely free</strong> - no hidden costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <button
                  onClick={onSignUp || (() => window.location.href = '/sign-up')}
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate('/?explicit=true')}
                  className="bg-purple-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-500/30 transition-all duration-200 border-2 border-white/20 hover:border-white/40"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Premium Features You'll Get 
              <span className="text-purple-600">(100% Free)</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              All premium features are included in your free account - no subscriptions, no hidden fees, 
              no credit card required
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* AI Document Generator */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-purple-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <ClipboardList className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">AI Document Generator</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Generate professional legal documents instantly using advanced AI. Create contracts, 
                  NDAs, terms of service, and more with guided templates.
                </p>
              </div>
              
              <div className="space-y-5 mb-10">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Professional Document Templates</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">AI-Powered Customization</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Instant PDF Generation</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Legal Compliance Checking</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/create-document')}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Try Document Generator
              </button>
            </div>

            {/* Risk Analysis Dashboard */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-indigo-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Advanced analytics and insights for your legal documents. Track risks, compliance 
                  status, and get actionable recommendations.
                </p>
              </div>
              
              <div className="space-y-5 mb-10">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Portfolio Risk Overview</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Compliance Tracking</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Risk Scoring & Trends</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-4 flex-shrink-0" />
                  <span className="text-lg">Document Insights</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Analytics Dashboard
              </button>
            </div>
          </div>

          {/* Additional Premium Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 mb-20">
            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Plus These Premium Benefits
            </h3>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Unlimited Documents</h4>
                <p className="text-gray-600 text-lg leading-relaxed">Upload and analyze unlimited legal documents with permanent secure storage and instant access</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Complete Chat History</h4>
                <p className="text-gray-600 text-lg leading-relaxed">Access your complete chat history and document analysis results anytime, anywhere</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Priority Support</h4>
                <p className="text-gray-600 text-lg leading-relaxed">Get priority customer support and early access to new features and updates</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl mx-auto border border-purple-100">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Unlock Premium Features?
              </h3>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Create your free account in seconds and enjoy all premium features with no restrictions. 
                No credit card required, no hidden fees, just pure AI-powered legal analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <button
                  onClick={onSignUp || (() => window.location.href = '/sign-up')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Users className="w-6 h-6 mr-3" />
                  Create Free Account
                </button>
                <button
                  onClick={onSignIn || (() => window.location.href = '/sign-in')}
                  className="bg-gray-100 text-gray-700 px-10 py-5 rounded-xl text-xl font-semibold hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Trusted by professionals worldwide</p>
                <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Instant Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Premium Feature Upgrade Component - KEEPING YOUR EXISTING COMPONENT
  const PremiumFeaturePrompt: React.FC<{
    featureName: string;
    featureDescription: string;
    icon: React.ReactNode;
    onSignUp?: () => void;
    onSignIn?: () => void;
  }> = ({ featureName, featureDescription, icon, onSignUp, onSignIn }) => {
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
              onClick={onSignUp || (() => window.location.href = '/sign-up')}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Create Free Account
            </button>
            <button
              onClick={onSignIn || (() => window.location.href = '/sign-in')}
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
    const { isLoaded, isSignedIn, handleSignIn, handleSignUp } = useClerkAuth();
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        {/* Mobile Navigation Menu */}
        <MobileNavMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          isSignedIn={!!isSignedIn}
          navigate={navigate}
          handleSignIn={handleSignIn}
          handleSignUp={handleSignUp}
        />

        {/* Header - PRESERVING YOUR EXISTING HEADER DESIGN */}
        <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-20">
              {/* Left side - Logo and Brand */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                {/* Mobile Hamburger Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-6 w-6" />
                </button>

                <button
                  onClick={() => navigate('/?explicit=true')}
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

              {/* Center - Feature Navigation (Desktop Only) */}
              <nav className="hidden lg:flex items-center space-x-1">
                {/* Show Home button for all users */}
                <button
                  onClick={() => navigate('/?explicit=true')}
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
                    onClick={() => navigate('/premium')}
                    className="flex items-center space-x-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700
  hover:from-purple-200 hover:to-blue-200"
                    title="View premium features"
                  >
                    <Crown className="h-4 w-4" />
                    <span className="hidden xl:inline">Premium</span>
                    <span className="xl:hidden">Pro</span>
                  </button>
                )}

              </nav>

              {/* Right side - Auth Buttons or User Button */}
              <div className="flex-shrink-0">
                {isSignedIn ? (
                  <UserButton />
                ) : (
                  <div className="flex items-center space-x-2">
                    {/* Mobile Auth Buttons */}
                    <div className="flex lg:hidden items-center space-x-2">
                      <button
                        onClick={handleSignIn}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={handleSignUp}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Start
                      </button>
                    </div>
                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex">
                      <HeaderAuthButtons />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

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
                  onClick={handleSignUp}
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
            <Route path="/" element={
              <HomePageWrapper 
                isSignedIn={!!isSignedIn} 
                onSignUp={handleSignUp} 
                onSignIn={handleSignIn} 
              />
            } />
            <Route path="/premium" element={
              <PremiumFeaturesPage 
                onSignUp={handleSignUp} 
                onSignIn={handleSignIn} 
              />
            } />
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
                    onSignUp={handleSignUp}
                    onSignIn={handleSignIn}
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
                    onSignUp={handleSignUp}
                    onSignIn={handleSignIn}
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
                    onSignUp={handleSignUp}
                    onSignIn={handleSignIn}
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
                    onClick={handleSignUp}
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