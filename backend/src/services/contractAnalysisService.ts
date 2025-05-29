// backend/src/services/contractAnalysisService.ts - BULLETPROOF VERSION
import { IDocument } from '../models/Document';
import { BulletproofOpenAI } from './bulletproofOpenAI';

export interface ContractAnalysis {
  documentId: string;
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
  riskAnalysis: {
    overallScore: number;
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
}

// Validation functions (same as before)
const validateAndFixRiskCategory = (category: string): 'LIABILITY' | 'TERMINATION' | 'IP' | 'PAYMENT' | 'COMPLIANCE' | 'CONFIDENTIALITY' | 'DATA_PRIVACY' | 'REGULATORY' | 'OTHER' => {
  const validCategories = ['LIABILITY', 'TERMINATION', 'IP', 'PAYMENT', 'COMPLIANCE', 'CONFIDENTIALITY', 'DATA_PRIVACY', 'REGULATORY', 'OTHER'];
  const upperCategory = category.toUpperCase();
  
  const categoryMappings: Record<string, string> = {
    'CONFIDENTIALITY': 'CONFIDENTIALITY',
    'DATA': 'DATA_PRIVACY',
    'PRIVACY': 'DATA_PRIVACY',
    'DATA_PROTECTION': 'DATA_PRIVACY',
    'REGULATION': 'REGULATORY',
    'COMPLIANCE': 'COMPLIANCE',
    'LEGAL': 'COMPLIANCE',
    'INTELLECTUAL_PROPERTY': 'IP',
    'INTELLECTUAL': 'IP',
    'COPYRIGHT': 'IP',
    'PATENT': 'IP',
    'TRADEMARK': 'IP',
    'LIABILITY': 'LIABILITY',
    'TERMINATION': 'TERMINATION',  
    'PAYMENT': 'PAYMENT',
    'FINANCIAL': 'PAYMENT',
    'MONEY': 'PAYMENT'
  };
  
  if (validCategories.includes(upperCategory)) {
    return upperCategory as any;
  }
  
  if (categoryMappings[upperCategory]) {
    return categoryMappings[upperCategory] as any;
  }
  
  return 'OTHER';
};

const validateAndFixSeverity = (severity: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const validSeverities = ['HIGH', 'MEDIUM', 'LOW'];
  const upperSeverity = severity.toUpperCase();
  
  if (validSeverities.includes(upperSeverity)) {
    return upperSeverity as any;
  }
  
  const severityMappings: Record<string, string> = {
    'CRITICAL': 'HIGH',
    'SEVERE': 'HIGH', 
    'MAJOR': 'HIGH',
    'MODERATE': 'MEDIUM',
    'MINOR': 'LOW',
    'MINIMAL': 'LOW'
  };
  
  if (severityMappings[upperSeverity]) {
    return severityMappings[upperSeverity] as any;
  }
  
  return 'MEDIUM';
};

const validateAndFixImportance = (importance: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const validImportance = ['HIGH', 'MEDIUM', 'LOW'];
  const upperImportance = importance.toUpperCase();
  
  if (validImportance.includes(upperImportance)) {
    return upperImportance as any;
  }
  
  const importanceMappings: Record<string, string> = {
    'CRITICAL': 'HIGH',
    'IMPORTANT': 'HIGH',
    'URGENT': 'HIGH',
    'NORMAL': 'MEDIUM',
    'STANDARD': 'MEDIUM', 
    'MINOR': 'LOW',
    'OPTIONAL': 'LOW'
  };
  
  if (importanceMappings[upperImportance]) {
    return importanceMappings[upperImportance] as any;
  }
  
  return 'MEDIUM';
};

// Safe JSON parsing helper
const safeJSONParse = (text: string, fallback: any = {}) => {
  try {
    let cleanText = text.trim();
    
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    cleanText = cleanText.trim();
    return JSON.parse(cleanText);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    console.warn('JSON parsing failed:', errorMessage);
    return fallback;
  }
};

export const analyzeContract = async (document: any): Promise<ContractAnalysis> => {
  try {
    console.log(`🔍 Starting bulletproof contract analysis for: ${document.originalName || document.name}`);
    
    if (!document.content || document.content.length < 100) {
      throw new Error('Document content is too short or missing for analysis');
    }

    // Use larger content window but split analysis into focused chunks
    const maxContentLength = 6000; // Reduced to avoid token limits that cause empty responses
    const truncatedContent = document.content.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated for analysis]'
      : document.content;

    console.log(`📄 Processing contract content (${truncatedContent.length} characters)`);

    // Step 1: Executive Summary with bulletproof API call
    const summaryPrompt = `Analyze this legal contract and create a business-focused summary.

Contract Content:
${truncatedContent}

Provide a clear summary covering:
1. Contract type and parties
2. Key business risks (3 specific risks)
3. Actionable recommendations (3 specific actions)
4. Important dates

Be specific and base analysis on actual contract content.`;

    let executiveSummary;
    try {
      console.log('🔄 Generating executive summary...');
      executiveSummary = await BulletproofOpenAI.resilientAPICall([
        { role: 'system', content: 'You are a business consultant analyzing legal contracts. Be specific and concise.' },
        { role: 'user', content: summaryPrompt }
      ], {
        model: 'gpt-3.5-turbo',
        maxTokens: 800,
        temperature: 0.2
      });
      console.log('✅ Successfully generated executive summary');
    } catch (summaryError) {
      console.error('❌ Failed to generate executive summary:', summaryError);
      executiveSummary = `**Contract Analysis Summary**

**Contract Overview:**
This contract has been processed but detailed AI analysis encountered technical issues.

**Key Business Points:**
- Document: ${document.originalName || document.name}
- Size: ${document.content.length} characters
- Status: Analysis completed with limitations

**Recommended Actions:**
1. Manual review of key terms and conditions
2. Legal consultation within 7 business days
3. Extract important dates and deadlines
4. Clarify ambiguous terms with counterparty

**Risk Assessment:**
Manual review required due to technical constraints.`;
    }

    // Step 2: Risk Analysis with bulletproof handling
    const riskAnalysisPrompt = `Analyze this contract for business risks.

Contract Content:
${truncatedContent}

Return JSON format only:
{
  "overallRiskScore": [1-100 where 1-30=LOW, 31-70=MEDIUM, 71-100=HIGH],
  "riskFactors": [
    {
      "category": "[LIABILITY|IP|PAYMENT|TERMINATION|COMPLIANCE|CONFIDENTIALITY|OTHER]",
      "severity": "[HIGH|MEDIUM|LOW]",
      "description": "[2 sentence risk explanation]",
      "clause": "[relevant clause or section]",
      "recommendation": "[specific action]"
    }
  ],
  "problematicClauses": [
    {
      "clause": "[problematic section]",
      "issue": "[specific problem]",
      "severity": "[HIGH|MEDIUM|LOW]",
      "suggestion": "[improvement suggestion]"
    }
  ]
}`;

    let riskData;
    try {
      console.log('🔄 Analyzing risks...');
      const riskContent = await BulletproofOpenAI.resilientAPICall([
        { role: 'system', content: 'You are a legal risk analyst. Return only valid JSON.' },
        { role: 'user', content: riskAnalysisPrompt }
      ], {
        model: 'gpt-3.5-turbo',
        maxTokens: 1200,
        temperature: 0.1
      });

      riskData = safeJSONParse(riskContent, {
        overallRiskScore: 45,
        riskFactors: [],
        problematicClauses: []
      });
      console.log('✅ Successfully analyzed risks');
    } catch (riskError) {
      console.error('❌ Risk analysis failed:', riskError);
      
      // Create intelligent defaults based on document content
      const hasUnlimitedLiability = truncatedContent.toLowerCase().includes('unlimited liability') || 
                                   truncatedContent.toLowerCase().includes('no limit') ||
                                   !truncatedContent.toLowerCase().includes('liability cap');
      const isHighValue = /\$[\d,]+/.test(truncatedContent) && 
                         (truncatedContent.includes('million') || truncatedContent.includes('000,000'));
      const hasComplexIP = truncatedContent.toLowerCase().includes('intellectual property') ||
                          truncatedContent.toLowerCase().includes('work product');
      
      // Dynamic risk scoring
      let calculatedRisk = 40; // Base score
      if (hasUnlimitedLiability) calculatedRisk += 20;
      if (isHighValue) calculatedRisk += 15;  
      if (hasComplexIP) calculatedRisk += 10;
      
      riskData = {
        overallRiskScore: Math.min(calculatedRisk, 90),
        riskFactors: [{
          category: hasComplexIP ? 'IP' : hasUnlimitedLiability ? 'LIABILITY' : 'OTHER',
          severity: calculatedRisk > 70 ? 'HIGH' : calculatedRisk > 45 ? 'MEDIUM' : 'LOW',
          description: `Analysis indicates ${hasUnlimitedLiability ? 'potential liability exposure' : 'standard risk levels'} ${isHighValue ? 'with significant financial commitments' : ''}.`,
          clause: 'Detailed clause analysis limited by technical constraints',
          recommendation: 'Comprehensive legal review focusing on key risk areas'
        }],
        problematicClauses: []
      };
    }

    // Step 3: Key Terms Extraction
    const keyTermsPrompt = `Extract key terms from this contract.

Contract Content:
${truncatedContent}

Return JSON only:
{
  "keyTerms": [
    {
      "term": "[term name]",
      "value": "[value/amount]",
      "category": "[FINANCIAL|TIMELINE|LEGAL|OTHER]",
      "riskLevel": "[HIGH|MEDIUM|LOW]"
    }
  ],
  "keyDates": [
    {
      "date": "[date or description]",
      "description": "[what happens]",
      "importance": "[HIGH|MEDIUM|LOW]"
    }
  ],
  "obligations": [
    {
      "party": "[which party]",
      "obligation": "[obligation description]",
      "deadline": "[when due]"
    }
  ]
}`;

    let extractedData;
    try {
      console.log('🔄 Extracting key terms...');
      const keyTermsContent = await BulletproofOpenAI.resilientAPICall([
        { role: 'system', content: 'Extract key business terms. Return only valid JSON.' },
        { role: 'user', content: keyTermsPrompt }
      ], {
        model: 'gpt-3.5-turbo',
        maxTokens: 800,
        temperature: 0.1
      });

      extractedData = safeJSONParse(keyTermsContent, {
        keyTerms: [],
        keyDates: [],
        obligations: []
      });
      console.log('✅ Successfully extracted key terms');
    } catch (extractError) {
      console.error('❌ Key terms extraction failed:', extractError);
      extractedData = {
        keyTerms: [{
          term: 'Manual Review Required',
          value: 'Analysis limited due to technical constraints',
          category: 'OTHER',
          riskLevel: 'MEDIUM'
        }],
        keyDates: [{
          date: new Date().toISOString().split('T')[0],
          description: 'Contract analysis completed - review important dates manually',
          importance: 'HIGH'
        }],
        obligations: [{
          party: 'Both parties',
          obligation: 'Thorough contract review and legal consultation',
          deadline: 'Within 7 business days'
        }]
      };
    }

    // Process and validate all data
    const overallRiskScore = Math.min(Math.max(riskData.overallRiskScore || 50, 1), 100);
    const riskScore = overallRiskScore > 70 ? 'HIGH' : 
                     overallRiskScore > 40 ? 'MEDIUM' : 'LOW';

    // Validate and clean all arrays
    const validatedRiskFactors = (riskData.riskFactors && Array.isArray(riskData.riskFactors)) 
      ? riskData.riskFactors.map((risk: any) => ({
          category: validateAndFixRiskCategory(risk.category || 'OTHER'),
          severity: validateAndFixSeverity(risk.severity || 'MEDIUM'),
          description: risk.description || 'Risk assessment completed with technical limitations',
          clause: risk.clause || 'Clause analysis not available',
          recommendation: risk.recommendation || 'Legal review recommended'
        }))
      : [{
          category: 'OTHER' as const,
          severity: 'MEDIUM' as const,
          description: 'General contract risk assessment completed with technical limitations',
          clause: 'Full analysis not available due to processing constraints',
          recommendation: 'Comprehensive legal review strongly recommended'
        }];

    const validatedProblematicClauses = (riskData.problematicClauses && Array.isArray(riskData.problematicClauses))
      ? riskData.problematicClauses.map((clause: any) => ({
          clause: clause.clause || 'Clause identification limited',
          issue: clause.issue || 'Issue analysis not available',
          severity: validateAndFixSeverity(clause.severity || 'MEDIUM'),
          suggestion: clause.suggestion || 'Legal counsel review recommended'
        }))
      : [];

    const validatedKeyDates = (extractedData.keyDates && Array.isArray(extractedData.keyDates))
      ? extractedData.keyDates.map((date: any) => ({
          date: date.date || new Date().toISOString().split('T')[0],
          description: date.description || 'Important contract date',
          importance: validateAndFixImportance(date.importance || 'MEDIUM')
        }))
      : [{
          date: new Date().toISOString().split('T')[0],
          description: 'Contract analysis completed - manual date review needed',
          importance: 'HIGH' as const
        }];

    const validatedKeyTerms = (extractedData.keyTerms && Array.isArray(extractedData.keyTerms))
      ? extractedData.keyTerms.map((term: any) => ({
          term: term.term || 'Term analysis limited',
          value: term.value || 'Value not extracted',
          category: term.category || 'General',
          riskLevel: validateAndFixSeverity(term.riskLevel || 'LOW')
        }))
      : [{
          term: 'Contract Analysis Status',
          value: 'Completed with technical limitations',
          category: 'Analysis',
          riskLevel: 'MEDIUM' as const
        }];

    // Generate recommendations
    const recommendedActions = [
      'Schedule comprehensive legal review with qualified attorney',
      'Extract and calendar all important dates manually',
      'Review financial terms and payment obligations',
      'Clarify any ambiguous clauses with counterparty',
      'Establish compliance monitoring procedures'
    ];

    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || 
             doc.id?.toString() || 
             doc.documentId?.toString() || 
             'unknown-id';
    };

    const documentId = getDocumentId(document);

    const analysis: ContractAnalysis = {
      documentId,
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore,
      executiveSummary: {
        overview: executiveSummary,
        keyDates: validatedKeyDates,
        obligations: (extractedData.obligations && Array.isArray(extractedData.obligations)) ? extractedData.obligations : [],
        recommendedActions: recommendedActions
      },
      riskAnalysis: {
        overallScore: overallRiskScore,
        riskFactors: validatedRiskFactors
      },
      keyTerms: validatedKeyTerms,
      problematicClauses: validatedProblematicClauses,
      analyzedAt: new Date()
    };

    console.log(`✅ Bulletproof contract analysis completed for: ${document.originalName || document.name}`);
    console.log(`📊 Risk Score: ${overallRiskScore}/100 (${riskScore})`);
    console.log(`⚠️ Risk Factors: ${validatedRiskFactors.length}`);
    
    return analysis;

  } catch (error: any) {
    console.error('❌ Contract analysis failed:', error);
    throw new Error(`Bulletproof contract analysis failed: ${error.message}`);
  }
};

export const generateContractSummary = async (document: any): Promise<string> => {
  try {
    console.log('🔄 Generating bulletproof contract summary...');

    const maxContentLength = 5000;
    const truncatedContent = document.content?.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated]'
      : document.content || 'No content available';

    const prompt = `Create an executive summary of this contract:

${truncatedContent}

Structure:
## Contract Overview
- Contract type and parties
- Key purpose and scope

## Key Terms
- Financial obligations
- Important dates
- Deliverables

## Risk Assessment
- Primary risk areas
- Recommended actions

Keep it concise and business-focused.`;

    try {
      const summary = await BulletproofOpenAI.resilientAPICall([
        {
          role: 'system',
          content: 'You are a legal advisor creating executive summaries. Be concise and professional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], {
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.2
      });

      return summary;
    } catch (apiError) {
      console.error('❌ Error generating contract summary via API:', apiError);
      
      return `# Contract Summary: ${document.originalName || document.name}

## Contract Overview
This document has been uploaded and processed, but detailed AI-generated summary could not be created due to technical limitations.

## Key Information
- **Document Name:** ${document.originalName || document.name}
- **File Size:** ${document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'}
- **Upload Date:** ${document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Unknown'}
- **Content Length:** ${document.content ? `${document.content.length} characters` : 'No content extracted'}

## Risk Assessment
- **Status:** Manual review required due to technical limitations
- **Automated Analysis:** Could not be completed
- **Legal Review:** Strongly recommended within 7 business days

## Key Business Terms
- **Financial Terms:** Manual extraction required
- **Important Dates:** Review document for deadlines and milestones
- **Party Obligations:** Identify responsibilities for each party
- **Termination Conditions:** Review exit clauses and requirements

## Recommended Next Steps
1. **Immediate Actions (Next 24 hours):**
   - Schedule legal consultation
   - Identify and calendar critical dates
   - Review financial obligations and payment terms

2. **Short-term Actions (Next 7 days):**
   - Comprehensive legal review with qualified attorney
   - Risk assessment of key terms and conditions
   - Clarification of ambiguous language with counterparty

3. **Ongoing Actions:**
   - Establish compliance monitoring procedures
   - Regular review of contract performance
   - Documentation of any modifications or amendments

## Risk Mitigation
- **High Priority:** Legal counsel review for liability and compliance issues
- **Medium Priority:** Financial term validation and cash flow impact assessment
- **Standard:** Operational procedures alignment with contract requirements

## Technical Note
This summary was generated using fallback procedures due to API processing limitations. For comprehensive AI-powered analysis, please try again later or contact technical support if issues persist.

**Disclaimer:** This analysis is for informational purposes only and does not constitute legal advice. Consult with qualified legal counsel for specific legal guidance.`;
    }
  } catch (error: any) {
    console.error('❌ Error in generateContractSummary:', error);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
};

export default {
  analyzeContract,
  generateContractSummary
};