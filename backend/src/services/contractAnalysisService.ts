// backend/src/services/contractAnalysisService.ts
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

// Enhanced OpenAI response validator
class SafeOpenAIResponse {
  static extractContent(response: any): string {
    try {
      console.log('🔍 Examining OpenAI response structure:', JSON.stringify(response, null, 2));
      
      if (!response) {
        throw new Error('Response is null or undefined');
      }

      if (!response.choices) {
        throw new Error('Response has no choices array');
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
        throw new Error('Choice has no message');
      }

      if (!firstChoice.message.content) {
        throw new Error('Message has no content');
      }

      const content = firstChoice.message.content.trim();
      if (!content) {
        throw new Error('Content is empty after trimming');
      }

      console.log('✅ Successfully extracted content, length:', content.length);
      return content;
      
    } catch (error) {
      console.error('❌ Error extracting OpenAI response:', error);
      console.error('Response object:', response);
      throw error;
    }
  }
}

// Enhanced rate limiter with better error handling
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
        console.log(`🔄 API attempt ${attempt}/${maxRetries}`);
        return await apiCall();
      } catch (error: any) {
        console.error(`❌ API attempt ${attempt} failed:`, error.message);
        
        if (error.status === 429 && attempt < maxRetries) {
          const retryAfter = error.headers?.['retry-after-ms'] 
            ? parseInt(error.headers['retry-after-ms'])
            : Math.pow(2, attempt) * 1000;
          
          console.log(`⏳ Rate limit hit. Waiting ${retryAfter}ms before retry...`);
          await this.delay(retryAfter);
          continue;
        }
        
        if (attempt < maxRetries) {
          console.log(`⏳ Retrying in ${attempt * 2000}ms...`);
          await this.delay(attempt * 2000);
          continue;
        }
        
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }
}

// Safe JSON parser with better error handling
const safeJSONParse = (text: string, fallback: any = {}) => {
  try {
    console.log('🔍 Attempting to parse JSON, content preview:', text.substring(0, 200));
    
    let cleanText = text.trim();
    
    // Remove code block markers
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    cleanText = cleanText.trim();
    
    // Check if it starts with expected JSON characters
    if (!cleanText.startsWith('{') && !cleanText.startsWith('[')) {
      console.warn('⚠️ Content does not start with JSON. First 100 chars:', cleanText.substring(0, 100));
      return fallback;
    }
    
    const parsed = JSON.parse(cleanText);
    console.log('✅ Successfully parsed JSON');
    return parsed;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
    console.warn('❌ JSON parsing failed:', errorMessage);
    console.warn('Content that failed to parse (first 500 chars):', text.substring(0, 500));
    return fallback;
  }
};

// Validation helpers
const validateRiskCategory = (category: string): 'LIABILITY' | 'TERMINATION' | 'IP' | 'PAYMENT' | 'COMPLIANCE' | 'CONFIDENTIALITY' | 'DATA_PRIVACY' | 'REGULATORY' | 'OTHER' => {
  const validCategories = ['LIABILITY', 'TERMINATION', 'IP', 'PAYMENT', 'COMPLIANCE', 'CONFIDENTIALITY', 'DATA_PRIVACY', 'REGULATORY', 'OTHER'];
  const upperCategory = category?.toUpperCase() || 'OTHER';
  return validCategories.includes(upperCategory) ? upperCategory as any : 'OTHER';
};

const validateSeverity = (severity: string): 'HIGH' | 'MEDIUM' | 'LOW' => {
  const validSeverities = ['HIGH', 'MEDIUM', 'LOW'];
  const upperSeverity = severity?.toUpperCase() || 'MEDIUM';
  return validSeverities.includes(upperSeverity) ? upperSeverity as any : 'MEDIUM';
};

// Enhanced OpenAI API call with better error handling
const enhancedOpenAICall = async (
  messages: any[], 
  maxTokens: number = 1000, 
  model: string = 'gpt-3.5-turbo'
): Promise<string> => {
  try {
    console.log(`🤖 Making OpenAI API call with model: ${model}, max_tokens: ${maxTokens}`);
    console.log('📝 Message count:', messages.length);
    
    return await RateLimitHandler.handleRateLimit(async () => {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.2,
        max_tokens: maxTokens,
      });
      
      console.log('📨 Raw OpenAI response received');
      return SafeOpenAIResponse.extractContent(response);
    });
    
  } catch (error: any) {
    console.error(`❌ OpenAI API call failed with model ${model}:`, error.message);
    
    // Try fallback to simpler model
    if (model === 'gpt-4') {
      console.log('🔄 Falling back to GPT-3.5-turbo...');
      try {
        return await RateLimitHandler.handleRateLimit(async () => {
          const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0.2,
            max_tokens: Math.min(maxTokens, 1000),
          });
          
          return SafeOpenAIResponse.extractContent(response);
        });
      } catch (fallbackError: any) {
        console.error('❌ GPT-3.5 fallback also failed:', fallbackError.message);
        throw new Error(`Both GPT-4 and GPT-3.5 failed: ${fallbackError.message}`);
      }
    }
    
    throw error;
  }
};

export const analyzeContract = async (document: any): Promise<ContractAnalysis> => {
  try {
    console.log(`🔍 Starting contract analysis for: ${document.originalName || document.name}`);
    
    if (!document.content || document.content.length < 100) {
      throw new Error('Document content is too short or missing for analysis');
    }

    // Use reasonable content window
    const maxContentLength = 6000; // Reduced to avoid token limits
    const truncatedContent = document.content.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated for analysis]'
      : document.content;

    console.log(`Processing contract content (${truncatedContent.length} characters)`);

    // Step 1: Simple Executive Summary (no complex JSON parsing)
    const summaryPrompt = `Analyze this legal contract and provide a clear executive summary.

Contract Content:
${truncatedContent}

Provide a structured summary covering:
1. What type of contract this is and who the parties are
2. The main purpose and key business terms
3. Top 3 business risks identified
4. Top 3 recommended actions

Keep it concise and professional. Do not use JSON format - use plain text with clear headings.`;

    let executiveSummary;
    try {
      executiveSummary = await enhancedOpenAICall([
        { 
          role: 'system', 
          content: 'You are a senior business consultant analyzing legal contracts. Be specific and concise. Use plain text formatting, not JSON.' 
        },
        { role: 'user', content: summaryPrompt }
      ], 800, 'gpt-3.5-turbo'); // Start with GPT-3.5 for reliability
      
      console.log('✅ Successfully generated executive summary');
    } catch (summaryError) {
      console.warn('❌ Failed to generate executive summary:', summaryError);
      executiveSummary = `Contract Analysis Summary
      
This contract has been uploaded and processed, but detailed AI analysis is temporarily unavailable.

Key Information:
- Document: ${document.originalName || document.name}
- Content Length: ${document.content?.length || 0} characters
- Analysis Date: ${new Date().toLocaleDateString()}

Recommended Actions:
1. Review the contract manually for key terms and conditions
2. Consult with legal counsel for detailed analysis
3. Extract important dates and deadlines
4. Identify liability and payment terms`;
    }

    // Step 2: Simple Risk Analysis (avoid complex JSON)
    const riskPrompt = `Analyze this contract for business risks. Keep it simple and clear.

Contract Content:
${truncatedContent}

Identify:
1. Overall risk level (LOW, MEDIUM, or HIGH)
2. Main risk areas (liability, payments, termination, etc.)
3. Specific problematic clauses if any

Provide a clear, structured response. Do not use complex JSON - use simple bullet points.`;

    let riskAnalysis;
    let overallRiskScore = 50; // Default medium risk
    let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    
    try {
      riskAnalysis = await enhancedOpenAICall([
        { 
          role: 'system', 
          content: 'You are a legal risk analyst. Provide clear, structured risk analysis using bullet points, not JSON.' 
        },
        { role: 'user', content: riskPrompt }
      ], 600, 'gpt-3.5-turbo');
      
      console.log('✅ Successfully analyzed risks');
      
      // Try to extract risk level from response
      const lowerResponse = riskAnalysis.toLowerCase();
      if (lowerResponse.includes('high risk') || lowerResponse.includes('risk level: high')) {
        overallRiskScore = 75;
        riskScore = 'HIGH';
      } else if (lowerResponse.includes('low risk') || lowerResponse.includes('risk level: low')) {
        overallRiskScore = 25;
        riskScore = 'LOW';
      }
      
    } catch (riskError) {
      console.warn('❌ Failed to analyze risks:', riskError);
      riskAnalysis = 'Risk analysis temporarily unavailable. Manual review recommended.';
    }

    // Create safe analysis object with defaults
    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || 
             doc.id?.toString() || 
             doc.documentId?.toString() || 
             'unknown-id';
    };

    const analysis: ContractAnalysis = {
      documentId: getDocumentId(document),
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore,
      executiveSummary: {
        overview: executiveSummary || 'Analysis completed but summary unavailable',
        keyDates: [], // Simple empty array to avoid complexity
        obligations: [],
        recommendedActions: [
          'Review contract with legal counsel',
          'Identify key dates and deadlines',
          'Clarify any ambiguous terms',
          'Assess compliance requirements'
        ]
      },
      riskAnalysis: {
        overallScore: overallRiskScore,
        riskFactors: [{
          category: 'OTHER',
          severity: 'MEDIUM',
          description: riskAnalysis || 'Risk analysis completed but details unavailable',
          clause: 'See full contract for specific clauses',
          recommendation: 'Conduct detailed legal review'
        }]
      },
      keyTerms: [], // Simple empty array
      problematicClauses: [],
      analyzedAt: new Date()
    };

    console.log(`✅ Contract analysis completed for: ${document.originalName || document.name}`);
    console.log(`📊 Risk Score: ${overallRiskScore}/100 (${riskScore})`);
    
    return analysis;

  } catch (error: any) {
    console.error('❌ Error analyzing contract:', error);
    
    // Return safe fallback analysis
    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || doc.id?.toString() || 'unknown-id';
    };

    return {
      documentId: getDocumentId(document),
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore: 'MEDIUM',
      executiveSummary: {
        overview: `Contract analysis failed due to technical issue: ${error.message}. Manual review required.`,
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
          category: 'OTHER',
          severity: 'MEDIUM',
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
    const maxContentLength = 5000;
    const truncatedContent = document.content?.length > maxContentLength 
      ? document.content.substring(0, maxContentLength) + '...[truncated]'
      : document.content || 'No content available';

    const prompt = `Create a professional executive summary of this contract:

${truncatedContent}

Format as a clear, readable summary with these sections:
- Contract Overview
- Key Business Terms  
- Main Obligations
- Important Dates
- Risk Areas
- Recommended Actions

Keep it concise and executive-friendly.`;

    try {
      const summary = await enhancedOpenAICall([
        {
          role: 'system',
          content: 'You are a legal advisor creating executive contract summaries. Be concise and professional.'
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
This document has been uploaded and processed successfully.

## Key Information
- Document Name: ${document.originalName || document.name}
- File Size: ${document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'}
- Content Length: ${document.content ? `${document.content.length} characters` : 'No content extracted'}
- Processing Date: ${new Date().toLocaleDateString()}

## Status
Basic processing completed. Detailed AI analysis temporarily unavailable.

## Recommended Next Steps
1. Review the document manually for key terms
2. Consult with legal counsel for detailed analysis
3. Extract important dates and deadlines manually
4. Try the AI analysis again later

## Note
This is a basic summary. For detailed AI-powered analysis, please try again or contact support if issues persist.`;
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