import { IDocument } from '../models/Document';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

// Initialize OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

try {
  if (OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    console.log('✅ OpenAI initialized');
  } else {
    console.warn('⚠️ No OpenAI API key found');
  }
} catch (error) {
  console.error('❌ OpenAI initialization error:', error);
}

/**
 * Process a message using OpenAI
 */
export const processMessage = async (
  message: string, 
  documents: any[] = []
): Promise<string> => {
  try {
    console.log(`\n======== AI SERVICE: PROCESS MESSAGE ========`);
    console.log(`Message: "${message}"`);
    console.log(`Documents: ${documents.length}`);
    
    // Get document IDs for vector search
    const documentIds = documents.map(doc => doc._id ? doc._id.toString() : doc.id ? doc.id.toString() : '');
    
    // Try vector search first
    let context = '';
    let usingVectorSearch = false;
    
    try {
      if (documentIds.length > 0 && documentIds[0]) {
        console.log('🔍 Trying vector search...');
        const { getRelevantContext } = await import('./vectorizationService');
        context = await getRelevantContext(message, documentIds, 5);
        
        if (context && context.length > 100 && !context.includes('Error')) {
          usingVectorSearch = true;
          console.log(`✅ Vector search successful (${context.length} chars)`);
        } else {
          throw new Error('Vector search insufficient');
        }
      }
    } catch (vectorError) {
      console.warn('⚠️ Vector search failed, using document content');
      
      // Fall back to document content
      if (documents.length > 0) {
        const documentContexts = documents.map(doc => {
          const docName = doc.originalName || doc.name || 'Document';
          const docContent = doc.content || 'No content';
          const truncated = docContent.length > 3000 
            ? docContent.substring(0, 3000) + '...[truncated]'
            : docContent;
          return `Document: ${docName}\n\nContent:\n${truncated}\n`;
        });
        
        context = documentContexts.join('\n---\n');
        console.log(`📄 Document context created (${context.length} chars)`);
      }
    }

    // If no OpenAI, return fallback
    if (!openai || !OPENAI_API_KEY) {
      console.log('🚫 OpenAI not available');
      return generateFallbackResponse(message, documents);
    }

    // System prompt
    const systemPrompt = `You are a legal document assistant. Help users understand their legal documents and answer questions about the content.
      
      Guidelines:
      - Be clear, precise, and helpful
      - Use headers and bullet points when appropriate
      - Cite specific sections when referencing documents
      - Explain legal terms in simple language
      - Always note that this is not legal advice
      - Suggest consulting with attorneys for legal counsel
      
      ${usingVectorSearch ? 'You have access to the most relevant document sections.' : 'You have access to document content.'}`;
    
    // Build messages
    const messages = [
      { role: 'system', content: systemPrompt },
    ];
    
    if (context) {
      const contextMessage = usingVectorSearch 
        ? `Most relevant sections:\n\n${context}`
        : `Document content:\n\n${context}`;
        
      messages.push({ role: 'system', content: contextMessage });
    }
    
    messages.push({ role: 'user', content: message });

    console.log('🔄 Calling OpenAI...');
    
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }
    
    console.log(`✅ Response received (${aiResponse.length} chars)`);
    
    // Add disclaimer
    let finalResponse = aiResponse;
    if (!aiResponse.includes("not legal advice")) {
      finalResponse += "\n\n**⚖️ Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Consult with a qualified attorney for legal counsel.";
    }
    
    // Add method indicator
    const methodNote = usingVectorSearch 
      ? "\n\n*🔍 Response generated using semantic search of document content.*"
      : "\n\n*📄 Response generated using document content analysis.*";
    
    console.log('======== END AI SERVICE ========\n');
    return finalResponse + methodNote;
    
  } catch (error) {
    console.error('❌ AI service error:', error);
    return generateFallbackResponse(message, documents, error instanceof Error ? error.message : 'Unknown error');
  }
};

/**
 * Generate fallback response when AI fails
 */
const generateFallbackResponse = (message: string, documents: any[] = [], errorDetails: string = ''): string => {
  const docNames = documents.map(doc => doc.originalName || doc.name || 'Document').join(', ');
  
  return `Hello! I'm your Legal Document Assistant.

You asked: "${message}"

${documents.length > 0 
  ? `I can see you have ${documents.length} document(s): ${docNames}. However, I'm currently unable to analyze them due to technical limitations.` 
  : `I don't see any documents uploaded. Please upload your legal documents first.`}

**What you can do:**
1. **Try again** - This may be a temporary issue
2. **Upload documents** - Make sure your legal documents are uploaded
3. **Be specific** - Ask about particular sections or terms
4. **Manual review** - Review documents manually for immediate needs

**When working, I can:**
- Analyze legal document content
- Extract key terms and dates
- Identify risks and issues
- Explain legal language simply
- Provide document summaries

**⚖️ Disclaimer**: This is for educational purposes only, not legal advice. Consult with a qualified attorney for legal counsel.

${errorDetails ? `\n*Technical details: ${errorDetails}*` : ''}

Please try again shortly!`;
};

export default {
  processMessage
};