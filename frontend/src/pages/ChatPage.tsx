// frontend/src/pages/ChatPage.tsx - Enhanced with document status
import React, { useState, useEffect } from 'react';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import { useChat } from '../hooks/useChat';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const API_BASE_URL = 'https://legal-chat-ai.onrender.com';

const ChatPage: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat();
  const [localError, setLocalError] = useState<string | null>(null);
  
  // NEW: Add document status tracking
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [documentsLoading, setDocumentsLoading] = useState<boolean>(true);

  // NEW: Load document status on component mount
  useEffect(() => {
    loadDocumentStatus();
  }, []);

  const loadDocumentStatus = async () => {
    try {
      setDocumentsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      
      if (response.ok) {
        const documents = await response.json();
        setDocumentCount(documents.length);
        console.log(`📊 Chat page: ${documents.length} documents available for context`);
      } else {
        console.warn('⚠️ Could not load document status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading document status:', error);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Preserve existing handleSendMessage functionality
  const handleSendMessage = async (message: string) => {
    try {
      setLocalError(null);
      await sendMessage({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setLocalError(errorMessage);
    }
  };

  // Preserve existing clearError functionality
  const clearError = () => {
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Document Chat</h1>
        <p className="text-gray-600">
          Ask questions about your uploaded legal documents
          {/* NEW: Show document status */}
          {!documentsLoading && (
            <span className={`ml-2 ${documentCount > 0 ? 'text-green-600' : 'text-orange-600'}`}>
              ({documentCount} document{documentCount !== 1 ? 's' : ''} {documentCount > 0 ? 'loaded' : 'available'})
            </span>
          )}
        </p>
      </div>

      {/* NEW: Document status indicator */}
      {!documentsLoading && (
        <div className={`mb-4 p-3 rounded-lg border ${
          documentCount > 0 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              documentCount > 0 ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className={`text-sm ${
              documentCount > 0 ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {documentCount > 0 
                ? `✅ ${documentCount} document(s) available for AI analysis - ask specific questions about your legal content`
                : '⚠️ No documents uploaded yet - upload documents first to get specific answers about your legal content'
              }
            </span>
            {documentCount === 0 && (
              <button
                onClick={() => window.location.href = '/documents'}
                className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300 transition-colors"
              >
                Upload Documents
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border h-[600px] flex flex-col">
        {/* Preserve existing error display */}
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

        {/* Preserve existing chat messages layout */}
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
                  {documentCount > 0 
                    ? 'Start asking questions about your uploaded documents.'
                    : 'Start a conversation by asking questions about your legal documents.'
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {documentCount > 0 
                    ? 'I can help you understand contract terms, extract key information, and analyze legal clauses.'
                    : 'Upload documents first in the Documents section if you haven\'t already.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        {/* Preserve existing message input */}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Enhanced chat instructions with dynamic content */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How to use Legal Document Chat:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          {documentCount === 0 ? (
            <>
              <li>• <strong>Step 1:</strong> Upload your legal documents in the Documents section</li>
              <li>• <strong>Step 2:</strong> Return here and ask specific questions about your documents</li>
              <li>• Example: "What are the payment terms?" or "What is the liability clause?"</li>
            </>
          ) : (
            <>
              <li>• Ask specific questions about contract terms, clauses, or legal language</li>
              <li>• Request summaries or explanations of complex legal concepts</li>
              <li>• Example: "What is the scope of services?" or "What are the termination conditions?"</li>
              <li>• Try: "Summarize the key obligations" or "What are the payment terms?"</li>
            </>
          )}
          <li>• Remember: This is for informational purposes only and not a substitute for professional legal advice</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;