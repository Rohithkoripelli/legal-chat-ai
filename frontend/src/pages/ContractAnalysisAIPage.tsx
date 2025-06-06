// src/pages/ContractAnalysisAIPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, AlertTriangle, BarChart3, Eye } from 'lucide-react';

const ContractAnalysisAIPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Contract Analysis AI | Free AI-Powered Contract Review Tool | LegalChatAI"
        description="Free contract analysis AI tool. Upload contracts and get instant risk assessment, clause analysis, and compliance checking. Professional-grade contract review in seconds."
        keywords="contract analysis AI, AI contract review, contract analysis tool, automated contract review, free contract analysis, contract risk assessment"
        canonical="https://legalchatai.com/contract-analysis-ai"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Contract Analysis AI - Free Contract Review Tool",
          "description": "AI-powered contract analysis tool providing instant risk assessment, clause analysis, and compliance checking for all contract types.",
          "url": "https://legalchatai.com/contract-analysis-ai",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "Contract Analysis AI Tool",
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Contract Upload Section - MOVED TO TOP */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-purple-300 p-8">
              <div className="text-center">
                <FileText className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Upload Contract for Instant AI Analysis
                </h3>
                <p className="text-gray-600 mb-6">
                  Drag and drop any contract for comprehensive risk assessment and clause analysis
                </p>

                {/* Contract Types */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 text-sm">
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-purple-700">Employment</div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-purple-700">Service Agreements</div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-purple-700">NDAs</div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-purple-700">Vendor Contracts</div>
                </div>

                <button 
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center"
                  onClick={() => window.location.href = '/chat'}
                >
                  Start Free Contract Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  Supports PDF, Word, and text files • Enterprise-grade security • No signup required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section - MOVED AFTER CONTRACT UPLOAD */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-8">
              <Shield className="w-4 h-4 mr-2" />
              Professional Contract Risk Assessment
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-purple-600">Contract Analysis AI</span>
              <br />
              Free AI-Powered Contract Review
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Upload any contract and get instant <strong>AI-powered analysis</strong>. 
              Our advanced contract analysis AI identifies risks, analyzes clauses, checks compliance, 
              and provides professional-grade contract review in seconds. <strong>Free for all contract types.</strong>
            </h2>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Risk Detection</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Clause Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Compliance Check</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium text-gray-700">Plain English</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is Contract Analysis AI */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is Contract Analysis AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Contract analysis AI is advanced artificial intelligence technology that automatically reviews, 
              analyzes, and assesses contracts for risks, compliance issues, and key terms with professional-grade accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How Our Contract Analysis AI Works:</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Contract Upload & Parsing</h4>
                    <p className="text-gray-600">Upload your contract in any format. Our AI extracts and structures the content for comprehensive analysis.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h4>
                    <p className="text-gray-600">Advanced NLP algorithms identify clauses, assess risks, and check compliance against legal standards.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Report</h4>
                    <p className="text-gray-600">Receive detailed analysis with risk scores, clause explanations, and actionable recommendations.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contract Elements We Analyze:</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Liability and indemnification clauses</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Payment terms and penalties</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Termination and renewal conditions</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Intellectual property rights</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Confidentiality and non-disclosure</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Compliance and regulatory requirements</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Force majeure and dispute resolution</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Benefits of AI Contract Analysis
              </h2>
              <p className="text-lg text-gray-600">
                Why legal professionals choose AI-powered contract review
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Identification</h3>
                <p className="text-gray-600">
                  Automatically identify potential risks, unfavorable terms, and compliance issues 
                  that could impact your business or legal position.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Accuracy</h3>
                <p className="text-gray-600">
                  98%+ accuracy in contract analysis with consistency that surpasses manual review. 
                  Never miss critical clauses or terms again.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Clear Insights</h3>
                <p className="text-gray-600">
                  Get plain-English explanations of complex legal terms and clauses. 
                  Understand exactly what each section means for your business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contract Types */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contract Types Our AI Analyzes
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive analysis for all types of business and legal contracts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Contracts</h3>
              <p className="text-gray-600 mb-4">Analyze salary terms, benefits, non-compete clauses, and termination conditions.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Salary & benefits • ✓ Non-compete analysis • ✓ Termination terms
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Agreements</h3>
              <p className="text-gray-600 mb-4">Review scope of work, payment terms, liability clauses, and deliverable requirements.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Scope analysis • ✓ Payment terms • ✓ Liability assessment
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NDAs & Confidentiality</h3>
              <p className="text-gray-600 mb-4">Analyze confidentiality scope, duration, penalties, and permitted disclosures.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Confidentiality scope • ✓ Duration terms • ✓ Penalty clauses
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Vendor Contracts</h3>
              <p className="text-gray-600 mb-4">Review supplier terms, quality standards, delivery schedules, and penalty clauses.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Quality standards • ✓ Delivery terms • ✓ Penalty analysis
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lease Agreements</h3>
              <p className="text-gray-600 mb-4">Analyze rent terms, maintenance responsibilities, renewal options, and exit clauses.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Rent analysis • ✓ Maintenance terms • ✓ Renewal options
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Partnership Agreements</h3>
              <p className="text-gray-600 mb-4">Review profit sharing, decision-making authority, exit strategies, and dispute resolution.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Profit sharing • ✓ Authority structure • ✓ Exit strategies
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Software Licenses</h3>
              <p className="text-gray-600 mb-4">Analyze usage rights, restrictions, support terms, and termination conditions.</p>
              <div className="text-sm text-purple-600 font-medium">
                ✓ Usage rights • ✓ Restrictions • ✓ Support terms
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-700 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                AI Contract Analysis vs Traditional Review
              </h2>
              <p className="text-xl text-purple-100">
                See why businesses choose AI-powered contract analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Traditional Contract Review</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    2-5 hours per contract review
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    $300-800+ in legal fees per contract
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    Risk of human error and oversight
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    Inconsistent analysis quality
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-red-600 text-sm">✗</span>
                    </span>
                    Limited availability and scheduling
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-xl p-8 shadow-xl border-2 border-green-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI Contract Analysis</h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    Instant analysis in under 30 seconds
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    Completely free with no hidden costs
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    98%+ accuracy with AI consistency
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </span>
                    Consistent professional-grade analysis
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
                    className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    onClick={() => window.location.href = '/chat'}
                  >
                    Try Free Contract Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Contract Analysis AI FAQ
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is AI contract analysis?</h3>
              <p className="text-gray-600">Our contract analysis AI achieves 98%+ accuracy in identifying key contract terms, risks, and compliance issues. It's trained on millions of contracts and continuously improved based on legal expert feedback.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What contract formats are supported?</h3>
              <p className="text-gray-600">We support PDF, Microsoft Word (.doc, .docx), and plain text files. Our OCR technology can also extract text from scanned contracts and image-based PDFs.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is contract analysis AI secure?</h3>
              <p className="text-gray-600">Yes, we use enterprise-grade security with AES-256 encryption, secure processing environments, and compliance with data protection regulations. Contracts are processed securely and not stored permanently.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can AI contract analysis replace legal review?</h3>
              <p className="text-gray-600">AI contract analysis is a powerful tool to accelerate and enhance contract review, but it should complement qualified legal counsel. For critical contracts and complex legal matters, always consult with an attorney.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does contract analysis take?</h3>
              <p className="text-gray-600">Most contracts are analyzed in under 30 seconds, regardless of length. Complex multi-page contracts may take up to 1-2 minutes for comprehensive analysis.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-700 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Try AI Contract Analysis?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Upload your contract and get professional-grade analysis in seconds - completely free
            </p>
            <button 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              onClick={() => window.location.href = '/chat'}
            >
              Analyze Your Contract Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <p className="text-sm text-purple-100 mt-4">
              No signup required • Instant results • 100% secure
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContractAnalysisAIPage;