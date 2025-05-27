// backend/src/services/llmService.ts
import OpenAI from 'openai';
import logger from '../config/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class LLMService {
  /**
   * Generate embeddings for text chunks
   */
  static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const embeddings: number[][] = [];
      
      // Process in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        
        const response = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: batch,
        });
        
        const batchEmbeddings = response.data.map((item: any) => item.embedding);
        embeddings.push(...batchEmbeddings);
        
        // Add delay to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return embeddings;
    } catch (error) {
      logger.error('Error generating embeddings:', error);
      throw new Error('Failed to generate embeddings');
    }
  }

  /**
   * Generate embeddings for a single text
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      logger.error('Error generating embedding:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Find similar text chunks using cosine similarity
   */
  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Generate answer based on question and context
   */
  static async generateAnswer(
    question: string,
    contextChunks: Array<{ text: string; source: string; confidence: number }>
  ): Promise<string> {
    try {
      const context = contextChunks
        .map(chunk => `Source: ${chunk.source}\n${chunk.text}`)
        .join('\n\n---\n\n');

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a helpful legal assistant. Answer questions based strictly on the provided legal documents. 
            If the answer cannot be found in the provided context, say so clearly.
            Always cite the source documents when providing information.
            Be precise and professional in your responses.`
          },
          {
            role: 'user',
            content: `Context from legal documents:\n\n${context}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      return response.choices[0].message?.content || 'Unable to generate response';
    } catch (error) {
      logger.error('Error generating answer:', error);
      throw new Error('Failed to generate answer');
    }
  }

  /**
   * Summarize document content
   */
  static async summarizeDocument(text: string, maxLength: number = 500): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a legal document summarizer. Provide concise, accurate summaries of legal documents.'
          },
          {
            role: 'user',
            content: `Please provide a summary of this legal document (max ${maxLength} words):\n\n${text}`
          }
        ],
        temperature: 0.1,
        max_tokens: Math.min(maxLength * 2, 1000),
      });

      return response.choices[0].message?.content || 'Unable to generate summary';
    } catch (error) {
      logger.error('Error summarizing document:', error);
      throw new Error('Failed to summarize document');
    }
  }
}