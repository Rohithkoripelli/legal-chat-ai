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

// Content sanitizer to avoid content filter issues
const sanitizeContentForOpenAI = (content: string): string => {
  console.log('🧹 Sanitizing content for OpenAI...');
  
  // Remove binary/non-printable characters that might trigger content filter
  let cleaned = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
  
  // Remove common PDF artifacts that trigger content filters
  cleaned = cleaned.replace(/\b(endstream|endobj|xref|trailer|startxref)\b/gi, '');
  cleaned = cleaned.replace(/\b(CreationDate|ModDate|Producer|Title)\b\s*\([^)]*\)/gi, '');
  cleaned = cleaned.replace(/\/[A-Za-z]+\s*\d+/g, ''); // Remove PDF commands like /Type 1
  cleaned = cleaned.replace(/<<[^>]*>>/g, ''); // Remove PDF dictionary objects
  cleaned = cleaned.replace(/\s+/g, ' '); // Normalize whitespace
  
  // Extract only meaningful text content
  const sentences = cleaned.split(/[.!?]+/).filter(sentence => {
    const trimmed = sentence.trim();
    return trimmed.length > 10 && // Meaningful length
           /[a-zA-Z]/.test(trimmed) && // Contains letters
           !(/^[^a-zA-Z]*$/.test(trimmed)); // Not just special characters
  });
  
  const sanitized = sentences.join('. ').trim();
  console.log(`✅ Content sanitized: ${content.length} → ${sanitized.length} characters`);
  
  return sanitized;
};

// Enhanced OpenAI response validator with content filter handling
class SafeOpenAIResponse {
  static extractContent(response: any): string {
    try {
      console.log('🔍 Examining OpenAI response...');
      
      if (!response || !response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
        throw new Error('Invalid response structure');
      }

      const firstChoice = response.choices[0];
      if (!firstChoice) {
        throw new Error('First choice is null or undefined');
      }

      // Check for content filter specifically
      if (firstChoice.finish_reason === 'content_filter') {
        console.error('🚫 OpenAI Content Filter Triggered!');
        console.error('This usually means the content contains text that OpenAI flagged as potentially inappropriate.');
        console.error('Common causes: Binary data, special characters, or garbled PDF text.');
        throw new Error('CONTENT_FILTER_TRIGGERED');
      }

      if (!firstChoice.message || firstChoice.message.content === null || firstChoice.message.content === undefined) {
        throw new Error(`No content in message. Finish reason: ${firstChoice.finish_reason}`);
      }

      const content = String(firstChoice.message.content).trim();
      if (!content) {
        throw new Error(`Empty content after trimming. Finish reason: ${firstChoice.finish_reason}`);
      }

      console.log('✅ Successfully extracted content, length:', content.length);
      return content;
      
    } catch (error) {
      console.error('❌ Error extracting OpenAI response:', error);
      throw error;
    }
  }
}

// Enhanced rate limiter
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
        
        // Don't retry content filter errors - they won't resolve with retries
        if (error.message === 'CONTENT_FILTER_TRIGGERED') {
          throw error;
        }
        
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

// Safe OpenAI API call with content filter handling
const safeOpenAICall = async (
  messages: any[], 
  maxTokens: number = 1000, 
  model: string = 'gpt-3.5-turbo'
): Promise<string> => {
  try {
    console.log(`🤖 Making OpenAI API call with model: ${model}, max_tokens: ${maxTokens}`);
    
    return await RateLimitHandler.handleRateLimit(async () => {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
      });
      
      return SafeOpenAIResponse.extractContent(response);
    });
    
  } catch (error: any) {
    console.error(`❌ OpenAI API call failed:`, error.message);
    
    if (error.message === 'CONTENT_FILTER_TRIGGERED') {
      throw new Error('Content was flagged by OpenAI safety filter. This usually indicates garbled or inappropriate text in the document.');
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

    // STEP 1: Clean and sanitize the content
    console.log('🧹 Sanitizing document content...');
    const sanitizedContent = sanitizeContentForOpenAI(document.content);
    
    if (sanitizedContent.length < 50) {
      console.warn('⚠️ Sanitized content is very short, may indicate poor PDF extraction');
    }

    // Use smaller content window to avoid token limits and filter issues
    const maxContentLength = 3000; // Reduced significantly
    const truncatedContent = sanitizedContent.length > maxContentLength 
      ? sanitizedContent.substring(0, maxContentLength) + '...[content truncated for analysis]'
      : sanitizedContent;

    console.log(`📄 Processing sanitized content (${truncatedContent.length} characters)`);

    // STEP 2: Simple, safe executive summary
    const summaryPrompt = `Please analyze this business contract and provide a brief professional summary.

Contract text:
${truncatedContent}

Please provide:
1. Document type and main parties
2. Key business purpose  
3. Primary obligations
4. Notable terms or conditions

Keep the response professional and concise.`;

    let executiveSummary = '';
    try {
      console.log('📝 Generating executive summary...');
      executiveSummary = await safeOpenAICall([
        { 
          role: 'system', 
          content: 'You are a professional business analyst. Provide clear, factual analysis of business contracts. Avoid speculation and focus on observable facts from the document.'
        },
        { role: 'user', content: summaryPrompt }
      ], 600, 'gpt-3.5-turbo');
      
      console.log('✅ Successfully generated executive summary');
    } catch (summaryError: any) {
      console.warn('❌ Failed to generate executive summary:', summaryError.message);
      
      // Check if it's a content filter issue
      if (summaryError.message.includes('Content was flagged')) {
        executiveSummary = `⚠️ Content Analysis Blocked

The document content triggered OpenAI's safety filter, which typically indicates:
- Garbled or corrupted text from PDF extraction
- Binary data mixed with text content
- Special characters that appear inappropriate to AI safety systems

Document Information:
- Name: ${document.originalName || document.name}
- Size: ${document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'}
- Content Length: ${document.content?.length || 0} characters

Recommended Actions:
1. Try re-uploading the document in a different format (Word, plain text)
2. Check if the PDF has selectable text (not a scanned image)
3. Contact support if the issue persists with clean documents`;
      } else {
        executiveSummary = `Contract Analysis Summary

Document: ${document.originalName || document.name}
Analysis Date: ${new Date().toLocaleDateString()}

The document has been processed but detailed AI analysis is currently unavailable due to technical limitations.

Recommended Actions:
1. Review the contract manually for key terms
2. Consult with legal counsel for detailed analysis
3. Extract important dates and deadlines manually
4. Contact support if this issue persists`;
      }
    }

    // STEP 3: Risk assessment (simplified to avoid filter issues)
    let riskScore: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
    let overallRiskScore = 50;
    let riskAnalysis = 'Risk analysis temporarily unavailable due to content processing limitations.';

    // Try a simple, safe risk analysis
    try {
      const simpleRiskPrompt = `Based on this contract excerpt, what is the overall business risk level?

Contract excerpt:
${truncatedContent.substring(0, 1500)} // Even smaller excerpt

Please respond with just:
RISK LEVEL: [LOW/MEDIUM/HIGH]
REASON: [brief explanation]`;

      console.log('📊 Performing basic risk assessment...');
      const riskResponse = await safeOpenAICall([
        { 
          role: 'system', 
          content: 'You are a risk analyst. Provide a simple risk assessment based on contract complexity and standard business terms.'
        },
        { role: 'user', content: simpleRiskPrompt }
      ], 300, 'gpt-3.5-turbo');
      
      // Extract risk level from response
      const lowerResponse = riskResponse.toLowerCase();
      if (lowerResponse.includes('risk level: high')) {
        riskScore = 'HIGH';
        overallRiskScore = 75;
      } else if (lowerResponse.includes('risk level: low')) {
        riskScore = 'LOW';
        overallRiskScore = 25;
      }
      
      riskAnalysis = riskResponse;
      console.log('✅ Basic risk assessment completed');
      
    } catch (riskError: any) {
      console.warn('❌ Risk assessment failed:', riskError.message);
      // Keep default values
    }

    // Create safe analysis result
    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || doc.id?.toString() || 'unknown-id';
    };

    const analysis: ContractAnalysis = {
      documentId: getDocumentId(document),
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore,
      executiveSummary: {
        overview: executiveSummary,
        keyDates: [],
        obligations: [],
        recommendedActions: [
          'Review contract with qualified legal counsel',
          'Identify and calendar key dates and deadlines',
          'Clarify any ambiguous terms with counterparty',
          'Assess compliance requirements and obligations',
          'Consider contract amendment if high-risk areas identified'
        ]
      },
      riskAnalysis: {
        overallScore: overallRiskScore,
        riskFactors: [{
          category: 'OTHER',
          severity: 'MEDIUM',
          description: riskAnalysis,
          clause: 'See full contract for specific clause analysis',
          recommendation: 'Conduct comprehensive legal review with qualified attorney'
        }]
      },
      keyTerms: [],
      problematicClauses: [],
      analyzedAt: new Date()
    };

    console.log(`✅ Contract analysis completed for: ${document.originalName || document.name}`);
    console.log(`📊 Risk Score: ${overallRiskScore}/100 (${riskScore})`);
    
    return analysis;

  } catch (error: any) {
    console.error('❌ Error analyzing contract:', error);
    
    // Create safe fallback analysis
    const getDocumentId = (doc: any): string => {
      return doc._id?.toString() || doc.id?.toString() || 'unknown-id';
    };

    const isContentFilterError = error.message?.includes('Content was flagged') || 
                                error.message?.includes('CONTENT_FILTER_TRIGGERED');

    return {
      documentId: getDocumentId(document),
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore: 'MEDIUM',
      executiveSummary: {
        overview: isContentFilterError 
          ? `⚠️ Analysis Blocked: The document content triggered safety filters, likely due to garbled PDF text extraction. Try re-uploading in a different format or ensure the PDF has selectable text.`
          : `Analysis failed due to: ${error.message}. Manual review required.`,
        keyDates: [],
        obligations: [],
        recommendedActions: [
          isContentFilterError ? 'Re-upload document in Word or clean PDF format' : 'Conduct manual contract review',
          'Consult with legal counsel for detailed analysis',
          'Extract key terms and dates manually',
          'Contact support if technical issues persist'
        ]
      },
      riskAnalysis: {
        overallScore: 50,
        riskFactors: [{
          category: 'OTHER',
          severity: 'MEDIUM',
          description: isContentFilterError 
            ? 'Content filter triggered - document may contain garbled text from poor PDF extraction'
            : 'Automated analysis failed - manual review required',
          clause: 'Full contract review needed',
          recommendation: 'Consult with legal professional for comprehensive analysis'
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
    console.log('📄 Generating contract summary...');
    
    // Sanitize content first
    const sanitizedContent = sanitizeContentForOpenAI(document.content || '');
    const maxContentLength = 2000; // Keep it small
    const truncatedContent = sanitizedContent.length > maxContentLength 
      ? sanitizedContent.substring(0, maxContentLength) + '...[truncated]'
      : sanitizedContent;

    if (truncatedContent.length < 50) {
      throw new Error('Insufficient content for summary generation');
    }

    const prompt = `Please create a brief professional summary of this business document:

${truncatedContent}

Include:
- Document type and purpose
- Key parties (if identifiable)
- Main business terms
- Important obligations or conditions

Keep the summary concise and professional.`;

    try {
      const summary = await safeOpenAICall([
        {
          role: 'system',
          content: 'You are a professional document analyst. Create clear, factual summaries of business documents.'
        },
        {
          role: 'user',
          content: prompt
        }
      ], 800, 'gpt-3.5-turbo');

      return summary;
      
    } catch (apiError: any) {
      console.error('❌ Summary generation failed:', apiError.message);
      
      const isContentFilterError = apiError.message?.includes('Content was flagged');
      
      return `# Contract Summary: ${document.originalName || document.name}

## Status
${isContentFilterError 
  ? '⚠️ **Content Filter Issue**: The document content triggered AI safety filters, likely due to garbled text from PDF extraction.' 
  : '❌ **Analysis Unavailable**: Detailed AI summary could not be generated due to technical limitations.'}

## Document Information
- **Name**: ${document.originalName || document.name}
- **Size**: ${document.size ? `${Math.round(document.size / 1024)} KB` : 'Unknown'}
- **Content**: ${document.content ? `${document.content.length} characters extracted` : 'No content extracted'}
- **Date Processed**: ${new Date().toLocaleDateString()}

## Recommended Actions
${isContentFilterError 
  ? `1. **Re-upload** the document in Word format (.docx) or as a clean, selectable PDF
2. **Verify** the PDF has selectable text (not a scanned image)
3. **Check** for document corruption or unusual formatting
4. **Contact support** if clean documents still trigger this issue`
  : `1. **Manual Review**: Examine the document directly for key terms and conditions
2. **Legal Consultation**: Consult with qualified legal counsel for detailed analysis
3. **Key Dates**: Extract important deadlines and dates manually
4. **Retry**: Try the analysis again later when technical issues are resolved`}

## Technical Notes
${isContentFilterError 
  ? 'Content filters are designed to prevent analysis of inappropriate material. For legal documents, this usually indicates text extraction issues rather than actual content problems.'
  : 'This is a technical limitation that may be resolved by re-uploading the document or trying again later.'}`;
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