// src/pages/AILegalDocumentAnalysisPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

const AILegalDocumentAnalysisPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="AI Legal Document Analysis | Free Contract Analysis Tool | LegalChatAI"
        description="Free AI legal document analysis tool. Upload contracts, NDAs, agreements and get instant analysis. Identify risks, compliance issues, and key terms in seconds. No signup required."
        keywords="AI legal document analysis, contract analysis tool, legal document AI, automated contract review, free legal analysis, AI contract analysis"
        canonical="https://legalchatai.com/ai-legal-document-analysis"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "AI Legal Document Analysis - Free Contract Analysis Tool",
          "description": "Free AI-powered legal document analysis. Upload contracts and legal documents for instant analysis, risk assessment, and compliance checking.",
          "url": "https://legalchatai.com/ai-legal-document-analysis",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "AI Legal Document Analysis Tool",
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">AI Legal Document Analysis</span>
              <br />
              Free Contract Analysis Tool
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Upload any legal document and get instant <strong>AI-powered analysis</strong>. 
              Our advanced legal AI identifies risks, analyzes clauses, and provides plain-English summaries. 
              Perfect for contracts, NDAs, agreements, and legal documents.
            </h2>

            {/* Upload Tool */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-blue-300 p-8">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Upload Your Legal Document for Free AI Analysis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Drag and drop or click to upload contracts, NDAs, agreements, and other legal documents
                  </p>
                  <button 
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
                    onClick={() => window.location.href = '/chat'}
                  >
                    Upload Document for Analysis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    Supports PDF, Word, and text files • No signup required • 100% secure
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Instant AI Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Risk Assessment</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Plain English Summary</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is AI Legal Document Analysis */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is AI Legal Document Analysis?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              AI legal document analysis uses advanced artificial intelligence and natural language processing 
              to automatically review, understand, and analyze legal documents with professional-grade accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How Our AI Legal Document Analysis Works:</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Document Upload & Processing</h4>
                    <p className="text-gray-600">Upload your legal document in PDF, Word, or text format. Our AI instantly extracts and processes the text content.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis & Understanding</h4>
                    <p className="text-gray-600">Advanced NLP algorithms analyze the document structure, identify key clauses, and understand legal context.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Risk Assessment & Insights</h4>
                    <p className="text-gray-600">Generate comprehensive analysis including risk assessment, compliance checking, and plain-English summaries.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What Our AI Analyzes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Contract terms and conditions
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Risk factors and liability clauses
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Payment terms and deadlines
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Termination and renewal clauses
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Compliance and regulatory requirements
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  Intellectual property rights
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Benefits of AI Legal Document Analysis
              </h2>
              <p className="text-lg text-gray-600">
                Why thousands of legal professionals choose AI-powered document analysis
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">80% Faster Analysis</h3>
                <p className="text-gray-600">
                  Analyze complex legal documents in seconds instead of hours. Get instant insights 
                  without the wait or expensive hourly fees.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Accuracy</h3>
                <p className="text-gray-600">
                  96%+ accuracy in identifying key terms, risks, and compliance issues. 
                  AI-powered consistency without human error.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Insights</h3>
                <p className="text-gray-600">
                  Get detailed risk assessments, compliance checks, and plain-English explanations 
                  of complex legal terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI Legal Document Analysis Use Cases
            </h2>
            <p className="text-lg text-gray-600">
              Perfect for various legal document types and professional scenarios
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Review & Analysis</h3>
              <p className="text-gray-600 mb-4">Analyze service agreements, employment contracts, and vendor agreements for risks and key terms.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Payment terms analysis</li>
                <li>• Liability assessment</li>
                <li>• Termination clause review</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NDA & Confidentiality Review</h3>
              <p className="text-gray-600 mb-4">Quickly analyze non-disclosure agreements and confidentiality clauses for scope and enforceability.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Scope of confidentiality</li>
                <li>• Duration and enforceability</li>
                <li>• Permitted disclosures</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Due Diligence Support</h3>
              <p className="text-gray-600 mb-4">Accelerate due diligence processes by quickly analyzing large volumes of legal documents.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Bulk document analysis</li>
                <li>• Risk aggregation</li>
                <li>• Compliance checking</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lease Agreement Analysis</h3>
              <p className="text-gray-600 mb-4">Review residential and commercial lease agreements for tenant rights and landlord obligations.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Rent and fee analysis</li>
                <li>• Maintenance responsibilities</li>
                <li>• Termination conditions</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms of Service Review</h3>
              <p className="text-gray-600 mb-4">Analyze website terms, software licenses, and service agreements for user rights and restrictions.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• User rights and obligations</li>
                <li>• Data privacy terms</li>
                <li>• Limitation of liability</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Partnership Agreements</h3>
              <p className="text-gray-600 mb-4">Review business partnership agreements, joint ventures, and collaboration contracts.</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Profit sharing terms</li>
                <li>• Decision-making authority</li>
                <li>• Exit strategies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI Legal Document Analysis FAQ
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is AI legal document analysis?</h3>
                <p className="text-gray-600">Our AI achieves 96%+ accuracy in identifying key contract terms, risks, and compliance issues. The system is trained on millions of legal documents and continuously improved based on legal expert feedback.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What file formats are supported for legal document analysis?</h3>
                <p className="text-gray-600">We support PDF, Microsoft Word (.doc, .docx), and plain text files. Our OCR technology can extract text from scanned documents and images within PDFs.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is AI legal document analysis secure?</h3>
                <p className="text-gray-600">Yes, we use enterprise-grade security with AES-256 encryption, secure processing, and compliance with data protection regulations. Documents are processed securely and not stored permanently.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can AI replace legal review entirely?</h3>
                <p className="text-gray-600">AI legal document analysis is a powerful tool to assist and accelerate legal review, but it should complement, not replace, qualified legal counsel. Always consult with an attorney for important legal decisions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Try AI Legal Document Analysis?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Upload your first document and experience the power of AI-driven legal analysis
            </p>
            <button 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              onClick={() => window.location.href = '/chat'}
            >
              Start Free Analysis Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default AILegalDocumentAnalysisPage;