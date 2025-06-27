import express, { Request, Response } from 'express';
import Document from '../models/Document';
import * as documentController from '../controllers/documentController';
import { clerkAuthMiddleware } from '../middleware/auth';
import { uploadSingleDocument, handleUploadError } from '../../uploads/upload';

const router = express.Router();

// APPLY AUTH MIDDLEWARE TO ALL ROUTES
router.use(clerkAuthMiddleware);

// Extend Request interface to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Test route - now shows only user's documents
router.get('/test', async (req: Request, res: Response) => {
  try {
    console.log('📋 Test route accessed by user:', req.userId);
    
    // FILTER BY USER ID - CRITICAL SECURITY FIX
    const documents = await Document.find({ userId: req.userId }).sort({ uploadedAt: -1 });
    
    const testResponse = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.originalName || doc.name,
      size: doc.size,
      type: doc.type,
      uploadedAt: doc.uploadedAt
    }));
    
    res.json({
      message: `Test document list for authenticated user: ${req.userId}`,
      count: testResponse.length,
      documents: testResponse,
      userInfo: {
        userId: req.userId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Error in test route:', error);
    res.status(500).json({ 
      error: 'An error occurred while fetching documents', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

// POST /api/documents/upload - Upload a document (protected) - using enhanced upload middleware
router.post('/upload', uploadSingleDocument, handleUploadError, documentController.uploadDocument);

// GET /api/documents - Get user's documents (protected)
router.get('/', documentController.getDocuments);

// GET /api/documents/:id - Get a specific user document (protected)
router.get('/:id', documentController.getDocument);

// GET /api/documents/:id/download - Download user document (protected)
router.get('/:id/download', documentController.downloadDocument);

// DELETE /api/documents/:id - Delete user document (protected)
router.delete('/:id', documentController.deleteDocument);

// Debug route for development (protected)
if (process.env.NODE_ENV === 'development') {
  router.get('/:id/debug', documentController.debugDocument);
}

export default router;