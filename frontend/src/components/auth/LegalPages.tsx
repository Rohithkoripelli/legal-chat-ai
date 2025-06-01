import React from 'react';
import { Shield, Mail, User, FileText, Eye, Lock, Globe, CheckCircle, ArrowRight, Users, Star, Heart, AlertTriangle } from 'lucide-react';

// Privacy Policy Component
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
                <p className="text-blue-100 text-lg">Protecting your data and privacy</p>
              </div>
            </div>
            <p className="text-blue-100">
              <strong>Effective Date:</strong> January 1, 2025 | <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-12">
            {/* Introduction */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  Welcome to LegalChatAI ("we," "our," or "us"). We are committed to protecting your privacy 
                  and ensuring the security of your personal information. This Privacy Policy explains how we 
                  collect, use, store, and protect your information when you use our AI-powered legal document 
                  analysis platform.
                </p>
                <p>
                  By using LegalChatAI, you agree to the collection and use of information in accordance with 
                  this Privacy Policy. We encourage you to read this policy carefully to understand our practices 
                  regarding your personal data.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 font-medium">
                    🔒 <strong>Your Privacy Matters:</strong> We use enterprise-grade security measures including 
                    AES-256 encryption, secure data transmission, and strict access controls to protect your 
                    legal documents and personal information.
                  </p>
                </div>
              </div>
            </section>

            {/* What Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">What Information We Collect</h2>
              </div>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Account Information:</strong> Email address, name, and authentication data when you create an account</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Profile Data:</strong> Optional profile information you choose to provide</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Communication Data:</strong> Messages, feedback, and support communications</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Document and Usage Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Legal Documents:</strong> Documents you upload for analysis (temporarily processed and securely deleted)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Chat History:</strong> Conversations with our AI assistant for improving service quality</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Usage Analytics:</strong> Platform usage patterns, feature interactions, and performance metrics</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Device Information:</strong> Browser type, operating system, device identifiers</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Log Data:</strong> IP addresses, access times, pages viewed, and referring URLs</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Cookies:</strong> Authentication tokens, preferences, and analytics cookies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Service Delivery</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• AI-powered document analysis</li>
                      <li>• Legal chat assistance</li>
                      <li>• Document risk assessment</li>
                      <li>• Platform functionality</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Account Management</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• User authentication</li>
                      <li>• Account security</li>
                      <li>• Preference management</li>
                      <li>• Customer support</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Platform Improvement</h3>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• AI model training</li>
                      <li>• Feature development</li>
                      <li>• Performance optimization</li>
                      <li>• Bug fixes and updates</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Legal Compliance</h3>
                    <ul className="text-sm text-orange-800 space-y-1">
                      <li>• GDPR compliance</li>
                      <li>• Data protection regulations</li>
                      <li>• Security monitoring</li>
                      <li>• Fraud prevention</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
                <p className="text-gray-700 mb-6">
                  Under data protection laws (including GDPR), you have the following rights regarding your personal information:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">Right to Access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">Right to Rectification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">Right to Erasure</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">Right to Data Portability</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">Right to Object</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-gray-900">Right to Restrict Processing</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
                  <p className="text-sm text-gray-700">
                    <strong>Exercise Your Rights:</strong> To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:reddyrohith705@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-medium">
                      reddyrohith705@gmail.com
                    </a>
                    . We will respond to your request within 30 days.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Lock className="h-6 w-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, provide 
                  functionality, and analyze usage patterns. You can control cookie preferences through 
                  your browser settings.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-sm text-gray-600">Required for platform functionality and security</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-gray-600">Help us understand usage patterns and improve our service</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Preference Cookies</h3>
                    <p className="text-sm text-gray-600">Remember your settings and personalize your experience</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Changes to This Privacy Policy</h2>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or for other operational reasons. When we make changes:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>We will update the "Last Updated" date at the top of this policy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>We will notify users of significant changes via email or platform notification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ArrowRight className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Continued use of our service constitutes acceptance of the updated policy</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
                <p className="text-blue-100 mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Mail className="h-6 w-6" />
                  <a href="mailto:reddyrohith705@gmail.com" className="text-xl font-semibold hover:text-blue-200 transition-colors">
                    reddyrohith705@gmail.com
                  </a>
                </div>
                <p className="text-sm text-blue-200">
                  We're committed to transparency and will respond to your privacy inquiries promptly.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Us Component
export const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">About LegalChatAI</h1>
                <p className="text-green-100 text-lg">Revolutionizing legal document analysis with AI</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-12">
            {/* Mission */}
            <section>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  To democratize legal technology and make professional-grade document analysis 
                  accessible to everyone through the power of artificial intelligence.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-green-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Accessible</h3>
                    <p className="text-sm text-gray-600">Free AI-powered legal analysis for everyone</p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-teal-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Professional</h3>
                    <p className="text-sm text-gray-600">Enterprise-grade accuracy and security</p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">User-Focused</h3>
                    <p className="text-sm text-gray-600">Built with users' needs at the center</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Story */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  LegalChatAI was born from the recognition that legal document analysis should be accessible 
                  to everyone, not just those who can afford expensive legal fees. Traditional legal document 
                  review is time-consuming, costly, and often results in missed critical details that could 
                  impact important decisions.
                </p>
                <p>
                  Our platform leverages cutting-edge artificial intelligence and natural language processing 
                  to provide instant, professional-grade analysis of legal documents. Whether you're a small 
                  business owner reviewing a contract, a startup analyzing terms of service, or an individual 
                  understanding a legal agreement, our AI assistant provides the insights you need.
                </p>
                <p>
                  We believe that technology should empower people to make better-informed decisions about 
                  their legal matters, while always emphasizing the importance of professional legal counsel 
                  for critical decisions.
                </p>
              </div>
            </section>

            {/* What We Do */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Document Analysis</h3>
                  </div>
                  <p className="text-gray-700">
                    Our advanced AI analyzes legal documents to identify key terms, potential risks, 
                    compliance issues, and provides plain-English explanations of complex legal language.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Legal AI Assistant</h3>
                  </div>
                  <p className="text-gray-700">
                    Chat with our intelligent AI assistant to get answers about your documents, 
                    understand specific clauses, and receive guidance on potential issues.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
                  </div>
                  <p className="text-gray-700">
                    Comprehensive risk analysis that identifies potentially problematic clauses, 
                    missing terms, and areas that may require legal attention.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Secure Platform</h3>
                  </div>
                  <p className="text-gray-700">
                    Enterprise-grade security with AES-256 encryption, GDPR compliance, 
                    and strict data protection measures to keep your documents safe.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Technology */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Technology</h2>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Powered by Advanced AI</h3>
                  <p className="text-gray-700 max-w-2xl mx-auto">
                    Our platform utilizes state-of-the-art artificial intelligence and machine learning 
                    technologies to provide accurate, reliable legal document analysis.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">GPT-4</div>
                    <div className="text-sm text-gray-600">Advanced Language Model</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">NLP</div>
                    <div className="text-sm text-gray-600">Natural Language Processing</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">ML</div>
                    <div className="text-sm text-gray-600">Machine Learning</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-indigo-200">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">OCR</div>
                    <div className="text-sm text-gray-600">Document Recognition</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Meet the Creator */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet the Creator</h2>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Rohith Koripelli</h3>
                    <p className="text-blue-100 text-lg mb-4">Founder & Lead Developer</p>
                    <p className="text-blue-100 leading-relaxed mb-6">
                      Rohith is a passionate technologist and entrepreneur with a vision to make legal 
                      technology accessible to everyone. With expertise in AI, machine learning, and 
                      software engineering, he designed LegalChatAI to bridge the gap between complex 
                      legal documents and user understanding.
                    </p>
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                      <Mail className="h-5 w-5" />
                      <a 
                        href="mailto:reddyrohith705@gmail.com" 
                        className="text-blue-200 hover:text-white transition-colors font-medium"
                      >
                        reddyrohith705@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Commitment */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Always Free Core Features</h3>
                      <p className="text-gray-700">Our fundamental AI document analysis will always remain free for everyone.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                      <p className="text-gray-700">Your documents and data are processed securely and never used for training or shared.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Continuous Improvement</h3>
                      <p className="text-gray-700">We constantly enhance our AI models and platform based on user feedback and technological advances.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">User-Centric Design</h3>
                      <p className="text-gray-700">Every feature is designed with our users' needs and feedback at the forefront.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ethical AI</h3>
                      <p className="text-gray-700">We're committed to responsible AI development and transparent practices.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                      <Globe className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Global Accessibility</h3>
                      <p className="text-gray-700">Making legal technology accessible worldwide, regardless of location or economic status.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section className="bg-gradient-to-r from-green-600 to-teal-700 rounded-xl p-8 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-green-100 mb-6">
                  Have questions, feedback, or suggestions? We'd love to hear from you!
                </p>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Mail className="h-6 w-6" />
                  <a href="mailto:reddyrohith705@gmail.com" className="text-xl font-semibold hover:text-green-200 transition-colors">
                    reddyrohith705@gmail.com
                  </a>
                </div>
                <p className="text-sm text-green-200">
                  We typically respond within 24 hours and value every piece of feedback.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terms of Service Component
export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <p className="text-purple-100 text-lg">Legal terms and conditions</p>
              </div>
            </div>
            <p className="text-purple-100">
              <strong>Effective Date:</strong> January 1, 2025 | <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-12 space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Introduction and Acceptance</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  Welcome to LegalChatAI. These Terms of Service ("Terms") govern your use of our AI-powered 
                  legal document analysis platform and services. By accessing or using LegalChatAI, you agree 
                  to be bound by these Terms.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
                  <p className="text-purple-800 font-medium">
                    📋 <strong>Important:</strong> Please read these terms carefully before using our service. 
                    If you do not agree to these terms, please do not use LegalChatAI.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Service Description</h2>
              <div className="space-y-4">
                <p className="text-gray-700">LegalChatAI provides:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">AI Document Analysis</h3>
                    <p className="text-sm text-blue-800">Automated analysis of legal documents using artificial intelligence</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Legal AI Assistant</h3>
                    <p className="text-sm text-green-800">Interactive chat interface for document-related questions</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Risk Assessment</h3>
                    <p className="text-sm text-purple-800">Identification of potential legal risks and issues</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-900 mb-2">Document Generation</h3>
                    <p className="text-sm text-orange-800">AI-powered creation of legal document templates</p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Responsibilities</h2>
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4">You agree to:</h3>
                  <ul className="space-y-2 text-yellow-800">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>Use the service only for lawful purposes</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>Provide accurate information when using our services</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>Respect intellectual property rights</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>Not attempt to reverse engineer or hack our systems</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>Not upload malicious or harmful content</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Important Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Important Legal Disclaimers</h2>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-3">NOT LEGAL ADVICE</h3>
                    <p className="text-red-800 leading-relaxed">
                      LegalChatAI provides <strong>informational content only</strong> and does not constitute legal advice. 
                      Our AI analysis should not replace consultation with qualified legal professionals. Always consult 
                      with a licensed attorney for legal matters and important decisions.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 text-red-800">
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>AI analysis may contain errors or omissions</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>Results should be verified by qualified legal professionals</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ArrowRight className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>We are not responsible for decisions made based on AI analysis</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Privacy and Data Handling</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-4">
                  Your privacy is important to us. Our data handling practices include:
                </p>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Documents are processed securely and temporarily</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>We do not store document content permanently</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>User data is not used for AI training without consent</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>GDPR and data protection compliance</span>
                  </li>
                </ul>
                <p className="text-sm text-blue-700 mt-4">
                  For detailed information, please review our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Limitation of Liability</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, LEGALCHATAI AND ITS CREATOR SHALL NOT BE LIABLE 
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS 
                  OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 text-sm">
                    <strong>Use at Your Own Risk:</strong> You acknowledge that use of AI analysis tools 
                    carries inherent risks and that you use our service at your own discretion and risk.
                  </p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Intellectual Property</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">Our Rights</h3>
                  <p className="text-sm text-green-800">
                    LegalChatAI platform, AI models, and associated technology are our intellectual property
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Rights</h3>
                  <p className="text-sm text-blue-800">
                    You retain all rights to documents you upload and analysis results you receive
                  </p>
                </div>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Service Availability</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <p className="text-orange-800">
                  While we strive for high availability, we cannot guarantee uninterrupted service. 
                  We reserve the right to modify, suspend, or discontinue services with or without notice.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Changes to Terms</h2>
              <div className="prose prose-lg text-gray-700 leading-relaxed">
                <p>
                  We may update these Terms from time to time. Significant changes will be communicated 
                  via email or platform notification. Continued use of our service after changes 
                  constitutes acceptance of the updated terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl p-8 text-white">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Questions About Terms?</h2>
                <p className="text-purple-100 mb-6">
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Mail className="h-6 w-6" />
                  <a href="mailto:reddyrohith705@gmail.com" className="text-xl font-semibold hover:text-purple-200 transition-colors">
                    reddyrohith705@gmail.com
                  </a>
                </div>
                <p className="text-sm text-purple-200">
                  We're here to help clarify any questions about our terms and policies.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component with Links
export const FooterWithLegalLinks: React.FC<{
  onPrivacyClick: () => void;
  onAboutClick: () => void;
  onTermsClick: () => void;
}> = ({ onPrivacyClick, onAboutClick, onTermsClick }) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">LegalChatAI</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              AI-powered legal document analysis platform. Get instant insights, risk assessments, 
              and professional-grade contract analysis for free.
            </p>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Contact: </span>
              <a href="mailto:reddyrohith705@gmail.com" className="text-blue-600 hover:text-blue-800 text-sm">
                reddyrohith705@gmail.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><button className="hover:text-blue-600 transition-colors">Document Analysis</button></li>
              <li><button className="hover:text-blue-600 transition-colors">AI Chat Assistant</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Risk Assessment</button></li>
              <li><button className="hover:text-blue-600 transition-colors">Document Generator</button></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button 
                  onClick={onPrivacyClick}
                  className="hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onTermsClick}
                  className="hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={onAboutClick}
                  className="hover:text-blue-600 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li><button className="hover:text-blue-600 transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © 2025 LegalChatAI. Created by Rohith Koripelli. All rights reserved.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md">
              <p className="text-xs text-yellow-800 text-center">
                ⚖️ <strong>Disclaimer:</strong> For informational purposes only. Not legal advice. 
                Consult qualified attorneys for legal matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};