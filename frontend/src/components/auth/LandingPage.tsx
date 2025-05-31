// frontend/src/components/auth/LandingPage.tsx
import React from 'react';
import { DocumentHead } from '../SEO/DocumentHead';
import { FileText, MessageSquare, Shield, Zap, CheckCircle, BarChart3, ArrowRight, Users, Star, Menu, X } from 'lucide-react';
import { useClerkAuth } from '../../hooks/useClerk';
import HeaderAuthButtons from './HeaderAuthButtons';

const LandingPage: React.FC = () => {
  const { handleSignIn, handleSignUp } = useClerkAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* IMPROVED SEO META DATA */}
      <DocumentHead
        title="AI Legal Document Analysis | Free Contract Review & Chat | LegalChatAI"
        description="Free AI-powered legal document analysis and chat. Upload contracts, NDAs, agreements and get instant insights. 80% faster than manual review. No signup required."
        keywords="AI legal document analysis, contract analysis AI, legal AI assistant, free legal document analysis, AI contract review, legal chat AI, contract review AI tool"
        canonical="https://legalchatai.com"
        verification="u68V4TOCfGA0QPpqGeTwcvxr-AZ9TJl3kqCf6rdb8cg"
      />

      {/* SCHEMA MARKUP FOR GOOGLE */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "LegalChatAI - AI Legal Document Analysis",
          "description": "Free AI-powered legal document analysis and chat platform for contracts, NDAs, and legal documents",
          "url": "https://legalchatai.com",
          "applicationCategory": "Legal Technology",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free AI legal document analysis"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "250"
          },
          "keywords": "AI legal document analysis, contract analysis AI, legal AI assistant, free legal analysis"
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header with Authentication */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LegalChatAI</span>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                  How it Works
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </a>
                <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                  FAQ
                </a>
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:block">
                <HeaderAuthButtons />
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200">
                <div className="flex flex-col space-y-4">
                  <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2">
                    Features
                  </a>
                  <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2">
                    How it Works
                  </a>
                  <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2">
                    Pricing
                  </a>
                  <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors px-4 py-2">
                    FAQ
                  </a>
                  <div className="px-4 pt-4 border-t border-gray-200">
                    <HeaderAuthButtons />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
{/* Hero Section - OPTIMIZED H1 */}
<div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Legal Professionals
            </div>
            
            {/* OPTIMIZED H1 FOR TARGET KEYWORD */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">AI Legal Document Analysis</span> 
              <br />
              Free Contract Review & Chat
            </h1>
            
            {/* OPTIMIZED H2 WITH LSI KEYWORDS */}
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Upload contracts, NDAs, and legal documents for instant <strong>AI-powered analysis</strong>. 
              Get clause explanations, risk assessments, and legal insights 80% faster than manual review. 
              <strong>Start your free legal document analysis now</strong>.
            </h2>
            
            {/* Hero Features with KEYWORDS */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">100% Free AI Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Contract Risk Detection</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Legal AI Chat Assistant</span>
              </div>
            </div>

            {/* CTA Buttons with AUTHENTICATION */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                onClick={handleSignUp}
              >
                Start Free AI Document Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                onClick={handleSignIn}
              >
                Sign In to Your Account
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Free forever • 2-minute setup
            </p>
          </div>
        </div>

        {/* BENEFITS SECTION WITH TARGET KEYWORDS */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Legal Document Analysis Platform?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The most comprehensive <strong>contract analysis AI</strong> and <strong>legal AI assistant</strong> platform. 
              Analyze contracts 80% faster with professional-grade accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Contract Analysis</h3>
              <p className="text-gray-600 mb-4">
                Advanced <strong>contract analysis AI</strong> that identifies risks, compliance issues, and key terms 
                in seconds. Support for PDF, Word, and text formats with automatic OCR.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Risk assessment and scoring</li>
                <li>• Clause-by-clause breakdown</li>
                <li>• Compliance checking</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal AI Chat Assistant</h3>
              <p className="text-gray-600 mb-4">
                Intelligent <strong>legal AI assistant</strong> that answers questions about your documents. 
                Ask in plain English and get expert-level legal analysis with citations.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Natural language queries</li>
                <li>• Source citations included</li>
                <li>• Context-aware responses</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Free AI Contract Review</h3>
              <p className="text-gray-600 mb-4">
                Professional-grade <strong>AI contract review</strong> at no cost. Identify potential risks, 
                unfavorable terms, and missing clauses before signing.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Automated risk detection</li>
                <li>• Term analysis and scoring</li>
                <li>• Legal compliance checking</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Document AI Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive analytics dashboard showing document risks, compliance status, 
                and portfolio insights powered by advanced <strong>legal document AI</strong>.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Portfolio risk overview</li>
                <li>• Compliance tracking</li>
                <li>• Trend analysis</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Legal Analysis</h3>
              <p className="text-gray-600 mb-4">
                Lightning-fast document processing with sub-second response times. 
                Get professional legal insights without the wait or expensive hourly fees.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Sub-second analysis</li>
                <li>• Real-time processing</li>
                <li>• Enterprise performance</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise-Grade Security</h3>
              <p className="text-gray-600 mb-4">
                Bank-level security with end-to-end encryption, GDPR compliance, 
                and SOC 2 certification. Your legal documents stay private and secure.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• AES-256 encryption</li>
                <li>• GDPR compliant</li>
                <li>• SOC 2 certified</li>
              </ul>
            </article>
          </div>
        </section>{/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How AI Legal Document Analysis Works
              </h2>
              <p className="text-lg text-gray-600">
                Get professional legal insights in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Document</h3>
                <p className="text-gray-600">
                  Simply drag and drop your legal document (PDF, Word, or text format) 
                  into our secure platform. No installation required.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analyzes Instantly</h3>
                <p className="text-gray-600">
                  Our advanced AI reads and analyzes your document in seconds, 
                  identifying key terms, risks, and important clauses.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Insights & Chat</h3>
                <p className="text-gray-600">
                  Receive detailed analysis, risk scores, and chat with our AI assistant 
                  to ask specific questions about your document.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                onClick={handleSignUp}
              >
                Try It Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* COMPARISON SECTION - HIGH CONVERTING */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                LegalChatAI vs Traditional Legal Document Review
              </h2>
              <p className="text-xl text-blue-100">
                See why thousands of legal professionals choose AI-powered analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Traditional Review</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    Hours or days per document
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    $300-500+ per hour in legal fees
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    Human error and missed risks
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    Limited availability (business hours)
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 shadow-xl border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">LegalChatAI Analysis</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    Instant analysis in seconds
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    Completely free - no hidden costs
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    AI-powered accuracy and consistency
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    Available 24/7 with instant results
                  </li>
                </ul>
                <div className="mt-8 text-center">
                  <button 
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    onClick={handleSignUp}
                  >
                    Try Free AI Analysis Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Legal Professionals Worldwide
              </h2>
              <p className="text-lg text-gray-600">See why lawyers choose our AI legal document analysis platform</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "This AI legal document analysis tool has revolutionized our contract review process. 
                  What used to take our team days now takes hours with better accuracy."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">SC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Chen</p>
                    <p className="text-sm text-gray-600">Partner, Chen & Associates Law Firm</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "The contract analysis AI caught several critical issues we missed in manual review. 
                  It's like having a senior legal associate working 24/7 for free."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">MR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael Rodriguez</p>
                    <p className="text-sm text-gray-600">General Counsel, TechCorp Inc.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "Our clients love the instant insights from the legal AI assistant. 
                  We can provide preliminary contract analysis within minutes of receiving documents."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">JP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jennifer Park</p>
                    <p className="text-sm text-gray-600">Senior Attorney, Legal Solutions LLC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>{/* PRICING SECTION */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $0<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>5 document analyses per month</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Basic AI chat assistant</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Risk assessment reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
              </ul>
              <button 
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                onClick={handleSignUp}
              >
                Get Started Free
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-xl border-2 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $29<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Unlimited document analyses</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Advanced AI chat assistant</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Detailed analytics dashboard</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>API access</span>
                </li>
              </ul>
              <button 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={handleSignUp}
              >
                Start Pro Trial
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                Custom
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>On-premise deployment</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span>SLA guarantees</span>
                </li>
              </ul>
              <button 
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                onClick={() => window.location.href = 'mailto:contact@legalchatai.com'}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section with TARGET KEYWORDS */}
        <section id="faq" className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions About AI Legal Document Analysis
              </h2>
              <p className="text-lg text-gray-600">Get answers about our legal AI platform and document analysis tools</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is AI legal document analysis?</h3>
                <p className="text-gray-600">Our AI legal document analysis achieves 96%+ accuracy in identifying key contract terms, risks, and compliance issues. The AI is trained on millions of legal documents and continuously improved.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What types of documents can the legal AI assistant analyze?</h3>
                <p className="text-gray-600">Our legal AI assistant can analyze contracts, NDAs, employment agreements, lease agreements, terms of service, privacy policies, and most other legal documents in PDF, Word, or text format.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is the AI contract review really free?</h3>
                <p className="text-gray-600">Yes, our AI contract review and legal document analysis is completely free for up to 5 documents per month with no hidden costs or subscription fees required.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How does contract analysis AI work?</h3>
                <p className="text-gray-600">Our contract analysis AI uses advanced natural language processing and machine learning to read, understand, and analyze legal documents, identifying key terms, risks, and providing plain-English explanations.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I trust AI for legal document analysis?</h3>
                <p className="text-gray-600">Our AI provides professional-grade analysis as a tool to assist legal review, but should not replace qualified legal counsel. Always consult with an attorney for important legal decisions.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my legal document data secure?</h3>
                <p className="text-gray-600">Yes, we use enterprise-grade security with AES-256 encryption, GDPR compliance, and SOC 2 certification. Your documents are processed securely and never stored permanently.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does the AI analysis take?</h3>
                <p className="text-gray-600">Our AI can analyze most legal documents in under 30 seconds, regardless of document length. Complex contracts may take up to 2 minutes for comprehensive analysis.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Do I need to install any software?</h3>
                <p className="text-gray-600">No installation required. Our AI legal document analysis platform works entirely in your web browser. Simply upload your documents and get instant analysis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Legal Document Review?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of legal professionals using AI to analyze contracts faster and more accurately
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                onClick={handleSignUp}
              >
                Start Free AI Legal Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors border-2 border-green-600"
                onClick={handleSignIn}
              >
                Sign In to Your Account
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-4">
              No credit card required • Free forever • 2-minute setup
            </p>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <div className="bg-yellow-50 border-t border-yellow-200 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-yellow-800 mb-4">
              ⚖️ <strong>Important Legal Notice:</strong> This AI legal document analysis tool is for informational purposes only 
              and does not constitute legal advice. Always consult with a qualified attorney for legal matters and professional guidance.
            </p>
            <p className="text-xs text-yellow-700">
              AI-generated analysis should be reviewed by qualified legal professionals before making legal decisions.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">LegalChatAI</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  AI-powered legal document analysis and chat platform for legal professionals.
                </p>
                <p className="text-gray-500 text-xs">
                  © 2024 LegalChatAI. All rights reserved.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/ai-legal-document-analysis" className="hover:text-white transition-colors">Document Analysis</a></li>
                  <li><a href="/legal-ai-assistant" className="hover:text-white transition-colors">AI Assistant</a></li>
                  <li><a href="/contract-analysis-ai" className="hover:text-white transition-colors">Contract Analysis</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="/api" className="hover:text-white transition-colors">API Reference</a></li>
                  <li><a href="mailto:support@legalchatai.com" className="hover:text-white transition-colors">Email Support</a></li>
                  <li><a href="/status" className="hover:text-white transition-colors">System Status</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  Built with ❤️ for legal professionals worldwide
                </p>
                <div className="flex space-x-6">
                  <a href="/security" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
                  <a href="/compliance" className="text-gray-400 hover:text-white text-sm transition-colors">Compliance</a>
                  <a href="/gdpr" className="text-gray-400 hover:text-white text-sm transition-colors">GDPR</a>
                  <a href="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">Accessibility</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;