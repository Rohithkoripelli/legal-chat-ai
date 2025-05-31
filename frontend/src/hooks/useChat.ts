import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Message } from '../types'; // Use your existing types

export const useChat = () => {
  const { getToken, isSignedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async ({ message }: { message: string }) => {
    if (!isSignedIn) {
      setError('Please log in to use chat functionality');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message first (preserve existing functionality)
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get authentication token
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in again');
      }

      console.log('🔑 Got auth token for chat request');

      // Fetch user's available documents for chat context
      let documentIds: string[] = [];
      try {
        console.log('🔍 Fetching user documents for chat context...');
        const documentsResponse = await fetch(`https://legal-chat-ai.onrender.com/api/documents`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (documentsResponse.ok) {
          const documents = await documentsResponse.json();
          documentIds = documents.map((doc: any) => doc.id || doc._id);
          console.log(`📄 Found ${documentIds.length} documents for chat context:`, documentIds);
        } else {
          console.warn('⚠️ Could not fetch documents for chat context:', documentsResponse.status);
        }
      } catch (docError) {
        console.warn('⚠️ Error fetching documents for chat:', docError);
        // Continue without documents - don't fail the chat
      }

      // Send message with document context and authentication
      console.log('📤 Sending authenticated message to chat API');
      const response = await fetch(`https://legal-chat-ai.onrender.com/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // CRITICAL: Auth header
        },
        body: JSON.stringify({ 
          message,
          documentIds // Include user's document IDs for context
        }),
      });

      console.log('📡 Chat response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Chat response received');
      
      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.response || 'No response received',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      console.log('✅ Chat message exchange completed successfully');

    } catch (err) {
      console.error('❌ Error sending chat message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      // Add error message to chat (preserve existing UX)
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const initializeSession = useCallback(() => {
    // Placeholder for session initialization
    if (!isSignedIn) {
      setError('Please log in to start a chat session');
      return;
    }
    
    console.log('🔄 Chat session initialized for authenticated user');
    setError(null);
  }, [isSignedIn]);

  // Return interface compatible with existing components
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    initializeSession,
    currentSession: null, // Placeholder for future session management
    isAuthenticated: isSignedIn
  };
};