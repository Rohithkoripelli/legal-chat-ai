// src/services/streamingVectorizationService.ts - Memory-Optimized Vectorization Strategy
// Prevents memory spikes during large document vectorization on 512MB backend

interface VectorizationConfig {
  chunkSize: number;           // Size of text chunks
  chunkOverlap: number;        // Overlap between chunks
  batchSize: number;           // Vectors processed per batch
  processingDelay: number;     // Delay between batches (ms)
  maxEmbeddingDimensions: number; // Vector dimensions
}

interface VectorizationProgress {
  totalChunks: number;
  processedChunks: number;
  percentage: number;
  estimatedTimeRemaining: number;
  memoryUsage?: number;
}

interface VectorizationResult {
  documentId: string;
  totalChunks: number;
  processingTime: number;
  vectorsStored: number;
  success: boolean;
  error?: string;
}

class StreamingVectorizationService {
  private static instance: StreamingVectorizationService;
  private readonly API_BASE_URL: string;
  
  private constructor() {
    this.API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';
  }

  public static getInstance(): StreamingVectorizationService {
    if (!StreamingVectorizationService.instance) {
      StreamingVectorizationService.instance = new StreamingVectorizationService();
    }
    return StreamingVectorizationService.instance;
  }

  /**
   * Vectorize large documents without memory spikes
   */
  async vectorizeDocumentStreaming(
    documentId: string,
    content: string,
    config: Partial<VectorizationConfig> = {},
    onProgress?: (progress: VectorizationProgress) => void,
    authToken?: string
  ): Promise<VectorizationResult> {
    const defaultConfig: VectorizationConfig = {
      chunkSize: 1000,              // Smaller chunks for memory efficiency
      chunkOverlap: 200,
      batchSize: 5,                 // Very small batches for 512MB backend
      processingDelay: 3000,        // 3 second delay between batches
      maxEmbeddingDimensions: 512   // Use smaller embeddings to save memory
    };

    const finalConfig = { ...defaultConfig, ...config };
    const startTime = Date.now();

    try {
      console.log(`🔄 Starting streaming vectorization for document: ${documentId}`);

      // Step 1: Initiate vectorization session
      await this.initiateVectorization(documentId, content.length, finalConfig, authToken);

      // Step 2: Stream text chunks to backend for processing
      const result = await this.processChunksStreaming(
        documentId, 
        content, 
        finalConfig, 
        onProgress, 
        authToken
      );

      // Step 3: Finalize vectorization
      await this.finalizeVectorization(documentId, authToken);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Streaming vectorization completed: ${documentId} in ${processingTime}ms`);

      return {
        documentId,
        totalChunks: result.totalChunks,
        processingTime,
        vectorsStored: result.vectorsStored,
        success: true
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error('❌ Streaming vectorization failed:', error);
      
      return {
        documentId,
        totalChunks: 0,
        processingTime,
        vectorsStored: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Vectorization failed'
      };
    }
  }

  /**
   * Initiate vectorization session on backend
   */
  private async initiateVectorization(
    documentId: string,
    contentLength: number,
    config: VectorizationConfig,
    authToken?: string
  ): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/vectorization/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        documentId,
        contentLength,
        config
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate vectorization: ${response.status}`);
    }
  }

  /**
   * Process text chunks in streaming fashion
   */
  private async processChunksStreaming(
    documentId: string,
    content: string,
    config: VectorizationConfig,
    onProgress?: (progress: VectorizationProgress) => void,
    authToken?: string
  ): Promise<{ totalChunks: number; vectorsStored: number }> {
    
    // Calculate approximate chunk count without creating all chunks
    const estimatedChunks = Math.ceil(content.length / config.chunkSize);
    let processedChunks = 0;
    let vectorsStored = 0;
    const startTime = Date.now();

    // Process content in chunks without loading all into memory
    let startIndex = 0;
    const chunks: string[] = [];

    while (startIndex < content.length) {
      // Create chunk with overlap
      const endIndex = Math.min(startIndex + config.chunkSize, content.length);
      const chunk = content.substring(startIndex, endIndex);
      
      chunks.push(chunk);

      // Process batch when we reach batch size or end of content
      if (chunks.length >= config.batchSize || endIndex >= content.length) {
        // Send batch to backend for vectorization
        const batchResult = await this.processBatch(documentId, chunks, processedChunks, authToken);
        vectorsStored += batchResult.vectorsCreated;
        processedChunks += chunks.length;

        // Report progress
        if (onProgress) {
          const elapsed = Date.now() - startTime;
          const rate = processedChunks / elapsed; // chunks per ms
          const remaining = estimatedChunks - processedChunks;
          const estimatedTimeRemaining = remaining / rate;

          onProgress({
            totalChunks: estimatedChunks,
            processedChunks,
            percentage: Math.round((processedChunks / estimatedChunks) * 100),
            estimatedTimeRemaining: Math.round(estimatedTimeRemaining)
          });
        }

        // Clear batch to free memory
        chunks.length = 0;

        // Delay to prevent backend memory spikes
        if (endIndex < content.length) {
          await new Promise(resolve => setTimeout(resolve, config.processingDelay));
        }
      }

      // Move to next chunk with overlap
      startIndex = endIndex - config.chunkOverlap;
      if (startIndex < 0) startIndex = 0;
    }

    return { totalChunks: processedChunks, vectorsStored };
  }

  /**
   * Process a batch of chunks on backend
   */
  private async processBatch(
    documentId: string,
    chunks: string[],
    startIndex: number,
    authToken?: string
  ): Promise<{ vectorsCreated: number }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/vectorization/batch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        documentId,
        chunks,
        startIndex
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to process batch: ${response.status}`);
    }

    const result = await response.json();
    return { vectorsCreated: result.vectorsCreated || chunks.length };
  }

  /**
   * Finalize vectorization and cleanup
   */
  private async finalizeVectorization(documentId: string, authToken?: string): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/vectorization/finalize`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ documentId })
    });

    if (!response.ok) {
      throw new Error(`Failed to finalize vectorization: ${response.status}`);
    }
  }

  /**
   * Get vectorization status
   */
  async getVectorizationStatus(documentId: string, authToken?: string): Promise<any> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/vectorization/status/${documentId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to get vectorization status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Cancel ongoing vectorization
   */
  async cancelVectorization(documentId: string, authToken?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    await fetch(`${this.API_BASE_URL}/api/vectorization/cancel`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ documentId })
    });
  }
}

/**
 * Progressive OCR Service - Process PDFs page by page to prevent memory spikes
 */
class ProgressiveOCRService {
  private static instance: ProgressiveOCRService;
  private readonly API_BASE_URL: string;
  
  private constructor() {
    this.API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';
  }

  public static getInstance(): ProgressiveOCRService {
    if (!ProgressiveOCRService.instance) {
      ProgressiveOCRService.instance = new ProgressiveOCRService();
    }
    return ProgressiveOCRService.instance;
  }

  /**
   * Process large PDFs page by page to prevent memory spikes
   */
  async processLargePDF(
    documentId: string,
    fileId: string,
    onProgress?: (progress: { page: number; totalPages: number; percentage: number }) => void,
    authToken?: string
  ): Promise<{ success: boolean; extractedText?: string; error?: string }> {
    try {
      console.log(`🔄 Starting progressive OCR for document: ${documentId}`);

      // Step 1: Get PDF info (page count, etc.)
      const pdfInfo = await this.getPDFInfo(fileId, authToken);
      
      // Step 2: Process pages sequentially
      let combinedText = '';
      
      for (let pageNum = 1; pageNum <= pdfInfo.totalPages; pageNum++) {
        // Process single page
        const pageResult = await this.processPage(fileId, pageNum, authToken);
        combinedText += pageResult.text + '\n';

        // Report progress
        if (onProgress) {
          onProgress({
            page: pageNum,
            totalPages: pdfInfo.totalPages,
            percentage: Math.round((pageNum / pdfInfo.totalPages) * 100)
          });
        }

        // Delay between pages to prevent memory buildup
        if (pageNum < pdfInfo.totalPages) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return { success: true, extractedText: combinedText };

    } catch (error) {
      console.error('❌ Progressive OCR failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OCR processing failed' 
      };
    }
  }

  private async getPDFInfo(fileId: string, authToken?: string): Promise<{ totalPages: number }> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/ocr/pdf-info/${fileId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`Failed to get PDF info: ${response.status}`);
    }

    return await response.json();
  }

  private async processPage(fileId: string, pageNum: number, authToken?: string): Promise<{ text: string }> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/ocr/process-page`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, pageNum })
    });

    if (!response.ok) {
      throw new Error(`Failed to process page ${pageNum}: ${response.status}`);
    }

    return await response.json();
  }
}

export default StreamingVectorizationService;
export { ProgressiveOCRService };
export type { VectorizationConfig, VectorizationProgress, VectorizationResult };