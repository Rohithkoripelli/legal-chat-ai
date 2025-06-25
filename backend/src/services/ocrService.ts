import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

export interface OCRResult {
  text: string;
  confidence: number;
  provider: 'tesseract';
  isScanned: boolean;
  pages: OCRPageResult[];
}

export interface OCRPageResult {
  pageNumber: number;
  text: string;
  confidence: number;
}

export interface OCRConfig {
  fallbackToTesseract?: boolean;
  tempDir?: string;
}

class OCRService {
  private config: OCRConfig;
  private logger: winston.Logger;
  private tempDir: string;
  private popplerAvailable: boolean = false;

  constructor(config: OCRConfig = {}) {
    this.config = config;
    this.tempDir = config.tempDir || path.join(__dirname, '../../temp/ocr');
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console()
      ]
    });

    // Check if poppler is available
    this.checkPopplerAvailability();
    
    // Ensure temp directory exists
    this.ensureTempDir();
  }

  private checkPopplerAvailability(): void {
    try {
      // Check if poppler system dependency is available
      const { execSync } = require('child_process');
      execSync('pdftoppm -h', { stdio: 'ignore' });
      this.popplerAvailable = true;
      this.logger.info('OCR Service initialized with full PDF support via Tesseract.js + pdf-poppler');
    } catch (error) {
      this.popplerAvailable = false;
      this.logger.warn('Poppler not available - PDF OCR disabled. Images still supported via Tesseract.js');
      this.logger.info('To enable PDF OCR: install poppler (brew install poppler / apt-get install poppler-utils)');
    }
  }

  private async ensureTempDir(): Promise<void> {
    try {
      await fs.promises.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create temp directory:', error);
    }
  }

  async processDocument(filePath: string, mimeType: string): Promise<OCRResult> {
    this.logger.info(`Processing document: ${filePath}, type: ${mimeType}`);

    try {
      if (mimeType.startsWith('image/')) {
        return await this.processImageFile(filePath);
      } else if (mimeType === 'application/pdf') {
        if (this.popplerAvailable) {
          return await this.processPDFFile(filePath);
        } else {
          return await this.createPDFUnsupportedResult();
        }
      } else {
        throw new Error(`Unsupported file type for OCR: ${mimeType}`);
      }
    } catch (error) {
      this.logger.error('OCR processing failed:', error);
      throw error;
    }
  }

  private async createPDFUnsupportedResult(): Promise<OCRResult> {
    return {
      text: `📄 PDF file uploaded successfully.

⚠️ **PDF OCR Not Available**: This server doesn't have the required system dependencies for PDF OCR processing.

**For PDF OCR support, the server administrator needs to install:**
- poppler-utils (Linux: apt-get install poppler-utils)
- poppler (macOS: brew install poppler)

**Current capabilities:**
✅ Image files (JPG, PNG, BMP, TIFF, GIF) with OCR
✅ Regular PDF text extraction (searchable PDFs)
✅ Word documents (DOC, DOCX)

**Workaround for scanned PDFs:**
1. Convert PDF pages to images (JPG/PNG)
2. Upload individual images for OCR processing
3. Or use a regular (searchable) PDF instead

The document has been uploaded and stored for reference.`,
      confidence: 0,
      provider: 'tesseract',
      isScanned: false,
      pages: []
    };
  }

  private async processImageFile(filePath: string): Promise<OCRResult> {
    this.logger.info('Processing single image file with Tesseract');
    
    try {
      // Enhance image quality if needed
      const enhancedImagePath = await this.enhanceImageQuality(filePath);
      
      const { data } = await Tesseract.recognize(enhancedImagePath, 'eng', {
        logger: m => this.logger.debug('Tesseract:', m)
      });
      
      // Clean up enhanced image if it's different from original
      if (enhancedImagePath !== filePath) {
        await this.safeDeleteFile(enhancedImagePath);
      }
      
      this.logger.info(`Image processed: ${data.text.length} characters, confidence: ${data.confidence}%`);
      
      return {
        text: data.text,
        confidence: data.confidence / 100,
        provider: 'tesseract',
        isScanned: true,
        pages: [{
          pageNumber: 1,
          text: data.text,
          confidence: data.confidence / 100
        }]
      };
    } catch (error) {
      this.logger.error('Image processing failed:', error);
      throw error;
    }
  }

  private async processPDFFile(filePath: string): Promise<OCRResult> {
    this.logger.info('Processing PDF file - converting to images then OCR');
    
    const pdfSessionDir = path.join(this.tempDir, `pdf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    
    try {
      // Create session-specific directory
      await fs.promises.mkdir(pdfSessionDir, { recursive: true });
      
      // Convert PDF to images
      const imageFiles = await this.convertPDFToImages(filePath, pdfSessionDir);
      
      if (imageFiles.length === 0) {
        throw new Error('No images were generated from PDF');
      }
      
      this.logger.info(`PDF converted to ${imageFiles.length} images`);
      
      // Process each image with OCR
      const pages: OCRPageResult[] = [];
      let fullText = '';
      
      for (let i = 0; i < imageFiles.length; i++) {
        try {
          this.logger.info(`Processing PDF page ${i + 1}/${imageFiles.length}`);
          
          // Enhance image quality
          const enhancedImagePath = await this.enhanceImageQuality(imageFiles[i]);
          
          const { data } = await Tesseract.recognize(enhancedImagePath, 'eng', {
            logger: m => this.logger.debug(`Tesseract Page ${i + 1}:`, m)
          });
          
          pages.push({
            pageNumber: i + 1,
            text: data.text,
            confidence: data.confidence / 100
          });
          
          fullText += `--- Page ${i + 1} ---\n${data.text}\n\n`;
          
          // Clean up enhanced image if different
          if (enhancedImagePath !== imageFiles[i]) {
            await this.safeDeleteFile(enhancedImagePath);
          }
          
          this.logger.info(`Page ${i + 1} processed: ${data.text.length} characters, confidence: ${data.confidence}%`);
        } catch (pageError) {
          this.logger.error(`Failed to process page ${i + 1}:`, pageError);
          
          // Add empty page but continue processing
          pages.push({
            pageNumber: i + 1,
            text: `[OCR processing failed for page ${i + 1}]`,
            confidence: 0
          });
        }
      }
      
      // Calculate average confidence
      const validPages = pages.filter(p => p.confidence > 0);
      const avgConfidence = validPages.length > 0 
        ? validPages.reduce((sum, page) => sum + page.confidence, 0) / validPages.length 
        : 0;
      
      this.logger.info(`PDF OCR completed: ${pages.length} pages, average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
      
      return {
        text: fullText.trim(),
        confidence: avgConfidence,
        provider: 'tesseract',
        isScanned: true,
        pages
      };
      
    } finally {
      // Clean up all temporary files
      await this.cleanupDirectory(pdfSessionDir);
    }
  }

  private async convertPDFToImages(pdfPath: string, outputDir: string): Promise<string[]> {
    this.logger.info(`Converting PDF to images: ${pdfPath}`);
    
    try {
      const poppler = require('pdf-poppler');
      
      const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: 'page',
        page: null, // Process all pages
        scale: 2048 // High resolution for better OCR
      };
      
      await poppler.convert(pdfPath, options);
      
      // Get list of generated image files
      const files = await fs.promises.readdir(outputDir);
      const imageFiles = files
        .filter(file => file.startsWith('page') && file.endsWith('.png'))
        .sort((a, b) => {
          // Sort by page number
          const aNum = parseInt(a.match(/page-(\d+)/)?.[1] || '0');
          const bNum = parseInt(b.match(/page-(\d+)/)?.[1] || '0');
          return aNum - bNum;
        })
        .map(file => path.join(outputDir, file));
      
      this.logger.info(`Generated ${imageFiles.length} image files from PDF`);
      return imageFiles;
      
    } catch (error) {
      this.logger.error('PDF to image conversion failed:', error);
      throw new Error(`Failed to convert PDF to images: ${error.message}`);
    }
  }

  private async enhanceImageQuality(imagePath: string): Promise<string> {
    try {
      const Jimp = require('jimp');
      
      // Read the image
      const image = await Jimp.read(imagePath);
      
      // Get image info
      const { width, height } = image.bitmap;
      
      // Only enhance if image needs it
      const needsEnhancement = width < 1200 || height < 1200;
      
      if (!needsEnhancement) {
        this.logger.debug('Image quality sufficient, skipping enhancement');
        return imagePath;
      }
      
      this.logger.debug(`Enhancing image quality: ${width}x${height}`);
      
      // Create enhanced version
      const enhancedPath = imagePath.replace(/(\.[^.]+)$/, '_enhanced$1');
      
      await image
        .scaleToFit(2048, 2048) // Scale up if too small
        .contrast(0.3) // Increase contrast
        .normalize() // Normalize levels
        .writeAsync(enhancedPath);
      
      this.logger.debug(`Image enhanced and saved to: ${enhancedPath}`);
      return enhancedPath;
      
    } catch (error) {
      this.logger.warn('Image enhancement failed, using original:', error);
      return imagePath;
    }
  }

  private async cleanupDirectory(dirPath: string): Promise<void> {
    try {
      const files = await fs.promises.readdir(dirPath);
      
      // Delete all files in directory
      for (const file of files) {
        await this.safeDeleteFile(path.join(dirPath, file));
      }
      
      // Delete the directory itself
      await fs.promises.rmdir(dirPath);
      
      this.logger.debug(`Cleaned up directory: ${dirPath}`);
    } catch (error) {
      this.logger.warn('Failed to cleanup directory:', error);
    }
  }

  private async safeDeleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      this.logger.debug(`Deleted file: ${filePath}`);
    } catch (error) {
      this.logger.warn(`Failed to delete file ${filePath}:`, error);
    }
  }

  async isDocumentScanned(filePath: string, extractedText: string): Promise<boolean> {
    // Simple heuristic to determine if a document is scanned
    if (!extractedText || extractedText.trim().length < 50) {
      return true; // If very little text was extracted, it's probably scanned
    }

    // Check for garbled text patterns that suggest OCR failures
    const garbledPatterns = [
      /[^\w\s\.,;:!?'"()-]{3,}/g, // Multiple consecutive special characters
      /\b[a-zA-Z]{1,2}\b/g, // Too many single/double letter words
    ];

    const totalWords = extractedText.split(/\s+/).length;
    let suspiciousMatches = 0;

    for (const pattern of garbledPatterns) {
      const matches = extractedText.match(pattern);
      if (matches) {
        suspiciousMatches += matches.length;
      }
    }

    // If more than 20% of content seems garbled, it might be scanned
    return (suspiciousMatches / totalWords) > 0.2;
  }

  // Public method to check if PDF OCR is available
  public isPDFOCRAvailable(): boolean {
    return this.popplerAvailable;
  }
}

export default OCRService;