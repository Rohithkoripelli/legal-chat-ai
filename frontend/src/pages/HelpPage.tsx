// src/pages/HelpPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, HelpCircle, Book, MessageSquare, Mail, Phone, Globe } from 'lucide-react';

const HelpPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Help & Support | LegalChatAI Documentation & Tutorials"
        description="Get help with LegalChatAI. Find tutorials, documentation, FAQs, and support for AI legal document analysis, contract review, and legal AI chat features."
        keywords="LegalChatAI help, legal AI support, how to use legal AI, contract analysis help, legal AI tutorial, LegalChatAI documentation"
        canonical="https://legalchatai.com/help"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support Center
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Help & Support</span>
              <br />
              LegalChatAI Guide
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Find answers, tutorials, and support for <strong>LegalChatAI</strong>. 
              Learn how to use our AI legal tools, analyze documents, and get the most 
              out of your legal AI experience.
            </h2>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border p-8">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Book className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Need Help Getting Started?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Try AI Chat
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button 
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/documents'}
                    >
                      Upload Documents
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Quick Start Guide
            </h2>
            <p className="text-xl text-gray-600">
              Get started with LegalChatAI in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Documents</h3>
              <p className="text-gray-600 mb-4">
                Upload legal documents in PDF, Word, or text format. No signup required 
                for up to 3 documents.
              </p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => window.location.href = '/documents'}
              >
                Start Upload →
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get AI Analysis</h3>
              <p className="text-gray-600 mb-4">
                Our AI analyzes your documents instantly, providing risk assessment, 
                key terms, and insights.
              </p>
              <button 
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => window.location.href = '/guest-contract-analysis'}
              >
                Try Analysis →
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Chat with AI</h3>
              <p className="text-gray-600 mb-4">
                Ask questions about your documents, get explanations, and receive 
                professional insights.
              </p>
              <button 
                className="text-purple-600 hover:text-purple-800 font-medium"
                onClick={() => window.location.href = '/chat'}
              >
                Start Chat →
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How do I get started with LegalChatAI?</h3>
                <p className="text-gray-600">Simply visit our homepage and either upload documents for analysis or start chatting with our AI. No signup is required for basic features.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What file formats are supported?</h3>
                <p className="text-gray-600">We support PDF, Word documents (.doc, .docx), RTF, and plain text files. Our AI can process both digital and scanned documents.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is LegalChatAI really free?</h3>
                <p className="text-gray-600">Yes! Our core features are completely free with no hidden costs. You can analyze up to 3 documents and chat unlimited without any charges.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is the AI analysis?</h3>
                <p className="text-gray-600">Our AI achieves 96%+ accuracy in document analysis and risk assessment. However, always consult qualified legal professionals for important decisions.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure and private?</h3>
                <p className="text-gray-600">Yes, we use enterprise-grade security with AES-256 encryption. Guest documents are processed securely and automatically deleted after your session.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I save my analysis results?</h3>
                <p className="text-gray-600">With a free account, yes! Guest users can download results, while account holders get permanent storage and chat history.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Need More Help?
            </h2>
            <p className="text-xl text-gray-600">
              Can't find what you're looking for? Contact our support team
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email with detailed responses</p>
              <a 
                href="mailto:reddyrohith705@gmail.com"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                reddyrohith705@gmail.com
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Chat Support</h3>
              <p className="text-gray-600 mb-4">Ask our AI assistant about how to use the platform</p>
              <button 
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => window.location.href = '/chat'}
              >
                Start Chat →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Online Resources</h3>
              <p className="text-gray-600 mb-4">Browse our knowledge base and tutorials</p>
              <button 
                className="text-purple-600 hover:text-purple-800 font-medium"
                onClick={() => window.location.href = '/'}
              >
                Visit Homepage →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HelpPage;