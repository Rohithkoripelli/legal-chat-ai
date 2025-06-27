import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Document } from '../types'; // Use your existing types

export const useDocuments = () => {
  const { getToken, isSignedIn } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error('❌ Error getting auth headers:', error);
      throw new Error('Authentication failed - please log in again');
    }
  }, [getToken]);

  const fetchDocuments = useCallback(async () => {
    if (!isSignedIn) {
      console.log('⚠️ User not signed in, skipping document fetch');
      setDocuments([]);
      return;
    }

    console.log('🔍 fetchDocuments called for authenticated user');
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in');
      }

      console.log('🌐 Making authenticated request to:', `https://legal-chat-ai.onrender.com/api/documents`);
      const response = await fetch(`https://legal-chat-ai.onrender.com/api/documents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        throw new Error(`Failed to fetch documents: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📄 Raw response data:', data);
      
      if (!Array.isArray(data)) {
        console.error('❌ Expected array but got:', typeof data);
        throw new Error('Invalid response format');
      }
      
      // Map the backend response to frontend format with OCR data
      const mappedDocuments = data.map((doc: any) => ({
        id: doc._id || doc.id,
        name: doc.name || doc.originalName || 'Unnamed Document',
        size: doc.size || 0,
        type: doc.type || 'application/pdf',
        uploadedAt: new Date(doc.uploadedAt),
        // OCR-related fields
        ocrProcessed: doc.ocrProcessed || false,
        ocrProvider: doc.ocrProvider,
        ocrConfidence: doc.ocrConfidence,
        isScannedDocument: doc.isScannedDocument || false,
        ocrProcessedAt: doc.ocrProcessedAt ? new Date(doc.ocrProcessedAt) : undefined
      }));
      
      console.log('✅ Mapped documents:', mappedDocuments.length, 'documents');
      setDocuments(mappedDocuments);
      
    } catch (err) {
      console.error('❌ fetchDocuments error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  const uploadDocument = useCallback(async (file: File) => {
    if (!isSignedIn) {
      throw new Error('Please log in to upload documents');
    }

    console.log('📤 Uploading document:', file.name);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in');
      }

      const formData = new FormData();
      formData.append('document', file);

      console.log('🌐 Making authenticated upload request');
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`https://legal-chat-ai.onrender.com/api/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      console.log('📡 Upload response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Upload successful:', result);
      
      // Refresh document list
      await fetchDocuments();
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Upload timed out. Please try again with a smaller file or check your connection.');
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error during upload. Please check your connection and try again.');
        }
      }
      
      throw error;
    }
  }, [getToken, isSignedIn, fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    if (!isSignedIn) {
      throw new Error('Please log in to delete documents');
    }

    console.log('🗑️ Deleting document:', id);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in');
      }

      const response = await fetch(`https://legal-chat-ai.onrender.com/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        if (response.status === 404) {
          throw new Error('Document not found or access denied');
        }
        throw new Error(`Delete failed: ${response.status}`);
      }

      console.log('✅ Delete successful');
      
      // Refresh document list
      await fetchDocuments();
    } catch (error) {
      console.error('❌ Delete error:', error);
      throw error;
    }
  }, [getToken, isSignedIn, fetchDocuments]);

  const downloadDocument = useCallback(async (id: string) => {
    if (!isSignedIn) {
      throw new Error('Please log in to download documents');
    }

    console.log('📥 Downloading document:', id);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in');
      }

      // Create a download link with auth token
      const downloadUrl = `https://legal-chat-ai.onrender.com/api/documents/${id}/download`;
      
      // Create a temporary form to send the request with auth headers
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        if (response.status === 404) {
          throw new Error('Document not found or access denied');
        }
        throw new Error(`Download failed: ${response.status}`);
      }

      // Get the file blob and create download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Extract filename from response headers or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `document-${id}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('✅ Download completed');
    } catch (error) {
      console.error('❌ Download error:', error);
      throw error;
    }
  }, [getToken, isSignedIn]);

  // Only fetch documents when user is signed in
  useEffect(() => {
    if (isSignedIn) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setError(null);
    }
  }, [isSignedIn, fetchDocuments]);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    refetch: fetchDocuments,
    refreshDocuments: fetchDocuments,
    isAuthenticated: isSignedIn
  };
}