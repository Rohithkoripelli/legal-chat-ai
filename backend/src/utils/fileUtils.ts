import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import crypto from 'crypto';

// Promisify file operations
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const unlink = promisify(fs.unlink);

/**
 * Ensure a directory exists
 */
export const ensureDirectoryExists = async (dirPath: string): Promise<void> => {
  try {
    await access(dirPath, fs.constants.F_OK);
  } catch (error) {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

/**
 * Generate a safe filename with a timestamp and random string
 */
export const generateSafeFilename = (originalFilename: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalFilename);
  const basename = path.basename(originalFilename, extension)
    .replace(/[^a-zA-Z0-9]/g, '_') // Remove special characters
    .substring(0, 20); // Limit length
  
  return `${basename}_${timestamp}_${randomString}${extension}`;
};

/**
 * Check if a file exists
 */
export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get file details (size, extension, creation date)
 */
export const getFileDetails = (filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    
    return {
      size: stats.size,
      extension: path.extname(filePath).toLowerCase(),
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    console.error(`Error getting file details for ${filePath}:`, error);
    throw error;
  }
};

/**
 * Format file size into human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get MIME type based on file extension
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.rtf': 'application/rtf',
    '.json': 'application/json',
    '.csv': 'text/csv',
    '.xml': 'application/xml',
    '.zip': 'application/zip',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Determine if a file is a supported document type
 */
export const isSupportedDocumentType = (filename: string): boolean => {
  const supportedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
  const extension = path.extname(filename).toLowerCase();
  
  return supportedExtensions.includes(extension);
};

/**
 * Check if a file is a PDF
 */
export const isPdfFile = (filename: string): boolean => {
  return path.extname(filename).toLowerCase() === '.pdf';
};

/**
 * Get file content as string (for text-based files)
 */
export const getTextFileContent = async (filePath: string): Promise<string> => {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading text file: ${filePath}`, error);
    throw error;
  }
};

export default {
  ensureDirectoryExists,
  generateSafeFilename,
  fileExists,
  getFileDetails,
  formatFileSize,
  getMimeTypeFromExtension,
  isSupportedDocumentType,
  isPdfFile,
  getTextFileContent
};