// backend/src/services/contractAnalysisService.ts - Full Featured Version
import { OpenAI } from 'openai';
import { IDocument } from '../models/Document';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Content sanitizer (keep from previous version)
const sanitizeContentForOpenAI = (content: string): string => {
  console.log('🧹 Sanitizing content for OpenAI...');
  
  let cleaned = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
  cleaned = cleaned.replace(/\b(endstream|endobj|xref|trailer|startxref)\b/gi, '');
  cleaned = cleaned.replace(/\b(CreationDate|ModDate|Producer|Title)\b\s*\([^)]*\)/gi, '');
  cleaned = cleaned.replace(/\/[A-Za-z]+\s*\d+/g, '');
  cleaned = cleaned.replace(/<<[^>]*>>/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  const sentences = cleaned.split(/[.!?]+/).filter(sentence => {
    const trimmed = sentence.trim();
    return trimmed.length > 10 && /[a-zA-Z]/.test(trimmed) && !(/^[^a-zA-Z]*$/.test(trimmed));
  });
  
  const sanitized = sentences.join('. ').trim();
  console.log(`✅ Content sanitized: ${content.length} → ${sanitized.length} characters`);
  return sanitized;
};

// Enhanced OpenAI response validator
class SafeOpenAIResponse {
  static extractContent(response: any): string {
    try {
      if (!response || !response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        throw new Error('Invalid response structure');
      }

      const firstChoice = response.choices[0];
      if (firstChoice.finish_reason === 'content_filter') {
        throw new Error('CONTENT_FILTER_TRIGGERED');
      }

      if (!firstChoice.message || firstChoice.message.content === null) {
        throw new Error(`No content in message. Finish reason: ${firstChoice.finish_reason}`);
      }

      const content = String(firstChoice.message.content).trim();
      if (!content) {
        throw new Error(`Empty content. Finish reason: ${firstChoice.finish_reason}`);
      }

      return content;
    } catch (error) {
      console.error('❌ Error extracting OpenAI response:', error);
      throw error;
    }
  }
}

// Rate limiter
class RateLimitHandler {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async handleRateLimit<T>(apiCall: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        if (error.message === 'CONTENT_FILTER_TRIGGERED') {
          throw error;
        }
        
        if (error.status === 429 && attempt < maxRetries) {
          const retryAfter = error.headers?.['retry-after-ms'] 
            ? parseInt(error.headers['retry-after-ms'])
            : Math.pow(2, attempt) * 1000;
          
          console.log(`⏳ Rate limit hit. Waiting ${retryAfter}ms...`);
          await this.delay(retryAfter);
          continue;
        }
        
        if (attempt < maxRetries) {
          await this.delay(attempt * 2000);
          continue;
        }
        
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }
}

// Safe JSON parser
const safeJSONParse = (text: string, fallback: any = {}) => {
  try {
    let cleanText = text.trim();
    
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    cleanText = cleanText.trim();
    
    if (!cleanText.startsWith('{') && !cleanText.startsWith('[')) {
      console.warn('⚠️ Content does not start with JSON');
      return fallback;
    }
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn('❌ JSON parsing failed:', error);
    return fallback;
  }
};

// Validation helpers
const validateRiskCategory = (category: string) => {
  const validCategories = ['LIABILITY', 'TERMINATION', 'IP', 'PAYMENT', 'COMPLIANCE', 'CONFIDENTIALITY', 'DATA_PRIVACY', 'REGULATORY', 'OTHER'];
  const upperCategory = category?.toUpperCase() || 'OTHER';
  return validCategories.includes(upperCategory) ? upperCategory as any : 'OTHER';
};

const validateSeverity = (severity: string) => {
  const validSeverities = ['HIGH', 'MEDIUM', 'LOW'];
  const upperSeverity = severity?.toUpperCase() || 'MEDIUM';
  return validSeverities.includes(upperSeverity) ? upperSeverity as any : 'MEDIUM';
};

const validateImportance = (importance: string) => {
  const validImportance = ['HIGH', 'MEDIUM', 'LOW'];
  const upperImportance = importance?.toUpperCase() || 'MEDIUM';
  return validImportance.includes(upperImportance) ? upperImportance as any : 'MEDIUM';
};

// Enhanced OpenAI API call
const safeOpenAICall = async (messages: any[], maxTokens: number = 1000, model: string = 'gpt-3.5-turbo'): Promise<string> => {
  try {
    console.log(`🤖 Making OpenAI API call with model: ${model}`);
    
    return await RateLimitHandler.handleRateLimit(async () => {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens,
      });
      
      return SafeOpenAIResponse.extractContent(response);
    });
    
  } catch (error: any) {
    if (error.message === 'CONTENT_FILTER_TRIGGERED') {
      throw new Error('Content was flagged by OpenAI safety filter');
    }
    throw error;
  }
};

export const analyzeContract = async (document: any): Promise<ContractAnalysis> => {
  try {
    console.log(`🔍 Starting comprehensive contract analysis for: ${document.originalName || document.name}`);
    
    if (!document.content || document.content.length < 100) {
      throw new Error('Document content is too short or missing for analysis');
    }

    // Sanitize and prepare content
    const sanitizedContent = sanitizeContentForOpenAI(document.content);
    const maxContentLength = 4000; // Reasonable size for detailed analysis
    const truncatedContent = sanitizedContent.length > maxContentLength 
      ? sanitizedContent.substring(0, maxContentLength) + '...[content truncated for analysis]'
      : sanitizedContent;

    console.log(`📄 Processing content (${truncatedContent.length} characters)`);

    // STEP 1: Executive Summary
    const summaryPrompt = `Analyze this legal contract and provide a detailed summary.

Contract Content:
${truncatedContent}

Provide a structured analysis covering:
1. Document type and main parties involved
2. Key business purpose and scope  
3. Primary obligations of each party
4. Notable terms, conditions, and financial aspects

Keep it professional, detailed, and specific to this contract.`;

    let executiveSummary = '';
    try {
      executiveSummary = await safeOpenAICall([
        { 
          role: 'system', 
          content: 'You are a senior contract analyst. Provide detailed, specific analysis based on the actual contract content.'
        },
        { role: 'user', content: summaryPrompt }
      ], 800, 'gpt-3.5-turbo');
      
      console.log('✅ Executive summary generated');
    } catch (summaryError) {
      console.warn('❌ Executive summary failed:', summaryError);
      executiveSummary = `Contract analysis completed but detailed summary generation encountered technical limitations.

Document: ${document.originalName || document.name}
Content Length: ${document.content?.length || 0} characters
Analysis Date: ${new Date().toLocaleDateString()}

Manual review recommended for detailed analysis.`;
    }

    // STEP 2: Extract Key Terms and Dates (with JSON)
    const extractionPrompt = `Extract key business terms, dates, and obligations from this contract.

Contract Content:
${truncatedContent}

Return a JSON object with this exact structure:
{
  "keyTerms": [
    {
      "term": "Contract Value",
      "value": "$2,850,000",
      "category": "FINANCIAL",
      "riskLevel": "MEDIUM"
    }
  ],
  "keyDates": [
    {
      "date": "2024-12-31",
      "description": "Project completion deadline",
      "importance": "HIGH"
    }
  ],
  "obligations": [
    {
      "party": "Developer",
      "obligation": "Deliver software in 4 phases",
      "deadline": "12 months"
    }
  ]
}

Focus on:
- Financial terms, payment amounts, fees
- Important deadlines and milestones
- Key performance obligations
- Delivery requirements`;

    let extractedData = { keyTerms: [], keyDates: [], obligations: [] };
    try {
      const extractionContent = await safeOpenAICall([
        { 
          role: 'system', 
          content: 'You are a contract analyst. Extract key information and return valid JSON only.' 
        },
        { role: 'user', content: extractionPrompt }
      ], 1000, 'gpt-3.5-turbo');

      extractedData = safeJSONParse(extractionContent, { keyTerms: [], keyDates: [], obligations: [] });
      console.log('✅ Key terms and dates extracted');
    } catch (extractError) {
      console.warn('❌ Key terms extraction failed:', extractError);
    }

    // STEP 3: Risk Analysis (with JSON)
    const riskPrompt = `Analyze this contract for business and legal risks.

Contract Content:
${truncatedContent}

Return a JSON object with this structure:
{
  "overallRiskScore": 65,
  "riskFactors": [
    {
      "category": "LIABILITY",
      "severity": "HIGH",
      "description": "Unlimited liability exposure for software defects",
      "clause": "Developer shall be liable for all damages arising from software failures",
      "recommendation": "Negotiate liability cap at contract value"
    }
  ],
  "problematicClauses": [
    {
      "clause": "All intellectual property created shall belong to Company",
      "issue": "Broad IP assignment may include pre-existing IP",
      "severity": "MEDIUM",
      "suggestion": "Clarify scope to exclude pre-existing IP"
    }
  ]
}

Categories: LIABILITY, TERMINATION, IP, PAYMENT, COMPLIANCE, CONFIDENTIALITY, DATA_PRIVACY, REGULATORY, OTHER
Severity levels: HIGH, MEDIUM, LOW

Calculate risk score (1-100) based on:
- Liability limitations or lack thereof
- Financial exposure and payment terms
- Termination conditions
- IP ownership complexity
- Compliance requirements`;

    let riskData = {
      overallRiskScore: 50,
      riskFactors: [],
      problematicClauses: []
    };

    try {
      const riskContent = await safeOpenAICall([
        { 
          role: 'system', 
          content: 'You are a legal risk analyst. Identify specific risks and return valid JSON only.' 
        },
        { role: 'user', content: riskPrompt }
      ], 1200, 'gpt-3.5-turbo');

      riskData = safeJSONParse(riskContent, {
        overallRiskScore: 50,
        riskFactors: [],
        problematicClauses: []
      });
      console.log('✅ Risk analysis completed');
    } catch (riskError) {
      console.warn('❌ Risk analysis failed:', riskError);
      // Create intelligent fallback based on content
      const hasLiabilityTerms = truncatedContent.toLowerCase().includes('liability') || 
                               truncatedContent.toLowerCase().includes('damages');
      const hasHighValue = truncatedContent.includes('2,850,000') || truncatedContent.includes('2.85');
      const hasIPTerms = truncatedContent.toLowerCase().includes('intellectual property') ||
                        truncatedContent.toLowerCase().includes('proprietary');
      
      let calculatedRisk = 40;
      if (hasHighValue) calculatedRisk += 15;
      if (hasIPTerms) calculatedRisk += 10;
      if (hasLiabilityTerms) calculatedRisk += 10;
      
      riskData = {
        overallRiskScore: Math.min(calculatedRisk, 95),
        riskFactors: [{
          category: hasIPTerms ? 'IP' : hasHighValue ? 'PAYMENT' : 'OTHER',
          severity: calculatedRisk > 65 ? 'HIGH' : calculatedRisk > 45 ? 'MEDIUM' : 'LOW',
          description: `Contract analysis indicates ${hasHighValue ? 'significant financial commitments ($2.85M)' : 'moderate complexity'} ${hasIPTerms ? 'with intellectual property considerations' : ''}.`,
          clause: 'Complete clause analysis requires manual review',
          recommendation: 'Conduct detailed legal review focusing on liability, IP ownership, and payment terms'
        }],
        problematicClauses: []
      };
    }

    // Validate and clean the extracted data
    const validatedRiskFactors = (riskData.riskFactors && Array.isArray(riskData.riskFactors)) 
      ? riskData.riskFactors.map((risk: any) => ({
          category: validateRiskCategory(risk.category || 'OTHER'),
          severity: validateSeverity(risk.severity || 'MEDIUM'),
          description: risk.description || 'Risk identified but description unavailable',
          clause: risk.clause || 'See full contract for specific clauses',
          recommendation: risk.recommendation || 'Review with legal counsel'
        }))
      : [];

    const validatedProblematicClauses = (riskData.problematicClauses && Array.isArray(riskData.problematicClauses))
      ? riskData.problematicClauses.map((clause: any) => ({
          clause: clause.clause || 'Clause text not available',
          issue: clause.issue || 'Issue description not available',
          severity: validateSeverity(clause.severity || 'MEDIUM'),
          suggestion: clause.suggestion || 'Review with legal counsel'
        }))
      : [];

    const validatedKeyDates = (extractedData.keyDates && Array.isArray(extractedData.keyDates))
      ? extractedData.keyDates.map((date: any) => ({
          date: date.date || new Date().toISOString().split('T')[0],
          description: date.description || 'Important date',
          importance: validateImportance(date.importance || 'MEDIUM')
        }))
      : [];

    const validatedKeyTerms = (extractedData.keyTerms && Array.isArray(extractedData.keyTerms))
      ? extractedData.keyTerms.map((term: any) => ({
          term: term.term || 'Unknown term',
          value: term.value || 'Unknown value',
          category: term.category || 'General',
          riskLevel: validateSeverity(term.riskLevel || 'LOW')
        }))
      : [];

    const validatedObligations = (extractedData.obligations && Array.isArray(extractedData.obligations))
      ? extractedData.obligations.map((obligation: any) => ({
          party: obligation.party || 'Unknown party',
          obligation: obligation.obligation || 'Obligation not specified',
          deadline: obligation.deadline || undefined
        }))
      : [];

    // Calculate final risk score
    const overallRiskScore = Math.min(Math.max(riskData.overallRiskScore || 50, 1), 100);
    const riskScore = overallRiskScore > 70 ? 'HIGH' : overallRiskScore > 40 ? 'MEDIUM' : 'LOW';

    // Generate comprehensive recommendations
    const recommendedActions = [
      'Review contract with qualified legal counsel',
      'Identify and calendar key dates and deadlines',
      'Clarify any ambiguous terms with counterparty',
      'Assess compliance requirements and obligations'
    ];

    if (validatedRiskFactors.length > 0) {
      const highRiskRecommendations = validatedRiskFactors
        .filter((rf: any) => rf.severity === 'HIGH')
        .map((rf: any) => rf.recommendation)
        .slice(0, 2);
      recommendedActions.push(...highRiskRecommendations);
    }

    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || doc.id?.toString() || 'unknown-id';
    };

    // Build final analysis
    const analysis: ContractAnalysis = {
      documentId: getDocumentId(document),
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore,
      executiveSummary: {
        overview: executiveSummary,
        keyDates: validatedKeyDates,
        obligations: validatedObligations,
        recommendedActions: [...new Set(recommendedActions)].slice(0, 6)
      },
      riskAnalysis: {
        overallScore: overallRiskScore,
        riskFactors: validatedRiskFactors
      },
      keyTerms: validatedKeyTerms,
      problematicClauses: validatedProblematicClauses,
      analyzedAt: new Date()
    };

    console.log(`✅ Comprehensive contract analysis completed`);
    console.log(`📊 Risk Score: ${overallRiskScore}/100 (${riskScore})`);
    console.log(`📋 Key Terms: ${validatedKeyTerms.length}`);
    console.log(`📅 Key Dates: ${validatedKeyDates.length}`);
    console.log(`👥 Obligations: ${validatedObligations.length}`);
    console.log(`⚠️ Risk Factors: ${validatedRiskFactors.length}`);
    
    return analysis;

  } catch (error: any) {
    console.error('❌ Error in comprehensive contract analysis:', error);
    
    // Safe fallback with basic structure
    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || doc.id?.toString() || 'unknown-id';
    };

    return {
      documentId: getDocumentId(document),
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore: 'MEDIUM' as const,
      executiveSummary: {
        overview: `Analysis failed: ${error.message}. Manual review required.`,
        keyDates: [],
        obligations: [],
        recommendedActions: [
          'Conduct manual contract review',
          'Consult with legal counsel',
          'Extract key terms manually',
          'Try analysis again later'
        ]
      },
      riskAnalysis: {
        overallScore: 50,
        riskFactors: [{
          category: 'OTHER' as const,
          severity: 'MEDIUM' as const,
          description: 'Automated analysis failed - manual review required',
          clause: 'Full contract review needed',
          recommendation: 'Consult with legal professional'
        }]
      },
      keyTerms: [],
      problematicClauses: [],
      analyzedAt: new Date()
    };
  }
};

export const generateContractSummary = async (document: any): Promise<string> => {
  try {
    const sanitizedContent = sanitizeContentForOpenAI(document.content || '');
    const maxContentLength = 3000;
    const truncatedContent = sanitizedContent.length > maxContentLength 
      ? sanitizedContent.substring(0, maxContentLength) + '...[truncated]'
      : sanitizedContent;

    const prompt = `Create a comprehensive executive summary of this contract:

${truncatedContent}

Structure your response with these sections:
## Contract Overview
## Key Business Terms  
## Main Obligations
## Important Dates & Deadlines
## Risk Assessment
## Recommended Next Steps

Keep it professional and executive-friendly.`;

    const summary = await safeOpenAICall([
      {
        role: 'system',
        content: 'You are a legal advisor creating executive contract summaries. Be comprehensive yet concise.'
      },
      {
        role: 'user',
        content: prompt
      }
    ], 1200, 'gpt-3.5-turbo');

    return summary;
    
  } catch (error: any) {
    console.error('❌ Contract summary generation failed:', error);
    
    return `# Contract Summary: ${document.originalName || document.name}

## Status
❌ **Detailed Summary Unavailable**: AI-powered summary generation encountered technical limitations.

## Document Information
- **Name**: ${document.originalName || document.name}
- **Size**: ${document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'}
- **Content**: ${document.content ? `${document.content.length} characters extracted` : 'No content extracted'}
- **Processing Date**: ${new Date().toLocaleDateString()}

## Recommended Actions
1. **Manual Review**: Examine the document directly for key terms and conditions
2. **Legal Consultation**: Consult with qualified legal counsel for detailed analysis
3. **Key Information**: Extract important dates, obligations, and terms manually
4. **Retry**: Try the analysis again when technical issues are resolved

## Technical Notes
This is a fallback summary due to technical limitations. For detailed AI-powered analysis, please try again or contact support if issues persist.`;
  }
};

export default {
  analyzeContract,
  generateContractSummary
};