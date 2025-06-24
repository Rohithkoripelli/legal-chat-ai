// frontend/src/types/index.ts - UPDATED with authentication support
// Message type for chat
export interface Message {
  id: string | number; // Allow both string and number for compatibility
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
  userId?: string; // NEW: User ID for document ownership
}

// Chat session
export interface ChatSession {
  _id: string;
  sessionId: string;
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  userId?: string; // NEW: User ID for session ownership
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
  isAuthenticated?: boolean; // NEW: Authentication status
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

// NEW: Authentication types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

// NEW: Chat context type for useChat hook compatibility
export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (params: { message: string }) => Promise<void>;
  clearMessages: () => void;
  isAuthenticated?: boolean;
}

// NEW: Document context type for useDocuments hook compatibility
export interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  downloadDocument: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
  isAuthenticated: boolean;
}

// NEW: Authentication error types
export interface AuthError {
  type: 'AUTHENTICATION_FAILED' | 'TOKEN_EXPIRED' | 'UNAUTHORIZED';
  message: string;
}

// NEW: Protected API request options
export interface ProtectedApiOptions extends RequestInit {
  requireAuth?: boolean;
  retryOnAuthFailure?: boolean;
}

// NEW: Conversation types for chat history
export interface Conversation {
  _id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount?: number;
}

// NEW: Conversation with messages
export interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
}

// NEW: Updated Chat context type with conversation support
export interface ChatContextTypeWithConversations extends ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: (title?: string) => Promise<Conversation>;
  switchConversation: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;
}