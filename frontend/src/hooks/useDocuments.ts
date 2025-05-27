// frontend/src/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://legal-chat-ai.onrender.com'; // Replace with your actual Render URL

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
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      
      const data = await response.json();
      setDocuments(data.map((doc: any) => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    await fetchDocuments();
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Delete failed');
    await fetchDocuments();
  }, [fetchDocuments]);

  const downloadDocument = useCallback(async (id: string) => {
    window.open(`${API_BASE_URL}/api/documents/${id}/download`, '_blank');
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