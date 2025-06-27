import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import Document from '../models/Document';
import { extractTextFromDocument, extractTextWithOCR } from '../services/documentService';
import MemoryMonitor from '../utils/memoryMonitor';

// Extend Request interface to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadDocument = async (req: MulterRequest, res: Response) => {
  const memoryMonitor = MemoryMonitor.getInstance();
  
  try {
    console.log('📂 Upload request received from user:', req.userId);
    memoryMonitor.logMemoryUsage('upload start');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check memory before processing
    if (memoryMonitor.isMemoryLow()) {
      console.log('⚠️ Memory is high, forcing garbage collection...');
      memoryMonitor.forceGarbageCollection();
      await memoryMonitor.waitForMemoryOptimization(3000);
    }

    const file = req.file;
    console.log('📄 File details:', {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
      userId: req.userId
    });

    // Memory-optimized approach based on file size
    const isVeryLargeFile = file.size > 8 * 1024 * 1024; // 8MB - skip processing entirely 
    const isLargeFile = file.size > 3 * 1024 * 1024; // 3MB - basic processing only
    
    if (isVeryLargeFile) {
      console.log('📦 Very large file detected, minimal processing mode...');
      memoryMonitor.logMemoryUsage('before large file save');
      
      // Save document metadata only - NO content processing to save memory
      const document = new Document({
        name: file.filename,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        content: `📄 Large document uploaded successfully.

⚠️ Content extraction skipped due to file size (${(file.size / 1024 / 1024).toFixed(1)}MB).
This helps prevent memory issues on the server.

To analyze this document:
1. Use our chat feature and reference this document by name
2. The AI can still access and analyze the file when needed
3. Consider splitting large documents into smaller sections for better processing`,
        userId: req.userId,
        uploadedAt: new Date(),
        processingStatus: 'completed'
      });

      const savedDocument = await document.save();
      console.log('💾 Large document metadata saved for user:', req.userId, 'Doc ID:', savedDocument._id);

      const responseData = {
        id: savedDocument._id.toString(),
        name: savedDocument.originalName,
        size: savedDocument.size,
        type: savedDocument.type,
        uploadedAt: savedDocument.uploadedAt,
        contentExtracted: false,
        contentLength: savedDocument.content.length,
        processing: false,
        message: 'Large document uploaded successfully. Content extraction skipped to conserve memory.'
      };

      console.log('📤 Sending response for very large file');
      res.status(201).json(responseData);
      return;
    }
    
    if (isLargeFile) {
      console.log('📦 Large file detected, using basic processing...');
      console.log('🧠 Memory before processing:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
      
      // Save document metadata immediately with basic content
      const document = new Document({
        name: file.filename,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        content: `📄 Document uploaded successfully.

⏳ Content extraction will be processed in the background to conserve server memory.

File details:
- Size: ${(file.size / 1024 / 1024).toFixed(1)}MB
- Type: ${file.mimetype}
- Status: Processing

You can start chatting about this document now, and the AI will process it as needed.`,
        userId: req.userId,
        uploadedAt: new Date(),
        processingStatus: 'pending'
      });

      const savedDocument = await document.save();
      console.log('💾 Document metadata saved for user:', req.userId, 'Doc ID:', savedDocument._id);

      // Return response immediately
      const responseData = {
        id: savedDocument._id.toString(),
        name: savedDocument.originalName,
        size: savedDocument.size,
        type: savedDocument.type,
        uploadedAt: savedDocument.uploadedAt,
        contentExtracted: false,
        contentLength: 0,
        processing: true,
        message: 'Document uploaded successfully. Content extraction is in progress.'
      };

      console.log('📤 Sending immediate response for large file');
      res.status(201).json(responseData);

      // Process content asynchronously with delay to allow memory cleanup
      setTimeout(() => {
        processDocumentAsync(savedDocument._id.toString(), file.path, file.mimetype)
          .catch(error => console.error('❌ Async processing failed:', error));
      }, 10000); // 10 second delay

      return;
    }

    // For smaller files, process immediately as before
    console.log('🔍 Starting text extraction for small file...');
    const extractionResult = await extractTextWithOCR(file.path, file.mimetype);
    const textContent = extractionResult.text;
    const ocrResult = extractionResult.ocrResult;
    console.log('✅ Text extraction completed', ocrResult ? `(OCR: ${ocrResult.provider})` : '(Standard)');
    
    // Validate extracted content
    const isContentValid = validateExtractedContent(textContent);
    if (!isContentValid) {
      console.warn('⚠️ Extracted content may have issues, but proceeding...');
    }
    
    // Save document metadata to database WITH content
    const document = new Document({
      name: file.filename,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      content: textContent,
      userId: req.userId,
      uploadedAt: new Date(),
      processingStatus: 'completed',
      // OCR metadata
      ocrProcessed: !!ocrResult,
      ocrProvider: ocrResult?.provider,
      ocrConfidence: ocrResult?.confidence ? Math.round(ocrResult.confidence * 100) : undefined,
      isScannedDocument: ocrResult?.isScanned,
      ocrProcessedAt: ocrResult ? new Date() : undefined
    });

    const savedDocument = await document.save();
    console.log('💾 Small document fully processed and saved for user:', req.userId);

    // Vectorize in background for small files too
    if (isContentValid && textContent.length > 50) {
      vectorizeDocumentAsync(savedDocument._id.toString(), savedDocument.originalName, textContent)
        .catch(error => console.error('❌ Background vectorization failed:', error));
    }

    // Return response
    const responseData = {
      id: savedDocument._id.toString(),
      name: savedDocument.originalName,
      size: savedDocument.size,
      type: savedDocument.type,
      uploadedAt: savedDocument.uploadedAt,
      contentExtracted: isContentValid,
      contentLength: textContent.length,
      ocrProcessed: !!ocrResult,
      ocrProvider: ocrResult?.provider,
      ocrConfidence: ocrResult?.confidence ? Math.round(ocrResult.confidence * 100) : undefined,
      isScannedDocument: ocrResult?.isScanned
    };

    console.log('📤 Sending response for small file');
    res.status(201).json(responseData);
    
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    res.status(500).json({ 
      error: 'An error occurred while uploading the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    console.log('📋 Fetching documents for user:', req.userId);
    
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // CRITICAL SECURITY FIX: Filter by user ID
    const documents = await Document.find({ userId: req.userId })
      .select('-content -path') // Exclude sensitive data for list view
      .sort({ uploadedAt: -1 });

    console.log(`📄 Found ${documents.length} documents for user:`, req.userId);

    const responseData = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.originalName,
      size: doc.size,
      type: doc.type,
      uploadedAt: doc.uploadedAt
    }));

    console.log('📤 Sending documents list for user:', req.userId);
    res.json(responseData);
  } catch (error) {
    console.error('❌ Error fetching documents:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🗑️ User', req.userId, 'attempting to delete document:', id);

    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // CRITICAL SECURITY CHECK: Verify ownership
    const document = await Document.findOne({ _id: id, userId: req.userId });
    if (!document) {
      console.log('❌ Document not found or access denied for user:', req.userId);
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    // Delete vectors if available
    try {
      const { deleteDocumentVectors } = await import('../services/vectorizationService');
      await deleteDocumentVectors(id);
      console.log('✅ Document vectors deleted');
    } catch (vectorError) {
      console.warn('⚠️ Could not delete vectors:', vectorError);
    }

    // Delete file from filesystem
    try {
      await fsPromises.unlink(document.path);
      console.log('✅ File deleted from filesystem');
    } catch (fileError) {
      console.warn('⚠️ Could not delete file from filesystem:', fileError);
    }

    // Delete document from database
    await Document.findByIdAndDelete(id);
    console.log('✅ Document deleted successfully by user:', req.userId);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting document:', error);
    res.status(500).json({ 
      error: 'An error occurred while deleting the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const downloadDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('📥 User', req.userId, 'requesting download for document:', id);

    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // CRITICAL SECURITY CHECK: Verify ownership
    const document = await Document.findOne({ _id: id, userId: req.userId });
    if (!document) {
      console.log('❌ Document not found or access denied for user:', req.userId);
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      console.log('❌ Physical file not found:', document.path);
      return res.status(404).json({ error: 'File not found on server' });
    }

    console.log('✅ Sending file for download to user:', req.userId);
    res.download(document.path, document.originalName);
  } catch (error) {
    console.error('❌ Error downloading document:', error);
    res.status(500).json({ 
      error: 'An error occurred while downloading the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('📄 User', req.userId, 'fetching document details:', id);

    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // CRITICAL SECURITY CHECK: Verify ownership
    const document = await Document.findOne({ _id: id, userId: req.userId });
    if (!document) {
      console.log('❌ Document not found or access denied for user:', req.userId);
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    const responseData = {
      id: document._id.toString(),
      name: document.originalName,
      size: document.size,
      type: document.type,
      uploadedAt: document.uploadedAt,
      content: document.content,
      contentPreview: document.content ? document.content.substring(0, 500) + '...' : 'No content',
      // Extract OCR information from content if present
      ocrInfo: extractOCRInfoFromContent(document.content || '')
    };

    console.log('📤 Sending document details to user:', req.userId);
    res.json(responseData);
  } catch (error) {
    console.error('❌ Error fetching document:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Debug endpoint to check document content (development only)
export const debugDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🔍 Debug request for document:', id, 'by user:', req.userId);

    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // SECURITY CHECK: Verify ownership
    const document = await Document.findOne({ _id: id, userId: req.userId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    const debugInfo = {
      id: document._id.toString(),
      name: document.originalName,
      size: document.size,
      type: document.type,
      uploadedAt: document.uploadedAt,
      userId: document.userId,
      contentStats: {
        length: document.content?.length || 0,
        hasContent: !!document.content,
        firstChars: document.content?.substring(0, 100) || 'No content',
        lastChars: document.content?.substring(-100) || 'No content',
        wordCount: document.content?.split(/\s+/).length || 0,
        lineCount: document.content?.split('\n').length || 0,
        hasValidText: /[a-zA-Z]{3,}/.test(document.content || ''),
        specialCharCount: (document.content?.match(/[^\x20-\x7E\n\r\t]/g) || []).length
      }
    };

    res.json(debugInfo);
  } catch (error) {
    console.error('❌ Error debugging document:', error);
    res.status(500).json({ 
      error: 'An error occurred while debugging the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Extract OCR information from document content
const extractOCRInfoFromContent = (content: string): any => {
  // Look for OCR processing info in the content
  const ocrInfoMatch = content.match(/📋 \*\*.*?Processing Info:\*\*\n(.*?)(?=\n\n|$)/s);
  if (ocrInfoMatch) {
    const info: any = {};
    const infoText = ocrInfoMatch[1];
    
    const providerMatch = infoText.match(/(?:OCR )?Provider: (\w+)/i);
    if (providerMatch) info.provider = providerMatch[1].toLowerCase();
    
    const confidenceMatch = infoText.match(/(?:OCR )?Confidence: ([\d.]+)%/i);
    if (confidenceMatch) info.confidence = parseFloat(confidenceMatch[1]);
    
    const scannedMatch = infoText.match(/Scanned Document: (Yes|No)/i);
    if (scannedMatch) info.isScanned = scannedMatch[1].toLowerCase() === 'yes';
    
    const pagesMatch = infoText.match(/Pages Processed: (\d+)/i);
    if (pagesMatch) info.pagesProcessed = parseInt(pagesMatch[1]);
    
    return Object.keys(info).length > 0 ? info : null;
  }
  return null;
};

// Memory-optimized async processing function for large files
const processDocumentAsync = async (documentId: string, filePath: string, mimeType: string) => {
  let textContent = '';
  
  try {
    console.log('🔄 Starting memory-optimized async processing for document:', documentId);
    console.log('🧠 Memory before processing:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
    // Check file size to determine processing strategy
    const fileStats = await fs.promises.stat(filePath);
    const fileSizeMB = fileStats.size / (1024 * 1024);
    
    if (fileSizeMB > 10) {
      // For very large files, just extract basic metadata
      textContent = `📄 Large document processed (${fileSizeMB.toFixed(1)}MB).

⚠️ Full text extraction skipped for memory optimization.

To analyze this document, use the chat feature and reference it by name. 
The AI will process relevant sections on-demand.

Document stored and ready for analysis.`;
      
      console.log('📄 Large file - using minimal processing');
    } else {
      // For medium files, try extraction with memory limits
      try {
        console.log('🔍 Attempting text extraction...');
        
        // Basic text extraction without OCR to save memory
        const extractionResult = await extractTextFromDocument(filePath, false); // Disable OCR
        textContent = extractionResult || 'Content extracted but may be incomplete due to memory constraints.';
        
        // Limit content size to prevent memory issues
        if (textContent.length > 50000) { // 50KB limit
          textContent = textContent.substring(0, 50000) + '\n\n... [Content truncated to conserve memory]';
        }
        
        console.log('✅ Basic text extraction completed');
      } catch (extractError) {
        console.warn('⚠️ Text extraction failed, using fallback:', extractError);
        textContent = `📄 Document uploaded successfully.

⚠️ Text extraction failed due to memory constraints.

File information:
- Size: ${fileSizeMB.toFixed(1)}MB
- Type: ${mimeType}

You can still reference this document in chat, and the AI will attempt to process it when needed.`;
      }
    }
    
    console.log('🧠 Memory after extraction:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
    // Update document with content
    await Document.findByIdAndUpdate(documentId, {
      content: textContent,
      processingStatus: 'completed',
      ocrProcessed: false, // Skip OCR for memory optimization
      ocrProvider: undefined,
      ocrConfidence: undefined,
      isScannedDocument: false,
      ocrProcessedAt: undefined
    });
    
    console.log('✅ Memory-optimized processing completed for document:', documentId);
    
    // Skip vectorization for large files to save memory
    if (fileSizeMB < 5 && textContent.length > 50 && textContent.length < 20000) {
      setTimeout(() => {
        vectorizeDocumentAsync(documentId, `doc_${documentId}`, textContent)
          .catch(error => console.error('❌ Background vectorization failed:', error));
      }, 15000); // 15 second delay
    } else {
      console.log('⏭️ Skipping vectorization for large file to conserve memory');
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('🧹 Garbage collection triggered');
    }
    
    console.log('🧠 Memory after processing:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
  } catch (error) {
    console.error('❌ Async processing failed for document:', documentId, error);
    
    // Update document with error status but still mark as completed
    await Document.findByIdAndUpdate(documentId, {
      content: `📄 Document uploaded but processing encountered issues.

Error: ${error instanceof Error ? error.message : 'Unknown error'}

The file is still stored and may be accessible through the chat interface.`,
      processingStatus: 'completed', // Mark as completed even with errors
      processingError: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // Clear variables to help garbage collection
    textContent = '';
    
    // Additional garbage collection attempt
    if (global.gc) {
      setTimeout(() => {
        global.gc();
        console.log('🧹 Final garbage collection triggered');
      }, 2000);
    }
  }
};

// Async vectorization function
const vectorizeDocumentAsync = async (documentId: string, documentName: string, content: string) => {
  try {
    console.log('🔄 Starting async vectorization for document:', documentId);
    const { vectorizeDocument } = await import('../services/vectorizationService');
    const vectorized = await vectorizeDocument(documentId, documentName, content);
    
    if (vectorized) {
      console.log('✅ Async vectorization completed for document:', documentId);
    } else {
      console.warn('⚠️ Async vectorization failed for document:', documentId);
    }
  } catch (error) {
    console.error('❌ Async vectorization error for document:', documentId, error);
  }
};

// Validate extracted content quality
const validateExtractedContent = (content: string): boolean => {
  if (!content || content.length < 10) {
    console.warn('Content too short');
    return false;
  }
  
  // Check for readable text (at least some English words)
  const hasReadableText = /[a-zA-Z]{3,}/.test(content);
  if (!hasReadableText) {
    console.warn('No readable text found');
    return false;
  }
  
  // Check if content is mostly special characters or encoding artifacts
  const specialCharRatio = (content.match(/[^\x20-\x7E\n\r\t]/g) || []).length / content.length;
  if (specialCharRatio > 0.5) {
    console.warn('High ratio of special characters:', specialCharRatio);
    return false;
  }
  
  // Check for common encoding issues
  const hasEncodingIssues = content.includes('�') || 
                           content.includes('\ufffd') ||
                           /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(content);
  if (hasEncodingIssues) {
    console.warn('Encoding issues detected');
    return false;
  }
  
  return true;
};