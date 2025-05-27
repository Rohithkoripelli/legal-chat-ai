import { useState, useCallback, useEffect } from 'react';
import { documentApi } from '../utils/api';

interface Document {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  type: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      console.log('🔍 Fetching documents');
      setLoading(true);
      setError(null);

      const data = await documentApi.getAll();
      
      // If test route is needed
      // const testResponse = await fetch('http://localhost:3001/api/documents/test');
      // const testData = await testResponse.json();
      // const data = testData.documents;
      
      if (!data) {
        console.log('No documents found');
        setDocuments([]);
        return;
      }
      
      console.log('📄 Received documents data:', data);
      
      const processedDocuments = Array.isArray(data) ? data.map((doc: any) => ({
        id: doc.id || doc._id, // Handle both id formats
        name: doc.name || doc.originalName,
        size: doc.size,
        type: doc.type,
        uploadedAt: new Date(doc.uploadedAt)
      })) : [];
      
      console.log('✅ Processed documents:', processedDocuments);
      setDocuments(processedDocuments);
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      
      // Try test route if main route fails
      try {
        console.log('Trying test route as fallback');
        const response = await fetch('http://localhost:3001/api/documents/test');
        const data = await response.json();
        
        if (data && data.documents) {
          const processedDocuments = data.documents.map((doc: any) => ({
            id: doc.id || doc._id,
            name: doc.name,
            size: doc.size,
            type: doc.type,
            uploadedAt: new Date(doc.uploadedAt)
          }));
          
          console.log('✅ Test route success:', processedDocuments);
          setDocuments(processedDocuments);
          return;
        }
      } catch (backupError) {
        console.error('Backup route also failed:', backupError);
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch documents';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (file: File) => {
    try {
      console.log('📤 Uploading file:', file.name);
      setLoading(true);
      setError(null);

      const data = await documentApi.upload(file);
      console.log('✅ Upload successful:', data);
      
      // Refresh document list after upload
      fetchDocuments();
      
      return data;
    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      console.log('🗑️ Deleting document:', id);
      setLoading(true);
      setError(null);

      await documentApi.delete(id);
      console.log('✅ Document deleted successfully');
      
      // Update local state by removing the deleted document
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('❌ Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete document';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadDocument = useCallback(async (id: string) => {
    try {
      const document = documents.find(doc => doc.id === id);
      if (!document) {
        throw new Error('Document not found');
      }
      
      console.log('📥 Downloading document:', document.name);
      await documentApi.download(id, document.name);
      console.log('✅ Download successful');
    } catch (error) {
      console.error('❌ Download error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to download document';
      setError(errorMessage);
    }
  }, [documents]);

  useEffect(() => {
    console.log('🚀 useDocuments: Initial fetch');
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    refreshDocuments: fetchDocuments
  };
};

export default useDocuments;