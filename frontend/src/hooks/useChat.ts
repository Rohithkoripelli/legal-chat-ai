// frontend/src/hooks/useChat.ts
import { useState, useCallback } from 'react';

const API_BASE_URL = 'https://legal-chat-ai.onrender.com';

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async ({ message }: { message: string }) => {
    setIsLoading(true);
    setError(null);

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response || 'No response',
        isUser: false,
        timestamp: new Date()
      }]);

    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages: () => setMessages([]),
    initializeSession: () => {},
    currentSession: null
  };
};