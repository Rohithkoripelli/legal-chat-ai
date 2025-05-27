import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openai = null;

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

export async function processMessage(message, documents = []) {
  try {
    console.log(`🔄 Processing message: "${message}"`);
    console.log(`📄 Documents count: ${documents.length}`);
    
    let context = '';
    if (documents.length > 0) {
      const documentContexts = documents.map(doc => {
        const docName = doc.originalName || doc.name || 'Unnamed document';
        const docContent = doc.content || 'No content extracted';
        const truncatedContent = docContent.length > 3000 
          ? docContent.substring(0, 3000) + '...[truncated]'
          : docContent;
        return `Document: ${docName}\n\nContent:\n${truncatedContent}\n`;
      });
      
      context = documentContexts.join('\n---\n');
    }

    if (!openai || !OPENAI_API_KEY) {
      return generateFallbackResponse(message, documents);
    }

    const systemPrompt = `You are an advanced legal document assistant. Help users understand their legal documents, extract key information, and answer questions with high accuracy.
      
      Guidelines:
      - Be clear, precise, and helpful
      - Structure responses with headers and bullet points when appropriate
      - Cite specific clauses or sections clearly
      - Explain legal terminology in simple terms
      - Always clarify that you're not providing legal advice
      - Suggest consulting a legal professional when appropriate`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
    ];
    
    if (context) {
      messages.push({
        role: 'system',
        content: `Here are the documents to reference:\n\n${context}`
      });
    }
    
    messages.push({ role: 'user', content: message });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process your request. Please try again.";
    
    if (!aiResponse.includes("not legal advice")) {
      const disclaimer = "\n\n**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. For legal counsel, please consult with a qualified attorney.";
      return aiResponse + disclaimer;
    }
    
    return aiResponse;
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    return "Sorry, I encountered an error processing your request. Please try again.";
  }
}

function generateFallbackResponse(message, documents = []) {
  const docNames = documents.map(doc => doc.originalName || doc.name || 'Unnamed document').join(', ');
  
  return `Hello! I'm your Legal Document Assistant. 

I notice you've asked: "${message}"

${documents.length > 0 
  ? `I can see you've uploaded ${documents.length} document(s): ${docNames}. However, I'm currently unable to analyze these documents due to OpenAI service limitations.` 
  : `I don't see any documents uploaded yet. Please upload your documents for analysis.`}

**Note**: This is a fallback response. When fully operational, I can provide detailed analysis of your legal documents.

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice.`;
}
