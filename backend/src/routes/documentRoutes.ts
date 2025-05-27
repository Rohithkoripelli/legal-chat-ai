import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import Document from '../models/Document';
import * as documentController from '../controllers/documentController';

const router = express.Router();

// Extend Request interface to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: MulterRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Check file type
    const allowedTypes = /\.(pdf|doc|docx|txt|rtf)$/i;
    const extname = allowedTypes.test(path.extname(file.originalname));
    const mimetype = /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text\/(plain|rtf))$/.test(file.mimetype);
    
    if (mimetype && extname) {
      cb(null, true);
    } else {
      // Use a standard Error instead of MulterError for simplicity
      cb(new Error('Only PDF, Word, Text, and RTF files are allowed!'));
    }
  }
});

// Test route to verify document list format
// Must be before the :id routes to avoid conflict!
router.get('/test', async (req: Request, res: Response) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });
    
    const testResponse = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.originalName || doc.name,
      size: doc.size,
      type: doc.type,
      uploadedAt: doc.uploadedAt
    }));
    
    res.json({
      message: 'Test document list',
      count: testResponse.length,
      documents: testResponse
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'An error occurred while fetching documents', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

// POST /api/documents/upload - Upload a document
router.post('/upload', upload.single('document'), documentController.uploadDocument);

// GET /api/documents - Get all documents
router.get('/', documentController.getDocuments);

// GET /api/documents/:id - Get a specific document
router.get('/:id', documentController.getDocument);

// GET /api/documents/:id/download - Download a document
router.get('/:id/download', documentController.downloadDocument);

// DELETE /api/documents/:id - Delete a document
router.delete('/:id', documentController.deleteDocument);

// Make sure to export the router
export default router;