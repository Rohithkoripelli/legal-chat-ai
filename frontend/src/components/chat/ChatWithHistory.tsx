import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useChat } from '../../hooks/useChat';
import ConversationSidebar from './ConversationSidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { MessageSquare, Brain, AlertCircle, X, ChevronLeft, Menu } from 'lucide-react';

const ChatWithHistory: React.FC = () => {
  const { isSignedIn } = useAuth();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    conversations,
    currentConversation,
    conversationsLoading,
    createConversation,
    switchConversation,
    deleteConversation
  } = useChat();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // Only show this component for signed-in users
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-96 text-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-4">Please sign in to access chat history features.</p>
          <button
            onClick={() => window.location.href = '/sign-in'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (message: string) => {
    try {
      setLocalError(null);
      await sendMessage({ message });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setLocalError(errorMessage);
    }
  };

  const handleCreateConversation = async (title?: string) => {
    try {
      await createConversation(title);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create conversation';
      setLocalError(errorMessage);
    }
  };

  const handleSwitchConversation = async (conversationId: string) => {
    try {
      await switchConversation(conversationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch conversation';
      setLocalError(errorMessage);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation';
      setLocalError(errorMessage);
    }
  };

  const clearError = () => {
    setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarVisible ? 'block' : 'hidden'} lg:block`}>
        <ConversationSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={handleSwitchConversation}
          onCreateConversation={handleCreateConversation}
          onDeleteConversation={handleDeleteConversation}
          isLoading={conversationsLoading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg"
              >
                {sidebarVisible ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {currentConversation ? currentConversation.title : 'Legal AI Chat'}
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {currentConversation 
                      ? `${currentConversation.messageCount || 0} messages`
                      : 'Start a new conversation'
                    }
                  </span>
                </div>
              </div>
            </div>
            {!currentConversation && (
              <button
                onClick={() => handleCreateConversation()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                New Chat
              </button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {displayError && (
          <div className="bg-red-50 border-b border-red-100 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-700 text-sm font-medium">{displayError}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {messages.length === 0 && !displayError ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {currentConversation ? 'Continue Your Conversation' : 'Start a New Conversation'}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {currentConversation 
                      ? 'Ask questions about your legal documents or continue where you left off.'
                      : 'Create a new conversation or select one from the sidebar to start chatting with our legal AI.'
                    }
                  </p>
                </div>
                
                {/* Quick Start Examples */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Quick examples:</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => handleSendMessage('What are the key risks in my contracts?')}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      disabled={!currentConversation}
                    >
                      📊 "What are the key risks in my contracts?"
                    </button>
                    <button 
                      onClick={() => handleSendMessage('Explain the payment terms')}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      disabled={!currentConversation}
                    >
                      💰 "Explain the payment terms"
                    </button>
                    <button 
                      onClick={() => handleSendMessage('What should I include in an NDA?')}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm"
                      disabled={!currentConversation}
                    >
                      📄 "What should I include in an NDA?"
                    </button>
                  </div>
                </div>

                {!currentConversation && (
                  <button
                    onClick={() => handleCreateConversation()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto" id="chat-messages-container">
              <MessageList 
                messages={messages} 
                isLoading={isLoading}
                containerRef="chat-messages-container"
              />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading}
          />
          <div className="text-center mt-2">
            <p className="text-xs text-gray-400">
              {currentConversation 
                ? 'Chat about your legal documents or ask general legal questions'
                : 'Start or select a conversation to begin chatting'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithHistory;