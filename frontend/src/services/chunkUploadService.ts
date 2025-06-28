// src/services/chunkUploadService.ts - Chunked Upload Strategy for Large Files
// This service prevents memory spikes on 512MB backend by uploading files in small chunks

interface ChunkUploadConfig {
  chunkSize: number;        // Size of each chunk (default: 1MB)
  maxConcurrency: number;   // Maximum parallel chunk uploads
  retryAttempts: number;    // Number of retry attempts per chunk
  timeout: number;          // Timeout per chunk upload
}

interface ChunkMetadata {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  chunkHash?: string;       // Optional integrity verification
}

interface UploadProgress {
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  uploadedChunks: number;
  totalChunks: number;
  currentChunk?: number;
}

interface UploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadTime: number;
  success: boolean;
  error?: string;
}

class ChunkUploadService {
  private static instance: ChunkUploadService;
  private readonly API_BASE_URL: string;
  
  private constructor() {
    this.API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';
  }

  public static getInstance(): ChunkUploadService {
    if (!ChunkUploadService.instance) {
      ChunkUploadService.instance = new ChunkUploadService();
    }
    return ChunkUploadService.instance;
  }

  /**
   * Upload a large file in chunks to prevent memory spikes
   */
  async uploadFileInChunks(
    file: File, 
    config: Partial<ChunkUploadConfig> = {},
    onProgress?: (progress: UploadProgress) => void,
    authToken?: string
  ): Promise<UploadResult> {
    const defaultConfig: ChunkUploadConfig = {
      chunkSize: 1024 * 1024,     // 1MB chunks for 512MB backend
      maxConcurrency: 2,          // Only 2 concurrent chunks to prevent overload
      retryAttempts: 3,
      timeout: 30000              // 30 second timeout per chunk
    };

    const finalConfig = { ...defaultConfig, ...config };
    const startTime = Date.now();

    try {
      // Step 1: Validate file size (optional upper limit)
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB absolute maximum
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large: ${file.name}. Maximum 50MB per file.`);
      }

      // Step 2: Create chunks without loading file into memory
      const chunks = this.createFileChunks(file, finalConfig.chunkSize);
      const fileId = this.generateFileId();

      console.log(`🔄 Starting chunked upload: ${file.name} (${chunks.length} chunks)`);

      // Step 3: Initiate upload session on backend
      await this.initiateUpload(fileId, file.name, file.type, file.size, chunks.length, authToken);

      // Step 4: Upload chunks with concurrency control
      const uploadResults = await this.uploadChunksWithConcurrency(
        chunks, 
        fileId, 
        finalConfig, 
        onProgress,
        authToken
      );

      // Step 5: Finalize upload on backend
      const result = await this.finalizeUpload(fileId, authToken);

      const uploadTime = Date.now() - startTime;
      console.log(`✅ Chunked upload completed: ${file.name} in ${uploadTime}ms`);

      return {
        fileId,
        fileName: file.name,
        fileSize: file.size,
        uploadTime,
        success: true
      };

    } catch (error) {
      const uploadTime = Date.now() - startTime;
      console.error('❌ Chunked upload failed:', error);
      
      return {
        fileId: '',
        fileName: file.name,
        fileSize: file.size,
        uploadTime,
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Create file chunks without loading entire file into memory
   */
  private createFileChunks(file: File, chunkSize: number): Blob[] {
    const chunks: Blob[] = [];
    let start = 0;

    while (start < file.size) {
      const end = Math.min(start + chunkSize, file.size);
      // file.slice() creates a Blob reference without loading data into memory
      chunks.push(file.slice(start, end));
      start = end;
    }

    return chunks;
  }

  /**
   * Generate unique file ID for upload session
   */
  private generateFileId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initiate upload session on backend
   */
  private async initiateUpload(
    fileId: string, 
    fileName: string, 
    fileType: string, 
    fileSize: number, 
    totalChunks: number,
    authToken?: string
  ): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/upload/initiate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fileId,
        fileName,
        fileType,
        fileSize,
        totalChunks
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate upload: ${response.status}`);
    }
  }

  /**
   * Upload chunks with controlled concurrency
   */
  private async uploadChunksWithConcurrency(
    chunks: Blob[],
    fileId: string,
    config: ChunkUploadConfig,
    onProgress?: (progress: UploadProgress) => void,
    authToken?: string
  ): Promise<void> {
    let uploadedChunks = 0;
    let uploadedBytes = 0;
    const totalBytes = chunks.reduce((sum, chunk) => sum + chunk.size, 0);

    // Create semaphore for concurrency control
    const semaphore = new Array(config.maxConcurrency).fill(null);
    const chunkPromises: Promise<void>[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunkPromise = this.waitForAvailableSlot(semaphore).then(async () => {
        try {
          await this.uploadSingleChunk(chunks[i], fileId, i, chunks.length, config, authToken);
          
          uploadedChunks++;
          uploadedBytes += chunks[i].size;

          // Report progress
          if (onProgress) {
            onProgress({
              uploadedBytes,
              totalBytes,
              percentage: Math.round((uploadedBytes / totalBytes) * 100),
              uploadedChunks,
              totalChunks: chunks.length,
              currentChunk: i
            });
          }

        } catch (error) {
          console.error(`❌ Failed to upload chunk ${i}:`, error);
          throw error;
        }
      });

      chunkPromises.push(chunkPromise);
    }

    // Wait for all chunks to complete
    await Promise.all(chunkPromises);
  }

  /**
   * Wait for available concurrency slot
   */
  private async waitForAvailableSlot(semaphore: any[]): Promise<void> {
    return new Promise((resolve) => {
      const checkSlot = () => {
        const availableIndex = semaphore.findIndex(slot => slot === null);
        if (availableIndex !== -1) {
          semaphore[availableIndex] = true;
          resolve();
          // Release slot when done
          setTimeout(() => {
            semaphore[availableIndex] = null;
          }, 0);
        } else {
          setTimeout(checkSlot, 10); // Check again in 10ms
        }
      };
      checkSlot();
    });
  }

  /**
   * Upload a single chunk with retry logic
   */
  private async uploadSingleChunk(
    chunk: Blob,
    fileId: string,
    chunkIndex: number,
    totalChunks: number,
    config: ChunkUploadConfig,
    authToken?: string
  ): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < config.retryAttempts; attempt++) {
      try {
        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('fileId', fileId);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());

        const headers: Record<string, string> = {};
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(`${this.API_BASE_URL}/api/upload/chunk`, {
          method: 'POST',
          headers,
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Chunk upload failed: ${response.status}`);
        }

        // Success - cleanup and return
        formData.delete('chunk');
        return;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.warn(`⚠️ Chunk ${chunkIndex} attempt ${attempt + 1} failed:`, lastError.message);
        
        if (attempt < config.retryAttempts - 1) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error(`Failed to upload chunk ${chunkIndex} after ${config.retryAttempts} attempts`);
  }

  /**
   * Finalize upload and trigger backend processing
   */
  private async finalizeUpload(fileId: string, authToken?: string): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${this.API_BASE_URL}/api/upload/finalize`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fileId })
    });

    if (!response.ok) {
      throw new Error(`Failed to finalize upload: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Cancel an ongoing upload
   */
  async cancelUpload(fileId: string, authToken?: string): Promise<void> {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    await fetch(`${this.API_BASE_URL}/api/upload/abort`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ fileId })
    });
  }
}

export default ChunkUploadService;
export type { ChunkUploadConfig, UploadProgress, UploadResult };