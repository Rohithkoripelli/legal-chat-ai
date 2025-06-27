import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import Document from '../models/Document';
import { extractTextFromDocument, extractTextWithOCR } from '../services/documentService';

// Extend Request interface to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadDocument = async (req: MulterRequest, res: Response) => {
  try {
    console.log('📂 Upload request received from user:', req.userId);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ error: 'User not authenticated' });
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

    // For large files (> 5MB), save metadata first and process asynchronously
    const isLargeFile = file.size > 5 * 1024 * 1024; // 5MB
    
    if (isLargeFile) {
      console.log('📦 Large file detected, using optimized processing...');
      
      // Save document metadata immediately without content
      const document = new Document({
        name: file.filename,
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: file.path,
        content: '', // Will be processed asynchronously
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

      // Process content asynchronously (don't await)
      processDocumentAsync(savedDocument._id.toString(), file.path, file.mimetype)
        .catch(error => console.error('❌ Async processing failed:', error));

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

// Async processing function for large files
const processDocumentAsync = async (documentId: string, filePath: string, mimeType: string) => {
  try {
    console.log('🔄 Starting async processing for document:', documentId);
    console.log('🧠 Memory before processing:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
    // Process with memory-efficient text extraction
    const extractionResult = await extractTextWithOCR(filePath, mimeType);
    const textContent = extractionResult.text;
    const ocrResult = extractionResult.ocrResult;
    
    console.log('🧠 Memory after extraction:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
    // Validate content
    const isContentValid = validateExtractedContent(textContent);
    
    // Update document with content
    await Document.findByIdAndUpdate(documentId, {
      content: textContent,
      processingStatus: 'completed',
      ocrProcessed: !!ocrResult,
      ocrProvider: ocrResult?.provider,
      ocrConfidence: ocrResult?.confidence ? Math.round(ocrResult.confidence * 100) : undefined,
      isScannedDocument: ocrResult?.isScanned,
      ocrProcessedAt: ocrResult ? new Date() : undefined
    });
    
    console.log('✅ Async processing completed for document:', documentId);
    
    // Vectorize in background if content is valid
    if (isContentValid && textContent.length > 50) {
      const document = await Document.findById(documentId);
      if (document) {
        // Use setTimeout to delay vectorization and allow memory cleanup
        setTimeout(() => {
          vectorizeDocumentAsync(documentId, document.originalName, textContent)
            .catch(error => console.error('❌ Background vectorization failed:', error));
        }, 5000); // 5 second delay
      }
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('🧹 Garbage collection triggered');
    }
    
    console.log('🧠 Memory after processing:', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
    
  } catch (error) {
    console.error('❌ Async processing failed for document:', documentId, error);
    // Update document with error status
    await Document.findByIdAndUpdate(documentId, {
      processingStatus: 'failed',
      processingError: error instanceof Error ? error.message : 'Unknown error'
    });
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