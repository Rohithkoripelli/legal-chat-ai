// frontend/src/services/chatService.ts
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = window.location.hostname === 'localhost';

// Determine the correct API URL
const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  (isDevelopment && isLocalhost 
    ? 'http://localhost:3001' 
    : 'https://legal-ai-backend.onrender.com'); // Update with your actual Render URL

export const chatService = {
  /**
   * Send message to chat API
   */
  sendMessage: async (message: string, documentIds: string[] = []) => {
    try {
      console.log('📤 Sending message to chat API:', message);
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          documentIds
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received chat response');
      
      return {
        success: true,
        response: data.response
      };
    } catch (error) {
      console.error('❌ Chat service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      };
    }
  },

  /**
   * Test chat API connection
   */
  testConnection: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/test`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('❌ Chat connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }
};