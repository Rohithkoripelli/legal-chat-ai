// src/services/optimizedAIService.ts - Memory-Optimized AI Processing
// Prevents memory spikes during AI processing on 512MB backend

interface AIProcessingConfig {
  maxContextLength: number;      // Maximum context tokens
  chunkProcessingLimit: number;  // Max chunks to process simultaneously  
  streamingEnabled: boolean;     // Enable streaming responses
  contextOptimization: boolean;  // Enable smart context selection
  memoryThreshold: number;       // Memory usage threshold (MB)
}

interface ContextChunk {
  id: string;
  text: string;
  relevanceScore: number;
  tokens: number;
  documentId: string;
}

interface AIProcessingResult {
  response: string;
  tokensUsed: number;
  processingTime: number;
  contextsUsed: number;
  memoryPeak: number;
  success: boolean;
  error?: string;
}

class OptimizedAIService {
  private static instance: OptimizedAIService;
  private readonly API_BASE_URL: string;
  private currentMemoryUsage: number = 0;
  
  private constructor() {
    this.API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';
  }

  public static getInstance(): OptimizedAIService {
    if (!OptimizedAIService.instance) {
      OptimizedAIService.instance = new OptimizedAIService();
    }
    return OptimizedAIService.instance;
  }

  /**
   * Process AI queries with memory optimization and context streaming
   */
  async processQueryOptimized(
    query: string,
    documentIds: string[],
    config: Partial<AIProcessingConfig> = {},
    onProgress?: (progress: { stage: string; percentage: number }) => void,
    authToken?: string
  ): Promise<AIProcessingResult> {
    const defaultConfig: AIProcessingConfig = {
      maxContextLength: 6000,        // Conservative context limit for 512MB backend
      chunkProcessingLimit: 3,       // Process max 3 chunks at once
      streamingEnabled: true,
      contextOptimization: true,
      memoryThreshold: 400           // 400MB memory threshold
    };

    const finalConfig = { ...defaultConfig, ...config };
    const startTime = Date.now();
    let memoryPeak = 0;

    try {
      console.log(`🔄 Starting optimized AI processing for query: ${query.substring(0, 50)}...`);

      // Step 1: Check memory availability
      await this.checkMemoryAvailability(finalConfig.memoryThreshold);
      
      if (onProgress) onProgress({ stage: 'Retrieving context', percentage: 10 });

      // Step 2: Smart context retrieval with memory optimization
      const relevantContext = await this.retrieveOptimizedContext(
        query, 
        documentIds, 
        finalConfig
      );
      
      if (onProgress) onProgress({ stage: 'Processing query', percentage: 50 });

      // Step 3: Memory-optimized AI processing
      const aiResponse = await this.processWithMemoryOptimization(
        query,
        relevantContext,
        finalConfig,
        authToken
      );

      if (onProgress) onProgress({ stage: 'Finalizing response', percentage: 90 });

      const processingTime = Date.now() - startTime;
      memoryPeak = await this.getCurrentMemoryUsage();

      console.log(`✅ Optimized AI processing completed in ${processingTime}ms`);

      return {
        response: aiResponse.text,
        tokensUsed: aiResponse.tokensUsed,
        processingTime,
        contextsUsed: relevantContext.length,
        memoryPeak,
        success: true
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ Optimized AI processing failed:', error);
      
      return {
        response: '',
        tokensUsed: 0,
        processingTime,
        contextsUsed: 0,
        memoryPeak,
        success: false,
        error: error instanceof Error ? error.message : 'AI processing failed'
      };
    }
  }

  /**
   * Retrieve context with smart optimization and memory awareness
   */
  private async retrieveOptimizedContext(
    query: string,
    documentIds: string[],
    config: AIProcessingConfig
  ): Promise<ContextChunk[]> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Step 1: Get relevance scores for all potential chunks
    const response = await fetch(`${this.API_BASE_URL}/api/ai/context/relevance`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        documentIds,
        maxResults: config.chunkProcessingLimit * 5 // Get more options for optimization
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve context relevance: ${response.status}`);
    }

    const relevanceData = await response.json();
    
    // Step 2: Optimize context selection for memory efficiency
    return this.optimizeContextSelection(relevanceData.chunks, config);
  }

  /**
   * Optimize context selection based on relevance and memory constraints
   */
  private optimizeContextSelection(
    chunks: ContextChunk[],
    config: AIProcessingConfig
  ): ContextChunk[] {
    // Sort by relevance score
    chunks.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const selectedChunks: ContextChunk[] = [];
    let totalTokens = 0;

    for (const chunk of chunks) {
      // Stop if we would exceed context length
      if (totalTokens + chunk.tokens > config.maxContextLength) {
        break;
      }

      // Stop if we would exceed processing limit
      if (selectedChunks.length >= config.chunkProcessingLimit) {
        break;
      }

      selectedChunks.push(chunk);
      totalTokens += chunk.tokens;
    }

    console.log(`📊 Context optimization: Selected ${selectedChunks.length}/${chunks.length} chunks (${totalTokens} tokens)`);
    return selectedChunks;
  }

  /**
   * Process AI query with memory optimization
   */
  private async processWithMemoryOptimization(
    query: string,
    context: ContextChunk[],
    config: AIProcessingConfig,
    authToken?: string
  ): Promise<{ text: string; tokensUsed: number }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Build optimized context string
    const contextString = context
      .map(chunk => `[Document: ${chunk.documentId}]\n${chunk.text}`)
      .join('\n---\n');

    // Memory check before processing
    await this.checkMemoryAvailability(config.memoryThreshold);

    const response = await fetch(`${this.API_BASE_URL}/api/ai/process/optimized`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        context: contextString,
        streaming: config.streamingEnabled,
        memoryOptimized: true
      })
    });

    if (!response.ok) {
      throw new Error(`AI processing failed: ${response.status}`);
    }

    const result = await response.json();
    return {
      text: result.response,
      tokensUsed: result.tokensUsed || 0
    };
  }

  /**
   * Check memory availability and wait if necessary
   */
  private async checkMemoryAvailability(threshold: number): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const response = await fetch(`${this.API_BASE_URL}/api/system/memory`, {
      method: 'GET',
      headers
    });

    if (response.ok) {
      const memoryInfo = await response.json();
      const memoryUsageMB = memoryInfo.heapUsed / 1024 / 1024;

      if (memoryUsageMB > threshold) {
        console.log(`⚠️ Memory usage high (${memoryUsageMB.toFixed(1)}MB), waiting for optimization...`);
        
        // Wait for memory to be optimized
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Trigger garbage collection if available
        await fetch(`${this.API_BASE_URL}/api/system/gc`, { method: 'POST' });
        
        // Wait a bit more
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Get current memory usage
   */
  private async getCurrentMemoryUsage(): Promise<number> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/system/memory`, {
        method: 'GET'
      });

      if (response.ok) {
        const memoryInfo = await response.json();
        return memoryInfo.heapUsed / 1024 / 1024; // Convert to MB
      }
    } catch (error) {
      console.warn('Could not get memory usage:', error);
    }
    
    return 0;
  }

  /**
   * Process query with fallback strategy for memory-constrained scenarios
   */
  async processQueryWithFallback(
    query: string,
    documentIds: string[],
    authToken?: string
  ): Promise<AIProcessingResult> {
    try {
      // Try optimized processing first
      return await this.processQueryOptimized(query, documentIds, {}, undefined, authToken);
    } catch (error) {
      console.warn('⚠️ Optimized processing failed, falling back to basic processing...');
      
      // Fallback to basic processing with minimal context
      return await this.processQueryOptimized(
        query, 
        documentIds.slice(0, 1), // Only use first document
        {
          maxContextLength: 2000,    // Very limited context
          chunkProcessingLimit: 1,   // Only 1 chunk
          streamingEnabled: false,
          contextOptimization: false
        },
        undefined,
        authToken
      );
    }
  }

  /**
   * Batch process multiple queries with memory management
   */
  async processBatchQueries(
    queries: Array<{ query: string; documentIds: string[] }>,
    config: Partial<AIProcessingConfig> = {},
    authToken?: string
  ): Promise<AIProcessingResult[]> {
    const results: AIProcessingResult[] = [];
    
    for (let i = 0; i < queries.length; i++) {
      const { query, documentIds } = queries[i];
      
      console.log(`📝 Processing batch query ${i + 1}/${queries.length}`);
      
      // Process with memory checks between queries
      const result = await this.processQueryOptimized(
        query,
        documentIds,
        config,
        undefined,
        authToken
      );
      
      results.push(result);
      
      // Wait between queries to prevent memory buildup
      if (i < queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    
    return results;
  }

  /**
   * Estimate processing memory requirements
   */
  async estimateMemoryRequirement(
    query: string,
    documentIds: string[]
  ): Promise<{ estimatedMB: number; safe: boolean; recommendation: string }> {
    const baseMemory = 50; // Base processing memory
    const perDocumentMemory = 30; // Memory per document
    const queryComplexity = Math.min(query.length / 100, 5); // Query complexity factor
    
    const estimatedMB = baseMemory + (documentIds.length * perDocumentMemory) + (queryComplexity * 20);
    const safe = estimatedMB < 350; // Leave buffer for 512MB total
    
    let recommendation = '';
    if (!safe) {
      if (documentIds.length > 3) {
        recommendation = 'Reduce number of documents to 3 or fewer';
      } else if (query.length > 500) {
        recommendation = 'Simplify query to reduce complexity';
      } else {
        recommendation = 'Use fallback processing mode';
      }
    }
    
    return { estimatedMB, safe, recommendation };
  }
}

export default OptimizedAIService;
export type { AIProcessingConfig, ContextChunk, AIProcessingResult };