import React from 'react';
import { DocumentHead } from '../SEO/DocumentHead';
import { FileText, MessageSquare, Shield, Zap, CheckCircle, BarChart3, ArrowRight, Users, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <>
      {/* SEO AND GOOGLE VERIFICATION */}
      <DocumentHead
        title="LegalChatAI - Free AI Legal Document Analysis & Chat Platform"
        description="Upload legal documents and chat with AI for instant analysis. Get contract insights, clause explanations, and legal guidance powered by advanced AI technology. Free to use."
        keywords="legal AI, legal chat ai, contract analysis, document review, AI lawyer, legal assistant, free legal analysis, legal document AI"
        canonical="https://legalchatai.com"
        verification="u68V4TOCfGA0QPpqGeTwcvxr-AZ9TJl3kqCf6rdb8cg"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Trusted by Legal Professionals Worldwide
            </div>
            
            {/* UPDATED H1 TAG FOR BETTER SEO */}
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">LegalChatAI</span> - Free AI Legal Document Analysis & Chat
            </h1>
            
            {/* UPDATED H2 FOR BETTER SEO */}
            <h2 className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload legal documents and chat with AI for instant analysis. Get contract insights, 
              clause explanations, and legal guidance powered by advanced AI technology.
            </h2>
            
            {/* Hero Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">100% Free</span>
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Create Legal Documents
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LegalChatAI for Legal Document Analysis?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for comprehensive legal document analysis, powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
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
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Legal Chat Assistant</h3>
              <p className="text-gray-600 mb-4">
                Ask natural language questions about your documents and get instant, accurate answers with source citations.
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contract Risk Analysis</h3>
              <p className="text-gray-600 mb-4">
                Automatically identify potential risks, compliance issues, and critical clauses in your legal documents.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Automated risk detection</li>
                <li>• Compliance checking</li>
                <li>• Critical clause identification</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Analytics Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive analytics and insights about your document portfolio with visual risk assessments.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Portfolio overview</li>
                <li>• Risk heat maps</li>
                <li>• Trend analysis</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="h-16 w-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast Legal AI</h3>
              <p className="text-gray-600 mb-4">
                Process and analyze documents in seconds, not hours. Get instant insights with enterprise-grade performance.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Sub-second response times</li>
                <li>• Parallel processing</li>
                <li>• Real-time analysis</li>
              </ul>
            </article>

            <article className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
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
            </article>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose LegalChatAI vs Other Legal AI Tools?</h2>
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Free Forever</h3>
                      <p className="text-gray-600">Unlike other legal AI tools that charge $20-300/month, LegalChatAI is completely free with no hidden costs or subscription fees.</p>
                    </div>
                  </div>

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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Registration Required</h3>
                      <p className="text-gray-600">Start using immediately without creating accounts or providing payment information. Just upload and analyze.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Upload + Chat Combined</h3>
                      <p className="text-gray-600">Most legal AI tools only do chat OR document analysis. We seamlessly combine both for comprehensive legal assistance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Thousands of Legal Professionals</h3>
                  <p className="text-gray-600 mb-6">
                    From solo practitioners to Fortune 500 legal teams, professionals worldwide trust our AI-powered document analysis.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        🔒 <strong>Bank-Grade Security:</strong> Your documents are encrypted with AES-256 and processed securely.
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        ⚡ <strong>Start Immediately:</strong> No signup required. Upload documents and get instant AI analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Get answers about our legal AI chat and document analysis platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is LegalChatAI really free?</h3>
              <p className="text-gray-600">Yes, our legal AI chat and document analysis is completely free to use with no hidden costs or subscription fees.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What file formats do you support?</h3>
              <p className="text-gray-600">We support PDF, Word documents (.doc, .docx), and text files for legal document analysis.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is the AI legal analysis?</h3>
              <p className="text-gray-600">Our AI is trained on millions of legal documents and provides professional-grade analysis with high accuracy.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my data secure?</h3>
              <p className="text-gray-600">Yes, we use enterprise-grade security with end-to-end encryption to protect your sensitive legal documents.</p>
            </div>
          </div>
        </section>

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
    </>
  );
};

export default LandingPage;