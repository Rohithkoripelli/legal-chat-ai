// src/pages/FreeLegalAIPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, MessageSquare, Brain, Users, Globe, Award, Crown, Gift } from 'lucide-react';

const FreeLegalAIPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Free Legal AI | No Signup Required | AI Legal Assistant & Document Analysis"
        description="Free AI legal assistant with no signup required. Chat with AI about legal questions, analyze documents, get contract reviews, and access professional legal AI tools for free."
        keywords="free legal AI, no signup legal AI, free AI legal assistant, free contract analysis, legal AI chat, free legal analysis, AI legal help"
        canonical="https://legalchatai.com/free-legal-ai"
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4 mr-2" />
              100% Free - No Signup Required
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">Free Legal AI</span>
              <br />
              No Signup Required
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Access <strong>professional-grade legal AI</strong> completely free. 
              Chat with our AI assistant, analyze documents, review contracts, 
              and get legal insights - all without creating an account.
            </h2>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-green-300 p-8">
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Start Using Free Legal AI Now
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Start AI Chat
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/documents'}
                    >
                      Analyze Documents
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    No email • No credit card • No signup • Start immediately
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">AI Legal Chat</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Document Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Contract Review</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Risk Assessment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Free Features */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What You Get for Free
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Legal Chat</h3>
              <p className="text-gray-600 mb-4">
                Chat with our advanced legal AI assistant. Ask questions about contracts, 
                legal terms, and get professional insights instantly.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Unlimited chat messages</li>
                <li>• Legal question answering</li>
                <li>• Contract term explanations</li>
                <li>• Legal advice guidance</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Analysis</h3>
              <p className="text-gray-600 mb-4">
                Upload up to 3 legal documents for comprehensive AI analysis, 
                risk assessment, and key terms extraction.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 3 document uploads per session</li>
                <li>• Full AI analysis</li>
                <li>• Risk scoring</li>
                <li>• Key terms extraction</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Features</h3>
              <p className="text-gray-600 mb-4">
                Access the same AI technology used by legal professionals, 
                with enterprise-grade security and accuracy.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Professional-grade AI</li>
                <li>• Enterprise security</li>
                <li>• 96%+ accuracy rate</li>
                <li>• Instant analysis</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Free vs Premium Features
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium mb-4">
                    <Gift className="w-4 h-4 mr-2" />
                    Free - No Signup Required
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Features</h3>
                  <p className="text-gray-600">Everything you need to get started</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    Upload up to 3 documents
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    AI document analysis
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    Unlimited AI chat
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    Risk assessment
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    Session-based storage
                  </li>
                </ul>
                
                <button
                  onClick={() => window.location.href = '/documents'}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Try Free Now
                </button>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-2 border-blue-200 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium mb-4">
                    <Crown className="w-4 h-4 mr-2" />
                    Free Account - Premium Features
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Features</h3>
                  <p className="text-gray-600">Everything for professional use</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    Unlimited document uploads
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    Permanent secure storage
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    Advanced analytics dashboard
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    Document generation tools
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    Chat history & more
                  </li>
                </ul>
                
                <button
                  onClick={() => window.location.href = '/sign-up'}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Try Free Legal AI?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              No signup required! Start using professional legal AI tools instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
                onClick={() => window.location.href = '/chat'}
              >
                Start AI Chat
              </button>
              <button 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                onClick={() => window.location.href = '/documents'}
              >
                Analyze Documents
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FreeLegalAIPage;