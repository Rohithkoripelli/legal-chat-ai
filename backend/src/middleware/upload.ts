import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Simple utility functions (inline since fileUtils import is causing issues)
const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await fs.promises.access(dirPath, fs.constants.F_OK);
  } catch (error) {
    await fs.promises.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

const generateSafeFilename = (originalFilename: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalFilename);
  const basename = path.basename(originalFilename, extension)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);
  
  return `${basename}_${timestamp}_${randomString}${extension}`;
};

// Configure storage
const storage = multer.diskStorage({
  destination: async (req: Request, file: Express.Multer.File, cb) => {
    try {
      await ensureDirectoryExists(uploadDir);
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const safeFilename = generateSafeFilename(file.originalname);
    cb(null, safeFilename);
  }
});

// File filter for allowed document types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('= File filter check:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  // Check file type
  const allowedTypes = /\.(pdf|doc|docx|txt|rtf)$/i;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check MIME type
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf',
    'text/rtf'
  ];
  
  const mimetype = allowedMimeTypes.includes(file.mimetype);
  
  if (extname && mimetype) {
    // Check file size (15MB for PDF, 8MB for others - reduced for Render memory limits)
    const maxSize = file.mimetype === 'application/pdf' ? 15 * 1024 * 1024 : 8 * 1024 * 1024;
    
    if (file.size && file.size > maxSize) {
      const maxSizeStr = file.mimetype === 'application/pdf' ? '15MB' : '8MB';
      cb(new Error(`File too large. Maximum size is ${maxSizeStr}.`));
    } else {
      console.log(' File passed validation');
      cb(null, true);
    }
  } else {
    console.log('L File validation failed:', { extname, mimetype });
    cb(new Error('Only PDF, Word, Text, and RTF files are allowed!'));
  }
};

// Configure upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max (reduced for Render)
    fieldSize: 15 * 1024 * 1024,
  },
  fileFilter: fileFilter
});

// Single file upload middleware
export const uploadSingleDocument = upload.single('document');

// Handle multer errors
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  console.error('L Upload error:', error);
  
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          error: 'File too large', 
          details: 'Maximum file size is 15MB for PDF and 8MB for other formats' 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          error: 'Unexpected file field', 
          details: 'Please use the correct file field name' 
        });
      default:
        return res.status(400).json({ 
          error: 'Upload error', 
          details: error.message 
        });
    }
  }
  
  if (error.message) {
    return res.status(400).json({ 
      error: 'Upload failed', 
      details: error.message 
    });
  }
  
  return res.status(500).json({ 
    error: 'Internal server error during upload' 
  });
};

export default {
  upload,
  uploadSingleDocument,
  handleUploadError
};