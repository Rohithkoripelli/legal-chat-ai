// frontend/src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';

const API_BASE_URL = 'https://legal-chat-ai.onrender.com'; // Update with your actual Render URL

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

  // This function receives { message: string } from App.tsx
  const sendMessage = useCallback(async ({ message }: { message: string }) => {
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

      // Call chatService.sendMessage
      const response = await chatService.sendMessage(
        currentSession?.sessionId || 'default-session',
        message,
        documentIds
      );
      
      if (response.success) {
        // SUCCESS: Extract the AI response
        const aiResponseText = response.data?.response || response.response || 'No response received';
        
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponseText,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // FAILURE: Show error message
        console.error('Chat service error:', response.error);
        setError(response.error || 'Failed to send message');
        
        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message');
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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