// frontend/src/components/auth/LegalPages.tsx - UPDATED WITH ROUTER
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, FileText, Users, Lock, Globe, Eye, Heart, AlertTriangle, 
  ArrowRight, CheckCircle, Star, Mail, User, Crown
} from 'lucide-react';

// Privacy Policy Component
export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

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

          {/* Back to Home Button */}
          <div className="text-center py-8 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Us Component
export const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();

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

          {/* Back to Home Button */}
          <div className="text-center py-8 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Terms of Service Component
export const TermsOfServicePage: React.FC = () => {
  const navigate = useNavigate();

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

            {/* Important Disclaimers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Important Legal Disclaimers</h2>
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
                  </ul>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Privacy and Data Handling</h2>
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

          {/* Back to Home Button */}
          <div className="text-center py-8 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};