const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';

/**
 * Generic fetch API wrapper with error handling
 */
export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default options
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    ...options
  };
  
  console.log(`Fetching ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    // Check if response is empty
    const text = await response.text();
    if (!text) {
      return null;
    }
    
    // Parse JSON
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

/**
 * API Document functions
 */
export const documentApi = {
  getAll: async () => {
    return fetchApi('/api/documents');
  },
  
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    return fetchApi('/api/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type with FormData
    });
  },
  
  delete: async (id: string) => {
    return fetchApi(`/api/documents/${id}`, {
      method: 'DELETE',
    });
  },
  
  download: async (id: string, fileName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${id}/download`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },
};

/**
 * API Chat functions
 */
export const chatApi = {
  sendMessage: async (message: string, documentIds: string[] = []) => {
    return fetchApi('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, documentIds }),
    });
  },
  
  getHistory: async () => {
    return fetchApi('/api/chat/history');
  },
  
  clearHistory: async () => {
    return fetchApi('/api/chat/history', {
      method: 'DELETE',
    });
  },
};