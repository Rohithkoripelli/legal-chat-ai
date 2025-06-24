// src/pages/ResourcesPage.tsx
import React from 'react';
import { DocumentHead } from '../components/SEO/DocumentHead';
import { BookOpen, FileText, Clock, ArrowRight, Users, Brain, CheckCircle, Shield, Download } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const articles = [
    {
      id: 'ai-contract-analysis-guide',
      title: 'AI Contract Analysis: Complete Guide for 2025',
      description: 'Learn how AI is revolutionizing contract analysis, reducing costs by 90% and improving efficiency. Complete guide with real-world examples and implementation strategies.',
      readTime: '8 min read',
      category: 'AI Technology',
      tags: ['Contract Analysis', 'AI', 'Legal Tech'],
      featured: true,
      content: `/content/ai-contract-analysis-guide.md`
    },
    {
      id: 'startup-legal-checklist',
      title: 'The Complete Legal Checklist for Startups in 2025',
      description: 'Comprehensive legal compliance guide for startups. From business formation to IP protection, this 12-minute guide covers everything you need to build a legally sound startup.',
      readTime: '12 min read',
      category: 'Startup Legal',
      tags: ['Startup', 'Compliance', 'Legal Checklist'],
      featured: true,
      content: `/content/startup-legal-checklist.md`
    },
    {
      id: 'nda-analysis-guide',
      title: 'NDA Analysis Guide: AI-Powered Non-Disclosure Agreement Review',
      description: 'Master the art of NDA analysis with AI tools. Learn to identify risks, negotiate better terms, and protect your confidential information effectively.',
      readTime: '10 min read',
      category: 'Contract Analysis',
      tags: ['NDA', 'Confidentiality', 'Risk Assessment'],
      featured: true,
      content: `/content/nda-analysis-guide.md`
    },
    {
      id: 'ai-vs-human-legal-review',
      title: 'AI vs Human Legal Review: Complete Comparison Guide 2025',
      description: 'Comprehensive comparison of AI and human legal review. Learn when to use AI, when to use attorneys, and how to combine both for optimal results.',
      readTime: '11 min read',
      category: 'Legal Technology',
      tags: ['AI vs Human', 'Legal Review', 'ROI'],
      featured: true,
      content: `/content/ai-vs-human-legal-review.md`
    }
  ];

  const categories = [
    { name: 'All Resources', count: articles.length, active: true },
    { name: 'AI Technology', count: articles.filter(a => a.category === 'AI Technology' || a.category === 'Legal Technology').length },
    { name: 'Startup Legal', count: articles.filter(a => a.category === 'Startup Legal').length },
    { name: 'Contract Analysis', count: articles.filter(a => a.category === 'Contract Analysis').length }
  ];

  return (
    <>
      <DocumentHead
        title="Legal AI Resources & Guides | Free Legal Knowledge Base | LegalAI"
        description="Comprehensive collection of legal AI guides, startup legal checklists, contract analysis resources, and expert insights. Free legal knowledge base for businesses."
        keywords="legal AI resources, legal guides, startup legal checklist, contract analysis guide, legal knowledge base, legal AI tools"
        canonical="https://www.legalchatai.com/resources"
        jsonLD={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Legal AI Resources & Guides",
          "description": "Comprehensive legal AI resource center with guides, tools, and expert insights",
          "url": "https://www.legalchatai.com/resources"
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center text-white">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4 mr-2" />
                Free Legal Resources
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Legal AI Knowledge Base
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Expert guides, comprehensive checklists, and in-depth analysis to help you navigate 
                legal complexity with AI-powered tools and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <button
                  onClick={() => document.getElementById('resources-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Resources
                </button>
                <button
                  onClick={() => window.location.href = '/guest-contract-analysis'}
                  className="bg-blue-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-500/30 transition-colors border-2 border-white/20 hover:border-white/40"
                >
                  Try AI Tools
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{articles.length}+</div>
                <div className="text-gray-600">Expert Guides</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Free Access</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Pages of Content</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-2">AI-Powered</div>
                <div className="text-gray-600">Insights</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category.active
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Featured Articles Grid */}
          <div id="resources-grid" className="grid lg:grid-cols-2 gap-8 mb-16">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {article.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        window.location.href = `/resources/${article.id}`;
                      }}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Read Full Guide
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Put Knowledge into Action?</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Use our AI-powered legal tools to analyze your contracts, generate documents, and manage legal compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/guest-contract-analysis'}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Brain className="w-4 h-4 mr-2" />
                Analyze Documents with AI
              </button>
              <button
                onClick={() => window.location.href = '/chat'}
                className="inline-flex items-center px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-blue-500/30 transition-colors border-2 border-white/20"
              >
                <Users className="w-4 h-4 mr-2" />
                Chat with Legal AI
              </button>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gray-50 border-t border-gray-200 py-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4 mr-2" />
              100% Free • No Credit Card Required
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Using AI for Your Legal Needs Today
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses using our AI-powered legal tools to save time, reduce costs, and make better decisions.
            </p>
            <button
              onClick={() => window.location.href = '/documents'}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Upload Your First Document Free
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourcesPage;