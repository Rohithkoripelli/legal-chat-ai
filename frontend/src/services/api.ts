// frontend/src/config/api.ts - Create this new file
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = window.location.hostname === 'localhost';

// Determine the correct API URL
export const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  (isDevelopment && isLocalhost 
    ? 'http://localhost:3001' 
    : 'https://legal-chat-ai.onrender.com'); // Replace with your actual Render URL

console.log('🔗 API Base URL:', API_BASE_URL);

// Export API helper
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error(`❌ API Request failed: ${url}`, error);
    throw error;
  }
};