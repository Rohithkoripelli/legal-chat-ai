// frontend/src/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../services/api';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface DocumentsState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

export const useDocuments = () => {
  const [state, setState] = useState<DocumentsState>({
    documents: [],
    loading: false,
    error: null
  });

  const fetchDocuments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiRequest('/api/documents');
      const documents = await response.json();
      
      setState(prev => ({
        ...prev,
        documents: documents.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt)
        })),
        loading: false
      }));
      
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch documents',
        loading: false
      }));
    }
  }, []);

  const uploadDocument = useCallback(async (file: File) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const formData = new FormData();
      formData.append('document', file);

      const response = await apiRequest('/api/documents/upload', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type to let browser set it for FormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      await fetchDocuments(); // Refresh the list
      
    } catch (error) {
      console.error('❌ Error uploading document:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to upload document',
        loading: false
      }));
      throw error;
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiRequest(`/api/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      await fetchDocuments(); // Refresh the list
      
    } catch (error) {
      console.error('❌ Error deleting document:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete document',
        loading: false
      }));
      throw error;
    }
  }, [fetchDocuments]);

  const downloadDocument = useCallback(async (documentId: string) => {
    try {
      console.log('📥 Downloading document:', documentId);
      
      const response = await apiRequest(`/api/documents/${documentId}/download`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      // Check if response contains a download URL (for services like S3)
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // If JSON response, it might contain a presigned URL
        const data = await response.json();
        if (data.downloadUrl) {
          // Open the presigned URL
          window.open(data.downloadUrl, '_blank');
          return;
        }
      }

      // Direct file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('❌ Error downloading document:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to download document'
      }));
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents: state.documents,
    loading: state.loading,
    error: state.error,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    refetch: fetchDocuments,
    refreshDocuments: fetchDocuments // Alias for compatibility
  };
};