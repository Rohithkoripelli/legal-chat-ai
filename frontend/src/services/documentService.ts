// frontend/src/services/documentService.ts
const API_BASE_URL = 'https://legal-chat-ai.onrender.com'; // Your Render URL

export const documentService = {
  /**
   * Upload a document
   */
  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Get all documents
   */
  getDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/api/documents`);

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Get single document
   */
  getDocument: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status}`);
    }

    return await response.json();
  },

  /**
   * Delete document
   */
  deleteDocument: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.status}`);
    }

    return await response.json();
  },
};