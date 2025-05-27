import React, { createContext, useContext, ReactNode } from 'react';

// Simple context that doesn't do anything complex
// Since we're using useChat hook directly
const ChatContext = createContext({});

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  return (
    <ChatContext.Provider value={{}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return useContext(ChatContext);
};