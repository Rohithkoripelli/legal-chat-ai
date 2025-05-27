// frontend/src/services/chatService.ts
const API_BASE_URL = 'https://legal-chat-ai.onrender.com'; // Replace with your actual Render URL

export const chatService = {
  sendMessage: async (message: string, documentIds: string[] = []) => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, documentIds }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};