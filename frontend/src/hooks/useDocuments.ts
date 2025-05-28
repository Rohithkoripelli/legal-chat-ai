// frontend/src/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://legal-chat-ai.onrender.com';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    console.log('🔍 fetchDocuments called');
    try {
      setLoading(true);
      setError(null);
      
      console.log('🌐 Making request to:', `${API_BASE_URL}/api/documents`);
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) throw new Error('Failed to fetch documents');
      
      const data = await response.json();
      console.log('📄 Raw response data:', data);
      console.log('📄 First document structure:', data[0]);
      
      // Map the backend response to frontend format
      const mappedDocuments = data.map((doc: any) => ({
        id: doc._id || doc.id, // Convert _id to id
        name: doc.name || doc.originalName || 'Unnamed Document',
        size: doc.size || 0,
        type: doc.type || 'application/pdf',
        uploadedAt: new Date(doc.uploadedAt)
      }));
      
      console.log('✅ Mapped documents:', mappedDocuments);
      setDocuments(mappedDocuments);
      
    } catch (err) {
      console.error('❌ fetchDocuments error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (file: File) => {
    console.log('📤 Uploading document:', file.name);
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('📡 Upload response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      console.log('✅ Upload successful');
      await fetchDocuments(); // Refresh document list
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error; // Re-throw so calling component can handle it
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    console.log('🗑️ Deleting document:', id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      console.log('✅ Delete successful');
      await fetchDocuments(); // Refresh document list
    } catch (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }
  }, [fetchDocuments]);

  const downloadDocument = useCallback(async (id: string) => {
    console.log('📥 Downloading document:', id);
    try {
      // Try to open download URL
      window.open(`${API_BASE_URL}/api/documents/${id}/download`, '_blank');
    } catch (error) {
      console.error('❌ Download error:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    refetch: fetchDocuments,
    refreshDocuments: fetchDocuments
  };
};