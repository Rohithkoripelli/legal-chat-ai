// backend/src/services/documentService.ts - Enhanced with Clean PDF Extraction
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

// Enhanced document text extraction service
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
    const cleanedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    console.log(`✅ Successfully extracted ${cleanedContent.length} characters from text file`);
    return cleanedContent;
  } catch (error) {
    throw new Error(`Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Enhanced PDF extraction with proper cleaning
const extractFromPDF = async (filePath: string): Promise<string> => {
  console.log(`🔍 Attempting to extract text from PDF: ${path.basename(filePath)}`);
  
  // Method 1: Try pdf-parse first
  try {
    console.log('📊 Attempting pdf-parse extraction...');
    const pdfParse = require('pdf-parse');
    const dataBuffer = await readFile(filePath);
    
    const data = await pdfParse(dataBuffer, {
      max: 0,
      normalizeWhitespace: true,
      disableCombinedTextItems: false
    });
    
    if (data.text && data.text.length > 100) {
      console.log(`✅ pdf-parse successful: ${data.text.length} characters extracted`);
      const cleanedText = cleanPDFText(data.text);
      
      if (cleanedText.length > 50) {
        return cleanedText;
      } else {
        console.warn('⚠️ Cleaned text too short, trying alternative method...');
      }
    }
  } catch (pdfParseError) {
    console.warn('pdf-parse failed:', pdfParseError.message);
  }

  // Method 2: Try pdf.js-extract
  try {
    console.log('📄 Attempting pdf.js-extract as fallback...');
    const { PDFExtract } = require('pdf.js-extract');
    const pdfExtract = new PDFExtract();
    
    const data = await new Promise<any>((resolve, reject) => {
      pdfExtract.extract(filePath, {
        normalizeWhitespace: true,
        disableCombineTextItems: false
      }, (err: any, data: any) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    
    if (data && data.pages && data.pages.length > 0) {
      let extractedText = '';
      
      data.pages.forEach((page: any) => {
        if (page.content && page.content.length > 0) {
          const sortedItems = [...page.content].sort((a: any, b: any) => {
            const yDiff = Math.abs(a.y - b.y);
            if (yDiff < 12) return a.x - b.x;
            return a.y - b.y;
          });
          
          let currentLine = '';
          let lastY = -1;
          
          sortedItems.forEach((item: any) => {
            if (item.str && typeof item.str === 'string') {
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
          
          if (currentLine.trim()) {
            extractedText += currentLine.trim() + '\n';
          }
        }
      });
      
      const cleanedText = cleanPDFText(extractedText);
      if (cleanedText.length > 100) {
        console.log(`✅ pdf.js-extract successful: ${cleanedText.length} characters`);
        return cleanedText;
      }
    }
  } catch (pdfJsError) {
    console.warn('pdf.js-extract also failed:', pdfJsError.message);
  }

  // Method 3: Basic pattern extraction with heavy cleaning
  try {
    console.log('🔄 Attempting basic text pattern extraction...');
    const buffer = await readFile(filePath);
    const binaryText = buffer.toString('binary');
    
    // Extract text using multiple patterns
    const textPatterns = [
      /BT\s+.*?ET/gs,
      /\([^)]{10,}\)/g,
      /[A-Za-z][A-Za-z0-9\s.,;:!?'"()-]{20,}[.!?]/g
    ];
    
    let extractedTexts: string[] = [];
    textPatterns.forEach(pattern => {
      const matches = binaryText.match(pattern);
      if (matches) {
        extractedTexts.push(...matches);
      }
    });
    
    if (extractedTexts.length > 0) {
      const combinedText = extractedTexts.join(' ');
      const cleanedText = cleanPDFText(combinedText);
      
      if (cleanedText.length > 100) {
        console.log(`✅ Basic extraction successful: ${cleanedText.length} characters`);
        return cleanedText;
      }
    }
  } catch (basicError) {
    console.warn('Basic extraction failed:', basicError);
  }
  
  // Final fallback message
  return `📄 PDF file processed successfully.

⚠️ **Text Extraction Limited**: This PDF may contain:
- Scanned images requiring OCR
- Complex formatting that affected extraction
- Protected/encrypted content
- Non-selectable text

**Recommendations:**
1. Try converting to Word format (.docx)
2. Ensure PDF has selectable text (not just images)
3. Use a simpler PDF format if possible

The document has been uploaded and stored for reference.`;
};

// Enhanced text cleaning function specifically for PDFs
const cleanPDFText = (rawText: string): string => {
  console.log('🧹 Cleaning extracted PDF text...');
  
  let cleaned = rawText;
  
  // Remove PDF-specific artifacts that cause OpenAI content filter issues
  cleaned = cleaned.replace(/BT\s+.*?ET/gs, ' '); // Remove PDF text blocks
  cleaned = cleaned.replace(/endstream|endobj|xref|trailer|startxref/gi, ' ');
  cleaned = cleaned.replace(/CreationDate|ModDate|Producer|Title/gi, '');
  cleaned = cleaned.replace(/\([D:][^)]*\)/g, ' '); // Remove date stamps
  cleaned = cleaned.replace(/\/[A-Z][a-zA-Z]*\s*\d*/g, ' '); // Remove PDF commands
  cleaned = cleaned.replace(/\d+\s+\d+\s+obj/g, ' ');
  cleaned = cleaned.replace(/<<.*?>>/g, ' ');
  cleaned = cleaned.replace(/\[\s*\d+(\s+\d+)*\s*\]/g, ' ');
  
  // Remove binary/control characters that trigger content filters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
  
  // Remove excessive special characters
  cleaned = cleaned.replace(/[^\w\s.,;:!?()\-'"]/g, ' ');
  
  // Clean parentheses content (keep meaningful text, remove PDF artifacts)
  cleaned = cleaned.replace(/\([^)]*\)/g, (match) => {
    const content = match.slice(1, -1);
    if (content.length > 3 && /[a-zA-Z]/.test(content) && !/^[^a-zA-Z]*$/.test(content)) {
      return ` ${content} `;
    }
    return ' ';
  });
  
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // Filter to keep only meaningful sentences
  const sentences = cleaned.split(/[.!?]+/).filter(sentence => {
    const trimmed = sentence.trim();
    return trimmed.length > 15 && // Meaningful length
           /[a-zA-Z]/.test(trimmed) && // Contains letters
           (trimmed.match(/[a-zA-Z]/g) || []).length > 8 && // Has enough letters
           !/^\d+$/.test(trimmed) && // Not just numbers
           !trimmed.match(/^[^a-zA-Z]*$/); // Not just special characters
  });
  
  const result = sentences.join('. ').trim();
  
  console.log(`✅ Text cleaning completed: ${rawText.length} → ${result.length} characters`);
  
  return result;
};

const extractFromWord = async (filePath: string): Promise<string> => {
  try {
    console.log('📄 Attempting Word document extraction...');
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (result.value && result.value.length > 0) {
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

⚠️ Text extraction requires the 'mammoth' package:
npm install mammoth

The file has been stored but content analysis is limited without text extraction.`;
  }
};

const extractFromRTF = async (filePath: string): Promise<string> => {
  try {
    console.log('📄 Attempting RTF extraction...');
    const content = await readFile(filePath, 'utf-8');
    
    let text = content
      .replace(/\{\\rtf\d+\\[^}]*\}/g, '')
      .replace(/\{\\fonttbl[^}]*\}/g, '')
      .replace(/\{\\colortbl[^}]*\}/g, '')
      .replace(/\{[^}]*\}/g, '')
      .replace(/\\[a-zA-Z]+\d*/g, ' ')
      .replace(/\\\\/g, '\\')
      .replace(/\\\{/g, '{')
      .replace(/\\\}/g, '}')
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

⚠️ Text extraction from this RTF file was not successful.
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