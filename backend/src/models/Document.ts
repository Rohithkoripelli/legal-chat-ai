import mongoose from 'mongoose';

export interface IDocument {
  name: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: Date;
  userId?: string;
  content?: string;
  isVectorized?: boolean; // Whether the document has been vectorized
  vectorizedAt?: Date;    // When the document was vectorized
  // OCR-related fields
  ocrProcessed?: boolean;     // Whether OCR was used for text extraction
  ocrProvider?: string;       // OCR provider used (google, aws, tesseract)
  ocrConfidence?: number;     // OCR confidence score (0-100)
  isScannedDocument?: boolean; // Whether document was detected as scanned
  ocrProcessedAt?: Date;      // When OCR processing was completed
}

const documentSchema = new mongoose.Schema<IDocument>({
  name: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String
  },
  content: {
    type: String
  },
  isVectorized: {
    type: Boolean,
    default: false
  },
  vectorizedAt: {
    type: Date
  },
  // OCR-related fields
  ocrProcessed: {
    type: Boolean,
    default: false
  },
  ocrProvider: {
    type: String,
    enum: ['google', 'aws', 'tesseract'],
    required: false
  },
  ocrConfidence: {
    type: Number,
    min: 0,
    max: 100,
    required: false
  },
  isScannedDocument: {
    type: Boolean,
    default: false
  },
  ocrProcessedAt: {
    type: Date,
    required: false
  }
});

// Create a text index on content field for basic text search
documentSchema.index({ content: 'text', originalName: 'text' });

const Document = mongoose.model<IDocument>('Document', documentSchema);

export default Document;
export { documentSchema };