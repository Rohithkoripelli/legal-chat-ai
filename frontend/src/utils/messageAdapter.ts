// src/utils/messageAdapter.ts
import { Message } from '../types';

// This function adapts messages from the API to our frontend format
export function adaptMessage(message: any): Message {
  return {
    id: message._id || message.id || String(Date.now()), // Fallback to timestamp if no ID
    text: message.content || message.text || '',
    isUser: message.role === 'user' || message.isUser || false,
    timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
    documentReferences: message.documentReferences || []
  };
}

// This function adapts a collection of messages
export function adaptMessages(messages: any[]): Message[] {
  return messages.map(adaptMessage);
}