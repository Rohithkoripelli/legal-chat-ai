// src/pages/articles/NDAAnalysisPage.tsx
import React from 'react';
import { DocumentHead } from '../../components/SEO/DocumentHead';
import { ArrowLeft, Clock, FileText, CheckCircle, Brain, Download, Share2, Shield, AlertTriangle, Users } from 'lucide-react';

const NDAAnalysisPage: React.FC = () => {
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
    const file = new Blob([`NDA Analysis Guide: AI-Powered Non-Disclosure Agreement Review

Published: June 15, 2025 | Reading Time: 10 minutes

Non-Disclosure Agreements (NDAs) are among the most commonly used legal documents in business, yet they're often signed without proper analysis. A poorly structured NDA can expose your business to significant risks or fail to protect your valuable confidential information. This comprehensive guide will help you understand, analyze, and optimize NDAs using AI-powered tools.

[Full article content would be included here in a production implementation]

Visit https://www.legalchatai.com/contract-analysis to try our AI tools.
`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'nda-analysis-guide-2025.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NDA Analysis Guide: AI-Powered Non-Disclosure Agreement Review',
        text: 'Master NDA analysis with AI tools, risk identification, and negotiation strategies.',
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
        title="NDA Analysis Guide: AI-Powered Non-Disclosure Agreement Review | LegalAI"
        description="Master NDA analysis with AI tools, risk identification, and negotiation strategies. Complete guide to understanding, analyzing, and optimizing NDAs."
        keywords="NDA analysis, non-disclosure agreement review, confidentiality agreement analysis, NDA risks, AI legal tools"
        canonical="https://www.legalchatai.com/resources/nda-analysis-guide"
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
                Contract Analysis
              </span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                10 min read
              </div>
              <span>Published: June 15, 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              NDA Analysis Guide: AI-Powered Review
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Master NDA analysis with AI tools, risk identification, and negotiation strategies. 
              This comprehensive guide will help you understand, analyze, and optimize NDAs using AI-powered tools.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Guide
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </button>
              <button
                onClick={() => window.location.href = '/nda-analyzer'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-4 h-4 mr-2" />
                Analyze NDA with AI
              </button>
            </div>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300" style={{width: '0%'}} id="reading-progress"></div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <article className="prose prose-lg prose-purple max-w-none">
            
            {/* Master NDA Analysis Overview */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-purple-900 mb-4">Master NDA Analysis</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Types of NDAs and when to use each</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Critical elements of effective NDAs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Red flags and problematic terms</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Industry-specific considerations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>AI-powered risk assessment</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>Negotiation strategies and best practices</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                What is an NDA and Why Does It Matter?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                A Non-Disclosure Agreement (NDA), also called a confidentiality agreement, is a legal contract 
                that establishes confidential relationships between parties. It ensures that information shared 
                during business discussions, partnerships, or employment relationships remains private and protected.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                The Cost of Poor NDA Management
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-red-900 mb-4">Business Risks Without Proper NDAs</h4>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span><strong>Trade secret theft</strong>: Average loss of $12 million per incident</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Competitive disadvantage from leaked strategies</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Loss of patent eligibility for disclosed inventions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Damage to business relationships and reputation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Legal disputes and litigation costs</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h4 className="font-bold text-purple-900 mb-4">Statistics That Matter</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Use NDAs regularly</span>
                      <span className="text-sm font-bold text-purple-600">87%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Professionally reviewed</span>
                      <span className="text-sm font-bold text-red-600">23%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Theft via ex-employees</span>
                      <span className="text-sm font-bold text-orange-600">45%</span>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-xs text-gray-600">Avg. litigation cost</span><br />
                      <span className="text-sm font-bold text-red-600">$750K-$2.5M</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Types of NDAs: Understanding Your Options</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Unilateral (One-Way) NDA</h3>
                      <p className="text-sm text-gray-600 mb-4">Single direction information sharing</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-blue-900 mb-3">📋 When to Use:</p>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-white rounded-lg border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Interviewing potential employees</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Discussions with potential investors</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Vendor evaluations and RFP processes</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Customer demonstrations of proprietary technology</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-blue-900 mb-3">⚡ Key Characteristics:</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-lg border border-blue-200">
                        <span className="text-sm text-gray-700">• Only one party discloses confidential information</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-blue-200">
                        <span className="text-sm text-gray-700">• Simpler structure and terms</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-blue-200">
                        <span className="text-sm text-gray-700">• Easier to negotiate and implement</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-blue-200">
                        <span className="text-sm text-gray-700">• Lower risk for the disclosing party</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 border border-blue-300">
                    <p className="text-blue-800 font-medium text-sm">
                      📝 <strong>Example:</strong> A startup pitching to potential investors would use a unilateral NDA to protect their business plan and financial projections.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Bilateral (Mutual) NDA</h3>
                      <p className="text-sm text-gray-600 mb-4">Two-way information exchange</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-purple-900 mb-3">📋 When to Use:</p>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Joint ventures and partnerships</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Merger and acquisition discussions</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Technology licensing negotiations</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Strategic alliance formations</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-sm font-medium text-purple-900 mb-3">⚡ Key Characteristics:</p>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm text-gray-700">• Both parties exchange confidential information</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm text-gray-700">• More complex terms and obligations</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm text-gray-700">• Requires careful balance of interests</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-purple-200">
                        <span className="text-sm text-gray-700">• Higher negotiation complexity</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Critical Elements of an Effective NDA</h2>
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  Definition of Confidential Information
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-indigo-900 mb-4">✅ Comprehensive Definition Should Include:</p>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Technical data, algorithms, and source code</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Business plans, strategies, and financial information</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Customer lists, pricing, and market research</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Personnel information and organizational charts</span>
                      </div>
                      <div className="flex items-start p-3 bg-white rounded-lg border border-indigo-200">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Any information marked as "confidential" or "proprietary"</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-red-900 mb-4">⚠️ Common Pitfalls to Avoid:</p>
                    <div className="space-y-3">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-bold text-red-800 mb-1">Too Broad</p>
                        <p className="text-xs text-red-700">"All information exchanged" may be unenforceable</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-bold text-red-800 mb-1">Too Narrow</p>
                        <p className="text-xs text-red-700">May leave important information unprotected</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm font-bold text-red-800 mb-1">Vague Language</p>
                        <p className="text-xs text-red-700">Unclear definitions lead to disputes</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 mt-6 border border-green-300">
                  <p className="text-green-800 font-medium text-sm">
                    🤖 <strong>AI Analysis Tip:</strong> Use AI tools to compare your confidentiality definitions against industry standards and identify potential gaps or overreach.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Permitted Uses and Restrictions</h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    Clearly Define Permitted Uses
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Evaluation for potential business relationship</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Performance of specific contracted services</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Due diligence for investment or acquisition</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">Development of joint products or services</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    Common Restrictions
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">No reverse engineering or decompilation</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">No disclosure to third parties without consent</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">No use for competitive advantage</span>
                    </div>
                    <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 font-medium">No independent development of similar solutions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="text-red-600">🚩</span> Red Flags: Problematic NDA Terms
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    ⚠️ Overly Broad Definitions
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-orange-900 mb-4">🔍 Warning Signs:</p>
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">"All information disclosed" language</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">No specific categories or examples</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Unlimited scope and duration</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Vague or ambiguous terminology</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-4">💥 Why It's Problematic:</p>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm text-red-800 font-medium">May be unenforceable in court</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm text-red-800 font-medium">Creates unnecessary legal risk</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm text-red-800 font-medium">Inhibits normal business operations</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm text-red-800 font-medium">Damages business relationships</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    ⚠️ Unreasonable Restrictions
                  </h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-4">📋 Problematic Clauses:</p>
                      <div className="space-y-3">
                        <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Perpetual non-compete provisions</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Restrictions on hiring or recruiting</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Overly broad non-solicitation terms</span>
                        </div>
                        <div className="flex items-start p-3 bg-white rounded-lg border border-red-200">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">Unlimited liability and damages</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-red-900 mb-4">🏢 Business Impact:</p>
                      <div className="space-y-3">
                        <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                          <span className="text-sm text-red-800 font-medium">Limits future business opportunities</span>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                          <span className="text-sm text-red-800 font-medium">Restricts talent acquisition</span>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                          <span className="text-sm text-red-800 font-medium">Creates ongoing legal exposure</span>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                          <span className="text-sm text-red-800 font-medium">May violate employment laws</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">AI-Powered NDA Analysis</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    Automated Risk Assessment
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-3">AI Can Identify:</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Unusual or non-standard terms</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Missing critical provisions</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Inconsistent or contradictory clauses</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Industry-specific compliance issues</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-3">Risk Scoring Factors:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">High Risk</span>
                          <span className="text-xs text-red-600">Overly broad scope, unlimited liability</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Medium Risk</span>
                          <span className="text-xs text-yellow-600">Unclear definitions, missing exclusions</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Low Risk</span>
                          <span className="text-xs text-green-600">Standard terms, balanced obligations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    Comparative Analysis
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-3">AI Benchmarking Against:</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Industry standard agreements</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Comparable deal terms and structures</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Regulatory requirements and best practices</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Historical negotiation outcomes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Industry-Specific NDA Considerations</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    Technology and Software
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm font-medium text-purple-900 mb-3">Special Protections Needed:</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Source code and algorithms</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Technical specifications and documentation</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">User data and analytics</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">API specifications and integration methods</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-sm font-medium text-purple-900 mb-3">Key Clauses:</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">No reverse engineering provisions</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Open source software considerations</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Data privacy and security requirements</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-700">Intellectual property ownership clarifications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    Healthcare and Life Sciences
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-sm font-medium text-orange-900 mb-3">Regulatory Compliance:</p>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">HIPAA privacy requirements</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">FDA confidentiality regulations</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Clinical trial data protection</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Patient information safeguards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">NDA Negotiation Strategies</h2>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    Preparation Phase
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-indigo-200">
                    <p className="text-sm font-medium text-indigo-900 mb-4">Before Negotiation:</p>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white font-bold text-xs">1</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Identify your priorities</p>
                          <p className="text-xs text-gray-600">What information needs protection?</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white font-bold text-xs">2</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Understand counterparty needs</p>
                          <p className="text-xs text-gray-600">What are their concerns?</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white font-bold text-xs">3</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Research industry standards</p>
                          <p className="text-xs text-gray-600">What's typical for similar deals?</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 bg-indigo-50 rounded-lg">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white font-bold text-xs">4</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Set negotiation boundaries</p>
                          <p className="text-xs text-gray-600">What terms are non-negotiable?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4 mt-6 border border-blue-300">
                    <p className="text-blue-800 font-medium text-sm">
                      🤖 <strong>AI Assistance:</strong> Use AI tools to analyze similar NDAs in your industry and identify common negotiation points and outcomes.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    Key Negotiation Points
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm font-medium text-green-900 mb-4">Scope and Definition:</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Narrow definitions to specific information types</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Include reasonable exclusions and limitations</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Balance protection with operational flexibility</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">Consider future business relationship needs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Implementation and Management</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    NDA Management System
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Centralized storage and tracking</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Regular review and update procedures</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Compliance monitoring and reporting</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Training and awareness programs</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    Key Stakeholders
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Legal team for review and approval</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">Business teams for operational compliance</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">IT team for security implementation</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg border border-purple-200">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">HR team for employee training</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Common NDA Mistakes and How to Avoid Them</h2>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border border-red-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    ❌ Mistake 1: Using Generic Templates
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm font-medium text-red-900 mb-2">The Problem:</p>
                      <p className="text-sm text-gray-700">One-size-fits-all NDAs don't address specific business needs or industry requirements.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-red-200">
                      <p className="text-sm font-medium text-green-700 mb-2">The Solution:</p>
                      <p className="text-sm text-gray-700">Customize NDAs for specific relationships, industries, and information types using AI-powered tools.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    ❌ Mistake 2: Inadequate Definition of Confidential Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm font-medium text-red-900 mb-2">The Problem:</p>
                      <p className="text-sm text-gray-700">Vague or overly broad definitions lead to disputes and enforceability issues.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-orange-200">
                      <p className="text-sm font-medium text-green-700 mb-2">The Solution:</p>
                      <p className="text-sm text-gray-700">Create specific, detailed definitions that clearly identify protected information categories.</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                    ❌ Mistake 3: Ignoring Practical Implementation
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm font-medium text-red-900 mb-2">The Problem:</p>
                      <p className="text-sm text-gray-700">NDAs that can't be practically implemented or monitored in daily business operations.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <p className="text-sm font-medium text-green-700 mb-2">The Solution:</p>
                      <p className="text-sm text-gray-700">Consider operational realities and create implementable processes and procedures.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 mb-8 border border-purple-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Conclusion</h2>
              
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-lg p-6 border border-purple-200">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    NDAs are critical business tools that require careful analysis and management. While they protect 
                    valuable confidential information, poorly structured NDAs can create significant risks and business 
                    limitations. By leveraging AI-powered analysis tools and following best practices, you can create 
                    effective NDAs that balance protection with operational flexibility.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border border-purple-200">
                  <p className="text-lg font-bold text-gray-900 mb-4">Key Takeaways:</p>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-xs">1</span>
                      </div>
                      <p className="text-gray-700"><strong>Customize for your needs:</strong> Generic templates rarely provide adequate protection</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-xs">2</span>
                      </div>
                      <p className="text-gray-700"><strong>Balance protection and flexibility:</strong> Overly restrictive NDAs can harm business relationships</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-xs">3</span>
                      </div>
                      <p className="text-gray-700"><strong>Use AI for efficiency:</strong> Automate analysis and monitoring while maintaining legal oversight</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-xs">4</span>
                      </div>
                      <p className="text-gray-700"><strong>Plan for implementation:</strong> Consider practical aspects of compliance and enforcement</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                        <span className="text-white font-bold text-xs">5</span>
                      </div>
                      <p className="text-gray-700"><strong>Regular review and updates:</strong> Keep NDAs current with business and legal changes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </article>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your NDAs?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Upload your current NDAs to our AI analysis platform and get detailed insights, risk assessments, 
              and improvement recommendations in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/nda-analyzer'}
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Analyze NDA with AI
              </button>
              <button
                onClick={() => window.location.href = '/resources'}
                className="inline-flex items-center px-6 py-3 bg-purple-500/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-purple-500/30 transition-colors border-2 border-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                More Legal Guides
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
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Read Guide →
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">Startup Legal Checklist</h4>
                <p className="text-gray-600 text-sm mb-4">8-phase legal compliance guide for startups with AI tools.</p>
                <button
                  onClick={() => window.location.href = '/resources/startup-legal-checklist'}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Read Guide →
                </button>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-2">AI vs Human Review</h4>
                <p className="text-gray-600 text-sm mb-4">Comprehensive comparison with ROI calculations and best practices.</p>
                <button
                  onClick={() => window.location.href = '/resources/ai-vs-human-legal-review'}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
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

export default NDAAnalysisPage;