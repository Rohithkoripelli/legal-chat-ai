import { OpenAIEmbeddings } from '@langchain/openai';
import { Document as LangchainDocument } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { 
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Initialize environment variables with validation
const apiKey = process.env.OPENAI_API_KEY;
const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeHostUrl = process.env.PINECONE_HOST_URL;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME || 'legal-documents';

// Enhanced validation with detailed logging
if (!pineconeApiKey) {
  console.error('CRITICAL ERROR: PINECONE_API_KEY is missing in environment variables');
}

if (!pineconeHostUrl) {
  console.error('CRITICAL ERROR: PINECONE_HOST_URL is missing in environment variables');
  console.log('Expected format: https://your-index-name-random.svc.environment.pinecone.io');
}

if (!apiKey) {
  console.error('CRITICAL ERROR: OPENAI_API_KEY is missing in environment variables');
}

console.log('🔧 Environment Check:');
console.log(`- OPENAI_API_KEY: ${apiKey ? '✅ Present' : '❌ Missing'}`);
console.log(`- PINECONE_API_KEY: ${pineconeApiKey ? '✅ Present' : '❌ Missing'}`);
console.log(`- PINECONE_HOST_URL: ${pineconeHostUrl ? '✅ Present' : '❌ Missing'}`);
console.log(`- PINECONE_INDEX_NAME: ${pineconeIndexName}`);

// Initialize the embeddings model (only if API key is available)
const embeddings = apiKey ? new OpenAIEmbeddings({
  openAIApiKey: apiKey,
  modelName: 'text-embedding-3-large',
  dimensions: 1536,
}) : null;

// Initialize Pinecone client with host URL
let pinecone: Pinecone | null = null;
let pineconeIndex: any = null;

const initializePinecone = async () => {
  try {
    if (!pineconeApiKey || !pineconeHostUrl) {
      console.warn('⚠️ Skipping Pinecone initialization due to missing credentials');
      return false;
    }

    console.log('🔄 Initializing Pinecone client...');
    
    // Initialize Pinecone with proper configuration
    pinecone = new Pinecone({
      apiKey: pineconeApiKey,
    });
    
    // Get index with host URL
    console.log(`🔗 Connecting to Pinecone index: ${pineconeIndexName}`);
    console.log(`🌐 Host URL: ${pineconeHostUrl}`);
    
    pineconeIndex = pinecone.index(pineconeIndexName, pineconeHostUrl);
    
    // Test connection
    try {
      const stats = await pineconeIndex.describeIndexStats();
      console.log('✅ Pinecone connection successful');
      console.log(`📊 Index stats:`, stats);
      return true;
    } catch (testError) {
      console.error('❌ Pinecone connection test failed:', testError);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error initializing Pinecone client:', error);
    return false;
  }
};

// Initialize on startup
let pineconeInitialized = false;
initializePinecone().then(success => {
  pineconeInitialized = success;
  if (success) {
    console.log('✅ Pinecone initialization completed successfully');
  } else {
    console.error('❌ Pinecone initialization failed');
  }
});

// Helper function to ensure Pinecone is initialized
const ensurePineconeConnection = async (): Promise<boolean> => {
  if (pineconeInitialized && pineconeIndex) {
    return true;
  }
  
  console.log('🔄 Attempting to reconnect to Pinecone...');
  const success = await initializePinecone();
  pineconeInitialized = success;
  return success;
};

// Split text into chunks for vectorization
const splitTextIntoChunks = async (text: string, documentId: string, documentName: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const documents = await splitter.createDocuments(
    [text],
    [{ documentId, documentName }]
  );

  return documents;
};

/**
 * Clean metadata object to ensure it only contains allowed types for Pinecone
 */
const cleanMetadata = (metadata: Record<string, any>): Record<string, string | number | boolean | string[]> => {
  const cleanedMetadata: Record<string, string | number | boolean | string[]> = {};
  
  Object.entries(metadata).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        cleanedMetadata[key] = value;
        break;
      case 'object':
        if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
          cleanedMetadata[key] = value;
        } else {
          try {
            cleanedMetadata[key] = JSON.stringify(value).substring(0, 1000);
          } catch (e) {
            cleanedMetadata[key] = String(value).substring(0, 1000);
          }
        }
        break;
      default:
        cleanedMetadata[key] = String(value).substring(0, 1000);
    }
  });
  
  return cleanedMetadata;
};

/**
 * Vectorize document content and store in Pinecone
 */
export const vectorizeDocument = async (
  documentId: string, 
  documentName: string, 
  content: string
): Promise<boolean> => {
  try {
    console.log(`🔄 Starting vectorization for document: ${documentName} (${documentId})`);
    
    // Ensure Pinecone connection
    const connected = await ensurePineconeConnection();
    if (!connected) {
      console.error('❌ Cannot vectorize document: Pinecone connection failed');
      return false;
    }
    
    if (!embeddings) {
      console.error('❌ Cannot vectorize document: OpenAI embeddings not initialized');
      return false;
    }
    
    // Split text into chunks for processing
    const documents = await splitTextIntoChunks(content, documentId, documentName);
    console.log(`📄 Split document into ${documents.length} chunks`);
    
    // Convert chunks to vectors with embeddings
    const records: PineconeRecord<RecordMetadata>[] = [];
    
    // Process chunks in smaller batches to avoid rate limiting
    const batchSize = 10; // Reduced batch size
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`);
      
      // Add delay between batches to avoid rate limiting
      if (i > 0) {
        console.log('⏱️ Waiting 2 seconds to avoid rate limits...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Get embeddings for this batch
      const batchRecords = await Promise.all(
        batch.map(async (doc, j) => {
          try {
            const embedding = await embeddings!.embedQuery(doc.pageContent);
            const chunkId = `${documentId}-chunk-${i + j}`;
            
            // Create safe metadata object
            const safeMetadata = {
              documentId: documentId,
              documentName: documentName,
              chunkIndex: i + j,
              text: doc.pageContent.substring(0, 1000), // Limit text size
            };
            
            // Clean any additional metadata from LangChain
            let additionalMetadata = {};
            try {
              additionalMetadata = cleanMetadata(doc.metadata as Record<string, any>);
            } catch (e) {
              console.warn('⚠️ Error cleaning metadata, using basic metadata only:', e);
            }
            
            return {
              id: chunkId,
              values: embedding,
              metadata: {
                ...safeMetadata,
                ...additionalMetadata
              },
            };
          } catch (embeddingError) {
            console.error(`❌ Error creating embedding for chunk ${i + j}:`, embeddingError);
            throw embeddingError;
          }
        })
      );
      
      records.push(...batchRecords);
    }
    
    console.log(`📤 Upserting ${records.length} vectors to Pinecone...`);
    
    // Store vectors in Pinecone with smaller batches
    const upsertBatchSize = 50; // Reduced batch size
    for (let i = 0; i < records.length; i += upsertBatchSize) {
      const recordsBatch = records.slice(i, i + upsertBatchSize);
      console.log(`📤 Upserting batch ${Math.floor(i / upsertBatchSize) + 1}/${Math.ceil(records.length / upsertBatchSize)}`);
      
      try {
        await pineconeIndex.upsert(recordsBatch);
        
        // Add delay between upserts
        if (i + upsertBatchSize < records.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error upserting batch ${Math.floor(i / upsertBatchSize) + 1}:`, error);
        if (i === 0) {
          // If the first batch fails, abort the process
          throw error;
        }
        // Otherwise continue with the next batch
      }
    }
    
    console.log(`✅ Successfully vectorized document: ${documentName} (${documentId})`);
    return true;
  } catch (error) {
    console.error('❌ Error vectorizing document:', error);
    return false;
  }
};

/**
 * Delete document vectors from Pinecone
 */
export const deleteDocumentVectors = async (documentId: string): Promise<boolean> => {
  try {
    console.log(`🗑️ Deleting vectors for document: ${documentId}`);
    
    const connected = await ensurePineconeConnection();
    if (!connected) {
      console.error('❌ Cannot delete vectors: Pinecone connection failed');
      return false;
    }
    
    // Use the filter-based delete approach
    try {
      await pineconeIndex.deleteMany({
        filter: { documentId: documentId }
      });
      console.log(`✅ Successfully deleted vectors for document: ${documentId}`);
      return true;
    } catch (deleteError) {
      console.error('❌ Error deleting vectors with filter, trying alternative approach:', deleteError);
      
      // Alternative approach: query first, then delete by IDs
      try {
        const results = await pineconeIndex.query({
          vector: Array(1536).fill(0), // Dummy vector
          filter: { documentId },
          topK: 10000,
          includeMetadata: true,
        });
        
        const vectorIds = results.matches.map((match: any) => match.id);
        
        if (vectorIds.length > 0) {
          const batchSize = 1000;
          for (let i = 0; i < vectorIds.length; i += batchSize) {
            const batch = vectorIds.slice(i, i + batchSize);
            await pineconeIndex.deleteMany(batch);
          }
        }
        
        console.log(`✅ Successfully deleted ${vectorIds.length} vectors for document: ${documentId}`);
        return true;
      } catch (alternativeError) {
        console.error('❌ Alternative delete approach also failed:', alternativeError);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ Error deleting document vectors:', error);
    return false;
  }
};

/**
 * Search for most relevant document chunks based on a query
 */
export const searchDocuments = async (
  query: string,
  documentIds?: string[],
  limit: number = 5
): Promise<Array<{ text: string; documentId: string; documentName: string; score: number }>> => {
  try {
    console.log(`🔍 Searching documents for query: "${query}"`);
    
    const connected = await ensurePineconeConnection();
    if (!connected || !embeddings) {
      console.error('❌ Cannot search documents: Pinecone or OpenAI not initialized');
      return [];
    }
    
    // Generate embedding for the query
    console.log('🔄 Generating query embedding...');
    const queryEmbedding = await embeddings.embedQuery(query);
    
    // Prepare search options
    const searchOptions: any = {
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
    };
    
    // Add filter for specific documents if provided
    if (documentIds && documentIds.length > 0) {
      searchOptions.filter = {
        documentId: { $in: documentIds },
      };
      console.log(`🎯 Filtering by document IDs: ${documentIds.join(', ')}`);
    }
    
    // Search for similar vectors
    console.log('🔍 Performing vector search...');
    const results = await pineconeIndex.query(searchOptions);
    
    console.log(`📊 Found ${results.matches.length} matches`);
    
    // Format and return results with safety checks
    return results.matches.map((match: any) => ({
      text: typeof match.metadata?.text === 'string' ? match.metadata.text : '',
      documentId: typeof match.metadata?.documentId === 'string' ? match.metadata.documentId : '',
      documentName: typeof match.metadata?.documentName === 'string' ? match.metadata.documentName : '',
      score: typeof match.score === 'number' ? match.score : 0,
    }));
  } catch (error) {
    console.error('❌ Error searching documents:', error);
    return [];
  }
};

/**
 * Extract relevant context for a query
 */
export const getRelevantContext = async (
  query: string,
  documentIds?: string[],
  maxChunks: number = 5
): Promise<string> => {
  try {
    console.log(`🔍 Getting relevant context for: "${query}"`);
    
    const connected = await ensurePineconeConnection();
    if (!connected || !embeddings) {
      console.warn('⚠️ Vector search is currently unavailable. Check your API configuration.');
      return 'Vector search is currently unavailable. Please check your API configuration.';
    }
    
    const results = await searchDocuments(query, documentIds, maxChunks);
    
    if (results.length === 0) {
      console.log('📄 No relevant information found in the documents.');
      return 'No relevant information found in the documents.';
    }
    
    console.log(`📋 Found ${results.length} relevant chunks`);
    
    // Group results by document
    const documentGroups = results.reduce((groups, result) => {
      const { documentId, documentName, text, score } = result;
      if (!groups[documentId]) {
        groups[documentId] = { documentName, chunks: [] };
      }
      groups[documentId].chunks.push({ text, score });
      return groups;
    }, {} as Record<string, { documentName: string; chunks: Array<{ text: string; score: number }> }>);
    
    // Format context with document references
    let context = '';
    Object.entries(documentGroups).forEach(([documentId, { documentName, chunks }]) => {
      context += `📄 Document: ${documentName} (ID: ${documentId})\n\n`;
      chunks.forEach((chunk, i) => {
        context += `Section ${i + 1} (Relevance: ${Math.round(chunk.score * 100)}%):\n${chunk.text}\n\n`;
      });
      context += '---\n\n';
    });
    
    console.log(`✅ Generated context with ${results.length} relevant chunks`);
    return context;
  } catch (error) {
    console.error('❌ Error getting relevant context:', error);
    return 'Error retrieving context from documents.';
  }
};

/**
 * Test Pinecone connection
 */
export const testPineconeConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing Pinecone connection...');
    
    const connected = await ensurePineconeConnection();
    if (!connected) {
      return false;
    }
    
    // Try to get index stats
    const stats = await pineconeIndex.describeIndexStats();
    console.log('✅ Pinecone connection test successful:', stats);
    return true;
  } catch (error) {
    console.error('❌ Pinecone connection test failed:', error);
    return false;
  }
};

// Named exports for individual functions
export {
  // deleteDocumentVectors is already exported above
};

// Default export for the service object
export default {
  vectorizeDocument,
  deleteDocumentVectors,
  searchDocuments,
  getRelevantContext,
  testPineconeConnection
};