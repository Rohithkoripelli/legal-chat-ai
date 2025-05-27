// frontend/src/components/auth/LandingPage.tsx
import React from 'react';
import { FileText, MessageSquare, Shield, Zap, CheckCircle, BarChart3, ArrowRight, Users, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 10,000+ Legal Professionals
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            AI-Powered <span className="text-blue-600">Legal Document</span> Analysis
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload, analyze, and extract insights from your legal documents with advanced AI technology. 
            Get instant answers, risk assessments, and comprehensive document analysis in seconds.
          </p>
          
          {/* Hero Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">99.9% Accuracy</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Enterprise Security</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">Instant Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for comprehensive legal document analysis, powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Document Upload</h3>
            <p className="text-gray-600 mb-4">
              Drag-and-drop interface with support for PDF, Word, and text formats. Automatic OCR and text extraction.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Multiple file format support</li>
              <li>• Batch upload capability</li>
              <li>• Automatic text extraction</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Chat Assistant</h3>
            <p className="text-gray-600 mb-4">
              Ask natural language questions about your documents and get instant, accurate answers with source citations.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Natural language queries</li>
              <li>• Source citations included</li>
              <li>• Context-aware responses</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Analysis</h3>
            <p className="text-gray-600 mb-4">
              Automatically identify potential risks, compliance issues, and critical clauses in your legal documents.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Automated risk detection</li>
              <li>• Compliance checking</li>
              <li>• Critical clause identification</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive analytics and insights about your document portfolio with visual risk assessments.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Portfolio overview</li>
              <li>• Risk heat maps</li>
              <li>• Trend analysis</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-16 w-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600 mb-4">
              Process and analyze documents in seconds, not hours. Get instant insights with enterprise-grade performance.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Sub-second response times</li>
              <li>• Parallel processing</li>
              <li>• Real-time analysis</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="h-16 w-16 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Compliant</h3>
            <p className="text-gray-600 mb-4">
              Enterprise-grade security with end-to-end encryption and compliance with legal industry standards.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• End-to-end encryption</li>
              <li>• SOC 2 compliant</li>
              <li>• GDPR ready</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Legal Chat AI?</h2>
            <p className="text-lg text-gray-600">Transform how you work with legal documents and increase your productivity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Save 90% of Review Time</h3>
                    <p className="text-gray-600">What used to take hours now takes minutes. Our AI processes documents instantly, giving you more time for strategic legal work.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Improve Accuracy by 95%</h3>
                    <p className="text-gray-600">AI-powered analysis catches critical details that might be overlooked in manual review, reducing errors and liability.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Instant Access</h3>
                    <p className="text-gray-600">Access your documents and get AI insights anytime, anywhere. No waiting for office hours or manual reviews.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Reduce Costs by 80%</h3>
                    <p className="text-gray-600">Dramatically reduce document review costs while improving quality and speed of legal analysis.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join 10,000+ Legal Professionals</h3>
                <p className="text-gray-600 mb-6">
                  From solo practitioners to Fortune 500 legal teams, professionals worldwide trust our AI-powered document analysis.
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      🔒 <strong>Bank-Grade Security:</strong> Your documents are encrypted with AES-256 and stored in SOC 2 compliant data centers.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ⚡ <strong>Free Trial:</strong> Start analyzing documents immediately with our risk-free trial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Legal Professionals Say</h2>
          <p className="text-lg text-gray-600">Hear from lawyers who've transformed their practice with AI</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 mb-6">
              "This AI tool has revolutionized our contract review process. What used to take our team days now takes hours."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Sarah Chen</p>
                <p className="text-sm text-gray-600">Partner, Chen & Associates</p>
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
              "The risk analysis feature caught several critical issues we missed in manual review. It's like having a senior associate working 24/7."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Michael Rodriguez</p>
                <p className="text-sm text-gray-600">General Counsel, TechCorp</p>
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
              "Our clients love the instant insights. We can provide preliminary analysis within minutes of receiving documents."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-semibold text-gray-900">Jennifer Park</p>
                <p className="text-sm text-gray-600">Senior Attorney, Legal Solutions LLC</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border-t border-yellow-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-yellow-800 mb-4">
            ⚖️ <strong>Important Legal Notice:</strong> This tool is for informational purposes only and does not constitute legal advice. 
            Always consult with a qualified attorney for legal matters and professional guidance.
          </p>
          <p className="text-xs text-yellow-700">
            AI-generated analysis should be reviewed by qualified legal professionals before making legal decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;