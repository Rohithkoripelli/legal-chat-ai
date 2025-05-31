// src/pages/LegalAIAssistantPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { MessageSquare, CheckCircle, Star, ArrowRight, Zap, Users, Brain, FileText } from 'lucide-react';

const LegalAIAssistantPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Legal AI Assistant | Free AI-Powered Legal Help & Document Chat | LegalChatAI"
        description="Get instant legal assistance with our AI legal assistant. Ask questions about contracts, legal documents, and get expert-level answers. Free legal AI chat available 24/7."
        keywords="legal AI assistant, AI legal help, legal chatbot, AI lawyer assistant, free legal AI, legal document chat, AI legal advice"
        canonical="https://legalchatai.com/legal-ai-assistant"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Legal AI Assistant - Free AI-Powered Legal Help",
          "description": "Free legal AI assistant providing instant answers to legal questions, contract analysis, and legal document chat support.",
          "url": "https://legalchatai.com/legal-ai-assistant",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "Legal AI Assistant",
            "applicationCategory": "Legal Technology",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 mr-2" />
              Available 24/7 • No Legal Fees
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">Legal AI Assistant</span>
              <br />
              Free AI-Powered Legal Help
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get instant answers to legal questions with our advanced <strong>legal AI assistant</strong>. 
              Ask about contracts, legal documents, compliance, and get expert-level responses. 
              Available 24/7 with no hourly fees or consultations required.
            </h2>

            {/* Chat Demo */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Legal AI Assistant Chat</h3>
                    <p className="text-gray-600">Ask any legal question and get instant expert answers</p>
                  </div>
                </div>

                {/* Chat Examples */}
                <div className="space-y-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">👤 "What should I look for in an employment contract?"</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">🤖 <strong>Legal AI Assistant:</strong> Key elements to review in an employment contract include: salary and benefits, job responsibilities, termination clauses, non-compete agreements, intellectual property rights, and dispute resolution procedures. I can analyze your specific contract if you upload it.</p>
                  </div>
                </div>

                <button 
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center w-full justify-center"
                  onClick={() => window.location.href = '/chat'}
                >
                  Start Chatting with Legal AI Assistant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Instant Answers</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">24/7 Available</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">No Legal Fees</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Expert-Level AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is Legal AI Assistant */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is a Legal AI Assistant?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A legal AI assistant is an advanced artificial intelligence system trained on millions of legal documents 
              and cases to provide instant, accurate answers to legal questions and document analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How Our Legal AI Assistant Helps You:</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Ask Legal Questions</h4>
                    <p className="text-gray-600">Type any legal question in plain English. Our AI understands context and provides detailed, accurate answers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Document Analysis Chat</h4>
                    <p className="text-gray-600">Upload legal documents and ask specific questions about clauses, terms, risks, and compliance requirements.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Expert Explanations</h4>
                    <p className="text-gray-600">Receive detailed explanations of complex legal concepts in plain English with relevant examples and citations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Legal Topics Our AI Assistant Covers:</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Contract Law</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Employment Law</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Business Law</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Real Estate Law</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Intellectual Property</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Privacy Law</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Corporate Law</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">Compliance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose Our Legal AI Assistant?
              </h2>
              <p className="text-lg text-gray-600">
                Advanced AI technology trained specifically for legal assistance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert-Level Knowledge</h3>
                <p className="text-gray-600">
                  Trained on millions of legal documents, cases, and statutes. Provides professional-grade 
                  legal insights and analysis comparable to experienced attorneys.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Responses</h3>
                <p className="text-gray-600">
                  Get immediate answers to legal questions without waiting for appointments or paying 
                  consultation fees. Available 24/7 for urgent legal inquiries.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Integration</h3>
                <p className="text-gray-600">
                  Upload legal documents and ask specific questions about them. Our AI reads and analyzes 
                  your documents to provide contextual answers and insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Legal Professionals Use Our AI Assistant
            </h2>
            <p className="text-lg text-gray-600">
              Real-world applications for lawyers, businesses, and individuals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Legal Research</h3>
              <p className="text-gray-600 mb-4">
                "What are the key elements of a valid contract?" Get instant research results without 
                spending hours in legal databases.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ⚡ Saves 2-3 hours per research query
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Questions</h3>
              <p className="text-gray-600 mb-4">
                "Does this clause create liability for my company?" Upload contracts and get specific 
                answers about terms and risks.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ⚡ Instant contract analysis vs. hours of review
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compliance Guidance</h3>
              <p className="text-gray-600 mb-4">
                "What are GDPR requirements for data processing?" Get clear explanations of 
                complex compliance requirements.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ⚡ Immediate compliance guidance
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Drafting Help</h3>
              <p className="text-gray-600 mb-4">
                "What should I include in a service agreement?" Get guidance on essential clauses 
                and legal language for documents.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ⚡ Faster document creation
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Assessment</h3>
              <p className="text-gray-600 mb-4">
                "What are the risks in this partnership agreement?" Identify potential legal 
                issues before they become problems.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ⚡ Proactive risk identification
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Education</h3>
              <p className="text-gray-600 mb-4">
                "Explain intellectual property law for startups." Learn complex legal concepts 
                with clear, practical explanations.
              </p>
              <div className="text-sm text-green-600 font-medium">
                ⚡ Continuous legal learning
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-green-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Legal Professionals Say About Our AI Assistant
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">
                  "This legal AI assistant has become my go-to research tool. It's like having a 
                  junior associate available 24/7 who never gets tired and always provides accurate answers."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">DM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">David Martinez</p>
                    <p className="text-sm text-gray-600">Solo Practitioner, Business Law</p>
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
                  "The document analysis feature is incredible. I can upload contracts and get instant 
                  insights about risks and compliance issues. It's saved our firm countless hours."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-green-600 font-semibold">LT</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lisa Thompson</p>
                    <p className="text-sm text-gray-600">In-house Counsel, Tech Company</p>
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
                  "As a small business owner, this AI assistant helps me understand legal documents 
                  without expensive lawyer consultations. The explanations are clear and actionable."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">RK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Robert Kim</p>
                    <p className="text-sm text-gray-600">CEO, Marketing Agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Legal AI Assistant FAQ
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can a legal AI assistant provide legal advice?</h3>
              <p className="text-gray-600">Our legal AI assistant provides information and analysis to help you understand legal concepts and documents, but it does not provide legal advice. Always consult with a qualified attorney for legal counsel and decision-making.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate are the responses from the legal AI assistant?</h3>
              <p className="text-gray-600">Our AI assistant is trained on millions of legal documents and maintains high accuracy in providing legal information. However, laws can be complex and jurisdiction-specific, so important legal matters should always be reviewed by qualified legal counsel.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is the legal AI assistant free to use?</h3>
              <p className="text-gray-600">Yes, our legal AI assistant is completely free to use with no hidden costs, subscription fees, or usage limits. We believe legal technology should be accessible to everyone.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What types of legal questions can I ask?</h3>
              <p className="text-gray-600">You can ask about contract terms, legal concepts, compliance requirements, document analysis, risk assessment, and general legal information across various practice areas including business, employment, real estate, and intellectual property law.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I upload documents for the AI assistant to analyze?</h3>
              <p className="text-gray-600">Yes, you can upload legal documents in PDF, Word, or text format. The AI assistant will read and analyze your documents, then answer specific questions about clauses, terms, risks, and compliance requirements.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-700 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Try Your Personal Legal AI Assistant?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Get instant answers to legal questions and document analysis - completely free
            </p>
            <button 
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              onClick={() => window.location.href = '/chat'}
            >
              Start Chatting with Legal AI Assistant
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-green-100 mt-4">
              No signup required • Start chatting immediately • 100% free
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default LegalAIAssistantPage;