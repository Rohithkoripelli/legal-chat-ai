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
  }
});

// Create a text index on content field for basic text search
documentSchema.index({ content: 'text', originalName: 'text' });

const Document = mongoose.model<IDocument>('Document', documentSchema);

export default Document;
export { documentSchema };