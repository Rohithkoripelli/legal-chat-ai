// frontend/src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';

const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = window.location.hostname === 'localhost';

const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  (isDevelopment && isLocalhost 
    ? 'http://localhost:3001' 
    : 'https://your-railway-app.railway.app');

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const initializeSession = async () => {
    try {
      const response = await chatService.createSession();
      if (response.success && response.data) {
        setCurrentSession(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to create session');
      }
    } catch (err) {
      setError('Failed to initialize chat session');
    }
  };

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get document IDs if available
      let documentIds: string[] = [];
      
      try {
        const documentsResponse = await fetch(`${API_BASE_URL}/api/documents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (documentsResponse.ok) {
          const documentsData = await documentsResponse.json();
          documentIds = documentsData.map((doc: any) => doc.id);
          console.log('📄 Including document IDs:', documentIds);
        } else {
          console.warn('Could not fetch documents, proceeding without them');
        }
      } catch (docError) {
        console.warn('Error fetching documents:', docError);
        // Continue without documents
      }

      // Use chatService instead of direct fetch
      const response = await chatService.sendMessage(
        currentSession?.sessionId || 'default-session',
        message,
        documentIds
      );
      
      if (response.success && response.data) {
        // Adapt the response to your message format
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.response || response.response || 'No response received',
          isUser: false,
          timestamp: new Date(),
          sources: response.data.sources || []
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // FIXED: Use response.error instead of response.message
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    initializeSession,
    currentSession
  };
};