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

// Initialize environment variables with more validation
const apiKey = process.env.OPENAI_API_KEY;
const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME || 'legal-documents';

// Validate essential API keys
if (!pineconeApiKey) {
  console.error('CRITICAL ERROR: PINECONE_API_KEY is missing in environment variables');
}

if (!apiKey) {
  console.error('CRITICAL ERROR: OPENAI_API_KEY is missing in environment variables');
}

// Initialize the embeddings model (only if API key is available)
const embeddings = apiKey ? new OpenAIEmbeddings({
  openAIApiKey: apiKey,
  modelName: 'text-embedding-3-large',
  dimensions: 1536,
}) : null;

// Initialize Pinecone client with explicit validation
let pinecone: Pinecone | null = null;
try {
  if (pineconeApiKey) {
    pinecone = new Pinecone({
      apiKey: pineconeApiKey,
    });
    console.log('✅ Pinecone client initialized successfully');
  } else {
    console.warn('⚠️ Skipping Pinecone initialization due to missing API key');
  }
} catch (error) {
  console.error('❌ Error initializing Pinecone client:', error);
}

// Get the Pinecone index (with validation)
const getIndex = async () => {
  if (!pinecone) {
    throw new Error('Pinecone client not initialized. Check your PINECONE_API_KEY.');
  }
  
  if (!pineconeIndexName) {
    throw new Error('Pinecone index name not specified. Check your PINECONE_INDEX_NAME.');
  }
  
  return pinecone.index(pineconeIndexName);
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
 * (strings, numbers, booleans, or arrays of strings)
 */
const cleanMetadata = (metadata: Record<string, any>): Record<string, string | number | boolean | string[]> => {
  const cleanedMetadata: Record<string, string | number | boolean | string[]> = {};
  
  Object.entries(metadata).forEach(([key, value]) => {
    // Skip null or undefined values
    if (value === null || value === undefined) {
      return;
    }
    
    // Handle different types of values
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        cleanedMetadata[key] = value;
        break;
      case 'object':
        // Handle arrays of strings
        if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
          cleanedMetadata[key] = value;
        } else {
          // For complex objects, stringify them
          try {
            cleanedMetadata[key] = JSON.stringify(value).substring(0, 1000);
          } catch (e) {
            // If JSON stringify fails, convert to string
            cleanedMetadata[key] = String(value).substring(0, 1000);
          }
        }
        break;
      default:
        // Convert to string for other types
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
    // Validate prerequisites
    if (!pinecone) {
      console.error('Cannot vectorize document: Pinecone client not initialized');
      return false;
    }
    
    if (!embeddings) {
      console.error('Cannot vectorize document: OpenAI embeddings not initialized');
      return false;
    }
    
    console.log(`Starting vectorization for document: ${documentName} (${documentId})`);
    
    // Split text into chunks for processing
    const documents = await splitTextIntoChunks(content, documentId, documentName);
    console.log(`Split document into ${documents.length} chunks`);
    
    // Convert chunks to vectors with embeddings
    const records: PineconeRecord<RecordMetadata>[] = [];
    
    // Process chunks in batches to avoid rate limiting
    const batchSize = 20;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      
      // Get embeddings for this batch
      const batchRecords = await Promise.all(
        batch.map(async (doc, j) => {
          const embedding = await embeddings!.embedQuery(doc.pageContent);
          const chunkId = `${documentId}-chunk-${i + j}`;
          
          // Create safe metadata object
          const safeMetadata = {
            documentId: documentId,
            documentName: documentName,
            chunkIndex: i + j,
            text: doc.pageContent,
          };
          
          // Clean any additional metadata from LangChain
          let additionalMetadata = {};
          try {
            additionalMetadata = cleanMetadata(doc.metadata as Record<string, any>);
          } catch (e) {
            console.warn('Error cleaning metadata, using basic metadata only:', e);
          }
          
          return {
            id: chunkId,
            values: embedding,
            metadata: {
              ...safeMetadata,
              ...additionalMetadata
            },
          };
        })
      );
      
      records.push(...batchRecords);
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(documents.length / batchSize)}`);
    }
    
    // Store vectors in Pinecone
    const index = await getIndex();
    
    // Upsert in smaller batches to avoid payload size limits
    const upsertBatchSize = 100;
    for (let i = 0; i < records.length; i += upsertBatchSize) {
      const recordsBatch = records.slice(i, i + upsertBatchSize);
      try {
        await index.upsert(recordsBatch);
      } catch (error) {
        console.error(`Error upserting batch ${Math.floor(i / upsertBatchSize) + 1}:`, error);
        if (i === 0) {
          // If the first batch fails, abort the process
          throw error;
        }
        // Otherwise continue with the next batch
      }
    }
    
    console.log(`Successfully vectorized document: ${documentName} (${documentId})`);
    return true;
  } catch (error) {
    console.error('Error vectorizing document:', error);
    return false;
  }
};

/**
 * Delete document vectors from Pinecone
 */
export const deleteDocumentVectors = async (documentId: string): Promise<boolean> => {
  try {
    if (!pinecone) {
      console.error('Cannot delete vectors: Pinecone client not initialized');
      return false;
    }
    
    const index = await getIndex();
    
    // Find all vector IDs for this document
    const results = await index.query({
      vector: Array(1536).fill(0), // Dummy vector for metadata-only query (1536 dimensions)
      filter: { documentId },
      topK: 10000,
      includeMetadata: true,
    });
    
    // Extract vector IDs
    const vectorIds = results.matches.map(match => match.id);
    
    if (vectorIds.length > 0) {
      // Delete vectors in batches
      const batchSize = 1000;
      for (let i = 0; i < vectorIds.length; i += batchSize) {
        const batch = vectorIds.slice(i, i + batchSize);
        await index.deleteMany(batch);
      }
    }
    
    console.log(`Successfully deleted vectors for document: ${documentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting document vectors:', error);
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
    if (!pinecone || !embeddings) {
      console.error('Cannot search documents: Pinecone or OpenAI not initialized');
      return [];
    }
    
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    
    // Prepare search options
    const searchOptions = {
      vector: queryEmbedding,
      topK: limit,
      includeMetadata: true,
    } as any; // Using any here to bypass TypeScript checking due to Pinecone API changes
    
    // Add filter for specific documents if provided
    if (documentIds && documentIds.length > 0) {
      searchOptions.filter = {
        documentId: { $in: documentIds },
      };
    }
    
    // Search for similar vectors
    const index = await getIndex();
    const results = await index.query(searchOptions);
    
    // Format and return results with safety checks
    return results.matches.map(match => ({
      text: typeof match.metadata?.text === 'string' ? match.metadata.text : '',
      documentId: typeof match.metadata?.documentId === 'string' ? match.metadata.documentId : '',
      documentName: typeof match.metadata?.documentName === 'string' ? match.metadata.documentName : '',
      score: typeof match.score === 'number' ? match.score : 0,
    }));
  } catch (error) {
    console.error('Error searching documents:', error);
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
    if (!pinecone || !embeddings) {
      return 'Vector search is currently unavailable. Please check your API configuration.';
    }
    
    const results = await searchDocuments(query, documentIds, maxChunks);
    
    if (results.length === 0) {
      return 'No relevant information found in the documents.';
    }
    
    // Group results by document
    const documentGroups = results.reduce((groups, result) => {
      const { documentId, documentName, text } = result;
      if (!groups[documentId]) {
        groups[documentId] = { documentName, chunks: [] };
      }
      groups[documentId].chunks.push(text);
      return groups;
    }, {} as Record<string, { documentName: string; chunks: string[] }>);
    
    // Format context with document references
    let context = '';
    Object.entries(documentGroups).forEach(([documentId, { documentName, chunks }]) => {
      context += `Document: ${documentName} (ID: ${documentId})\n\n`;
      chunks.forEach((chunk, i) => {
        context += `Section ${i + 1}:\n${chunk}\n\n`;
      });
      context += '---\n\n';
    });
    
    return context;
  } catch (error) {
    console.error('Error getting relevant context:', error);
    return 'Error retrieving context from documents.';
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
};