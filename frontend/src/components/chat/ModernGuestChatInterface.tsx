import React, { useState, useEffect, useRef } from 'react';
import { useGuestChat } from '../../hooks/useGuestChat';
import { Send, Paperclip, Brain, AlertCircle, Upload, FileText, X } from 'lucide-react';

interface GuestDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  content: string;
}

const ModernGuestChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useGuestChat();

  // State management
  const [inputText, setInputText] = useState('');
  const [guestDocuments, setGuestDocuments] = useState<GuestDocument[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userMessageRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  // Load guest documents from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem('guestDocuments');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const documentsWithContent = parsed.map((doc: any) => ({
          ...doc,
          content: doc.content || '',
          uploadedAt: new Date(doc.uploadedAt)
        }));
        setGuestDocuments(documentsWithContent);
      } catch (error) {
        console.error('Error loading guest documents:', error);
      }
    }
  }, []);

  // Smart scroll logic - scroll to user's question instead of bottom
  useEffect(() => {
    const scrollToUserQuestion = () => {
      // Find the last user message
      const lastUserMessage = messages.slice().reverse().find(msg => msg.isUser);
      
      if (lastUserMessage && lastUserMessage.id) {
        const userMessageElement = userMessageRefs.current[lastUserMessage.id.toString()];
        
        if (userMessageElement) {
          // Always scroll to show the user's question that was just submitted
          userMessageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }
    };
    
    // Count user messages to detect when a new user message is added
    const userMessageCount = messages.filter(msg => msg.isUser).length;
    
    // Only scroll when there are user messages and we're not loading
    if (userMessageCount > 0 && !isLoading) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToUserQuestion, 100);
    }
  }, [messages, isLoading]); // Watch full messages array for user message changes

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Handle message sending
  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageText = inputText.trim();
    setInputText('');
    setLocalError(null);

    try {
      const selectedDocuments = guestDocuments.filter(doc => 
        selectedDocumentIds.includes(doc.id)
      );
      await sendMessage({ message: messageText, selectedDocuments });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setLocalError(errorMessage);
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
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';
      const formData = new FormData();
      uploadingFiles.forEach(file => {
        formData.append('documents', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/guest/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      const uploadedDocs = result.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        type: doc.type,
        uploadedAt: new Date(doc.uploadedAt),
        content: doc.content || ''
      }));

      const newDocuments = [...guestDocuments, ...uploadedDocs];
      setGuestDocuments(newDocuments);
      sessionStorage.setItem('guestDocuments', JSON.stringify(newDocuments));
      setUploadingFiles([]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove guest document
  const removeGuestDocument = (documentId: string) => {
    const updatedDocuments = guestDocuments.filter(doc => doc.id !== documentId);
    setGuestDocuments(updatedDocuments);
    sessionStorage.setItem('guestDocuments', JSON.stringify(updatedDocuments));
    
    // Also remove from selected documents
    setSelectedDocumentIds(prev => prev.filter(id => id !== documentId));
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Dynamic greeting generator for guests - memoized for session
  const [sessionGreeting, setSessionGreeting] = useState<string>('');

  useEffect(() => {
    if (!sessionGreeting) {
      const generateGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const date = new Date().getDate();
    
    // Time-based greetings
    let timeGreeting = '';
    if (hour >= 5 && hour < 12) {
      timeGreeting = 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good afternoon';
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = 'Good evening';
    } else {
      timeGreeting = 'Hello';
    }

    // Innovative variations for guests
    const greetingVariations = [
      `${timeGreeting}! What legal questions can I help you with today?`,
      `${timeGreeting}! Ready to get some legal clarity? I'm here to help.`,
      `${timeGreeting}! Let's explore your legal needs together.`,
      `${timeGreeting}! How can I assist with your legal inquiries?`,
      `${timeGreeting}! What legal challenge can we tackle today?`,
      `${timeGreeting}! I'm here to help with all your legal questions.`,
    ];

    // Weekend special greetings
    if (day === 0 || day === 6) {
      greetingVariations.push(
        `${timeGreeting}! Working on legal matters this weekend? Let's get started!`,
        `${timeGreeting}! Even on weekends, I'm here to help with legal questions.`
      );
    }

    // Month start greetings
    if (date <= 3) {
      greetingVariations.push(
        `${timeGreeting}! Starting the month with legal clarity? Great choice!`,
        `${timeGreeting}! New month, fresh legal insights. How can I help?`
      );
    }

    // Document-specific greetings
    if (guestDocuments.length > 0) {
      greetingVariations.push(
        `${timeGreeting}! I see you've uploaded ${guestDocuments.length} document${guestDocuments.length !== 1 ? 's' : ''}. What would you like to know?`,
        `${timeGreeting}! Ready to analyze your uploaded documents? Let's dive in!`
      );
    } else {
      greetingVariations.push(
        `${timeGreeting}! Upload documents or ask me anything about legal matters.`,
        `${timeGreeting}! Free legal AI assistance - no signup required!`
      );
    }

        // Select a random variation
        return greetingVariations[Math.floor(Math.random() * greetingVariations.length)];
      };
      
      setSessionGreeting(generateGreeting());
    }
  }, [guestDocuments.length, sessionGreeting]);

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

  // Clear errors
  const clearError = () => {
    setLocalError(null);
  };

  const displayError = localError || error;

  // Render messages
  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
      <div className="max-w-3xl mx-auto px-4 py-3 space-y-3">
        {messages.map((message, index) => (
          <div
            key={message.id || `msg-${index}`}
            ref={message.isUser && message.id ? (el) => {
              if (el) userMessageRefs.current[message.id.toString()] = el;
            } : undefined}
            className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Brain size={12} className="text-white" />
              </div>
            )}
            
            <div className={`max-w-[75%] ${message.isUser ? 'order-first' : ''}`}>
              <div
                className={`p-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.isUser ? (
                  <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                ) : message.text ? (
                  <div
                    className="prose prose-sm max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                  />
                ) : (
                  // Show thinking indicator for empty AI messages (loading state)
                  <div className="flex items-center space-x-1">
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-xs text-gray-600 ml-1">Thinking...</span>
                  </div>
                )}
              </div>
              <div className={`text-xs text-gray-500 mt-0.5 ${message.isUser ? 'text-right' : 'text-left'}`}>
                {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
              </div>
            </div>

            {message.isUser && (
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-medium">U</span>
              </div>
            )}
          </div>
        ))}


        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  // Render empty state with input first
  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col justify-center">
      {/* Dynamic greeting for guests */}
      <div className="flex-shrink-0 text-center mb-2 mt-64">
        <h1 className="text-xl font-bold text-gray-800">
          {sessionGreeting}
        </h1>
      </div>

      {/* Input area - prominently placed */}
      <div className="flex-shrink-0 bg-white p-4">
        <div className="max-w-2xl mx-auto">
          {renderInputArea()}
        </div>
      </div>

      {/* Quick start examples below input */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-xl mx-auto">
          <h3 className="text-xs font-medium text-gray-600 mb-2 text-center">Quick examples:</h3>
          <div className="grid grid-cols-2 gap-2">
            {guestDocuments.length > 0 ? (
              <>
                <button
                  onClick={() => setInputText('What are the key risks in this contract?')}
                  className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                >
                  <div className="text-sm mb-0.5">📊</div>
                  <div className="font-medium text-gray-900 text-xs">Analyze risks</div>
                </button>
                <button
                  onClick={() => setInputText('Explain the payment terms')}
                  className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                >
                  <div className="text-sm mb-0.5">💰</div>
                  <div className="font-medium text-gray-900 text-xs">Payment terms</div>
                </button>
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="col-span-2 p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                >
                  <div className="text-sm mb-0.5">📋</div>
                  <div className="font-medium text-blue-900 text-xs">Upload more docs</div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setInputText('What should I include in an NDA?')}
                  className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                >
                  <div className="text-sm mb-0.5">📄</div>
                  <div className="font-medium text-gray-900 text-xs">Draft an NDA</div>
                </button>
                <button
                  onClick={() => setInputText('How do liability clauses work?')}
                  className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                >
                  <div className="text-sm mb-0.5">⚖️</div>
                  <div className="font-medium text-gray-900 text-xs">Liability clauses</div>
                </button>
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="col-span-2 p-2 text-left bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                >
                  <div className="text-sm mb-0.5">📋</div>
                  <div className="font-medium text-blue-900 text-xs">Upload documents</div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render input area
  const renderInputArea = () => (
    <div>
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


        {/* Input field */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
<textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={guestDocuments.length > 0 
                ? `Ask anything about your ${guestDocuments.length} uploaded document${guestDocuments.length !== 1 ? 's' : ''}...`
                : 'Ask legal questions or upload documents for analysis.'
              }
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-hidden"
              rows={3}
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

        {/* Document selector */}
        {guestDocuments.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-sm font-medium text-gray-900 mb-2">
              Documents ({selectedDocumentIds.length}/{guestDocuments.length} selected)
            </div>
            <div className="flex flex-wrap gap-2">
              {guestDocuments.map((doc) => (
                <div key={doc.id} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedDocumentIds(prev =>
                        prev.includes(doc.id)
                          ? prev.filter(id => id !== doc.id)
                          : [...prev, doc.id]
                      );
                    }}
                    className={`px-3 py-1 pr-8 text-xs rounded-full border transition-colors ${
                      selectedDocumentIds.includes(doc.id)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {doc.name}
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${doc.name}"?`)) {
                        removeGuestDocument(doc.id);
                      }
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete document"
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help text */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            {guestDocuments.length === 0 
              ? 'Ask legal questions or use the 📎 icon to upload documents for analysis'
              : selectedDocumentIds.length === 0 
                ? 'Select documents below to include them in your conversation'
                : `Chat about your selected ${selectedDocumentIds.length} document${selectedDocumentIds.length !== 1 ? 's' : ''} or ask general legal questions`
            }
          </p>
        </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* Error display */}
      {displayError && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{displayError}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Messages or empty state */}
      {messages.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="flex flex-col h-full">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto">
            {renderMessages()}
          </div>
          
          {/* Input area - fixed at bottom for conversations */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
            <div className="max-w-3xl mx-auto">
              {renderInputArea()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernGuestChatInterface;