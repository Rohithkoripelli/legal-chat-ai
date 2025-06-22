// ContractAnalysisResults.tsx
import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Users, 
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  AlertCircle,
  Info,
  Building,
  Eye,
  Scale,
  Lock,
  UserX,
  Zap,
  Hand,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface ContractAnalysisResultsProps {
  analysis: {
    documentName: string;
    riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
    executiveSummary: {
      overview: string;
      keyDates: Array<{
        date: string;
        description: string;
        importance: 'HIGH' | 'MEDIUM' | 'LOW';
      }>;
      obligations: Array<{
        party: string;
        obligation: string;
        deadline?: string;
      }>;
      recommendedActions: string[];
    };
    contractSnapshot: {
      title: string;
      contractType: string;
      effectiveDate?: string;
      expirationDate?: string;
      renewalTerms?: string;
      parties: Array<{
        name: string;
        role: string;
        contactInfo?: string;
      }>;
    };
    keyInformationAndClauses: {
      confidentialityObligations: Array<{
        party: string;
        obligation: string;
        duration?: string;
        scope: string;
      }>;
      nonCircumvention: Array<{
        description: string;
        restrictions: string;
        penalties?: string;
      }>;
      nonSolicitationOfPersonnel: Array<{
        restrictions: string;
        duration?: string;
        exceptions?: string;
      }>;
      nonCompete: Array<{
        restrictions: string;
        duration?: string;
        geography?: string;
        exceptions?: string;
      }>;
      intellectualProperty: Array<{
        ownership: string;
        description: string;
        restrictions?: string;
      }>;
      remediesAndEnforcement: Array<{
        remedy: string;
        conditions: string;
        enforcement?: string;
      }>;
      termsAndTermination: Array<{
        terminationCondition: string;
        noticePeriod?: string;
        consequences?: string;
      }>;
      limitationAndLiability: Array<{
        limitation: string;
        scope: string;
        exceptions?: string;
      }>;
    };
    riskAssessment: {
      overallScore: number;
      keyConsiderations: Array<{
        category: string;
        consideration: string;
        impact: 'HIGH' | 'MEDIUM' | 'LOW';
        recommendation: string;
      }>;
      missingClauses: Array<{
        clause: string;
        importance: 'HIGH' | 'MEDIUM' | 'LOW';
        recommendation: string;
      }>;
      nonStandardTerms: Array<{
        term: string;
        description: string;
        risk: 'HIGH' | 'MEDIUM' | 'LOW';
        suggestion: string;
      }>;
      ambiguities: Array<{
        clause: string;
        ambiguity: string;
        risk: 'HIGH' | 'MEDIUM' | 'LOW';
        clarification: string;
      }>;
      riskFactors: Array<{
        category: 'LIABILITY' | 'TERMINATION' | 'IP' | 'PAYMENT' | 'COMPLIANCE' | 'CONFIDENTIALITY' | 'DATA_PRIVACY' | 'REGULATORY' | 'OTHER';
        severity: 'HIGH' | 'MEDIUM' | 'LOW';
        description: string;
        clause: string;
        recommendation: string;
      }>;
    };
    keyTerms: Array<{
      term: string;
      value: string;
      category: string;
      riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    problematicClauses: Array<{
      clause: string;
      issue: string;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      suggestion: string;
    }>;
    analyzedAt: Date;
  };
}

const ContractAnalysisResults: React.FC<ContractAnalysisResultsProps> = ({ analysis }) => {
  const getRiskColor = (risk: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (risk) {
      case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (risk: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (risk) {
      case 'HIGH': return <AlertTriangle className="h-4 w-4" />;
      case 'MEDIUM': return <AlertCircle className="h-4 w-4" />;
      case 'LOW': return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LIABILITY': return <Shield className="h-4 w-4" />;
      case 'PAYMENT': return <DollarSign className="h-4 w-4" />;
      case 'TERMINATION': return <AlertTriangle className="h-4 w-4" />;
      case 'IP': return <FileText className="h-4 w-4" />;
      case 'COMPLIANCE': return <CheckCircle className="h-4 w-4" />;
      case 'CONFIDENTIALITY': return <Shield className="h-4 w-4" />;
      case 'DATA_PRIVACY': return <Shield className="h-4 w-4" />;
      case 'REGULATORY': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  // Function to format the overview text into readable bullet points
  const formatOverview = (overview: string) => {
    const sections = [];
    
    // First try: Look for **Section:** pattern
    const sectionRegex = /\*\*([^:*]+):\*\*\s*([\s\S]*?)(?=\*\*[^:*]+:\*\*|$)/g;
    let match;

    while ((match = sectionRegex.exec(overview)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      
      // Split content into items - handle both numbered and bulleted lists
      const items: string[] = [];
      
      // Split by numbered items (1. 2. 3.)
      const numberedItems = content.split(/\n?\d+\.\s+/).filter(item => item.trim().length > 0);
      if (numberedItems.length > 1) {
        // Skip first empty item and process the rest
        numberedItems.slice(1).forEach(item => {
          const cleanItem = item.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
          if (cleanItem.length > 5) {
            items.push(cleanItem);
          }
        });
      } else {
        // Split by bullet points or dashes
        const bulletItems = content.split(/\n?[-•]\s+/).filter(item => item.trim().length > 0);
        if (bulletItems.length > 1) {
          bulletItems.slice(1).forEach(item => {
            const cleanItem = item.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
            if (cleanItem.length > 5) {
              items.push(cleanItem);
            }
          });
        } else {
          // Split by line breaks for simple content
          const lines = content.split('\n').filter(line => line.trim().length > 5);
          lines.forEach(line => {
            const cleanLine = line.trim().replace(/^[-•\d+\.\s]*/, '');
            if (cleanLine.length > 5) {
              items.push(cleanLine);
            }
          });
        }
      }
      
      if (items.length > 0) {
        sections.push({ title, content: items });
      }
    }

    // Second try: If no ** sections found, try other patterns
    if (sections.length === 0) {
      // Look for lines ending with : as headers
      const lines = overview.split('\n').filter(line => line.trim());
      let currentSection: { title: string; content: string[] } | null = null;
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check if this looks like a header (ends with : and isn't a numbered item)
        if (trimmedLine.includes(':') && !trimmedLine.match(/^\d+\./)) {
          // Save previous section
          if (currentSection && currentSection.content.length > 0) {
            sections.push(currentSection);
          }
          // Start new section
          currentSection = {
            title: trimmedLine.replace(/[*:]/g, '').trim(),
            content: []
          };
        } else if (currentSection && trimmedLine) {
          // Add content to current section
          const cleanContent = trimmedLine.replace(/^\d+\.\s*|^[-•]\s*/, '').trim();
          if (cleanContent.length > 5) {
            currentSection.content.push(cleanContent);
          }
        }
      }
      
      // Don't forget the last section
      if (currentSection && currentSection.content.length > 0) {
        sections.push(currentSection);
      }
    }

    // Final fallback: Split by sentences if still no sections
    if (sections.length === 0) {
      const sentences = overview
        .replace(/\*\*/g, '')
        .split(/[.!?]+/)
        .filter(s => s.trim().length > 15)
        .map(s => s.trim())
        .slice(0, 6);
      
      if (sentences.length > 0) {
        sections.push({ title: 'Summary', content: sentences });
      }
    }

    return sections;
  };

  const formatText = (text: string) => {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove markdown bold
      .replace(/^\d+\.\s*/, '') // Remove leading numbers
      .replace(/[^\w\s.,!?;:()"'-]/g, '') // Remove special/garbled characters
      .trim();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Contract Analysis: {analysis.documentName}
              </h1>
              <p className="text-gray-600">
                Analyzed on {new Date(analysis.analyzedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          {/* Risk Score Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getRiskColor(analysis.riskScore)}`}>
            {getRiskIcon(analysis.riskScore)}
            <span className="ml-2 font-semibold">{analysis.riskScore} RISK</span>
            <span className="ml-2 text-sm">({analysis.riskAssessment.overallScore}/100)</span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Executive Summary
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {formatOverview(analysis.executiveSummary.overview).map((section, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Fallback if no structured content */}
            {formatOverview(analysis.executiveSummary.overview).length === 0 && (
              <div className="text-gray-700 leading-relaxed">
                <p>{analysis.executiveSummary.overview}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contract Snapshot */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2 text-indigo-600" />
            Contract Snapshot
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contract Title</h3>
                <p className="text-lg font-semibold text-gray-900">{analysis.contractSnapshot.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Contract Type</h3>
                <p className="text-gray-700">{analysis.contractSnapshot.contractType}</p>
              </div>
              {analysis.contractSnapshot.renewalTerms && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Renewal Terms</h3>
                  <p className="text-gray-700">{analysis.contractSnapshot.renewalTerms}</p>
                </div>
              )}
            </div>

            {/* Key Dates */}
            <div className="space-y-4">
              {analysis.contractSnapshot.effectiveDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Effective Date</h3>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(analysis.contractSnapshot.effectiveDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
              {analysis.contractSnapshot.expirationDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Expiration Date</h3>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(analysis.contractSnapshot.expirationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Parties */}
          {analysis.contractSnapshot.parties.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Parties
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.contractSnapshot.parties.map((party, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900">{party.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{party.role}</p>
                    {party.contactInfo && (
                      <p className="text-sm text-gray-500">{party.contactInfo}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Terms */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Key Terms
            </h2>
          </div>
          <div className="p-6">
            {analysis.keyTerms.length > 0 ? (
              <div className="space-y-4">
                {analysis.keyTerms.map((term, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{term.term}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(term.riskLevel)}`}>
                        {term.riskLevel}
                      </span>
                    </div>
                    <p className="text-lg font-medium text-blue-600 mb-1">{term.value}</p>
                    <p className="text-sm text-gray-600">{term.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No key terms extracted</p>
            )}
          </div>
        </div>

        {/* Key Dates */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Important Dates
            </h2>
          </div>
          <div className="p-6">
            {analysis.executiveSummary.keyDates.length > 0 ? (
              <div className="space-y-4">
                {analysis.executiveSummary.keyDates.map((date, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{date.description}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(date.importance)}`}>
                        {date.importance}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-medium">{new Date(date.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No key dates identified</p>
            )}
          </div>
        </div>
      </div>

      {/* Key Information & Clauses */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Scale className="h-5 w-5 mr-2 text-purple-600" />
            Key Information & Clauses
          </h2>
        </div>
        <div className="p-6 space-y-8">
          {/* Confidentiality Obligations */}
          {analysis.keyInformationAndClauses.confidentialityObligations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-600" />
                Confidentiality Obligations
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.confidentialityObligations.map((conf, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{conf.party}</h4>
                      {conf.duration && (
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{conf.duration}</span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{conf.obligation}</p>
                    <p className="text-sm text-gray-600"><strong>Scope:</strong> {conf.scope}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Circumvention */}
          {analysis.keyInformationAndClauses.nonCircumvention.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Hand className="h-5 w-5 mr-2 text-orange-600" />
                Non-Circumvention
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.nonCircumvention.map((nc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">{nc.description}</p>
                    <p className="text-sm text-gray-600 mb-2"><strong>Restrictions:</strong> {nc.restrictions}</p>
                    {nc.penalties && (
                      <p className="text-sm text-red-600"><strong>Penalties:</strong> {nc.penalties}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Solicitation of Personnel */}
          {analysis.keyInformationAndClauses.nonSolicitationOfPersonnel.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserX className="h-5 w-5 mr-2 text-red-600" />
                Non-Solicitation of Personnel
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.nonSolicitationOfPersonnel.map((ns, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">{ns.restrictions}</p>
                    {ns.duration && (
                      <p className="text-sm text-gray-600 mb-2"><strong>Duration:</strong> {ns.duration}</p>
                    )}
                    {ns.exceptions && (
                      <p className="text-sm text-green-600"><strong>Exceptions:</strong> {ns.exceptions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Compete */}
          {analysis.keyInformationAndClauses.nonCompete.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Non-Compete
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.nonCompete.map((nc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">{nc.restrictions}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {nc.duration && (
                        <p className="text-sm text-gray-600"><strong>Duration:</strong> {nc.duration}</p>
                      )}
                      {nc.geography && (
                        <p className="text-sm text-gray-600"><strong>Geography:</strong> {nc.geography}</p>
                      )}
                    </div>
                    {nc.exceptions && (
                      <p className="text-sm text-green-600 mt-2"><strong>Exceptions:</strong> {nc.exceptions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intellectual Property */}
          {analysis.keyInformationAndClauses.intellectualProperty.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                Intellectual Property
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.intellectualProperty.map((ip, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{ip.ownership}</h4>
                    <p className="text-gray-700 mb-2">{ip.description}</p>
                    {ip.restrictions && (
                      <p className="text-sm text-orange-600"><strong>Restrictions:</strong> {ip.restrictions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remedies and Enforcement */}
          {analysis.keyInformationAndClauses.remediesAndEnforcement.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                Remedies and Enforcement
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.remediesAndEnforcement.map((re, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{re.remedy}</h4>
                    <p className="text-gray-700 mb-2"><strong>Conditions:</strong> {re.conditions}</p>
                    {re.enforcement && (
                      <p className="text-sm text-gray-600"><strong>Enforcement:</strong> {re.enforcement}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Termination */}
          {analysis.keyInformationAndClauses.termsAndTermination.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Terms & Termination
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.termsAndTermination.map((tt, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 mb-2">{tt.terminationCondition}</p>
                    {tt.noticePeriod && (
                      <p className="text-sm text-gray-600 mb-2"><strong>Notice Period:</strong> {tt.noticePeriod}</p>
                    )}
                    {tt.consequences && (
                      <p className="text-sm text-orange-600"><strong>Consequences:</strong> {tt.consequences}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Limitation and Liability */}
          {analysis.keyInformationAndClauses.limitationAndLiability.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Scale className="h-5 w-5 mr-2 text-purple-600" />
                Limitation and Liability
              </h3>
              <div className="space-y-3">
                {analysis.keyInformationAndClauses.limitationAndLiability.map((ll, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{ll.limitation}</h4>
                    <p className="text-gray-700 mb-2"><strong>Scope:</strong> {ll.scope}</p>
                    {ll.exceptions && (
                      <p className="text-sm text-red-600"><strong>Exceptions:</strong> {ll.exceptions}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Risk Assessment */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Risk Assessment
          </h2>
        </div>
        <div className="p-6 space-y-8">
          {/* Key Considerations */}
          {analysis.riskAssessment.keyConsiderations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Key Considerations
              </h3>
              <div className="space-y-4">
                {analysis.riskAssessment.keyConsiderations.map((consideration, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getRiskColor(consideration.impact)} border-l-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{consideration.category}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(consideration.impact)}`}>
                        {consideration.impact}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{consideration.consideration}</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-blue-800 text-sm"><strong>Recommendation:</strong> {consideration.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Clauses */}
          {analysis.riskAssessment.missingClauses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-orange-600" />
                Missing Clauses
              </h3>
              <div className="space-y-4">
                {analysis.riskAssessment.missingClauses.map((missing, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getRiskColor(missing.importance)} border-l-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{missing.clause}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(missing.importance)}`}>
                        {missing.importance}
                      </span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm"><strong>Recommendation:</strong> {missing.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Standard Terms */}
          {analysis.riskAssessment.nonStandardTerms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                Non-Standard Terms
              </h3>
              <div className="space-y-4">
                {analysis.riskAssessment.nonStandardTerms.map((term, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getRiskColor(term.risk)} border-l-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{term.term}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(term.risk)}`}>
                        {term.risk} RISK
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{term.description}</p>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-purple-800 text-sm"><strong>Suggestion:</strong> {term.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ambiguities */}
          {analysis.riskAssessment.ambiguities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-gray-600" />
                Ambiguities
              </h3>
              <div className="space-y-4">
                {analysis.riskAssessment.ambiguities.map((ambiguity, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getRiskColor(ambiguity.risk)} border-l-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{ambiguity.clause}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(ambiguity.risk)}`}>
                        {ambiguity.risk} RISK
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3"><strong>Ambiguity:</strong> {ambiguity.ambiguity}</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-800 text-sm"><strong>Clarification Needed:</strong> {ambiguity.clarification}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {analysis.riskAssessment.riskFactors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Risk Factors
              </h3>
              <div className="space-y-6">
                {analysis.riskAssessment.riskFactors.map((risk, index) => (
                  <div key={index} className={`border rounded-lg p-6 ${getRiskColor(risk.severity)} border-l-4`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(risk.category)}
                      <div>
                        <h3 className="text-lg font-semibold">{risk.category}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.severity)}`}>
                          {getRiskIcon(risk.severity)}
                          <span className="ml-1">{risk.severity}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                      <p className="text-gray-700 leading-relaxed">{risk.description}</p>
                    </div>
                    
                    {risk.clause && risk.clause.trim() && risk.clause !== 'No clause specified' && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Relevant Clause:</h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            "{risk.clause.replace(/[^a-zA-Z0-9\s.,!?;:()"'-]/g, ' ').replace(/\s+/g, ' ').trim()}"
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recommendation:</h4>
                      <p className="text-gray-700 leading-relaxed">{risk.recommendation}</p>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback message when no risk assessment data */}
          {analysis.riskAssessment.keyConsiderations.length === 0 && 
           analysis.riskAssessment.missingClauses.length === 0 && 
           analysis.riskAssessment.nonStandardTerms.length === 0 && 
           analysis.riskAssessment.ambiguities.length === 0 && 
           analysis.riskAssessment.riskFactors.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 italic">No detailed risk assessment data available</p>
              <p className="text-sm text-gray-400 mt-2">Manual review recommended for comprehensive risk analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Problematic Clauses */}
      {analysis.problematicClauses.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
              Problematic Clauses
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {analysis.problematicClauses.map((clause, index) => (
                <div key={index} className={`border rounded-lg p-6 ${getRiskColor(clause.severity)} border-l-4`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(clause.severity)}`}>
                        {getRiskIcon(clause.severity)}
                        <span className="ml-1">{clause.severity} RISK</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Issue:</h4>
                      <p className="text-gray-700 leading-relaxed">{clause.issue}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Clause:</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          "{clause.clause.replace(/[^a-zA-Z0-9\s.,!?;:()"'-]/g, ' ').replace(/\s+/g, ' ').trim()}"
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Suggested Improvement:</h4>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 leading-relaxed">{clause.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Obligations */}
      {analysis.executiveSummary.obligations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-600" />
              Key Obligations
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.executiveSummary.obligations.map((obligation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{obligation.party}</h3>
                  <p className="text-gray-700 mb-3 leading-relaxed">{obligation.obligation}</p>
                  {obligation.deadline && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Due: {new Date(obligation.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
        <div className="p-6 border-b border-blue-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
            Recommended Actions
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.executiveSummary.recommendedActions.map((action, index) => (
              <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{formatText(action)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Legal Disclaimer</h3>
            <p className="text-yellow-700 leading-relaxed">
              This analysis is generated by AI and is for informational purposes only. It does not constitute legal advice. 
              Always consult with a qualified attorney for legal matters and before making any decisions based on this analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractAnalysisResults;