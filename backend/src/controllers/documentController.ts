// backend/src/controllers/documentController.ts - FIXED VERSION
import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import Document from '../models/Document';
import { extractTextFromDocument } from '../services/documentService';
import { vectorizeDocument } from '../services/vectorizationService';

// Extend Request interface to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const uploadDocument = async (req: MulterRequest, res: Response) => {
  try {
    console.log('📂 Upload request received');
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    console.log('📄 File details:', {
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path
    });
    
    // Extract text content from the document
    console.log('🔍 Starting text extraction...');
    const textContent = await extractTextFromDocument(file.path);
    console.log('✅ Text extraction completed');
    
    // Validate extracted content
    const isContentValid = validateExtractedContent(textContent);
    if (!isContentValid) {
      console.warn('⚠️ Extracted content may have issues, but proceeding...');
    }
    
    // Log content sample for debugging (first 200 chars)
    console.log('📝 Content sample:', textContent.substring(0, 200) + '...');
    console.log('📊 Content stats:', {
      length: textContent.length,
      hasValidText: /[a-zA-Z]{3,}/.test(textContent),
      wordCount: textContent.split(/\s+/).length,
      hasSpecialChars: /[^\x20-\x7E\n\r\t]/.test(textContent)
    });

    // Save document metadata to database
    const document = new Document({
      name: file.filename,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      content: textContent,
      uploadedAt: new Date()
    });

    const savedDocument = await document.save();
    console.log('💾 Document saved to database:', savedDocument._id);

    // Try to vectorize the document if content is valid
    if (isContentValid && textContent.length > 50) {
      try {
        console.log('🔄 Starting vectorization...');
        const vectorized = await vectorizeDocument(
          savedDocument._id.toString(),
          savedDocument.originalName,
          textContent
        );
        
        if (vectorized) {
          console.log('✅ Document vectorized successfully');
        } else {
          console.warn('⚠️ Vectorization failed, but document saved');
        }
      } catch (vectorError) {
        console.error('❌ Vectorization error:', vectorError);
        // Don't fail the upload if vectorization fails
      }
    } else {
      console.warn('⚠️ Skipping vectorization due to poor content quality');
    }

    // Return consistent response format
    const responseData = {
      id: savedDocument._id.toString(),
      name: savedDocument.originalName,
      size: savedDocument.size,
      type: savedDocument.type,
      uploadedAt: savedDocument.uploadedAt,
      contentExtracted: isContentValid,
      contentLength: textContent.length
    };

    console.log('📤 Sending response:', responseData);
    res.status(201).json(responseData);
    
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    res.status(500).json({ 
      error: 'An error occurred while uploading the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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

export const getDocuments = async (req: Request, res: Response) => {
  try {
    console.log('📋 Fetching all documents');
    
    const documents = await Document.find()
      .select('-content -path') // Exclude content and path for list view
      .sort({ uploadedAt: -1 });

    console.log(`📄 Found ${documents.length} documents`);

    const responseData = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.originalName,
      size: doc.size,
      type: doc.type,
      uploadedAt: doc.uploadedAt
    }));

    console.log('📤 Sending documents list');
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
    console.log('🗑️ Deleting document:', id);

    const document = await Document.findById(id);
    if (!document) {
      console.log('❌ Document not found');
      return res.status(404).json({ error: 'Document not found' });
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
    console.log('✅ Document deleted from database');

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
    console.log('📥 Download request for document:', id);

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    console.log('✅ Sending file for download');
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
    console.log('📄 Fetching document details:', id);

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const responseData = {
      id: document._id.toString(),
      name: document.originalName,
      size: document.size,
      type: document.type,
      uploadedAt: document.uploadedAt,
      content: document.content,
      contentPreview: document.content ? document.content.substring(0, 500) + '...' : 'No content'
    };

    res.json(responseData);
  } catch (error) {
    console.error('❌ Error fetching document:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching the document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Debug endpoint to check document content
export const debugDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('🔍 Debug request for document:', id);

    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const debugInfo = {
      id: document._id.toString(),
      name: document.originalName,
      size: document.size,
      type: document.type,
      uploadedAt: document.uploadedAt,
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