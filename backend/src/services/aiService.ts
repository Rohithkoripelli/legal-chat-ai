
import { IDocument } from '../models/Document';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

// Initialize OpenAI with API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openai: OpenAI | null = null;

try {
  if (OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client initialized successfully');
  } else {
    console.warn('⚠️ No OpenAI API key found in environment variables');
  }
} catch (error) {
  console.error('❌ Error initializing OpenAI client:', error);
}

/**
 * Process a message using OpenAI with enhanced vector search
 */
export const processMessage = async (
  message: string, 
  documents: any[] = []
): Promise<string> => {
  try {
    console.log(`\n======== AI SERVICE: PROCESS MESSAGE ========`);
    console.log(`Message: "${message}"`);
    console.log(`Documents count: ${documents.length}`);
    
    // Get document IDs for vector search
    const documentIds = documents.map(doc => doc._id ? doc._id.toString() : doc.id ? doc.id.toString() : '');
    
    // Try to get relevant context using vector search first
    let context = '';
    let usingVectorSearch = false;
    
    try {
      if (documentIds.length > 0 && documentIds[0]) {
        console.log('🔍 Searching for relevant content using vector search...');
        const { getRelevantContext } = await import('./vectorizationService');
        context = await getRelevantContext(message, documentIds, 5);
        
        if (context && !context.includes('Error') && !context.includes('unavailable')) {
          usingVectorSearch = true;
          console.log(`✅ Retrieved relevant context using vector search (${context.length} characters)`);
        } else {
          throw new Error('Vector search returned no useful results');
        }
      }
    } catch (vectorError) {
      console.warn('⚠️ Vector search failed, falling back to traditional document processing:', vectorError);
      
      // Fall back to traditional document context
      if (documents.length > 0) {
        console.log('📝 Creating traditional document context...');
        const documentContexts = documents.map(doc => {
          const docName = doc.originalName || doc.name || 'Unnamed document';
          const docContent = doc.content || 'No content extracted';
          // Limit content to avoid token limits
          const truncatedContent = docContent.length > 3000 
            ? docContent.substring(0, 3000) + '...[truncated]'
            : docContent;
          return `Document: ${docName}\n\nContent:\n${truncatedContent}\n`;
        });
        
        context = documentContexts.join('\n---\n');
        console.log(`📄 Created fallback context (${context.length} characters)`);
      }
    }

    // If OpenAI is not initialized, provide a fallback response
    if (!openai || !OPENAI_API_KEY) {
      console.log('🚫 OpenAI not available, using fallback response');
      return generateFallbackResponse(message, documents);
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
      
      ${usingVectorSearch ? 'Note: You have access to the most relevant sections of the documents based on semantic search.' : 'Note: You have access to the full content of the uploaded documents.'}`;
    
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

    console.log('🔄 Sending request to OpenAI...');
    console.log('Messages structure:', messages.map(m => ({ role: m.role, contentLength: m.content.length })));
    console.log(`Using ${usingVectorSearch ? 'VECTOR SEARCH' : 'TRADITIONAL'} context retrieval`);
    
    // Call OpenAI API with enhanced model selection
    let model = 'gpt-4';
    let maxTokens = 1000;
    
    // Try GPT-4 first, fall back to GPT-3.5 if needed
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages as any,
        temperature: 0.3, // Lower temperature for more precise, factual responses
        max_tokens: maxTokens,
      });

      const aiResponse = response.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process your request. Please try again.";
      
      console.log(`✅ Received response from ${model}`);
      console.log(`Response length: ${aiResponse.length} characters`);
      
      return formatAIResponse(aiResponse, usingVectorSearch);
      
    } catch (gpt4Error: any) {
      console.warn('GPT-4 failed, trying GPT-3.5-turbo:', gpt4Error.message);
      
      // Fallback to GPT-3.5
      model = 'gpt-3.5-turbo';
      maxTokens = 800; // Reduced for GPT-3.5
      
      const response = await openai.chat.completions.create({
        model: model,
        messages: messages as any,
        temperature: 0.3,
        max_tokens: maxTokens,
      });

      const aiResponse = response.choices[0]?.message?.content || 
        "I'm sorry, I couldn't process your request. Please try again.";
      
      console.log(`✅ Received response from ${model} (fallback)`);
      console.log(`Response length: ${aiResponse.length} characters`);
      
      return formatAIResponse(aiResponse, usingVectorSearch);
    }
    
  } catch (error) {
    console.error('❌ Error processing message with OpenAI:', error);
    
    // Provide more detailed error message
    let errorMessage = "Sorry, I encountered an error processing your request.";
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      
      if (error.message.includes('insufficient_quota')) {
        errorMessage = "Sorry, there was an issue with the OpenAI API quota. Please try again later or contact support.";
      } else if (error.message.includes('rate_limit_exceeded')) {
        errorMessage = "The system is currently experiencing high demand. Please try again in a moment.";
      } else if (error.message.includes('context_length_exceeded')) {
        errorMessage = "The document is too large to process completely. Please try with a smaller document or a more specific question about a section.";
      }
    }
    
    return errorMessage + "\n\n**Disclaimer**: This information is for educational purposes only and does not constitute legal advice.";
  }
};

/**
 * Format AI response with appropriate disclaimers and structure
 */
const formatAIResponse = (aiResponse: string, usingVectorSearch: boolean): string => {
  // Add search method indicator for transparency
  const searchMethod = usingVectorSearch 
    ? "\n\n*📍 This response was generated using advanced semantic search to find the most relevant sections of your documents.*"
    : "\n\n*📄 This response was generated using traditional document processing.*";
  
  // Add disclaimer if not already included
  let formattedResponse = aiResponse;
  if (!aiResponse.includes("not legal advice") && !aiResponse.includes("not providing legal advice")) {
    const disclaimer = "\n\n**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. For legal counsel, please consult with a qualified attorney.";
    formattedResponse = aiResponse + disclaimer;
  }
  
  console.log('======== END AI SERVICE ========\n');
  return formattedResponse + searchMethod;
};

/**
 * Generate a fallback response when OpenAI is not available
 */
const generateFallbackResponse = (message: string, documents: any[] = []): string => {
  const docNames = documents.map(doc => doc.originalName || doc.name || 'Unnamed document').join(', ');
  
  return `
Hello! I'm your Legal Document Assistant. 

I notice you've asked: "${message}"

${documents.length > 0 
  ? `I can see you've uploaded ${documents.length} document(s): ${docNames}. However, I'm currently unable to analyze these documents in detail due to a technical limitation with the AI service.` 
  : `I don't see any documents uploaded yet. Please upload your documents for analysis.`}

🔧 **System Status**: The AI service is currently unavailable. This could be due to:
- Missing OpenAI API key
- Network connectivity issues
- API quota limitations

In normal operation, I would use advanced AI with semantic search to analyze your documents and provide specific insights.

Please try again later, or contact support if this issue persists.

**Note**: This is a fallback response due to a technical issue. When fully operational, I can provide detailed analysis of your legal documents using advanced AI capabilities.
  `;
};

export default {
  processMessage
};
