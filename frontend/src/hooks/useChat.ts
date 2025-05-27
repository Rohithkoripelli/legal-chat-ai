import { useState, useCallback } from 'react';

const API_BASE_URL = 'https://legal-chat-ai.onrender.com';  // Hardcode for now

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const sendMessage = useCallback(async ({ message }: { message: string }) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📤 Sending message:', message);

      // Add user message immediately
      addMessage({ text: message, isUser: true });

      // Get all documents first
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

      // Send message to chat API
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

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || `Server error: ${response.status}`;
        } catch {
          errorText = `Network error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log('✅ Received AI response');

      // Add AI response
      addMessage({ text: data.response, isUser: false });
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      let errorMessage = 'Failed to send message';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check if the backend is running on port 3001.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      // Add error message to chat
      addMessage({ 
        text: `Sorry, I encountered an error: ${errorMessage}. Please ensure the backend server is running and try again.`, 
        isUser: false 
      });
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading, setError]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage
  };
};