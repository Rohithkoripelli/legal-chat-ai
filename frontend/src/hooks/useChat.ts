import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Message, Conversation, ConversationWithMessages } from '../types';

export const useChat = () => {
  const { getToken, isSignedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Conversation state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversationsLoading, setConversationsLoading] = useState(false);

  const sendMessage = useCallback(async ({ message }: { message: string }) => {
    if (!isSignedIn) {
      setError('Please log in to use chat functionality');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message first (preserve existing functionalities)
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
          documentIds, // Include user's document IDs for context
          conversationId: currentConversation?._id // Include conversation ID
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
      
      // If a new conversation was created, update current conversation
      if (data.conversationId && !currentConversation) {
        // Load the new conversation details
        try {
          const convResponse = await fetch(`https://legal-chat-ai.onrender.com/api/chat/conversations/${data.conversationId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (convResponse.ok) {
            const convData = await convResponse.json();
            setCurrentConversation(convData.conversation);
            console.log('✅ Set current conversation to new conversation');
          }
        } catch (convError) {
          console.warn('⚠️ Could not load new conversation details:', convError);
        }
      }
      
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
  }, [getToken, isSignedIn, currentConversation]);

  // Conversation management functions
  const loadConversations = useCallback(async () => {
    if (!isSignedIn) return;

    setConversationsLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch('https://legal-chat-ai.onrender.com/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const conversations = await response.json();
        setConversations(conversations);
        console.log('✅ Loaded conversations:', conversations.length);
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    } finally {
      setConversationsLoading(false);
    }
  }, [getToken, isSignedIn]);

  const createConversation = useCallback(async (title?: string): Promise<Conversation> => {
    if (!isSignedIn) {
      throw new Error('Please log in to create conversations');
    }

    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch('https://legal-chat-ai.onrender.com/api/chat/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title || 'New Conversation' })
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    const conversation = await response.json();
    setConversations(prev => [conversation, ...prev]);
    setCurrentConversation(conversation);
    setMessages([]);
    
    console.log('✅ Created new conversation:', conversation._id);
    return conversation;
  }, [getToken, isSignedIn]);

  const switchConversation = useCallback(async (conversationId: string) => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`https://legal-chat-ai.onrender.com/api/chat/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data: ConversationWithMessages = await response.json();
        setCurrentConversation(data.conversation);
        setMessages(data.messages.map(msg => ({
          ...msg,
          id: msg.id || Date.now() + Math.random(),
          timestamp: new Date(msg.timestamp)
        })));
        console.log('✅ Switched to conversation:', conversationId);
      }
    } catch (error) {
      console.error('❌ Error switching conversation:', error);
      setError('Failed to load conversation');
    }
  }, [getToken, isSignedIn]);

  const deleteConversation = useCallback(async (conversationId: string) => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(`https://legal-chat-ai.onrender.com/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv._id !== conversationId));
        
        // If deleting current conversation, clear it
        if (currentConversation?._id === conversationId) {
          setCurrentConversation(null);
          setMessages([]);
        }
        
        console.log('✅ Deleted conversation:', conversationId);
      }
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      setError('Failed to delete conversation');
    }
  }, [getToken, isSignedIn, currentConversation]);

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

  // Load conversations when user signs in
  useEffect(() => {
    if (isSignedIn) {
      loadConversations();
    } else {
      // Clear conversations when user signs out
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [isSignedIn, loadConversations]);

  // Return interface compatible with existing components plus conversation features
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    initializeSession,
    currentSession: null, // Placeholder for future session management
    isAuthenticated: isSignedIn,
    
    // Conversation features
    conversations,
    currentConversation,
    conversationsLoading,
    loadConversations,
    createConversation,
    switchConversation,
    deleteConversation
  };
};