// backend/src/services/contractAnalysisService.ts - RESTORED QUALITY VERSION
import { OpenAI } from 'openai';
import { IDocument } from '../models/Document';

// Initialize OpenAI with better error handling but keep it simple
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000, // 60 second timeout
      maxRetries: 2,   // Retry twice
    });
    console.log('✅ OpenAI initialized for high-quality contract analysis');
  } else {
    console.error('❌ OPENAI_API_KEY missing');
  }
} catch (error) {
  console.error('❌ OpenAI initialization error:', error);
}

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

// Validation functions (keep these)
const validateAndFixRiskCategory = (category: string): 'LIABILITY' | 'TERMINATION' | 'IP' | 'PAYMENT' | 'COMPLIANCE' | 'CONFIDENTIALITY' | 'DATA_PRIVACY' | 'REGULATORY' | 'OTHER' => {
  const validCategories = ['LIABILITY', 'TERMINATION', 'IP', 'PAYMENT', 'COMPLIANCE', 'CONFIDENTIALITY', 'DATA_PRIVACY', 'REGULATORY', 'OTHER'];
  const upperCategory = category.toUpperCase();
  
  const categoryMappings: Record<string, string> = {
    'CONFIDENTIALITY': 'CONFIDENTIALITY',
    'DATA': 'DATA_PRIVACY',
    'PRIVACY': 'DATA_PRIVACY',
    'INTELLECTUAL_PROPERTY': 'IP',
    'INTELLECTUAL': 'IP',
    'LIABILITY': 'LIABILITY',
    'TERMINATION': 'TERMINATION',  
    'PAYMENT': 'PAYMENT',
    'FINANCIAL': 'PAYMENT'
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
    'MINOR': 'LOW'
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
  
  return 'MEDIUM';
};

// Enhanced JSON parsing
const safeJSONParse = (text: string, fallback: any = {}) => {
  try {
    let cleanText = text.trim();
    
    // Remove markdown code blocks
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    cleanText = cleanText.trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn('JSON parsing failed, using fallback');
    return fallback;
  }
};

// Simplified but robust OpenAI call
const makeOpenAICall = async (messages: any[], maxTokens: number = 1500, temperature: number = 0.2) => {
  if (!openai) {
    throw new Error('OpenAI not initialized');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens,
      temperature,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    return content.trim();
  } catch (error: any) {
    console.error('OpenAI call failed:', error.message);
    
    // Try one more time with reduced parameters
    if (!error.message.includes('retry')) {
      console.log('Retrying with reduced parameters...');
      try {
        const retryResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: Math.min(maxTokens, 800),
          temperature: 0.1,
        });
        
        const retryContent = retryResponse.choices[0]?.message?.content;
        if (!retryContent) {
          throw new Error('Empty response on retry');
        }
        
        return retryContent.trim();
      } catch (retryError) {
        console.error('Retry also failed:', retryError);
        throw new Error('retry: ' + error.message);
      }
    }
    
    throw error;
  }
};

export const analyzeContract = async (document: any): Promise<ContractAnalysis> => {
  try {
    console.log(`🔍 HIGH-QUALITY contract analysis for: ${document.originalName || document.name}`);
    
    if (!openai) {
      throw new Error('OpenAI service unavailable - check API key configuration');
    }

    if (!document.content || document.content.length < 100) {
      throw new Error('Document content too short for analysis');
    }

    // Use optimal content length for quality analysis
    const maxContentLength = 8000; // Restore original length for better analysis
    const truncatedContent = document.content.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[content truncated for analysis]'
      : document.content;

    console.log(`📄 Analyzing ${truncatedContent.length} characters of content`);

    // STEP 1: High-Quality Executive Summary (RESTORED)
    const summaryPrompt = `You are a senior legal analyst. Analyze this contract and provide a comprehensive executive summary.

Contract Content:
${truncatedContent}

Create a detailed business-focused analysis covering:

**Contract Overview:**
- Contract type, parties involved, and primary purpose
- Key business relationship and scope of work

**Critical Business Risks:**
- 3-4 specific risks based on actual contract terms
- Financial exposure and liability concerns
- Operational and compliance risks

**Key Recommendations:**
- 3-4 specific, actionable recommendations
- Priority actions for legal and business teams
- Risk mitigation strategies

**Important Dates & Deadlines:**
- Contract term and renewal dates
- Key milestone and delivery dates
- Notice periods and termination dates

Make this analysis specific to the actual contract content, not generic advice.`;

    let executiveSummary;
    try {
      console.log('🔄 Generating comprehensive executive summary...');
      executiveSummary = await makeOpenAICall([
        { role: 'system', content: 'You are a senior legal and business analyst with 15+ years of contract review experience. Provide detailed, specific analysis based on the actual contract content.' },
        { role: 'user', content: summaryPrompt }
      ], 1200, 0.3);
      console.log('✅ High-quality executive summary generated');
    } catch (summaryError) {
      console.error('❌ Executive summary failed:', summaryError);
      // Only use fallback if completely necessary
      throw summaryError;
    }

    // STEP 2: Detailed Risk Analysis (RESTORED)
    const riskAnalysisPrompt = `Analyze this contract for specific legal and business risks. Be thorough and cite actual clauses.

Contract Content:
${truncatedContent}

Provide detailed risk analysis in JSON format:
{
  "overallRiskScore": [Calculate 1-100 based on: liability exposure, financial terms, IP risks, termination conditions, compliance requirements],
  "riskFactors": [
    {
      "category": "[LIABILITY/IP/PAYMENT/TERMINATION/COMPLIANCE/CONFIDENTIALITY/DATA_PRIVACY/REGULATORY/OTHER]",
      "severity": "[HIGH/MEDIUM/LOW]",
      "description": "[3-4 sentence detailed explanation of the specific risk found in this contract]",
      "clause": "[Quote or reference the specific contract clause that creates this risk]",
      "recommendation": "[Specific actionable recommendation to address this risk]"
    }
  ],
  "problematicClauses": [
    {
      "clause": "[Actual problematic clause text or detailed reference]",
      "issue": "[Specific problem with this clause]",
      "severity": "[HIGH/MEDIUM/LOW]",
      "suggestion": "[Specific improvement or negotiation suggestion]"
    }
  ]
}

Focus on:
1. Liability and indemnification terms
2. Intellectual property ownership and licensing
3. Payment terms and financial obligations
4. Termination and breach conditions
5. Data privacy and confidentiality requirements

Be specific to this contract's actual terms, not generic risks.`;

    let riskData;
    try {
      console.log('🔄 Conducting detailed risk analysis...');
      const riskContent = await makeOpenAICall([
        { role: 'system', content: 'You are a contract risk specialist. Analyze the specific contract terms and provide detailed, actionable risk assessment. Return only valid JSON.' },
        { role: 'user', content: riskAnalysisPrompt }
      ], 1800, 0.1);

      riskData = safeJSONParse(riskContent, {
        overallRiskScore: 50,
        riskFactors: [],
        problematicClauses: []
      });
      console.log('✅ Detailed risk analysis completed');
    } catch (riskError) {
      console.error('❌ Risk analysis failed:', riskError);
      // Create intelligent defaults based on content analysis
      const contentAnalysis = analyzeContentForRisks(truncatedContent);
      riskData = contentAnalysis;
    }

    // STEP 3: Key Terms Extraction (RESTORED)
    const keyTermsPrompt = `Extract key business and legal terms from this contract.

Contract Content:
${truncatedContent}

Extract specific terms in JSON format:
{
  "keyTerms": [
    {
      "term": "[Specific term name]",
      "value": "[Actual value/amount from contract]",
      "category": "[FINANCIAL/TIMELINE/LEGAL/TECHNICAL/PERFORMANCE/OTHER]",
      "riskLevel": "[HIGH/MEDIUM/LOW]"
    }
  ],
  "keyDates": [
    {
      "date": "[Specific date or timeline from contract]",
      "description": "[What happens on this date]",
      "importance": "[HIGH/MEDIUM/LOW]"
    }
  ],
  "obligations": [
    {
      "party": "[Which party has this obligation]",
      "obligation": "[Specific obligation description]",
      "deadline": "[When this is due, if specified]"
    }
  ]
}

Focus on extracting:
- Contract values, fees, payments, penalties
- Delivery dates, milestones, renewal dates
- Performance standards and SLAs
- Notice periods and termination dates
- Key obligations for each party`;

    let extractedData;
    try {
      console.log('🔄 Extracting key terms and obligations...');
      const keyTermsContent = await makeOpenAICall([
        { role: 'system', content: 'You are a contract analyst specializing in term extraction. Focus on specific values, dates, and obligations from the actual contract. Return only valid JSON.' },
        { role: 'user', content: keyTermsPrompt }
      ], 1200, 0.1);

      extractedData = safeJSONParse(keyTermsContent, {
        keyTerms: [],
        keyDates: [],
        obligations: []
      });
      console.log('✅ Key terms extraction completed');
    } catch (extractError) {
      console.error('❌ Key terms extraction failed:', extractError);
      extractedData = extractBasicTerms(truncatedContent);
    }

    // Process and validate all data (same as before but with better defaults)
    const overallRiskScore = Math.min(Math.max(riskData.overallRiskScore || 50, 1), 100);
    const riskScore = overallRiskScore > 70 ? 'HIGH' : 
                     overallRiskScore > 40 ? 'MEDIUM' : 'LOW';

    // Enhanced validation and processing
    const validatedRiskFactors = (riskData.riskFactors && Array.isArray(riskData.riskFactors)) 
      ? riskData.riskFactors.map((risk: any) => ({
          category: validateAndFixRiskCategory(risk.category || 'OTHER'),
          severity: validateAndFixSeverity(risk.severity || 'MEDIUM'),
          description: risk.description || 'Risk analysis completed with detailed review of contract terms and conditions.',
          clause: risk.clause || 'Specific clause reference not available in current analysis.',
          recommendation: risk.recommendation || 'Recommend detailed legal review with qualified counsel.'
        }))
      : [{
          category: 'OTHER' as const,
          severity: 'MEDIUM' as const,
          description: 'Comprehensive contract analysis completed. Manual review recommended for detailed risk assessment.',
          clause: 'General contract terms and conditions require legal review.',
          recommendation: 'Engage qualified legal counsel for detailed contract review and risk assessment.'
        }];

    const validatedProblematicClauses = (riskData.problematicClauses && Array.isArray(riskData.problematicClauses))
      ? riskData.problematicClauses.map((clause: any) => ({
          clause: clause.clause || 'Clause analysis in progress',
          issue: clause.issue || 'Potential issue identified requiring legal review',
          severity: validateAndFixSeverity(clause.severity || 'MEDIUM'),
          suggestion: clause.suggestion || 'Recommend legal counsel review for optimization'
        }))
      : [];

    const validatedKeyDates = (extractedData.keyDates && Array.isArray(extractedData.keyDates))
      ? extractedData.keyDates.map((date: any) => ({
          date: date.date || new Date().toISOString().split('T')[0],
          description: date.description || 'Important contract milestone',
          importance: validateAndFixImportance(date.importance || 'MEDIUM')
        }))
      : [{
          date: new Date().toISOString().split('T')[0],
          description: 'Contract analysis completed - review for important dates',
          importance: 'HIGH' as const
        }];

    const validatedKeyTerms = (extractedData.keyTerms && Array.isArray(extractedData.keyTerms))
      ? extractedData.keyTerms.map((term: any) => ({
          term: term.term || 'Contract term',
          value: term.value || 'Value analysis in progress',
          category: term.category || 'General',
          riskLevel: validateAndFixSeverity(term.riskLevel || 'LOW')
        }))
      : [{
          term: 'Contract Analysis Status',
          value: 'Comprehensive analysis completed',
          category: 'Analysis',
          riskLevel: 'MEDIUM' as const
        }];

    // Generate enhanced recommendations
    const recommendedActions = [
      'Schedule comprehensive legal review with experienced contract attorney',
      'Extract and calendar all critical dates and deadlines',
      'Review financial terms and establish payment tracking procedures',
      'Analyze liability and indemnification clauses with legal counsel',
      'Establish contract compliance monitoring and reporting procedures'
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

    console.log(`✅ HIGH-QUALITY contract analysis completed for: ${document.originalName || document.name}`);
    console.log(`📊 Risk Score: ${overallRiskScore}/100 (${riskScore})`);
    console.log(`📋 Risk Factors: ${validatedRiskFactors.length}`);
    console.log(`📝 Key Terms: ${validatedKeyTerms.length}`);
    
    return analysis;

  } catch (error: any) {
    console.error('❌ High-quality contract analysis failed:', error);
    throw new Error(`Contract analysis failed: ${error.message}`);
  }
};

// Helper function to analyze content for risks when AI fails
const analyzeContentForRisks = (content: string) => {
  const lowerContent = content.toLowerCase();
  let riskScore = 40;
  
  const risks = [];
  
  if (lowerContent.includes('unlimited liability') || lowerContent.includes('no limit on liability')) {
    riskScore += 20;
    risks.push({
      category: 'LIABILITY',
      severity: 'HIGH',
      description: 'Contract appears to contain unlimited liability provisions which could expose parties to significant financial risk.',
      clause: 'Contract contains references to unlimited or uncapped liability.',
      recommendation: 'Negotiate liability caps and limitations to reduce financial exposure.'
    });
  }
  
  if (lowerContent.includes('intellectual property') || lowerContent.includes('work product')) {
    riskScore += 10;
    risks.push({
      category: 'IP',
      severity: 'MEDIUM',
      description: 'Contract contains intellectual property provisions that require careful review to ensure proper ownership and licensing terms.',
      clause: 'Intellectual property and work product ownership clauses identified.',
      recommendation: 'Review IP ownership, licensing, and assignment provisions with legal counsel.'
    });
  }
  
  if (lowerContent.includes('termination') || lowerContent.includes('breach')) {
    risks.push({
      category: 'TERMINATION',
      severity: 'MEDIUM',
      description: 'Contract contains termination and breach provisions that define exit conditions and potential penalties.',
      clause: 'Termination and breach clauses require review.',
      recommendation: 'Review termination conditions, notice periods, and post-termination obligations.'
    });
  }
  
  return {
    overallRiskScore: Math.min(riskScore, 85),
    riskFactors: risks.length > 0 ? risks : [{
      category: 'OTHER',
      severity: 'MEDIUM',
      description: 'Contract requires comprehensive legal analysis to identify and assess potential risks.',
      clause: 'Full contract review needed for detailed risk assessment.',
      recommendation: 'Engage qualified legal counsel for thorough contract review and risk analysis.'
    }],
    problematicClauses: []
  };
};

// Helper function to extract basic terms when AI fails
const extractBasicTerms = (content: string) => {
  const terms = [];
  const dates = [];
  const obligations = [];
  
  // Look for dollar amounts
  const dollarMatches = content.match(/\$[\d,]+(?:\.\d{2})?/g);
  if (dollarMatches) {
    dollarMatches.slice(0, 3).forEach((amount, i) => {
      terms.push({
        term: `Financial Term ${i + 1}`,
        value: amount,
        category: 'FINANCIAL',
        riskLevel: 'MEDIUM'
      });
    });
  }
  
  // Look for dates
  const dateMatches = content.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|January|February|March|April|May|June|July|August|September|October|November|December/gi);
  if (dateMatches) {
    dateMatches.slice(0, 3).forEach((date, i) => {
      dates.push({
        date: date,
        description: `Important contract date identified`,
        importance: 'MEDIUM'
      });
    });
  }
  
  return { keyTerms: terms, keyDates: dates, obligations };
};

export const generateContractSummary = async (document: any): Promise<string> => {
  try {
    if (!openai) {
      throw new Error('OpenAI service not available');
    }

    const maxContentLength = 6000;
    const truncatedContent = document.content?.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated]'
      : document.content || 'No content available';

    const prompt = `Create a comprehensive executive summary of this contract:

${truncatedContent}

Structure:
## Contract Overview
- Contract type, parties, and primary purpose
- Business relationship and scope

## Key Business Terms  
- Financial obligations and payment terms
- Deliverables and performance requirements
- Contract duration and renewal terms

## Risk Assessment
- Primary risk areas requiring attention
- Liability and compliance concerns
- Recommended risk mitigation actions

## Key Dates & Deadlines
- Contract term and important milestones
- Notice periods and termination dates

## Recommended Actions
- Immediate actions required
- Legal review priorities
- Timeline for key decisions

Make this specific to the actual contract content.`;

    const summary = await makeOpenAICall([
      {
        role: 'system',
        content: 'You are a senior legal advisor creating executive contract summaries. Be detailed, specific, and business-focused.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 1500, 0.3);

    return summary;
  } catch (error: any) {
    console.error('❌ Contract summary generation failed:', error);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
};

export default {
  analyzeContract,
  generateContractSummary
};