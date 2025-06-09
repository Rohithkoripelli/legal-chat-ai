// src/pages/NDAAnalyzerPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, Lock, Eye, Users, AlertTriangle, Clock, Globe } from 'lucide-react';

const NDAAnalyzerPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Free NDA Analyzer & Non-Disclosure Agreement Review | AI Analysis Tool"
        description="Free AI-powered NDA analyzer. Upload NDAs for instant analysis, confidentiality clause review, and risk assessment. Identify mutual vs unilateral terms, legal gaps, and compliance issues."
        keywords="NDA analyzer, non-disclosure agreement analysis, confidentiality agreement review, NDA AI tool, free NDA analysis, mutual NDA review, unilateral NDA"
        canonical="https://legalchatai.com/nda-analyzer"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free NDA Analyzer - AI Non-Disclosure Agreement Analysis Tool",
          "description": "Free AI-powered NDA analyzer for comprehensive non-disclosure agreement review. Analyze confidentiality clauses, identify risks, and get expert insights instantly.",
          "url": "https://legalchatai.com/nda-analyzer",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "NDA Analyzer AI Tool",
            "applicationCategory": "Legal Technology",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free NDA analysis and review"
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
                "name": "NDA Analyzer",
                "item": "https://legalchatai.com/nda-analyzer"
              }
            ]
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Lock className="w-4 h-4 mr-2" />
              Free NDA Analysis Tool
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-purple-600">Free NDA Analyzer</span>
              <br />
              AI Non-Disclosure Agreement Review
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Upload your <strong>NDA or confidentiality agreement</strong> for instant AI analysis. 
              Our legal AI identifies confidentiality gaps, analyzes mutual vs unilateral terms, 
              and provides expert insights on your non-disclosure agreement.
            </h2>

            {/* Upload Tool */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-purple-300 p-8">
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Lock className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Upload Your NDA for Free AI Analysis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get instant analysis of confidentiality clauses, scope limitations, and legal compliance
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => {
                        const guestDocs = sessionStorage.getItem('guestDocuments');
                        const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                        window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                      }}
                    >
                      Analyze My NDA
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Chat with AI
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Supports PDF, Word files • No signup required • Enterprise-grade security
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Confidentiality Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Mutual vs Unilateral</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Scope Review</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Risk Assessment</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is NDA Analysis */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is AI NDA Analysis?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI NDA analyzer uses advanced natural language processing to review 
              non-disclosure agreements and identify key terms, risks, and compliance issues.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confidentiality Scope Analysis</h3>
              <p className="text-gray-600 mb-4">
                AI analyzes the scope of confidential information, identifies overly broad or narrow definitions, 
                and ensures your confidentiality agreement provides adequate protection.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Information definition clarity</li>
                <li>• Scope limitations assessment</li>
                <li>• Protection adequacy review</li>
                <li>• Standard exceptions analysis</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mutual vs Unilateral Review</h3>
              <p className="text-gray-600 mb-4">
                Identifies whether your NDA is mutual (both parties bound) or unilateral (one-way), 
                analyzes fairness, and highlights any imbalanced obligations.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Reciprocity analysis</li>
                <li>• Obligation balance review</li>
                <li>• Party-specific terms</li>
                <li>• Fairness assessment</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Duration & Term Analysis</h3>
              <p className="text-gray-600 mb-4">
                Reviews confidentiality duration, survival clauses, and termination provisions 
                to ensure reasonable timeframes and clear obligations.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Duration reasonableness</li>
                <li>• Survival clause review</li>
                <li>• Termination conditions</li>
                <li>• Return obligations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key NDA Elements Analyzed */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Key NDA Elements Our AI Analyzes
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive review of all critical non-disclosure agreement components
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Definition of Confidential Information</h4>
                <p className="text-gray-600 text-sm">Scope, specificity, and adequacy of confidential information definitions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Permitted Disclosures & Exceptions</h4>
                <p className="text-gray-600 text-sm">Standard exceptions, carve-outs, and permitted disclosure scenarios</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Obligations & Restrictions</h4>
                <p className="text-gray-600 text-sm">Use restrictions, protection standards, and confidentiality obligations</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Duration & Survival</h4>
                <p className="text-gray-600 text-sm">Confidentiality period, survival clauses, and time limitations</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Return or Destruction</h4>
                <p className="text-gray-600 text-sm">Information return requirements and destruction obligations</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Remedies & Enforcement</h4>
                <p className="text-gray-600 text-sm">Breach remedies, injunctive relief, and enforcement mechanisms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Use Our Free NDA Analyzer?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get professional-grade NDA analysis in seconds, identify risks before signing, 
              and ensure your confidentiality agreements provide adequate protection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Businesses</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Protect Trade Secrets</h4>
                    <p className="text-gray-600 text-sm">Ensure your NDAs adequately protect proprietary information and trade secrets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Due Diligence Ready</h4>
                    <p className="text-gray-600 text-sm">Prepare robust NDAs for M&A, partnerships, and investor discussions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Employee Agreements</h4>
                    <p className="text-gray-600 text-sm">Review employee confidentiality agreements and non-disclosure terms</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Individuals</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Employment NDAs</h4>
                    <p className="text-gray-600 text-sm">Understand NDAs from employers and identify overly restrictive terms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Freelance Projects</h4>
                    <p className="text-gray-600 text-sm">Review client NDAs and ensure fair confidentiality terms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Startup Founders</h4>
                    <p className="text-gray-600 text-sm">Protect your startup ideas in investor and partnership discussions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                How Our NDA Analyzer Works
              </h2>
              <p className="text-xl text-gray-600">
                Get comprehensive NDA analysis in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-purple-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Your NDA</h3>
                <p className="text-gray-600">
                  Upload your non-disclosure agreement in PDF, Word, or text format. 
                  Our AI processes the document securely.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-purple-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h3>
                <p className="text-gray-600">
                  Our legal AI analyzes confidentiality clauses, identifies risks, 
                  and reviews all key NDA components in seconds.
                </p>
              </div>

              <div className="text-center">
                <div className="p-4 bg-purple-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Insights</h3>
                <p className="text-gray-600">
                  Receive detailed analysis, risk assessment, and recommendations 
                  for your non-disclosure agreement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions About NDA Analysis
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What types of NDAs can your AI analyze?</h3>
              <p className="text-gray-600">Our AI can analyze all types of non-disclosure agreements including mutual NDAs, unilateral NDAs, employee confidentiality agreements, vendor NDAs, and investor confidentiality agreements.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is the NDA analysis really free?</h3>
              <p className="text-gray-600">Yes, our NDA analyzer is completely free with no hidden costs. You can upload and analyze up to 3 NDAs without any signup required.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is AI NDA analysis?</h3>
              <p className="text-gray-600">Our AI achieves 95%+ accuracy in identifying key NDA terms, confidentiality clauses, and potential risks. However, always consult a lawyer for important legal decisions.</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I trust AI for NDA review?</h3>
              <p className="text-gray-600">Our AI provides professional-grade analysis to help you understand your NDA, but it should supplement, not replace, legal counsel for important agreements.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Analyze Your NDA for Free?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Get instant AI analysis of your non-disclosure agreement. Identify risks, 
              review confidentiality clauses, and ensure adequate protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                onClick={() => {
                  const guestDocs = sessionStorage.getItem('guestDocuments');
                  const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                  window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                }}
              >
                Analyze My NDA Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                onClick={() => window.location.href = '/documents'}
              >
                Upload Documents
              </button>
            </div>
            <p className="text-purple-200 text-sm mt-4">
              No signup required • Enterprise-grade security • Used by 10,000+ professionals
            </p>
          </div>
        </section>

        {/* Related Tools */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Related Legal AI Tools
            </h2>
            <p className="text-xl text-gray-600">
              Explore our other free legal analysis tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Risk Assessment</h3>
              <p className="text-gray-600 mb-4">Comprehensive risk analysis for all types of contracts and agreements.</p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => window.location.href = '/contract-risk-assessment'}
              >
                Analyze Contract Risk →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Agreement Analysis</h3>
              <p className="text-gray-600 mb-4">Specialized analysis for employment contracts and workplace agreements.</p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => window.location.href = '/employment-agreement-analysis'}
              >
                Analyze Employment Terms →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Free Legal AI Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our AI assistant about any legal document or question.</p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
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

export default NDAAnalyzerPage;