// src/pages/LegalDocumentReviewPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, Search, Clock, AlertTriangle, Brain, Users, Award } from 'lucide-react';

const LegalDocumentReviewPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Free Legal Document Review | AI Contract Analysis & Review Service"
        description="Professional legal document review service powered by AI. Upload contracts, agreements, NDAs for instant analysis, risk assessment, and compliance checking. Free legal document review tool."
        keywords="legal document review, contract review service, AI legal review, document analysis, legal contract review, free legal review, professional document review"
        canonical="https://legalchatai.com/legal-document-review"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free Legal Document Review - AI Contract Analysis Service",
          "description": "Professional legal document review service powered by AI. Get instant analysis, risk assessment, and compliance checking for all legal documents.",
          "url": "https://legalchatai.com/legal-document-review",
          "mainEntity": {
            "@type": "Service",
            "name": "AI Legal Document Review Service",
            "serviceType": "Legal Document Analysis",
            "provider": {
              "@type": "Organization",
              "name": "LegalChatAI"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free AI-powered legal document review"
            }
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://legalchatai.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Legal Document Review",
                "item": "https://legalchatai.com/legal-document-review"
              }
            ]
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4 mr-2" />
              Professional Document Review
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">Free Legal Document Review</span>
              <br />
              AI-Powered Contract Analysis
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get <strong>professional-grade legal document review</strong> powered by advanced AI. 
              Upload contracts, agreements, NDAs, or any legal document for instant analysis, 
              risk assessment, and comprehensive review in seconds.
            </h2>

            {/* Upload Tool */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-green-300 p-8">
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Upload for Professional Document Review
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get comprehensive analysis covering risks, compliance, key terms, and recommendations
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => {
                        const guestDocs = sessionStorage.getItem('guestDocuments');
                        const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                        window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                      }}
                    >
                      Start Document Review
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Chat About Documents
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    All file types supported • No signup required • Professional-grade analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Risk Assessment</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Compliance Check</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Key Terms Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Professional Report</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is Legal Document Review */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is AI Legal Document Review?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI legal document review service uses advanced natural language processing 
              to analyze contracts and legal documents with the precision of experienced lawyers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Risk Analysis</h3>
              <p className="text-gray-600 mb-4">
                AI identifies potential legal risks, liability issues, unfavorable terms, 
                and compliance problems that could impact your business or personal interests.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Liability exposure assessment</li>
                <li>• Financial risk identification</li>
                <li>• Operational risk analysis</li>
                <li>• Compliance gap detection</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Terms Extraction</h3>
              <p className="text-gray-600 mb-4">
                Automatically extracts and analyzes critical contract terms including dates, 
                obligations, payment terms, termination clauses, and renewal provisions.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Important dates & deadlines</li>
                <li>• Financial terms & obligations</li>
                <li>• Performance requirements</li>
                <li>• Termination conditions</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Verification</h3>
              <p className="text-gray-600 mb-4">
                Checks documents against legal standards, industry regulations, 
                and best practices to ensure compliance and identify potential issues.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Regulatory compliance check</li>
                <li>• Industry standard verification</li>
                <li>• Legal requirement validation</li>
                <li>• Best practice comparison</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Document Types */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Documents We Review
              </h2>
              <p className="text-xl text-gray-600">
                Professional AI review for all types of legal documents and contracts
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Business Contracts</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Service agreements</li>
                  <li>• Partnership contracts</li>
                  <li>• Vendor agreements</li>
                  <li>• Distribution contracts</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Employment Documents</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Employment contracts</li>
                  <li>• Non-compete agreements</li>
                  <li>• Confidentiality agreements</li>
                  <li>• Severance agreements</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Real Estate</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Purchase agreements</li>
                  <li>• Lease contracts</li>
                  <li>• Property management</li>
                  <li>• Construction contracts</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Legal Agreements</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• NDAs & confidentiality</li>
                  <li>• Licensing agreements</li>
                  <li>• Settlement agreements</li>
                  <li>• Terms of service</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI vs Traditional Review */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI Document Review vs Traditional Legal Review
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See why thousands of professionals choose AI-powered document review for speed, 
              accuracy, and cost-effectiveness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Traditional Review</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-red-600 text-sm">✗</span>
                  </span>
                  Days or weeks for review
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-red-600 text-sm">✗</span>
                  </span>
                  $300-800+ per hour in legal fees
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-red-600 text-sm">✗</span>
                  </span>
                  Human oversight and potential errors
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-red-600 text-sm">✗</span>
                  </span>
                  Limited availability and scheduling
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-red-600 text-sm">✗</span>
                  </span>
                  Inconsistent review standards
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 shadow-lg border-2 border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI Document Review</h3>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  Instant analysis in 30-60 seconds
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  Completely free - no hidden costs
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  AI-powered accuracy and consistency
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  Available 24/7 with instant results
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-green-600 text-sm">✓</span>
                  </span>
                  Standardized professional analysis
                </div>
              </div>
              <div className="mt-8 text-center">
                <button 
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  onClick={() => {
                    const guestDocs = sessionStorage.getItem('guestDocuments');
                    const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                    window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                  }}
                >
                  Try Free Review Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Review Process */}
        <section className="bg-green-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Document Review Process
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive 4-step analysis for thorough document review
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
                <p className="text-gray-600 text-sm">
                  Secure upload of your legal document with enterprise-grade encryption 
                  and privacy protection.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Advanced AI processes the document, analyzing structure, terms, 
                  risks, and compliance factors.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive risk evaluation with scoring and identification 
                  of potential legal issues.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Report</h3>
                <p className="text-gray-600 text-sm">
                  Detailed review report with findings, recommendations, 
                  and actionable insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Legal Document Review Service?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional-grade document review powered by AI, trusted by thousands 
              of businesses and individuals worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Time & Money</h3>
              <p className="text-gray-600">
                Get professional document review in minutes, not days. Save thousands 
                in legal fees while maintaining high-quality analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Accuracy</h3>
              <p className="text-gray-600">
                Advanced AI technology ensures consistent, accurate analysis with 
                95%+ precision in identifying key terms and risks.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-lg w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600">
                Your documents are protected with bank-level security, encryption, 
                and strict privacy policies. No data is stored permanently.
              </p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How thorough is AI document review?</h3>
                <p className="text-gray-600">Our AI provides comprehensive analysis covering risk assessment, compliance checking, key terms extraction, and recommendations. It's designed to match the thoroughness of experienced legal professionals.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What file formats are supported?</h3>
                <p className="text-gray-600">We support PDF, Word documents (.doc, .docx), RTF, and plain text files. Our AI can process both scanned documents and native digital files.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my document data secure and private?</h3>
                <p className="text-gray-600">Yes, we use enterprise-grade security with AES-256 encryption. Documents are processed securely and never stored permanently or used for training purposes.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can AI review replace legal counsel?</h3>
                <p className="text-gray-600">AI review provides excellent analysis and insights but should supplement, not replace, legal counsel for important decisions. Always consult qualified attorneys for critical matters.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready for Professional Document Review?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Upload your legal documents now for instant AI-powered analysis. 
              Get professional insights, risk assessment, and detailed review in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                onClick={() => {
                  const guestDocs = sessionStorage.getItem('guestDocuments');
                  const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                  window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                }}
              >
                Start Document Review
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                onClick={() => window.location.href = '/documents'}
              >
                Upload Documents
              </button>
            </div>
            <p className="text-green-200 text-sm mt-4">
              No signup required • Professional analysis • Used by 15,000+ users
            </p>
          </div>
        </section>

        {/* Related Services */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Related Legal AI Services
            </h2>
            <p className="text-xl text-gray-600">
              Explore our specialized legal analysis tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Risk Assessment</h3>
              <p className="text-gray-600 mb-4">Specialized risk analysis with scoring and mitigation recommendations.</p>
              <button 
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => window.location.href = '/contract-risk-assessment'}
              >
                Analyze Contract Risk →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NDA Analyzer</h3>
              <p className="text-gray-600 mb-4">Specialized analysis for non-disclosure and confidentiality agreements.</p>
              <button 
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => window.location.href = '/nda-analyzer'}
              >
                Analyze NDAs →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Free Legal AI Assistant</h3>
              <p className="text-gray-600 mb-4">Chat with our AI about legal questions and document concerns.</p>
              <button 
                className="text-green-600 hover:text-green-800 font-medium"
                onClick={() => window.location.href = '/free-legal-ai'}
              >
                Start AI Chat →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LegalDocumentReviewPage;