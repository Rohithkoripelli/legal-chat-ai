// src/pages/StartupLegalDocumentsPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { FileText, CheckCircle, Star, ArrowRight, Shield, Zap, BarChart3, Rocket, Users, DollarSign, Globe, Target, Award, TrendingUp } from 'lucide-react';

const StartupLegalDocumentsPage: React.FC = () => {
  return (
    <>
      <DocumentHead
        title="Startup Legal Documents | AI Analysis for Founding Agreements & Equity"
        description="Free AI analysis for startup legal documents. Review founder agreements, equity contracts, investor terms, and startup contracts with professional AI analysis."
        keywords="startup legal documents, founder agreement analysis, equity contract review, startup AI analysis, investor agreement review, startup legal AI"
        canonical="https://legalchatai.com/startup-legal-documents"
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              Startup Legal Analysis
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-purple-600">Startup Legal Documents</span>
              <br />
              AI Analysis & Review
            </h1>
            
            <h2 className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Get <strong>professional startup legal document analysis</strong> powered by AI. 
              Review founder agreements, equity contracts, investor terms, and startup legal documents 
              with instant analysis and risk assessment.
            </h2>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-purple-300 p-8">
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Rocket className="h-10 w-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Upload Startup Documents for AI Analysis
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                      onClick={() => {
                        const guestDocs = sessionStorage.getItem('guestDocuments');
                        const hasDocuments = guestDocs && JSON.parse(guestDocs).length > 0;
                        window.location.href = hasDocuments ? '/guest-contract-analysis' : '/documents';
                      }}
                    >
                      Analyze Startup Documents
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Founder Agreements</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Equity Analysis</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">Investor Terms</span>
              </div>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-700">IP Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Types */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Startup Legal Documents We Analyze
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Founder & Equity Documents</h3>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Founder agreements & partnerships</li>
                <li>• Equity distribution & vesting</li>
                <li>• Stock option plans</li>
                <li>• Buy-sell agreements</li>
                <li>• Co-founder separation terms</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment & Funding</h3>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Term sheets & investment agreements</li>
                <li>• SAFE & convertible note agreements</li>
                <li>• Shareholder agreements</li>
                <li>• Board resolutions</li>
                <li>• Voting agreements</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="p-3 bg-green-100 rounded-lg w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">IP & Employment</h3>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• IP assignment agreements</li>
                <li>• Employee stock option plans</li>
                <li>• Consultant agreements</li>
                <li>• Non-disclosure agreements</li>
                <li>• Employment contracts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Analyze Your Startup Documents?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Upload your startup legal documents for instant AI analysis and protect your venture.
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
                Analyze Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StartupLegalDocumentsPage;