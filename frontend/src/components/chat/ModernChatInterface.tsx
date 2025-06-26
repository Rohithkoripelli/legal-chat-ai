import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useChat } from '../../hooks/useChat';
import { useDocuments } from '../../hooks/useDocuments';
import { Message } from '../../types';
import { MessageSquare, Send, Paperclip, Menu, X, Plus, Trash2, Brain, AlertCircle, Upload, FileText } from 'lucide-react';

const ModernChatInterface: React.FC = () => {
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

  const { documents, uploadDocument } = useDocuments();

  // State management
  const [inputText, setInputText] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Handle message sending
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText('');

    try {
      await sendMessage({ message: messageText, selectedDocumentIds });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file uploads
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadingFiles(files);
      setUploadError(null);
    }
  };

  const uploadFiles = async () => {
    if (uploadingFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (const file of uploadingFiles) {
        await uploadDocument(file);
      }
      setUploadingFiles([]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format message text with markdown
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n#{3}\s(.*?)(?:\n|$)/g, '<h3 class="text-lg font-semibold mt-3 mb-2 text-gray-900">$1</h3>')
      .replace(/\n#{2}\s(.*?)(?:\n|$)/g, '<h2 class="text-xl font-bold mt-4 mb-2 text-gray-900">$1</h2>')
      .replace(/\n#{1}\s(.*?)(?:\n|$)/g, '<h1 class="text-2xl font-bold mt-4 mb-3 text-gray-900">$1</h1>')
      .replace(/\n[•\-\*]\s(.*?)(?:\n|$)/g, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mt-3">')
      .replace(/\n/g, '<br />');
  };

  // Render conversation sidebar
  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
      showSidebar ? 'translate-x-0' : '-translate-x-full'
    } lg:relative lg:translate-x-0`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat History</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => createConversation()}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="New conversation"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={() => {
            createConversation();
            if (window.innerWidth < 1024) setShowSidebar(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversationsLoading ? (
          <div className="p-4 text-center text-gray-400">
            <div className="animate-spin h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-2 text-gray-600" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`group p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                currentConversation?._id === conversation._id
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
              onClick={() => {
                switchConversation(conversation._id);
                if (window.innerWidth < 1024) setShowSidebar(false);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate mb-1">
                    {conversation.title.length > 40 
                      ? conversation.title.substring(0, 40) + '...' 
                      : conversation.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this conversation?')) {
                      deleteConversation(conversation._id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render messages
  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id || `msg-${index}`}
            className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Brain size={16} className="text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
              <div
                className={`p-4 rounded-2xl ${
                  message.isUser
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.isUser ? (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                ) : (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                  />
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
              </div>
            </div>

            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Brain size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 p-4 rounded-2xl">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-sm text-gray-600 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain size={32} className="text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          What can I help you with?
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Ask me anything about legal documents, contracts, or general legal questions.
        </p>

        {/* Quick start examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setInputText('What should I include in an NDA?')}
            className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium text-gray-900">Draft an NDA</div>
            <div className="text-sm text-gray-600">Get help creating a non-disclosure agreement</div>
          </button>
          
          <button
            onClick={() => setInputText('Explain liability clauses in contracts')}
            className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <div className="text-2xl mb-2">⚖️</div>
            <div className="font-medium text-gray-900">Analyze contracts</div>
            <div className="text-sm text-gray-600">Review and understand contract terms</div>
          </button>
          
          <button
            onClick={() => setInputText('What are common legal risks in business?')}
            className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-medium text-gray-900">Legal risks</div>
            <div className="text-sm text-gray-600">Understand potential legal issues</div>
          </button>
          
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium text-gray-900">Upload documents</div>
            <div className="text-sm text-gray-600">Analyze your legal documents</div>
          </button>
        </div>
      </div>
    </div>
  );

  // Render input area
  const renderInputArea = () => (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto p-4">
        {/* File upload area */}
        {uploadingFiles.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Files to upload</span>
              <button
                onClick={() => setUploadingFiles([])}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {uploadingFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-500">({formatFileSize(file.size)})</span>
                </div>
              ))}
              <button
                onClick={uploadFiles}
                disabled={isUploading}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
            {uploadError && (
              <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {uploadError}
              </div>
            )}
          </div>
        )}

        {/* Document selector */}
        {documents.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Documents ({selectedDocumentIds.length}/{documents.length} selected)
            </div>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocumentIds(prev =>
                      prev.includes(doc.id)
                        ? prev.filter(id => id !== doc.id)
                        : [...prev, doc.id]
                    );
                  }}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedDocumentIds.includes(doc.id)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {doc.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input field */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Legal AI..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="absolute right-12 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-300 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          id="file-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.rtf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Help text */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className="hidden lg:block">
        {renderSidebar()}
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        {renderSidebar()}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentConversation?.title || 'Legal AI Chat'}
            </h1>
          </div>
          <button
            onClick={() => createConversation()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            New Chat
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Messages or empty state */}
        {messages.length === 0 ? renderEmptyState() : renderMessages()}

        {/* Input area - always at bottom */}
        {renderInputArea()}
      </div>
    </div>
  );
};

export default ModernChatInterface;