// backend/src/services/contractAnalysisService.ts
import { OpenAI } from 'openai';
import { IDocument } from '../models/Document';

// Initialize OpenAI with better error handling
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client initialized for contract analysis');
  } else {
    console.error('❌ OPENAI_API_KEY not found for contract analysis');
  }
} catch (error) {
  console.error('❌ Error initializing OpenAI for contract analysis:', error);
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

// Validation functions
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

// Rate limit handler with exponential backoff
class RateLimitHandler {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async handleRateLimit<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        console.error(`API call attempt ${attempt} failed:`, error.message);
        
        if (error.status === 429 && attempt < maxRetries) {
          console.log(`Rate limit hit. Attempt ${attempt}/${maxRetries}`);
          
          const retryAfter = error.headers?.['retry-after-ms'] 
            ? parseInt(error.headers['retry-after-ms'])
            : Math.pow(2, attempt) * 1000; // Exponential backoff
          
          console.log(`Waiting ${retryAfter}ms before retry...`);
          await this.delay(retryAfter);
          continue;
        }
        
        // If it's not a rate limit error, or we've exhausted retries
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }
}

// Enhanced OpenAI response handler with better error handling
class SafeOpenAIResponse {
  static extractContent(response: any): string {
    try {
      console.log('📥 Received OpenAI response structure:', {
        hasChoices: !!response?.choices,
        choicesLength: response?.choices?.length || 0,
        firstChoiceHasMessage: !!(response?.choices?.[0]?.message),
        firstChoiceHasContent: !!(response?.choices?.[0]?.message?.content)
      });

      if (!response) {
        throw new Error('Response is null or undefined');
      }

      if (!response.choices) {
        throw new Error('Response missing choices array');
      }

      if (!Array.isArray(response.choices)) {
        throw new Error('Response choices is not an array');
      }

      if (response.choices.length === 0) {
        throw new Error('Response choices array is empty');
      }

      const firstChoice = response.choices[0];
      if (!firstChoice) {
        throw new Error('First choice is null or undefined');
      }

      if (!firstChoice.message) {
        throw new Error('First choice missing message object');
      }

      if (!firstChoice.message.content) {
        throw new Error('First choice message missing content');
      }

      const content = firstChoice.message.content.trim();
      if (!content) {
        throw new Error('Message content is empty after trimming');
      }

      console.log('✅ Successfully extracted content:', content.substring(0, 100) + '...');
      return content;
    } catch (error) {
      console.error('❌ Error extracting OpenAI response:', error);
      console.error('📋 Full response object:', JSON.stringify(response, null, 2));
      throw error;
    }
  }
}

// Enhanced API call with better error handling and model fallback
const enhancedOpenAICall = async (messages: any[], maxTokens: number = 1500, model: string = 'gpt-3.5-turbo') => {
  if (!openai) {
    throw new Error('OpenAI client not initialized. Check your OPENAI_API_KEY.');
  }

  try {
    console.log(`🔄 Making OpenAI API call with model: ${model}`);
    console.log(`📊 Request details: ${messages.length} messages, max tokens: ${maxTokens}`);
    
    return await RateLimitHandler.handleRateLimit(async () => {
      const response = await openai!.chat.completions.create({
        model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens,
      });
      
      console.log('📥 Raw OpenAI response received');
      const content = SafeOpenAIResponse.extractContent(response);
      console.log(`✅ Successfully extracted ${content.length} characters from ${model}`);
      return content;
    });
  } catch (error: any) {
    console.error(`❌ OpenAI API call failed with model ${model}:`, error.message);
    
    // Try fallback to GPT-3.5 if we were using GPT-4
    if (model === 'gpt-4') {
      console.log('🔄 Falling back to GPT-3.5-turbo...');
      try {
        return await RateLimitHandler.handleRateLimit(async () => {
          const response = await openai!.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0.2,
            max_tokens: Math.min(maxTokens, 1000),
          });
          
          const content = SafeOpenAIResponse.extractContent(response);
          console.log(`✅ Fallback successful: extracted ${content.length} characters from GPT-3.5`);
          return content;
        });
      } catch (fallbackError: any) {
        console.error('❌ GPT-3.5 fallback also failed:', fallbackError.message);
        throw new Error(`Both models failed. Original: ${error.message}, Fallback: ${fallbackError.message}`);
      }
    }
    
    throw error;
  }
};

export const analyzeContract = async (document: any): Promise<ContractAnalysis> => {
  try {
    console.log(`🔍 Starting contract analysis for: ${document.originalName || document.name}`);
    
    if (!openai) {
      throw new Error('OpenAI service not available. Please check your API key configuration.');
    }

    if (!document.content || document.content.length < 100) {
      throw new Error('Document content is too short or missing for analysis');
    }

    // Use larger content window but split analysis into focused chunks
    const maxContentLength = 8000;
    const truncatedContent = document.content.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated for analysis]'
      : document.content;

    console.log(`📄 Processing contract content (${truncatedContent.length} characters)`);

    // Step 1: Enhanced Executive Summary with structured format
    const summaryPrompt = `Analyze this legal contract and create a structured executive summary.

Contract Content:
${truncatedContent}

Provide a clear, business-focused summary that covers:
1. What this contract is about and who the parties are
2. The key business risks (3-4 specific risks based on actual content)
3. Actionable recommendations (3-4 specific actions)
4. Important dates and deadlines

Be specific and base your analysis on the ACTUAL contract content provided.`;

    let executiveSummary;
    try {
      executiveSummary = await enhancedOpenAICall([
        { role: 'system', content: 'You are a senior business consultant analyzing legal contracts. Be specific and focus on the actual contract content provided.' },
        { role: 'user', content: summaryPrompt }
      ], 1000, 'gpt-3.5-turbo'); // Start with GPT-3.5 to avoid quota issues
      console.log('✅ Successfully generated executive summary');
    } catch (summaryError) {
      console.warn('❌ Failed to generate executive summary:', summaryError);
      executiveSummary = `**Contract Analysis Summary**

This contract analysis was completed but detailed summary generation encountered technical issues.

**Key Points:**
- Document Name: ${document.originalName || document.name}
- Content Length: ${document.content.length} characters
- Analysis completed with limitations

**Recommended Actions:**
1. Conduct comprehensive legal review with qualified attorney
2. Extract and calendar important dates manually
3. Identify key terms and conditions for review
4. Clarify any ambiguous terms with counterparty

**Next Steps:**
- Manual review recommended due to technical limitations
- Legal consultation advised within 7 days
- Implementation after legal approval`;
    }

    // Step 2: Enhanced Risk Analysis with complete clause extraction
    const riskAnalysisPrompt = `Analyze this contract for specific business and legal risks.

Contract Content:
${truncatedContent}

Analyze the contract and identify real risks. Return ONLY valid JSON format:
{
  "overallRiskScore": [number between 1-100, where 1-30=LOW, 31-65=MEDIUM, 66-100=HIGH],
  "riskFactors": [
    {
      "category": "[LIABILITY|IP|PAYMENT|TERMINATION|COMPLIANCE|CONFIDENTIALITY|DATA_PRIVACY|REGULATORY|OTHER]",
      "severity": "[HIGH|MEDIUM|LOW]",
      "description": "[2-3 sentence explanation of the risk]",
      "clause": "[Quote relevant clause text or describe section]",
      "recommendation": "[Specific actionable recommendation]"
    }
  ],
  "problematicClauses": [
    {
      "clause": "[Text of problematic clause or section description]",
      "issue": "[Specific problem]",
      "severity": "[HIGH|MEDIUM|LOW]",
      "suggestion": "[Specific improvement suggestion]"
    }
  ]
}

Calculate risk score based on: liability exposure, financial terms, termination conditions, compliance requirements.`;

    let riskData;
    try {
      const riskContent = await enhancedOpenAICall([
        { role: 'system', content: 'You are a legal risk analyst. Return only valid JSON. Calculate risk scores based on actual contract terms.' },
        { role: 'user', content: riskAnalysisPrompt }
      ], 1500, 'gpt-3.5-turbo');

      riskData = safeJSONParse(riskContent, {
        overallRiskScore: 45,
        riskFactors: [],
        problematicClauses: []
      });
      console.log('✅ Successfully analyzed risks');
    } catch (parseError) {
      console.warn('❌ Failed to parse risk analysis:', parseError);
      
      // Create intelligent defaults based on document content
      const hasUnlimitedLiability = truncatedContent.toLowerCase().includes('unlimited liability') || 
                                   truncatedContent.toLowerCase().includes('no limit') ||
                                   !truncatedContent.toLowerCase().includes('liability cap');
      const isHighValue = /\$[\d,]+/.test(truncatedContent) && 
                         (truncatedContent.includes('million') || truncatedContent.includes('000,000'));
      const hasComplexIP = truncatedContent.toLowerCase().includes('intellectual property') ||
                          truncatedContent.toLowerCase().includes('work product');
      
      // Dynamic risk scoring based on actual content
      let calculatedRisk = 35; // Base score
      if (hasUnlimitedLiability) calculatedRisk += 25;
      if (isHighValue) calculatedRisk += 15;  
      if (hasComplexIP) calculatedRisk += 10;
      
      riskData = {
        overallRiskScore: Math.min(calculatedRisk, 95),
        riskFactors: [{
          category: hasComplexIP ? 'IP' : hasUnlimitedLiability ? 'LIABILITY' : 'OTHER',
          severity: calculatedRisk > 70 ? 'HIGH' : calculatedRisk > 45 ? 'MEDIUM' : 'LOW',
          description: `Contract analysis indicates ${hasUnlimitedLiability ? 'potential unlimited liability exposure' : 'moderate risk levels'} ${isHighValue ? 'with significant financial commitments' : ''}.`,
          clause: 'Clause analysis limited due to processing constraints',
          recommendation: 'Conduct detailed legal review focusing on liability, IP ownership, and payment terms'
        }],
        problematicClauses: []
      };
    }

    // Step 3: Enhanced Key Terms Extraction
    const keyTermsPrompt = `Extract key business terms from this contract.

Contract Content:
${truncatedContent}

Return ONLY valid JSON:
{
  "keyTerms": [
    {
      "term": "[Term name]",
      "value": "[Specific value/amount]",
      "category": "[FINANCIAL|TIMELINE|LEGAL|TECHNICAL|OTHER]",
      "riskLevel": "[HIGH|MEDIUM|LOW]"
    }
  ],
  "keyDates": [
    {
      "date": "[Date or description]",
      "description": "[What happens]",
      "importance": "[HIGH|MEDIUM|LOW]"
    }
  ],
  "obligations": [
    {
      "party": "[Which party]",
      "obligation": "[Specific obligation]",
      "deadline": "[When due if specified]"
    }
  ]
}

Focus on: contract values, payments, important deadlines, key obligations.`;

    let extractedData;
    try {
      const keyTermsContent = await enhancedOpenAICall([
        { role: 'system', content: 'You are a contract analyst extracting key terms. Return only valid JSON.' },
        { role: 'user', content: keyTermsPrompt }
      ], 1000, 'gpt-3.5-turbo');

      extractedData = safeJSONParse(keyTermsContent, {
        keyTerms: [],
        keyDates: [],
        obligations: []
      });
      console.log('✅ Successfully extracted key terms');
    } catch (parseError) {
      console.warn('❌ Failed to parse key terms:', parseError);
      extractedData = {
        keyTerms: [{
          term: 'Manual Review Required',
          value: 'Analysis limited',
          category: 'OTHER',
          riskLevel: 'MEDIUM'
        }],
        keyDates: [{
          date: new Date().toISOString().split('T')[0],
          description: 'Review contract for important dates',
          importance: 'HIGH'
        }],
        obligations: [{
          party: 'Both parties',
          obligation: 'Review contract terms thoroughly',
          deadline: 'Within 7 days'
        }]
      };
    }

    // Calculate dynamic risk score
    const overallRiskScore = Math.min(Math.max(riskData.overallRiskScore || 50, 1), 100);
    const riskScore = overallRiskScore > 70 ? 'HIGH' : 
                     overallRiskScore > 40 ? 'MEDIUM' : 'LOW';

    // Validate and clean data
    const validatedRiskFactors = (riskData.riskFactors && Array.isArray(riskData.riskFactors)) 
      ? riskData.riskFactors.map((risk: any) => ({
          category: validateAndFixRiskCategory(risk.category || 'OTHER'),
          severity: validateAndFixSeverity(risk.severity || 'MEDIUM'),
          description: risk.description || 'Risk description not available',
          clause: risk.clause || 'Clause text not available',
          recommendation: risk.recommendation || 'Review with legal counsel'
        }))
      : [{
          category: 'OTHER' as const,
          severity: 'MEDIUM' as const,
          description: 'General contract risk assessment completed with limitations',
          clause: 'Full clause analysis not available',
          recommendation: 'Comprehensive legal review recommended'
        }];

    const validatedProblematicClauses = (riskData.problematicClauses && Array.isArray(riskData.problematicClauses))
      ? riskData.problematicClauses.map((clause: any) => ({
          clause: clause.clause || 'Clause identification limited',
          issue: clause.issue || 'Issue description not available',
          severity: validateAndFixSeverity(clause.severity || 'MEDIUM'),
          suggestion: clause.suggestion || 'Review with legal counsel'
        }))
      : [];

    const validatedKeyDates = (extractedData.keyDates && Array.isArray(extractedData.keyDates))
      ? extractedData.keyDates.map((date: any) => ({
          date: date.date || new Date().toISOString().split('T')[0],
          description: date.description || 'Important date',
          importance: validateAndFixImportance(date.importance || 'MEDIUM')
        }))
      : [{
          date: new Date().toISOString().split('T')[0],
          description: 'Contract review and analysis completed',
          importance: 'HIGH' as const
        }];

    const validatedKeyTerms = (extractedData.keyTerms && Array.isArray(extractedData.keyTerms))
      ? extractedData.keyTerms.map((term: any) => ({
          term: term.term || 'Unknown term',
          value: term.value || 'Unknown value',
          category: term.category || 'General',
          riskLevel: validateAndFixSeverity(term.riskLevel || 'LOW')
        }))
      : [{
          term: 'Contract Analysis',
          value: 'Completed with technical limitations',
          category: 'Analysis',
          riskLevel: 'MEDIUM' as const
        }];

    // Generate smart recommendations
    const recommendedActions = [];
    
    if (validatedRiskFactors.length > 0) {
      const highRiskRecommendations = validatedRiskFactors
        .filter((rf: any) => rf.severity === 'HIGH' && rf.recommendation)
        .map((rf: any) => rf.recommendation)
        .slice(0, 2);
      
      recommendedActions.push(...highRiskRecommendations);
    }
    
    recommendedActions.push(
      'Conduct thorough legal review with qualified attorney',
      'Document all key dates in project management system',
      'Establish clear communication protocols with counterparty',
      'Review and validate all financial terms and obligations'
    );

    const uniqueRecommendations = [...new Set(recommendedActions)].slice(0, 5);

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
        recommendedActions: uniqueRecommendations
      },
      riskAnalysis: {
        overallScore: overallRiskScore,
        riskFactors: validatedRiskFactors
      },
      keyTerms: validatedKeyTerms,
      problematicClauses: validatedProblematicClauses,
      analyzedAt: new Date()
    };

    console.log(`✅ Contract analysis completed for: ${document.originalName || document.name}`);
    console.log(`📊 Risk Score: ${overallRiskScore}/100 (${riskScore})`);
    console.log(`⚠️ Risk Factors Found: ${validatedRiskFactors.length}`);
    
    return analysis;

  } catch (error: any) {
    console.error('❌ Error analyzing contract:', error);
    throw new Error(`Contract analysis failed: ${error.message}`);
  }
};

export const generateContractSummary = async (document: any): Promise<string> => {
  try {
    if (!openai) {
      throw new Error('OpenAI service not available for summary generation');
    }

    const maxContentLength = 6000;
    const truncatedContent = document.content?.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated]'
      : document.content || 'No content available';

    const prompt = `Create a comprehensive executive summary of this contract:

${truncatedContent}

Structure your response as:

## Contract Overview
- Type and purpose
- Parties involved  
- Duration and key dates

## Key Business Terms
- Financial terms
- Deliverables/services
- Performance metrics

## Risk Assessment  
- High-risk areas
- Missing protections
- Compliance requirements

## Recommended Next Steps
- Immediate actions required
- Risk mitigation strategies
- Timeline for review

Keep it professional and executive-friendly.`;

    try {
      const summary = await enhancedOpenAICall([
        {
          role: 'system',
          content: 'You are a legal advisor creating executive contract summaries. Be concise, professional, and business-focused.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 1200, 'gpt-3.5-turbo');

      return summary;
    } catch (apiError) {
      console.error('❌ Error generating contract summary via API:', apiError);
      
      return `# Contract Summary: ${document.originalName || document.name}

## Contract Overview
This document has been uploaded and processed, but a detailed AI-generated summary could not be created due to API limitations.

## Key Information
- Document Name: ${document.originalName || document.name}
- File Size: ${document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'}
- Upload Date: ${document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : 'Unknown'}
- Content Length: ${document.content ? `${document.content.length} characters` : 'No content extracted'}

## Risk Assessment
- Manual review required due to technical limitations
- Automated risk analysis could not be completed
- Legal counsel consultation strongly recommended

## Recommended Next Steps
1. Review the document manually for key terms and conditions
2. Consult with legal counsel for detailed analysis
3. Extract important dates and deadlines manually
4. Try the analysis again when API services are restored

## Note
This is a fallback summary generated due to API limitations. For detailed AI-powered analysis, please try again later or contact support if the issue persists.`;
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