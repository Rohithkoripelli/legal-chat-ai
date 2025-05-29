import { IDocument } from '../models/Document';
import dotenv from 'dotenv';
import { BulletproofOpenAI } from './bulletproofOpenAI';

// Load environment variables
dotenv.config();

/**
 * Process a message using bulletproof OpenAI with enhanced vector search
 */
export const processMessage = async (
  message: string, 
  documents: any[] = []
): Promise<string> => {
  try {
    console.log(`\n======== BULLETPROOF AI SERVICE: PROCESS MESSAGE ========`);
    console.log(`Message: "${message}"`);
    console.log(`Documents count: ${documents.length}`);
    
    // Get document IDs for vector search
    const documentIds = documents.map(doc => doc._id ? doc._id.toString() : doc.id ? doc.id.toString() : '');
    
    // Try to get relevant context using vector search first
    let context = '';
    let usingVectorSearch = false;
    
    try {
      if (documentIds.length > 0 && documentIds[0]) {
        console.log('🔍 Attempting vector search for relevant content...');
        const { getRelevantContext } = await import('./vectorizationService');
        context = await getRelevantContext(message, documentIds, 5);
        
        if (context && !context.includes('Error') && !context.includes('unavailable') && context.length > 100) {
          usingVectorSearch = true;
          console.log(`✅ Vector search successful (${context.length} characters)`);
        } else {
          throw new Error('Vector search returned insufficient results');
        }
      }
    } catch (vectorError) {
      console.warn('⚠️ Vector search failed, using traditional document processing:', vectorError.message);
      
      // Fall back to traditional document context
      if (documents.length > 0) {
        console.log('📝 Creating traditional document context...');
        const documentContexts = documents.map(doc => {
          const docName = doc.originalName || doc.name || 'Unnamed document';
          const docContent = doc.content || 'No content extracted';
          // Limit content to avoid token limits that cause empty responses
          const truncatedContent = docContent.length > 2000 
            ? docContent.substring(0, 2000) + '...[truncated to avoid API limits]'
            : docContent;
          return `Document: ${docName}\n\nContent:\n${truncatedContent}\n`;
        });
        
        context = documentContexts.join('\n---\n');
        console.log(`📄 Created fallback context (${context.length} characters)`);
      }
    }

    // Enhanced system prompt for the legal assistant
    const systemPrompt = `You are an advanced legal document assistant powered by AI. Your job is to help users understand their legal documents, extract key information, and answer questions about the content with high accuracy.
      
      Guidelines:
      - Be clear, precise, and helpful
      - Structure your responses with headers and bullet points when appropriate
      - If there are specific clauses or sections to reference, cite them clearly
      - Explain legal terminology in simple terms
      - Always clarify that you're not providing legal advice, just information
      - When appropriate, suggest what sections of a document might need further review by a legal professional
      - If you find relevant information in the provided context, cite the specific document and section
      
      Tone:
      - Professional but approachable
      - Confident in explaining legal concepts
      - Transparent about limitations
      
      ${usingVectorSearch ? 'Note: You have access to the most relevant sections of the documents based on semantic search.' : 'Note: You have access to traditional document content.'}`;
    
    // Create messages array for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add context if available
    if (context) {
      const contextMessage = usingVectorSearch 
        ? `Here are the most relevant sections from the documents based on your question:\n\n${context}`
        : `Here are the documents to reference:\n\n${context}`;
        
      messages.push({
        role: 'system',
        content: contextMessage
      });
    } else if (documents.length > 0) {
      messages.push({
        role: 'system',
        content: `The user has uploaded ${documents.length} document(s), but no specific relevant content was found for this query. Please provide a general response based on the question and suggest they try a more specific question.`
      });
    }
    
    // Add the user's question
    messages.push({ role: 'user', content: message });

    console.log('🔄 Sending request to bulletproof OpenAI...');
    console.log('Messages structure:', messages.map(m => ({ role: m.role, contentLength: m.content.length })));
    console.log(`Using ${usingVectorSearch ? 'VECTOR SEARCH' : 'TRADITIONAL'} context retrieval`);
    
    // Use bulletproof OpenAI API call
    let aiResponse;
    try {
      aiResponse = await BulletproofOpenAI.resilientAPICall(messages, {
        model: 'gpt-3.5-turbo', // Start with GPT-3.5 to avoid quota issues
        maxTokens: 1000,
        temperature: 0.3,
        maxRetries: 3
      });
      
      console.log(`✅ Received response from bulletproof OpenAI`);
      console.log(`Response length: ${aiResponse.length} characters`);
      
    } catch (openaiError: any) {
      console.error('❌ Bulletproof OpenAI also failed:', openaiError.message);
      return generateFallbackResponse(message, documents, openaiError.message);
    }
    
    return formatAIResponse(aiResponse, usingVectorSearch);
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    return generateFallbackResponse(message, documents, error instanceof Error ? error.message : 'Unknown error');
  }
};

/**
 * Format AI response with appropriate disclaimers and structure
 */
const formatAIResponse = (aiResponse: string, usingVectorSearch: boolean): string => {
  // Add search method indicator for transparency
  const searchMethod = usingVectorSearch 
    ? "\n\n*🔍 This response was generated using advanced semantic search to find the most relevant sections of your documents.*"
    : "\n\n*📄 This response was generated using traditional document processing.*";
  
  // Add disclaimer if not already included
  let formattedResponse = aiResponse;
  if (!aiResponse.includes("not legal advice") && !aiResponse.includes("not providing legal advice")) {
    const disclaimer = "\n\n**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. For legal counsel, please consult with a qualified attorney.";
    formattedResponse = aiResponse + disclaimer;
  }
  
  console.log('======== END BULLETPROOF AI SERVICE ========\n');
  return formattedResponse + searchMethod;
};

/**
 * Generate a comprehensive fallback response when AI services fail
 */
const generateFallbackResponse = (message: string, documents: any[] = [], errorDetails: string = ''): string => {
  const docNames = documents.map(doc => doc.originalName || doc.name || 'Unnamed document').join(', ');
  
  return `Hello! I'm your Legal Document Assistant.

I notice you've asked: "${message}"

${documents.length > 0 
  ? `I can see you've uploaded ${documents.length} document(s): ${docNames}. However, I'm currently unable to analyze these documents due to technical limitations with the AI service.` 
  : `I don't see any documents uploaded yet. Please upload your documents for analysis.`}

**🔧 Current Status**: The AI analysis service is experiencing technical difficulties.

**📋 What you can do:**
1. **Try again in a few minutes** - This may be a temporary issue
2. **Upload documents if you haven't** - Ensure your legal documents are uploaded first
3. **Be more specific** - Try asking about specific sections or terms
4. **Manual review** - Consider reviewing the documents manually for immediate needs

**🚀 When operational, I can:**
- Analyze legal document content with high accuracy
- Extract key terms, dates, and obligations
- Identify potential risks and issues
- Explain complex legal language in simple terms
- Provide document summaries and comparisons

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. For legal counsel, please consult with a qualified attorney.

${errorDetails ? `\n**Technical Details**: ${errorDetails}` : ''}

*Please try again shortly, or contact support if this issue persists.*`;
};

export default {
  processMessage
};