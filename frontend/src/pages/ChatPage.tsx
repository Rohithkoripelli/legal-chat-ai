import React, { useState } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useChat } from '../hooks/useChat';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    try {
      setLocalError(null);
      await sendMessage({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setLocalError(errorMessage);
    }
  };

  const clearError = () => {
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Document Chat</h1>
        <p className="text-gray-600">Ask questions about your uploaded legal documents</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
        {/* Error Display */}
        {displayError && (
          <div className="border-b border-red-200 bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                <span className="text-red-800 font-medium">Error: {displayError}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 && !displayError ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.003 9.003 0 01-8.716-6.747M3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Legal Document Chat!</h3>
                <p className="text-gray-600 mb-4">
                  Start a conversation by asking questions about your legal documents.
                </p>
                <p className="text-sm text-gray-500">
                  Upload documents first in the Documents section if you haven't already.
                </p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Chat Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How to use Legal Document Chat:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload your legal documents in the Documents section</li>
          <li>• Ask specific questions about contract terms, clauses, or legal language</li>
          <li>• Request summaries or explanations of complex legal concepts</li>
          <li>• Remember: This is for informational purposes only and not a substitute for professional legal advice</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;