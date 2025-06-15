// src/pages/articles/StartupLegalChecklistPage.tsx
import React from 'react';
import { DocumentHead } from '../../components/SEO/DocumentHead';
import { ArrowLeft, Clock, FileText, CheckCircle, Brain, Download, Share2, Shield, AlertTriangle, Users } from 'lucide-react';

const StartupLegalChecklistPage: React.FC = () => {
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      const progressBar = document.getElementById('reading-progress');
      if (progressBar) {
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleDownloadPDF = () => {
    const element = document.createElement('a');
    const file = new Blob([`The Complete Legal Checklist for Startups in 2025: AI-Powered Legal Compliance

Published: June 15, 2025 | Reading Time: 12 minutes

Starting a business is exciting, but navigating the legal requirements can be overwhelming. According to a 2024 study, 60% of startups face legal issues within their first two years, often due to incomplete or incorrect legal documentation. This comprehensive checklist will help you establish a solid legal foundation for your startup while leveraging AI tools to reduce costs and complexity.

[Full article content would be included here in a production implementation]

Visit https://www.legalchatai.com/contract-analysis to try our AI tools.
`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'startup-legal-checklist-2025.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'The Complete Legal Checklist for Startups in 2025',
        text: 'Comprehensive legal compliance guide for startups. From business formation to IP protection.',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <DocumentHead
        title="Complete Legal Checklist for Startups 2025 | AI-Powered Compliance | LegalAI"
        description="Comprehensive legal compliance guide for startups. From business formation to IP protection, this 12-minute guide covers everything you need to build a legally sound startup."
        keywords="startup legal checklist, business formation legal requirements, startup compliance, legal documents for startups, startup legal guide"
        canonical="https://www.legalchatai.com/resources/startup-legal-checklist"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => window.location.href = '/resources'}
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                Startup Legal
              </span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                12 min read
              </div>
              <span>Published: June 15, 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The Complete Legal Checklist for Startups in 2025
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Comprehensive legal compliance guide for startups. From business formation to IP protection, 
              this guide covers everything you need to build a legally sound startup while leveraging AI tools 
              to reduce costs and complexity.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Checklist
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </button>
              <button
                onClick={() => window.location.href = '/contract-analysis'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-4 h-4 mr-2" />
                Try AI Tools
              </button>
            </div>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-300" style={{width: '0%'}} id="reading-progress"></div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <article className="prose prose-lg prose-green max-w-none">
            
            {/* 8-Phase Overview */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-green-900 mb-4">8-Phase Legal Foundation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Business formation and structure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Foundational legal documents</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Intellectual property protection</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Customer contracts and agreements</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Employment and HR compliance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Financial and tax obligations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Insurance and risk management</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Data protection and privacy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Legal Compliance Matters for Startups</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">The Cost of Getting It Wrong</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Average legal dispute cost</span>
                        <span className="text-sm font-bold text-red-600">$45K-$150K</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Regulatory penalty range</span>
                        <span className="text-sm font-bold text-red-600">$5K-$500K+</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Time lost to legal issues</span>
                        <span className="text-sm font-bold text-red-600">3-6 months</span>
                      </div>
                    </div>
                    <div className="bg-red-100 rounded-lg p-4 border border-red-300">
                      <div className="text-center">
                        <p className="text-xs text-red-700 mb-1">Investor Due Diligence</p>
                        <p className="text-lg font-bold text-red-800">73% cite legal compliance as top factor</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">The Benefits of Getting It Right</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Attract investors with confidence</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Protect personal assets</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Avoid costly legal disputes</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Scale business operations smoothly</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Build customer and partner trust</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Phase 1:</span> Business Formation and Structure
              </h2>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Business Entity</h3>
              
              <div className="grid gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">LLC (Limited Liability Company)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-2">✅ Best For</p>
                          <p className="text-sm text-gray-700">Solo founders, service businesses, simple structures</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-green-700 mb-2">✅ Pros</p>
                          <p className="text-sm text-gray-700">Simple management, tax flexibility, personal liability protection</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Cons</p>
                          <p className="text-sm text-gray-700">Limited investment options, self-employment taxes</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-sm font-medium text-purple-700 mb-2">💰 Cost</p>
                          <p className="text-sm text-gray-700">$50-$500 state filing fee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Corporation (C-Corp)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-900 mb-2">✅ Best For</p>
                          <p className="text-sm text-gray-700">Venture-backed startups, multiple founders, equity compensation</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-green-700 mb-2">✅ Pros</p>
                          <p className="text-sm text-gray-700">Investor-friendly, stock options, perpetual existence</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Cons</p>
                          <p className="text-sm text-gray-700">Double taxation, complex compliance requirements</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                          <p className="text-sm font-medium text-purple-700 mb-2">💰 Cost</p>
                          <p className="text-sm text-gray-700">$100-$800 state filing fee + ongoing compliance costs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">S-Corporation</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-sm font-medium text-green-900 mb-2">✅ Best For</p>
                          <p className="text-sm text-gray-700">Small profitable businesses, avoiding self-employment taxes</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-sm font-medium text-green-700 mb-2">✅ Pros</p>
                          <p className="text-sm text-gray-700">Pass-through taxation, salary savings</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-sm font-medium text-red-700 mb-2">⚠️ Cons</p>
                          <p className="text-sm text-gray-700">Ownership restrictions, limited to 100 shareholders</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <p className="text-sm font-medium text-purple-700 mb-2">💰 Cost</p>
                          <p className="text-sm text-gray-700">$100-$800 filing fee + tax elections</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    Register Your Business Name
                  </h3>
                  
                  <p className="text-gray-700 mb-4 font-medium">Steps to Complete:</p>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Check name availability</p>
                        <p className="text-xs text-gray-600">with your state's business registry</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Conduct trademark search</p>
                        <p className="text-xs text-gray-600">using USPTO database</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Register domain & social media</p>
                        <p className="text-xs text-gray-600">secure your online presence</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-xs">4</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">File Articles of Incorporation</p>
                        <p className="text-xs text-gray-600">official business registration</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white font-bold text-xs">5</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Consider trademark registration</p>
                        <p className="text-xs text-gray-600">$225-$400 per class</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 mt-6 border border-blue-300">
                    <p className="text-blue-800 font-medium text-sm">
                      💡 <strong>Pro Tip:</strong> Use AI legal tools to quickly search for potential naming conflicts and trademark issues across multiple databases.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    Required Licenses & Permits
                  </h3>
                  
                  <p className="text-gray-700 mb-4 font-medium">Common Requirements:</p>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Business license (city/county level)</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Professional licenses (if applicable)</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Industry-specific permits</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Sales tax permit (if selling products)</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-indigo-200">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Employer Identification Number (EIN)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Phase 2:</span> Foundational Legal Documents
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    Operating Agreement (LLC) or Bylaws (Corporation)
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-4">🎯 Why It's Critical:</p>
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Defines ownership percentages and voting rights</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Establishes management structure and decision-making processes</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Prevents disputes between founders</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Required by many banks and investors</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-4">📋 Key Provisions to Include:</p>
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Member/shareholder rights and responsibilities</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Profit and loss distribution</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Management structure and voting procedures</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Transfer restrictions and buyout provisions</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Dissolution procedures</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm font-medium text-blue-900 mb-4">💰 Cost Comparison:</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="text-center">
                          <p className="text-sm font-bold text-red-800">Attorney-drafted</p>
                          <p className="text-lg font-bold text-red-600">$2,000-$5,000</p>
                          <p className="text-xs text-red-600">Premium quality</p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="text-center">
                          <p className="text-sm font-bold text-yellow-800">AI-assisted + Review</p>
                          <p className="text-lg font-bold text-yellow-600">$500-$1,500</p>
                          <p className="text-xs text-yellow-600">Best value</p>
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="text-center">
                          <p className="text-sm font-bold text-orange-800">DIY templates</p>
                          <p className="text-lg font-bold text-orange-600">$50-$200</p>
                          <p className="text-xs text-orange-600">Higher risk</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    Founders' Agreement
                  </h3>
                  
                  <p className="text-sm font-medium text-green-900 mb-4">🔑 Essential Elements:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Equity distribution and vesting schedules</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Roles and responsibilities of each founder</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Decision-making authority and dispute resolution</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Intellectual property assignment</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Confidentiality and non-compete provisions</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Exit procedures and buyout terms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Phase 3:</span> Intellectual Property Protection
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    Trademark Your Brand
                  </h3>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-purple-900 mb-4">™ What to Trademark:</p>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700 font-medium">Business name and tagline</span>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700 font-medium">Logo and brand designs</span>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700 font-medium">Product names</span>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700 font-medium">Domain names (if distinctive)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-purple-900 mb-4">📅 Timeline and Costs:</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm font-medium text-gray-700">Filing fee</span>
                        <span className="text-sm font-bold text-purple-600">$225-$400 per class</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm font-medium text-gray-700">Processing time</span>
                        <span className="text-sm font-bold text-purple-600">8-12 months</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm font-medium text-gray-700">Attorney fees</span>
                        <span className="text-sm font-bold text-purple-600">$1,000-$2,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-300">
                    <p className="text-blue-800 font-medium text-sm">
                      🤖 <strong>AI Assistance:</strong> Use AI tools to conduct comprehensive trademark searches and assess registration likelihood before filing.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    Copyright Protection
                  </h3>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-green-900 mb-4">© Automatically Protected:</p>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Website content and marketing materials</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Software code and documentation</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Creative works and designs</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 font-medium">Training materials and processes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-100 rounded-lg p-4 border border-green-300">
                    <div className="text-center">
                      <p className="text-sm font-bold text-green-800 mb-1">✨ Automatic Protection</p>
                      <p className="text-xs text-green-700">No registration required - protection starts immediately upon creation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Phase 4:</span> Employment and HR Compliance
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <Shield className="w-6 h-6 text-red-600" />
                    </div>
                    Employment Law Compliance
                  </h3>
                  
                  <p className="text-sm font-medium text-red-900 mb-4">📜 Required Policies:</p>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Equal employment opportunity (EEO) policy</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Anti-harassment and discrimination policy</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Workplace safety procedures (OSHA compliance)</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Leave policies (FMLA, state-specific requirements)</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Social media and technology use policies</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    Employee Benefits and Equity
                  </h3>
                  
                  <p className="text-sm font-medium text-blue-900 mb-4">🎁 Common Benefits to Consider:</p>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Health insurance options</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Retirement plans (401k, Simple IRA)</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Flexible work arrangements</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Professional development budgets</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Employee stock option plans (ESOPs)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Using AI to Streamline</span> Legal Compliance
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Brain className="w-6 h-6 text-green-600" />
                    </div>
                    AI-Powered Document Creation
                  </h3>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-green-900 mb-4">✨ Benefits of AI Legal Tools:</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-gray-700">Speed</span>
                        <span className="text-sm font-bold text-green-600">Minutes vs Hours</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-gray-700">Cost</span>
                        <span className="text-sm font-bold text-green-600">80-90% Less</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-gray-700">Built on thousands of legal templates</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-green-200">
                        <span className="text-sm font-medium text-gray-700">Tailored to your specific business needs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-4">🛠️ What AI Can Help With:</p>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Terms of service and privacy policies</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Employment agreements and handbooks</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Customer contracts and NDAs</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Vendor agreements and purchase orders</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-green-200">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Corporate resolutions and board minutes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    When to Still Use Attorneys
                  </h3>
                  
                  <p className="text-sm font-medium text-orange-900 mb-4">⚖️ Complex Matters Requiring Legal Counsel:</p>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Raising venture capital or angel investment</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Mergers, acquisitions, and strategic partnerships</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Intellectual property disputes and litigation</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Regulatory investigations and compliance issues</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Complex employment law matters</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6 border border-yellow-300">
                <p className="text-yellow-800 font-medium text-center">
                  ⚖️ <strong>Best Practice:</strong> Use AI for routine documents and attorney review for complex, high-stakes matters.
                </p>
              </div>
            </div>

            <h2>Cost-Effective Legal Strategies for Startups</h2>

            <h3>Budget-Friendly Approaches</h3>

            <h4>Phase 1: Bootstrap Stage (0-6 months)</h4>
            <ul>
              <li>Use AI tools for basic document creation</li>
              <li>Leverage free government resources and guides</li>
              <li>Join entrepreneur organizations for legal workshops</li>
              <li>Consider legal aid clinics for basic advice</li>
            </ul>

            <h4>Phase 2: Early Growth (6-18 months)</h4>
            <ul>
              <li>Retain attorney for specific high-risk matters</li>
              <li>Use AI + limited legal review for complex documents</li>
              <li>Invest in comprehensive insurance coverage</li>
              <li>Implement robust record-keeping systems</li>
            </ul>

            <h4>Phase 3: Scale Preparation (18+ months)</h4>
            <ul>
              <li>Establish ongoing legal counsel relationship</li>
              <li>Implement enterprise-grade compliance systems</li>
              <li>Consider in-house legal resources</li>
              <li>Prepare for investment and growth legal needs</li>
            </ul>

            <h2>Conclusion: Building a Strong Legal Foundation</h2>
            <p>
              Legal compliance isn't just about avoiding problems—it's about creating a foundation for 
              sustainable growth and success. By following this comprehensive checklist and leveraging 
              AI tools to reduce costs and complexity, you can establish a legally sound startup that 
              attracts investors, protects stakeholders, and scales effectively.
            </p>

            <p><strong>Key Takeaways</strong>:</p>
            <ol>
              <li><strong>Start early</strong>: Address legal requirements from day one</li>
              <li><strong>Use technology</strong>: Leverage AI tools to reduce costs and improve efficiency</li>
              <li><strong>Stay current</strong>: Laws and regulations change frequently</li>
              <li><strong>Seek help</strong>: Know when to consult with legal professionals</li>
              <li><strong>Document everything</strong>: Maintain thorough records and documentation</li>
            </ol>

          </article>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Your Legal Foundation?</h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Use our AI-powered legal tools to create, analyze, and manage your startup's legal documents 
              efficiently and affordably.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/contract-analysis'}
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Brain className="w-4 h-4 mr-2" />
                Start Legal Analysis
              </button>
              <button
                onClick={() => window.location.href = '/resources'}
                className="inline-flex items-center px-6 py-3 bg-green-500/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-green-500/30 transition-colors border-2 border-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                More Resources
              </button>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">AI Contract Analysis</h4>
                <p className="text-gray-600 text-sm mb-4">Complete guide to AI contract analysis and cost savings.</p>
                <button
                  onClick={() => window.location.href = '/resources/ai-contract-analysis-guide'}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Read Guide →
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">NDA Analysis Guide</h4>
                <p className="text-gray-600 text-sm mb-4">Master NDA analysis with AI tools and negotiation strategies.</p>
                <button
                  onClick={() => window.location.href = '/resources/nda-analysis-guide'}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Read Guide →
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">AI vs Human Review</h4>
                <p className="text-gray-600 text-sm mb-4">Comprehensive comparison with ROI calculations and best practices.</p>
                <button
                  onClick={() => window.location.href = '/resources/ai-vs-human-legal-review'}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Read Guide →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartupLegalChecklistPage;