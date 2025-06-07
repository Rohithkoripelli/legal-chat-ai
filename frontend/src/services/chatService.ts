// frontend/src/services/chatService.ts
const API_BASE_URL = 'https://legal-chat-ai.onrender.com'; // Update with your actual Render URL

export const chatService = {
  /**
   * Create a new chat session
   */
  createSession: async () => {
    try {
      console.log('📤 Creating new chat session');
      
      const response = await fetch(`${API_BASE_URL}/api/chat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Chat session created:', data);
      
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('❌ Failed to create chat session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create session'
      };
    }
  },

  /**
   * Send message to chat API with streaming support
   */
  sendMessage: async (sessionId: string, message: string, documentIds: string[] = [], onStreamChunk?: (chunk: string) => void) => {
    try {
      console.log('📤 Sending message to chat API:', message);
      
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          documentIds,
          stream: !!onStreamChunk // Enable streaming if callback provided
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      if (onStreamChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.trim() && line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.type === 'chunk' && data.content) {
                    fullResponse += data.content;
                    onStreamChunk(data.content);
                  } else if (data.type === 'done') {
                    console.log('✅ Streaming complete');
                    return {
                      success: true,
                      data: {
                        response: fullResponse,
                        aiMessage: { text: fullResponse, isUser: false }
                      }
                    };
                  }
                } catch (parseError) {
                  // Skip invalid JSON lines
                  continue;
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        return {
          success: true,
          data: {
            response: fullResponse,
            aiMessage: { text: fullResponse, isUser: false }
          }
        };
      } else {
        // Fallback to regular response
        const data = await response.json();
        console.log('✅ Received chat response');
        
        return {
          success: true,
          data: data,
          response: data.response
        };
      }
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