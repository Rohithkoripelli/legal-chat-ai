// backend/src/routes/guestDocumentRoutes.ts - New file for guest document handling
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Define interfaces
interface GuestUploadBody {
  fileName: string;
  fileContent: string; // base64 encoded
  fileType: string;
  fileSize: number;
}

interface GuestDocumentResponse {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content: string;
}

// Simple in-memory storage for guest documents (you could use Redis for production)
const guestDocumentStorage = new Map<string, any>();

// Configure multer for guest file uploads (memory storage since we don't persist)
const guestStorage = multer.memoryStorage();

const guestUpload = multer({
  storage: guestStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for free users (smaller than premium)
    files: 3 // Max 3 files for free users
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type (same as authenticated users)
    const allowedTypes = /\.(pdf|doc|docx|txt|rtf)$/i;
    const extname = allowedTypes.test(path.extname(file.originalname));
    const mimetype = /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(plain|rtf))$/.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word, Text, and RTF files are allowed! Sign up for more format support.'));
    }
  }
});

// Simple text extraction for guest users (basic implementation)
const extractTextFromBuffer = (buffer: Buffer, filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  
  try {
    switch (ext) {
      case '.txt':
        return buffer.toString('utf-8').substring(0, 3000); // Limit for free users
      case '.rtf':
        // Basic RTF text extraction
        const rtfContent = buffer.toString('utf-8');
        return rtfContent
          .replace(/\{\\rtf[^}]*\}/g, '')
          .replace(/\{[^}]*\}/g, '')
          .replace(/\\[a-zA-Z]+\d*/g, '')
          .replace(/\\\\/g, '\\')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 3000);
      default:
        return `📄 ${filename} uploaded successfully.\n\n⚠️ Text extraction for ${ext} files requires a premium account.\n\nFile has been uploaded and can be referenced in conversations.\n\n💡 Create a free account for advanced text extraction from PDFs and Word documents!`;
    }
  } catch (error) {
    return `📄 ${filename} uploaded successfully.\n\n⚠️ Could not extract text content.\n\nFile has been stored and can be referenced in conversations.`;
  }
};

// POST /api/guest/documents/upload - Upload document for guest users
router.post('/upload', guestUpload.array('documents', 3), async (req: Request, res: Response) => {
  try {
    console.log('📂 Guest document upload request received');
    
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    console.log(`📄 Processing ${files.length} guest files`);
    
    const uploadedDocuments: GuestDocumentResponse[] = [];

    for (const file of files) {
      // Extract text content
      const textContent = extractTextFromBuffer(file.buffer, file.originalname);
      
      // Create guest document object
      const guestDoc: GuestDocumentResponse = {
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        uploadedAt: new Date(),
        content: textContent
      };
      
      // Store in memory (for session-based access)
      guestDocumentStorage.set(guestDoc.id, guestDoc);
      
      uploadedDocuments.push({
        id: guestDoc.id,
        name: guestDoc.name,
        size: guestDoc.size,
        type: guestDoc.type,
        uploadedAt: guestDoc.uploadedAt,
        content: guestDoc.content
      });
      
      console.log(`✅ Guest document processed: ${file.originalname}`);
    }

    console.log(`📤 Returning ${uploadedDocuments.length} guest documents`);
    res.status(201).json({
      message: `Successfully uploaded ${uploadedDocuments.length} document(s) for free analysis!`,
      documents: uploadedDocuments,
      limitations: {
        maxFiles: 3,
        maxSizePerFile: '5MB',
        storage: 'Temporary (session-based)',
        upgrade: 'Create a free account for unlimited uploads and permanent storage!'
      }
    });
    
  } catch (error) {
    console.error('❌ Error in guest document upload:', error);
    res.status(500).json({ 
      error: 'Upload failed. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'For reliable uploads and permanent storage, consider creating a free account!'
    });
  }
});

// POST /api/guest/documents/upload-base64 - Alternative upload method for frontend
router.post('/upload-base64', async (req: Request<{}, {}, GuestUploadBody>, res: Response) => {
  try {
    console.log('📂 Guest base64 upload request received');
    const { fileName, fileContent, fileType, fileSize } = req.body;
    
    if (!fileName || !fileContent) {
      return res.status(400).json({ error: 'File name and content are required' });
    }

    // Check file size limit for guests (5MB)
    if (fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        error: 'File too large. Free users can upload files up to 5MB.',
        suggestion: 'Create a free account for larger file uploads (up to 10MB)!'
      });
    }

    console.log(`📄 Processing guest base64 file: ${fileName}`);

    // Convert base64 to buffer for text extraction
    const buffer = Buffer.from(fileContent.split(',')[1] || fileContent, 'base64');
    const textContent = extractTextFromBuffer(buffer, fileName);
    
    // Create guest document
    const guestDoc: GuestDocumentResponse = {
      id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: fileName,
      size: fileSize,
      type: fileType,
      uploadedAt: new Date(),
      content: textContent
    };
    
    // Store in memory
    guestDocumentStorage.set(guestDoc.id, guestDoc);
    
    console.log(`✅ Guest base64 document processed: ${fileName}`);
    
    res.status(201).json({
      message: 'Document uploaded successfully for free analysis!',
      document: guestDoc,
      limitations: {
        maxFiles: 3,
        maxSizePerFile: '5MB',
        storage: 'Temporary (session-based)',
        upgrade: 'Create a free account for unlimited uploads and permanent storage!'
      }
    });
    
  } catch (error) {
    console.error('❌ Error in guest base64 upload:', error);
    res.status(500).json({ 
      error: 'Upload failed. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/guest/documents/:id - Get a guest document (basic endpoint)
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = guestDocumentStorage.get(id);
    
    if (!document) {
      return res.status(404).json({ 
        error: 'Document not found or expired.',
        suggestion: 'Guest documents are temporary. Create a free account for permanent storage!'
      });
    }
    
    res.json({
      document,
      note: 'This is a temporary guest document. Create an account to save permanently!'
    });
    
  } catch (error) {
    console.error('❌ Error fetching guest document:', error);
    res.status(500).json({ 
      error: 'Failed to fetch document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/guest/documents/test - Test guest document API
router.get('/test', (req: Request, res: Response) => {
  console.log('Guest document test endpoint accessed');
  res.json({ 
    message: 'Guest document API is working!',
    timestamp: new Date().toISOString(),
    features: [
      'Upload up to 3 documents',
      '5MB max file size',
      'Temporary session storage',
      'Basic text extraction',
      'No signup required'
    ],
    limitations: [
      'Documents are temporary',
      'Limited text extraction',
      'No permanent storage',
      'Max 3 files per session'
    ],
    upgrade: 'Create a free account for unlimited uploads, permanent storage, and advanced features!'
  });
});

// Clean up old guest documents periodically (simple cleanup)
setInterval(() => {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [id, doc] of guestDocumentStorage.entries()) {
    if (now - new Date(doc.uploadedAt).getTime() > maxAge) {
      guestDocumentStorage.delete(id);
      console.log(`🧹 Cleaned up expired guest document: ${id}`);
    }
  }
}, 60 * 60 * 1000); // Run every hour

export default router;