import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import Document from '../models/Document';
import { extractTextFromDocument } from '../services/documentService';

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

    // Save document metadata to database WITH USER ID
    const document = new Document({
      name: file.filename,
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      content: textContent,
      userId: req.userId, // CRITICAL: Associate with user
      uploadedAt: new Date()
    });

    const savedDocument = await document.save();
    console.log('💾 Document saved to database for user:', req.userId, 'Doc ID:', savedDocument._id);

    // Try to vectorize the document if content is valid
    if (isContentValid && textContent.length > 50) {
      try {
        console.log('🔄 Starting vectorization...');
        const { vectorizeDocument } = await import('../services/vectorizationService');
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
      contentPreview: document.content ? document.content.substring(0, 500) + '...' : 'No content'
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