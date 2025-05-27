import { Document } from 'mongoose';

export interface IDocument extends Document {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  textContent: string;
  embeddings: number[][];
  metadata: {
    pageCount?: number;
    extractedAt: Date;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  };
}

export interface IChatSession extends Document {
  sessionId: string;
  documentIds: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface IMessage extends Document {
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  documentReferences?: {
    documentId: string;
    relevantText: string;
    confidence: number;
  }[];
}

export interface DocumentProcessingResult {
  success: boolean;
  textContent?: string;
  embeddings?: number[][];
  error?: string;
}

export interface ChatResponse {
  message: string;
  references: {
    documentId: string;
    snippet: string;
    confidence: number;
  }[];
}