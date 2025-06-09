// src/pages/EmploymentAgreementAnalysisPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, Users, Briefcase, Clock, DollarSign, AlertCircle, Award, Lock, Globe } from 'lucide-react';

const EmploymentAgreementAnalysisPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Free Employment Agreement Analysis | AI Employment Contract Review"
        description="Free AI-powered employment agreement analysis. Upload employment contracts for instant analysis of terms, benefits, non-compete clauses, and compensation review."
        keywords="employment agreement analysis, employment contract review, AI employment analysis, job contract analysis, non-compete analysis, employment terms review"
        canonical="https://legalchatai.com/employment-agreement-analysis"
      />

      {/* Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free Employment Agreement Analysis - AI Employment Contract Review",
          "description": "Professional employment agreement analysis powered by AI. Review employment contracts, analyze terms, benefits, and identify potential issues with instant AI analysis.",
          "url": "https://legalchatai.com/employment-agreement-analysis",
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "Employment Agreement Analysis Tool",
            "applicationCategory": "Legal Technology",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free employment contract analysis"
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
                "name": "Employment Agreement Analysis",
                "item": "https://legalchatai.com/employment-agreement-analysis"
              }
            ]
          }
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              Employment Contract Analysis
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Free Employment Agreement</span>
              <br />
              AI Contract Analysis
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get <strong>professional employment contract analysis</strong> powered by advanced AI. 
              Upload job offers, employment agreements, or workplace contracts for instant analysis 
              of compensation, benefits, non-compete clauses, and employment terms.
            </h2>

            {/* Upload Tool */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-blue-300 p-8">
                <div className="text-center">
                  <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Upload Employment Contract for Analysis
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get comprehensive analysis of salary, benefits, terms, and potential red flags
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => {
                        const guestDocs = sessionStorage.getItem('guestDocuments');
                        const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                        window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                      }}
                    >
                      Analyze Employment Terms
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button 
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => window.location.href = '/chat'}
                    >
                      Chat About Contract
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    All formats supported • No signup required • Confidential analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Compensation Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Benefits Review</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Non-Compete Check</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Terms Evaluation</span>
              </div>
            </div>
          </div>
        </div>

        {/* What is Employment Agreement Analysis */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What is AI Employment Agreement Analysis?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI employment contract analyzer uses advanced technology to review 
              employment agreements and identify key terms, benefits, risks, and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compensation & Benefits Analysis</h3>
              <p className="text-gray-600 mb-4">
                AI analyzes salary structure, bonus programs, equity compensation, benefits packages, 
                and compares against market standards to ensure fair compensation.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Base salary evaluation</li>
                <li>• Bonus structure analysis</li>
                <li>• Equity & stock options review</li>
                <li>• Benefits package assessment</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Work Terms & Conditions</h3>
              <p className="text-gray-600 mb-4">
                Reviews work schedule, remote work policies, vacation time, probationary periods, 
                and other employment conditions to identify potential concerns.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Work schedule & hours</li>
                <li>• Remote work provisions</li>
                <li>• Vacation & leave policies</li>
                <li>• Probationary terms</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-red-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Restrictive Covenants Review</h3>
              <p className="text-gray-600 mb-4">
                Analyzes non-compete clauses, non-disclosure agreements, non-solicitation terms, 
                and intellectual property assignments for reasonableness and enforceability.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Non-compete clause analysis</li>
                <li>• Non-disclosure obligations</li>
                <li>• Non-solicitation terms</li>
                <li>• IP assignment clauses</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Employment Terms */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Key Employment Terms We Analyze
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive review of all critical employment agreement components
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Compensation</h4>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Base salary amount</li>
                  <li>• Bonus structure</li>
                  <li>• Commission rates</li>
                  <li>• Salary review schedule</li>
                  <li>• Overtime provisions</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Benefits</h4>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Health insurance</li>
                  <li>• Retirement plans</li>
                  <li>• Vacation time</li>
                  <li>• Sick leave</li>
                  <li>• Stock options</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Work Terms</h4>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Job responsibilities</li>
                  <li>• Work schedule</li>
                  <li>• Remote work policy</li>
                  <li>• Probationary period</li>
                  <li>• Performance reviews</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Restrictions</h4>
                </div>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Non-compete clauses</li>
                  <li>• Confidentiality terms</li>
                  <li>• Non-solicitation</li>
                  <li>• IP assignments</li>
                  <li>• Termination clauses</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Red Flags Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Employment Contract Red Flags We Detect
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI identifies potential problems in employment agreements that could 
              impact your career, compensation, or future opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-xl p-8 border border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                High-Risk Terms
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Overly Broad Non-Compete</h4>
                    <p className="text-gray-600 text-sm">Non-compete clauses that are too restrictive in scope, duration, or geography</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Below-Market Compensation</h4>
                    <p className="text-gray-600 text-sm">Salary or benefits significantly below industry standards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Unfair Termination Terms</h4>
                    <p className="text-gray-600 text-sm">At-will termination without severance or unreasonable termination clauses</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Excessive IP Assignment</h4>
                    <p className="text-gray-600 text-sm">Overly broad intellectual property assignment clauses</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-8 border border-yellow-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
                Moderate Concerns
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Unclear Performance Metrics</h4>
                    <p className="text-gray-600 text-sm">Vague or subjective performance evaluation criteria</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Limited Benefits</h4>
                    <p className="text-gray-600 text-sm">Minimal health insurance, vacation time, or retirement benefits</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Long Probationary Period</h4>
                    <p className="text-gray-600 text-sm">Unusually long probationary periods without job security</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Inflexible Work Arrangements</h4>
                    <p className="text-gray-600 text-sm">No remote work options or rigid scheduling requirements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Analyze Your Employment Agreement?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Make informed decisions about job offers and protect your career interests 
                with professional employment contract analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">For Job Seekers</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Negotiate Better Terms</h4>
                      <p className="text-gray-600 text-sm">Identify areas for negotiation and improve your employment package</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Understand Restrictions</h4>
                      <p className="text-gray-600 text-sm">Know your obligations and restrictions before signing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Protect Future Opportunities</h4>
                      <p className="text-gray-600 text-sm">Ensure terms don't limit your future career prospects</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Compare Job Offers</h4>
                      <p className="text-gray-600 text-sm">Make informed decisions when comparing multiple job offers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">For Current Employees</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Review Existing Contracts</h4>
                      <p className="text-gray-600 text-sm">Understand your current employment terms and obligations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Prepare for Promotions</h4>
                      <p className="text-gray-600 text-sm">Review contract updates for promotions or role changes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Plan Career Moves</h4>
                      <p className="text-gray-600 text-sm">Understand restrictions before making career changes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Know Your Rights</h4>
                      <p className="text-gray-600 text-sm">Understand your rights regarding termination, benefits, and more</p>
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
              How Employment Agreement Analysis Works
            </h2>
            <p className="text-xl text-gray-600">
              Professional contract analysis in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Contract</h3>
              <p className="text-gray-600 text-sm">
                Securely upload your employment agreement, job offer, 
                or contract amendment for analysis.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Advanced AI analyzes compensation, benefits, restrictions, 
                and identifies potential concerns or opportunities.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive evaluation of contract terms with 
                red flag identification and risk scoring.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Report</h3>
              <p className="text-gray-600 text-sm">
                Receive detailed analysis with recommendations 
                for negotiation and decision-making.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Employment Contract Analysis FAQ
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What employment documents can you analyze?</h3>
                <p className="text-gray-600">We can analyze all types of employment documents including job offers, employment contracts, amendments, non-compete agreements, and severance packages.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How detailed is the compensation analysis?</h3>
                <p className="text-gray-600">Our AI provides comprehensive compensation analysis including base salary, bonuses, equity, benefits valuation, and comparison against market benchmarks for your role and location.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can you help identify unfair non-compete clauses?</h3>
                <p className="text-gray-600">Yes, our AI analyzes non-compete clauses for reasonableness in scope, duration, and geography, and flags potentially unenforceable or overly restrictive terms.</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is my employment contract data secure?</h3>
                <p className="text-gray-600">Absolutely. We use enterprise-grade security with encryption and strict privacy policies. Your employment information is processed securely and never stored permanently.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Analyze Your Employment Agreement?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Upload your employment contract now for instant AI analysis. 
              Get insights on compensation, benefits, restrictions, and negotiation opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                onClick={() => {
                  const guestDocs = sessionStorage.getItem('guestDocuments');
                  const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                  window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                }}
              >
                Analyze Employment Terms
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                onClick={() => window.location.href = '/documents'}
              >
                Upload Contract
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              No signup required • Confidential analysis • Used by 25,000+ professionals
            </p>
          </div>
        </section>

        {/* Related Tools */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Related Legal Analysis Tools
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive legal analysis for all your contract needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contract Risk Assessment</h3>
              <p className="text-gray-600 mb-4">Professional risk analysis with scoring and mitigation recommendations.</p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => window.location.href = '/contract-risk-assessment'}
              >
                Assess Contract Risk →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NDA Analysis</h3>
              <p className="text-gray-600 mb-4">Specialized analysis for employment-related confidentiality agreements.</p>
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => window.location.href = '/nda-analyzer'}
              >
                Analyze NDAs →
              </button>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Free Legal AI Chat</h3>
              <p className="text-gray-600 mb-4">Chat with our AI about employment law questions and contract concerns.</p>
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

export default EmploymentAgreementAnalysisPage;