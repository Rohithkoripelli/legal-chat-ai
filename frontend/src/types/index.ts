// Message type for chat
export interface Message {
  id: string;
  text: string;  // Content of the message
  isUser: boolean;  // Whether the message is from the user or AI
  timestamp: Date;
  documentReferences?: DocumentReference[];
}

// Document reference in messages
export interface DocumentReference {
  documentId: string;
  snippet: string;
  confidence: number;
}

// Document type
export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content?: string;
  extractionWarning?: boolean; // Indicates PDF extraction issues
}

// Chat session
export interface ChatSession {
  _id: string;
  sessionId: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// API response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// PDF extraction status
export enum PdfExtractionStatus {
  Success = 'success',
  PartialSuccess = 'partial',
  Failed = 'failed'
}

// Document with extraction info
export interface DocumentWithExtractionInfo extends Document {
  extractionStatus?: PdfExtractionStatus;
  extractionWarning?: boolean;
  warningMessage?: string;
}

// Chat state
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  hasPdfExtractionWarning: boolean;
}

// Document state
export interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedDocuments: string[];
}

// Search result for documents
export interface DocumentSearchResult {
  documentId: string;
  score: number;
  snippet: string;
}

// Message with document context
export interface MessageWithContext {
  text: string;
  isUser: boolean;
  documentIds?: string[];
  extractionWarnings?: boolean;
}