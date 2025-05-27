import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { generateSafeFilename, ensureDirectoryExists } from '../utils/fileUtils';

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Configure storage
const storage = multer.diskStorage({
  destination: async (req: Request, file: Express.Multer.File, cb) => {
    // Ensure the uploads directory exists
    await ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate a safe filename
    const safeFilename = generateSafeFilename(file.originalname);
    cb(null, safeFilename);
  }
});

// File filter for allowed document types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = /\.(pdf|doc|docx|txt|rtf)$/i;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check MIME type
  const mimetype = /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|rtf)|text\/(plain|rtf))$/i.test(file.mimetype);
  
  if (extname && mimetype) {
    // PDF file size limit can be higher for better quality documents
    if (file.mimetype === 'application/pdf' && file.size > 20 * 1024 * 1024) {
      cb(new Error('PDF file too large. Maximum size is 20MB.'));
    } else if (file.size > 10 * 1024 * 1024) {
      cb(new Error('File too large. Maximum size is 10MB.'));
    } else {
      cb(null, true);
    }
  } else {
    cb(new Error('Only PDF, Word, Text, and RTF files are allowed!'));
  }
};

// Configure upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max for PDF, 10MB for other files (checked in fileFilter)
  },
  fileFilter: fileFilter
});

// Single file upload middleware
export const uploadSingleDocument = upload.single('document');

export default {
  upload,
  uploadSingleDocument
};