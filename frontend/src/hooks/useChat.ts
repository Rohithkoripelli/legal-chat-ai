// frontend/src/hooks/useChat.ts - Fixed to include documents
import { useState, useCallback } from 'react';

const API_BASE_URL = 'https://legal-chat-ai.onrender.com';

export const useChat = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async ({ message }: { message: string }) => {
    setIsLoading(true);
    setError(null);

    // Add user message first (preserve existing functionality)
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }]);

    try {
      // NEW: Fetch available documents to include with the message
      let documentIds: string[] = [];
      try {
        console.log('🔍 Fetching available documents for chat context...');
        const documentsResponse = await fetch(`${API_BASE_URL}/api/documents`);
        
        if (documentsResponse.ok) {
          const documents = await documentsResponse.json();
          documentIds = documents.map((doc: any) => doc.id);
          console.log(`📄 Found ${documentIds.length} documents to include in chat:`, documentIds);
        } else {
          console.warn('⚠️ Could not fetch documents:', documentsResponse.status);
        }
      } catch (docError) {
        console.warn('⚠️ Error fetching documents for chat:', docError);
        // Continue without documents - don't fail the chat
      }

      // Send message with document context (ENHANCED - was missing before)
      console.log('📤 Sending message to chat API:', {
        message: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        documentCount: documentIds.length
      });

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          documentIds // NEW: Include document IDs so AI has context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response (preserve existing functionality)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response || 'No response',
        isUser: false,
        timestamp: new Date()
      }]);

      console.log('✅ Chat message sent successfully');

    } catch (err) {
      console.error('❌ Error sending chat message:', err);
      setError('Failed to send message');
      
      // Add error message to chat (preserve existing UX)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Preserve all existing return values and functionality
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