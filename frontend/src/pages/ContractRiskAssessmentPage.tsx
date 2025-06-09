// src/pages/ContractRiskAssessmentPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, AlertTriangle, TrendingUp, Target, DollarSign, Clock, Award, Users } from 'lucide-react';

const ContractRiskAssessmentPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Free Contract Risk Assessment | AI Legal Risk Analysis Tool"
        description="Free AI-powered contract risk assessment tool. Upload contracts for instant risk analysis, liability evaluation, and compliance scoring. Identify potential legal risks before signing."
        keywords="contract risk assessment, legal risk analysis, contract risk tool, AI risk assessment, liability analysis, contract compliance, free risk analysis"
        canonical="https://legalchatai.com/contract-risk-assessment"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free Contract Risk Assessment - AI Legal Risk Analysis Tool",
          "description": "Professional contract risk assessment powered by AI. Analyze legal documents for risks, liability exposure, and compliance issues with instant scoring.",
          "url": "https://legalchatai.com/contract-risk-assessment",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "Contract Risk Assessment Tool",
            "applicationCategory": "Legal Technology",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free contract risk assessment and analysis"
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
                "name": "Contract Risk Assessment",
                "item": "https://legalchatai.com/contract-risk-assessment"
              }
            ]
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Contract Risk Analysis
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-red-600">Free Contract Risk Assessment</span>
              <br />
              AI Legal Risk Analysis Tool
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get <strong>professional contract risk assessment</strong> powered by advanced AI. 
              Upload any legal contract for instant risk scoring, liability analysis, 
              and comprehensive risk evaluation with actionable insights.
            </h2>

            {/* Upload Tool */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-red-300 p-8">
                <div className="text-center">
                  <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Upload Contract for Risk Assessment
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get instant risk scoring, liability analysis, and compliance evaluation
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => {
                        const guestDocs = sessionStorage.getItem('guestDocuments');
                        const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                        window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                      }}
                    >
                      Assess Contract Risk
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Chat About Risks
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    All contract types supported • No signup required • Instant risk scoring
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Risk Scoring</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Liability Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Compliance Check</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Risk Mitigation</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is Contract Risk Assessment */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is AI Contract Risk Assessment?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI contract risk assessment uses advanced machine learning to evaluate 
              legal documents and identify potential risks, liabilities, and compliance issues.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-red-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Scoring & Evaluation</h3>
              <p className="text-gray-600 mb-4">
                AI analyzes contract terms and assigns comprehensive risk scores based on 
                liability exposure, unfavorable clauses, and potential legal issues.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Overall risk score (0-100)</li>
                <li>• Category-specific risk levels</li>
                <li>• Risk trend analysis</li>
                <li>• Comparative risk benchmarking</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-orange-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Liability & Exposure Analysis</h3>
              <p className="text-gray-600 mb-4">
                Identifies potential liability exposures, indemnification clauses, 
                limitation of liability provisions, and financial risk factors.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Liability cap analysis</li>
                <li>• Indemnification review</li>
                <li>• Financial exposure assessment</li>
                <li>• Insurance requirement evaluation</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Legal Review</h3>
              <p className="text-gray-600 mb-4">
                Evaluates compliance with legal standards, regulatory requirements, 
                and industry best practices to identify potential violations.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Regulatory compliance check</li>
                <li>• Legal standard verification</li>
                <li>• Industry requirement review</li>
                <li>• Best practice comparison</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Risk Categories */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Contract Risk Categories We Analyze
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive risk assessment across all critical contract areas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Financial Risk</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">Payment terms, penalties, liability caps, and financial obligations</p>
                <div className="flex items-center text-red-600 text-sm">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                  High Impact Risk Category
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Liability Risk</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">Indemnification, limitation clauses, and liability exposure</p>
                <div className="flex items-center text-orange-600 text-sm">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                  High Impact Risk Category
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Performance Risk</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">Delivery deadlines, performance standards, and penalties</p>
                <div className="flex items-center text-yellow-600 text-sm">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                  Medium Impact Risk Category
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Compliance Risk</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">Regulatory requirements, legal standards, and governance</p>
                <div className="flex items-center text-blue-600 text-sm">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                  Medium Impact Risk Category
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <AlertTriangle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Operational Risk</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">Termination clauses, renewal terms, and operational constraints</p>
                <div className="flex items-center text-green-600 text-sm">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  Low-Medium Impact Risk
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Relationship Risk</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">Dispute resolution, communication requirements, and relationship terms</p>
                <div className="flex items-center text-purple-600 text-sm">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                  Low-Medium Impact Risk
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Scoring System */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Risk Scoring System
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional risk assessment with clear scoring and actionable recommendations 
              for contract risk management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-4">0-30</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Low Risk</h3>
                <p className="text-gray-700 mb-6">
                  Minimal legal risks identified. Contract terms are generally favorable 
                  with standard industry protections.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Favorable terms</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Standard protections</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Minimal liability exposure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-200">
              <div className="text-center">
                <div className="text-6xl font-bold text-yellow-600 mb-4">31-70</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Medium Risk</h3>
                <p className="text-gray-700 mb-6">
                  Some risks identified that require attention. Review recommended 
                  before signing. Consider negotiations.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <span>Review recommended</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <span>Consider negotiations</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <span>Moderate liability exposure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 border-2 border-red-200">
              <div className="text-center">
                <div className="text-6xl font-bold text-red-600 mb-4">71-100</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">High Risk</h3>
                <p className="text-gray-700 mb-6">
                  Significant risks identified. Legal review strongly recommended 
                  before signing. Major negotiations needed.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <span>Legal review required</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <span>Major negotiations needed</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <span>High liability exposure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-red-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Use Contract Risk Assessment?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Identify risks before they become problems. Make informed decisions 
                with professional risk analysis and actionable insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Business Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Avoid Costly Legal Issues</h4>
                      <p className="text-gray-600 text-sm">Identify potential problems before signing and avoid expensive legal disputes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Negotiate Better Terms</h4>
                      <p className="text-gray-600 text-sm">Use risk insights to negotiate more favorable contract terms and conditions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Reduce Liability Exposure</h4>
                      <p className="text-gray-600 text-sm">Understand and mitigate potential liability exposures and financial risks</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Compliance Assurance</h4>
                      <p className="text-gray-600 text-sm">Ensure contracts meet regulatory requirements and industry standards</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Risk Management</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Early Risk Detection</h4>
                      <p className="text-gray-600 text-sm">Identify risks early in the contract review process for proactive management</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Risk Prioritization</h4>
                      <p className="text-gray-600 text-sm">Focus on the most critical risks with AI-powered prioritization and scoring</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Mitigation Strategies</h4>
                      <p className="text-gray-600 text-sm">Get actionable recommendations for risk mitigation and contract improvements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Portfolio Risk Management</h4>
                      <p className="text-gray-600 text-sm">Assess risk across multiple contracts for comprehensive risk management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How Contract Risk Assessment Works
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI analysis in four comprehensive steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-red-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Contract</h3>
              <p className="text-gray-600 text-sm">
                Upload your contract or legal document securely. 
                All file types supported with enterprise security.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-red-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Risk Analysis</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI analyzes contract terms, clauses, 
                and identifies potential risks across multiple categories.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-red-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Scoring</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive risk scoring with category breakdowns 
                and comparative analysis against industry standards.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-red-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Report</h3>
              <p className="text-gray-600 text-sm">
                Detailed risk assessment report with mitigation 
                recommendations and actionable insights.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Contract Risk Assessment FAQ
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate is AI risk assessment?</h3>
                <p className="text-gray-600">Our AI achieves 94%+ accuracy in risk identification and scoring, trained on thousands of contracts and legal precedents. However, always consult legal counsel for high-stakes decisions.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What types of contracts can be assessed?</h3>
                <p className="text-gray-600">We can assess all types of contracts including service agreements, NDAs, employment contracts, purchase agreements, leases, and complex commercial contracts.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How is the risk score calculated?</h3>
                <p className="text-gray-600">Risk scores are calculated using machine learning models that analyze contract terms, liability exposures, compliance factors, and industry benchmarks to provide comprehensive risk evaluation.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I get risk mitigation recommendations?</h3>
                <p className="text-gray-600">Yes, our assessment includes specific recommendations for risk mitigation, contract improvements, and negotiation strategies to reduce identified risks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-orange-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Assess Your Contract Risk?
            </h2>
            <p className="text-xl text-red-100 mb-8">
              Upload your contract now for instant AI-powered risk assessment. 
              Get risk scoring, liability analysis, and mitigation recommendations in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                onClick={() => {
                  const guestDocs = sessionStorage.getItem('guestDocuments');
                  const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                  window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                }}
              >
                Assess Contract Risk Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
                onClick={() => window.location.href = '/documents'}
              >
                Upload Documents
              </button>
            </div>
            <p className="text-red-200 text-sm mt-4">
              No signup required • Professional risk analysis • Used by 20,000+ professionals
            </p>
          </div>
        </section>

        {/* Related Tools */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Related Risk Analysis Tools
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive legal analysis for all your contract needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Document Review</h3>
              <p className="text-gray-600 mb-4">Comprehensive document review with detailed analysis and recommendations.</p>
              <button 
                className="text-red-600 hover:text-red-800 font-medium"
                onClick={() => window.location.href = '/legal-document-review'}
              >
                Start Document Review →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NDA Risk Analysis</h3>
              <p className="text-gray-600 mb-4">Specialized risk assessment for non-disclosure and confidentiality agreements.</p>
              <button 
                className="text-red-600 hover:text-red-800 font-medium"
                onClick={() => window.location.href = '/nda-analyzer'}
              >
                Analyze NDA Risk →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment Contract Analysis</h3>
              <p className="text-gray-600 mb-4">Risk assessment for employment agreements and workplace contracts.</p>
              <button 
                className="text-red-600 hover:text-red-800 font-medium"
                onClick={() => window.location.href = '/employment-agreement-analysis'}
              >
                Analyze Employment Risk →
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContractRiskAssessmentPage;