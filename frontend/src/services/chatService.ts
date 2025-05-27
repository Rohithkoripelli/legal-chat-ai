import { api } from './api';
import { ChatSession, Message, ApiResponse } from '../types';

export const chatService = {
  /**
   * Create new chat session
   */
  createSession: async (documentIds?: string[]): Promise<ApiResponse<ChatSession>> => {
    return api.post<ChatSession>('/chat/sessions', { documentIds });
  },

  /**
   * Send message
   */
  sendMessage: async (sessionId: string, content: string): Promise<ApiResponse<{
    userMessage: Message;
    aiMessage: Message;
  }>> => {
    return api.post('/chat/message', { sessionId, content });
  },

  /**
   * Get chat history
   */
  getChatHistory: async (sessionId: string, limit = 50, offset = 0): Promise<ApiResponse<Message[]>> => {
    return api.get<Message[]>(`/chat/sessions/${sessionId}/history?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get all sessions
   */
  getSessions: async (): Promise<ApiResponse<ChatSession[]>> => {
    return api.get<ChatSession[]>('/chat/sessions');
  },

  /**
   * End session
   */
  endSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    return api.put<void>(`/chat/sessions/${sessionId}/end`);
  },
};