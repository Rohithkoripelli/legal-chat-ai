// backend/src/services/documentService.ts - FIXED VERSION
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

// Enhanced document text extraction service with proper error handling
export const extractTextFromDocument = async (filePath: string): Promise<string> => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    const fileStats = await fs.promises.stat(filePath);
    
    console.log(`📄 Processing ${fileExtension} file: ${path.basename(filePath)} (${(fileStats.size / 1024).toFixed(1)}KB)`);

    switch (fileExtension) {
      case '.txt':
        return await extractFromText(filePath);
      case '.pdf':
        return await extractFromPDF(filePath);
      case '.doc':
      case '.docx':
        return await extractFromWord(filePath);
      case '.rtf':
        return await extractFromRTF(filePath);
      default:
        // Try to read as plain text for unknown formats
        try {
          return await extractFromText(filePath);
        } catch {
          return `⚠️ Unsupported file format: ${fileExtension}. 
                  Supported formats: PDF, Word (.doc, .docx), RTF, and text files.
                  File uploaded but content extraction was not possible.`;
        }
    }
  } catch (error) {
    console.error('Error extracting text from document:', error);
    return `❌ Error: Could not extract text from this document. 
            File uploaded but content analysis will be limited.
            Error details: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

const extractFromText = async (filePath: string): Promise<string> => {
  try {
    const content = await readFile(filePath, 'utf-8');
    
    // Basic text cleanup
    const cleanedContent = content
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
      .trim();
    
    console.log(`✅ Successfully extracted ${cleanedContent.length} characters from text file`);
    return cleanedContent;
  } catch (error) {
    throw new Error(`Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const extractFromPDF = async (filePath: string): Promise<string> => {
  console.log(`🔍 Attempting to extract text from PDF: ${path.basename(filePath)}`);
  
  // Method 1: Try pdf-parse first (most reliable)
  try {
    console.log('📊 Attempting pdf-parse extraction...');
    const pdfParse = require('pdf-parse');
    const dataBuffer = await readFile(filePath);
    
    const data = await pdfParse(dataBuffer, {
      max: 0, // Extract all pages
      version: 'v1.9.498' // Specify version for consistency
    });
    
    if (data.text && data.text.length > 0) {
      // Clean up the extracted text
      const cleanedText = data.text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
        .trim();
      
      console.log(`✅ Successfully extracted ${cleanedText.length} characters from PDF using pdf-parse`);
      return cleanedText;
    } else {
      throw new Error('No text content found in PDF');
    }
  } catch (pdfParseError) {
    console.warn('pdf-parse failed:', pdfParseError);
    
    // Method 2: Try pdf.js-extract as fallback
    try {
      console.log('📄 Attempting pdf.js-extract as fallback...');
      const { PDFExtract } = require('pdf.js-extract');
      const pdfExtract = new PDFExtract();
      
      // Use Promise wrapper for callback-based API
      const data = await new Promise<any>((resolve, reject) => {
        pdfExtract.extract(filePath, {
          normalizeWhitespace: true,
          disableCombineTextItems: false
        }, (err: any, data: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
      
      if (data && data.pages && data.pages.length > 0) {
        let extractedText = '';
        
        data.pages.forEach((page: any, pageIndex: number) => {
          if (page.content && page.content.length > 0) {
            // Sort content by position for reading order
            const sortedItems = [...page.content].sort((a: any, b: any) => {
              const yDiff = Math.abs(a.y - b.y);
              if (yDiff < 12) return a.x - b.x; // Same line, sort by x
              return a.y - b.y; // Different lines, sort by y
            });
            
            let currentLine = '';
            let lastY = -1;
            
            sortedItems.forEach((item: any) => {
              if (item.str && typeof item.str === 'string') {
                // Check if we're on a new line
                if (lastY !== -1 && Math.abs(item.y - lastY) > 12) {
                  if (currentLine.trim()) {
                    extractedText += currentLine.trim() + '\n';
                  }
                  currentLine = item.str + ' ';
                } else {
                  currentLine += item.str + ' ';
                }
                lastY = item.y;
              }
            });
            
            // Add the last line
            if (currentLine.trim()) {
              extractedText += currentLine.trim() + '\n';
            }
            
            // Add page break
            if (pageIndex < data.pages.length - 1) {
              extractedText += '\n';
            }
          }
        });
        
        // Clean up the text
        const cleanedText = extractedText
          .replace(/\n{3,}/g, '\n\n')
          .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
          .trim();
        
        if (cleanedText.length > 50) { // Ensure we got meaningful content
          console.log(`✅ Successfully extracted ${cleanedText.length} characters from PDF using pdf.js-extract`);
          return cleanedText;
        } else {
          throw new Error('Extracted text too short, likely not meaningful');
        }
      } else {
        throw new Error('No pages found in PDF');
      }
    } catch (pdfJsError) {
      console.warn('pdf.js-extract also failed:', pdfJsError);
      
      // Method 3: Last resort - simple text pattern extraction
      try {
        console.log('🔄 Attempting basic text pattern extraction...');
        const buffer = await readFile(filePath);
        
        // Convert to string and look for text patterns
        const content = buffer.toString('binary');
        
        // Look for readable text patterns (more sophisticated regex)
        const textMatches = content.match(/[A-Za-z0-9\s.,!?;:'"(){}[\]@#$%^&*+=_\-]{20,}/g);
        
        if (textMatches && textMatches.length > 0) {
          // Join matches and clean up
          const extractedText = textMatches
            .filter(match => match.trim().length > 10) // Filter out very short matches
            .join(' ')
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim()
            .slice(0, 10000); // Limit to reasonable size
          
          if (extractedText.length > 100) {
            console.log(`⚠️ Basic extraction found ${extractedText.length} characters`);
            return `PDF content (basic extraction):\n\n${extractedText}\n\n⚠️ Note: This PDF required basic text extraction. Content may be incomplete or contain formatting artifacts.`;
          }
        }
        
        throw new Error('No readable text found with basic extraction');
      } catch (basicError) {
        console.error('All PDF extraction methods failed:', basicError);
        
        // Return informative message instead of gibberish
        return `⚠️ Unable to extract readable text from this PDF file.

Possible reasons:
• The PDF may be scanned images without searchable text
• The PDF may be encrypted or password-protected  
• The PDF may have complex formatting that prevents text extraction
• The file may be corrupted

For better results, please try:
1. Using a PDF with selectable/searchable text
2. Converting scanned PDFs to searchable PDFs using OCR
3. Uploading the document in a different format (Word, RTF, or plain text)

The file has been uploaded successfully but cannot be analyzed for content.`;
      }
    }
  }
};

const extractFromWord = async (filePath: string): Promise<string> => {
  try {
    console.log('📄 Attempting Word document extraction...');
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (result.value && result.value.length > 0) {
      // Clean up the extracted text
      const cleanedText = result.value
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      console.log(`✅ Successfully extracted ${cleanedText.length} characters from Word document`);
      return cleanedText;
    } else {
      throw new Error('No text content found in Word document');
    }
  } catch (requireError) {
    console.warn('mammoth not available:', requireError);
    return `📄 Word document uploaded successfully.

⚠️ Text extraction requires the 'mammoth' package to be installed.

To enable Word document processing, run:
npm install mammoth

The file has been stored and can be referenced, but content analysis is limited without text extraction.`;
  }
};

const extractFromRTF = async (filePath: string): Promise<string> => {
  try {
    console.log('📄 Attempting RTF extraction...');
    const content = await readFile(filePath, 'utf-8');
    
    // Enhanced RTF text extraction
    let text = content
      // Remove RTF headers and version info
      .replace(/\{\\rtf\d+\\[^}]*\}/g, '')
      // Remove font tables
      .replace(/\{\\fonttbl[^}]*\}/g, '')
      // Remove color tables  
      .replace(/\{\\colortbl[^}]*\}/g, '')
      // Remove formatting blocks
      .replace(/\{[^}]*\}/g, '')
      // Remove RTF commands
      .replace(/\\[a-zA-Z]+\d*/g, ' ')
      // Remove escaped characters
      .replace(/\\\\/g, '\\')
      .replace(/\\\{/g, '{')
      .replace(/\\\}/g, '}')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text.length > 10) {
      console.log(`✅ Successfully extracted ${text.length} characters from RTF`);
      return text;
    } else {
      throw new Error('No meaningful text found after RTF processing');
    }
  } catch (error) {
    console.warn('RTF extraction failed:', error);
    return `📄 RTF file uploaded successfully.

⚠️ Text extraction from this RTF file was not successful using basic parsing.

The file has been stored but content analysis will be limited.`;
  }
};

// Utility functions
export const isValidDocumentType = (mimetype: string): boolean => {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/rtf'
  ];
  
  return allowedTypes.includes(mimetype);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileInfo = (filePath: string) => {
  const stats = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();
  
  return {
    size: stats.size,
    extension,
    created: stats.birthtime,
    modified: stats.mtime,
    formattedSize: formatFileSize(stats.size)
  };
};

export default {
  extractTextFromDocument,
  isValidDocumentType,
  formatFileSize,
  getFileInfo
};