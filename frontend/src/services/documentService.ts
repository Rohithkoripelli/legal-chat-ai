import { api } from './api';
import { Document, ApiResponse } from '../types';

export const documentService = {
  /**
   * Upload a document
   */
  uploadDocument: async (file: File): Promise<ApiResponse<Document>> => {
    const formData = new FormData();
    formData.append('document', file);
    
    return api.upload<Document>('/documents/upload', formData);
  },

  /**
   * Get all documents
   */
  getDocuments: async (): Promise<ApiResponse<Document[]>> => {
    return api.get<Document[]>('/documents');
  },

  /**
   * Get single document
   */
  getDocument: async (id: string): Promise<ApiResponse<Document>> => {
    return api.get<Document>(`/documents/${id}`);
  },

  /**
   * Delete document
   */
  deleteDocument: async (id: string): Promise<ApiResponse<void>> => {
    return api.delete<void>(`/documents/${id}`);
  },

  /**
   * Get processing status
   */
  getProcessingStatus: async (id: string): Promise<ApiResponse<{ status: string }>> => {
    return api.get<{ status: string }>(`/documents/${id}/status`);
  },
};