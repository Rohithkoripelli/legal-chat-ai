// services/bulletproofOpenAI.ts - Add this as a new file
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

try {
  if (OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
      timeout: 60000, // 60 seconds timeout
      maxRetries: 3,
    });
    console.log('✅ Bulletproof OpenAI client initialized');
  } else {
    console.error('❌ OPENAI_API_KEY missing');
  }
} catch (error) {
  console.error('❌ Error initializing OpenAI:', error);
}

// Enhanced response validation and extraction
export class BulletproofOpenAI {
  
  /**
   * Safely extract content from OpenAI response with detailed debugging
   */
  static extractContent(response: any): string {
    console.log('🔍 Analyzing OpenAI response structure...');
    
    // Log the full response for debugging
    console.log('📋 Full response:', JSON.stringify(response, null, 2));
    
    // Check if response exists
    if (!response) {
      throw new Error('Response is null or undefined');
    }
    
    // Check if choices exist and is array
    if (!response.choices) {
      console.error('❌ Response missing choices property');
      console.log('Available properties:', Object.keys(response));
      throw new Error('Response missing choices array');
    }
    
    if (!Array.isArray(response.choices)) {
      console.error('❌ Choices is not an array:', typeof response.choices);
      throw new Error('Choices is not an array');
    }
    
    if (response.choices.length === 0) {
      console.error('❌ Choices array is empty');
      throw new Error('Choices array is empty');
    }
    
    // Check first choice
    const firstChoice = response.choices[0];
    console.log('🎯 First choice structure:', JSON.stringify(firstChoice, null, 2));
    
    if (!firstChoice) {
      throw new Error('First choice is null');
    }
    
    // Check message property
    if (!firstChoice.message) {
      console.error('❌ First choice missing message property');
      console.log('Available properties:', Object.keys(firstChoice));
      throw new Error('First choice missing message');
    }
    
    // Check content property
    if (firstChoice.message.content === null) {
      console.error('❌ Message content is null - this is the "No content" error!');
      
      // Check if there's a refusal
      if (firstChoice.message.refusal) {
        console.log('🚫 Request was refused:', firstChoice.message.refusal);
        throw new Error(`Request refused: ${firstChoice.message.refusal}`);
      }
      
      // Check finish reason
      if (firstChoice.finish_reason) {
        console.log('🏁 Finish reason:', firstChoice.finish_reason);
        if (firstChoice.finish_reason === 'length') {
          throw new Error('Response truncated due to length limit');
        }
        if (firstChoice.finish_reason === 'content_filter') {
          throw new Error('Response blocked by content filter');
        }
      }
      
      throw new Error('Message content is null - no content generated');
    }
    
    if (firstChoice.message.content === undefined) {
      console.error('❌ Message content is undefined');
      throw new Error('Message content is undefined');
    }
    
    const content = firstChoice.message.content;
    
    // Check if content is string
    if (typeof content !== 'string') {
      console.error('❌ Content is not a string:', typeof content);
      throw new Error(`Content is not a string: ${typeof content}`);
    }
    
    // Check if content is empty
    if (content.trim().length === 0) {
      console.error('❌ Content is empty string');
      throw new Error('Content is empty string');
    }
    
    console.log('✅ Successfully extracted content:', content.substring(0, 100) + '...');
    console.log(`📏 Content length: ${content.length} characters`);
    
    return content;
  }
  
  /**
   * Make a bulletproof OpenAI API call with comprehensive error handling
   */
  static async safeAPICall(
    messages: any[], 
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      timeout?: number;
    } = {}
  ): Promise<string> {
    
    if (!openai) {
      throw new Error('OpenAI client not initialized - check OPENAI_API_KEY');
    }
    
    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.3,
      timeout = 60000
    } = options;
    
    console.log(`🚀 Making OpenAI API call with model: ${model}`);
    console.log(`📊 Parameters: maxTokens=${maxTokens}, temperature=${temperature}`);
    console.log(`💬 Messages: ${messages.length} total`);
    
    // Validate messages
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Messages must be a non-empty array');
    }
    
    // Log message sizes to check for oversized prompts
    messages.forEach((msg, i) => {
      console.log(`📝 Message ${i} (${msg.role}): ${msg.content?.length || 0} characters`);
    });
    
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      });
      
      console.log('📥 Received response from OpenAI');
      
      // Extract content with detailed validation
      const content = this.extractContent(response);
      
      console.log(`✅ API call successful - ${content.length} characters returned`);
      return content;
      
    } catch (error: any) {
      console.error('❌ OpenAI API call failed:', error.message);
      
      // Handle specific error types
      if (error.status === 429) {
        console.error('🚫 Rate limit exceeded - try again later');
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      
      if (error.status === 401) {
        console.error('🔑 Authentication failed - check API key');
        throw new Error('Authentication failed. Please check your OpenAI API key.');
      }
      
      if (error.status === 400) {
        console.error('📝 Bad request - check your prompt');
        console.error('Request details:', { model, maxTokens, temperature });
        throw new Error(`Bad request: ${error.message}`);
      }
      
      if (error.status === 500) {
        console.error('🔧 OpenAI server error');
        throw new Error('OpenAI server error. Please try again.');
      }
      
      // Generic error
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
  
  /**
   * Make API call with automatic retry and fallback
   */
  static async resilientAPICall(
    messages: any[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      maxRetries?: number;
    } = {}
  ): Promise<string> {
    
    const {
      model = 'gpt-3.5-turbo',
      maxTokens = 1000,
      temperature = 0.3,
      maxRetries = 3
    } = options;
    
    // First try with requested model
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} with ${model}`);
        
        const result = await this.safeAPICall(messages, {
          model,
          maxTokens,
          temperature
        });
        
        return result;
        
      } catch (error: any) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          // Last attempt failed, try fallback model if we were using GPT-4
          if (model.includes('gpt-4')) {
            console.log('🔄 Falling back to GPT-3.5-turbo...');
            try {
              return await this.safeAPICall(messages, {
                model: 'gpt-3.5-turbo',
                maxTokens: Math.min(maxTokens, 1000),
                temperature
              });
            } catch (fallbackError: any) {
              console.error('❌ Fallback also failed:', fallbackError.message);
              throw new Error(`Both models failed. Original: ${error.message}, Fallback: ${fallbackError.message}`);
            }
          }
          
          // If we're already using GPT-3.5 or fallback failed, throw original error
          throw error;
        }
        
        // Wait before retry with exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('All retry attempts failed');
  }
}

export default BulletproofOpenAI;