import React, { useEffect, useRef, memo, useMemo } from 'react';
import { Message } from '../../types'; // Use your existing types

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  hasTextExtractionWarning?: boolean;
  containerRef?: string;
}

const MessageList: React.FC<MessageListProps> = memo(({ messages, isLoading, hasTextExtractionWarning, containerRef }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerElementRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change, but keep it within chat container
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef) {
        // Scroll within the specific chat container
        const container = document.getElementById(containerRef);
        if (container && messagesEndRef.current) {
          container.scrollTop = container.scrollHeight;
        }
      } else {
        // Fallback to element scrolling
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end'
        });
      }
    }, 100); // Small delay to ensure DOM is updated
    
    return () => clearTimeout(timer);
  }, [messages, isLoading, containerRef]);

  // Format text with simple markdown-like syntax - memoized for performance
  const formatText = useMemo(() => (text: string) => {
    // Convert markdown-style formatting to HTML
    let formattedText = text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Headers
      .replace(/\n#{3}\s(.*?)(?:\n|$)/g, '<h3 class="text-lg font-semibold mt-2 mb-1">$1</h3>')
      .replace(/\n#{2}\s(.*?)(?:\n|$)/g, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>')
      .replace(/\n#{1}\s(.*?)(?:\n|$)/g, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      // Bullet points
      .replace(/\n[*-]\s(.*?)(?:\n|$)/g, '<li class="ml-4">• $1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mt-2">')
      // Replace newlines with breaks within paragraphs
      .replace(/\n/g, '<br />');

    // Wrap in paragraph tags if not already
    if (!formattedText.startsWith('<h') && !formattedText.startsWith('<p')) {
      formattedText = `<p>${formattedText}</p>`;
    }

    return formattedText;
  }, []);

  return (
    <div 
      ref={containerElementRef}
      className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4" 
      style={{ overflowY: 'auto', height: '100%', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Warning about PDF extraction if applicable */}
      {hasTextExtractionWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Some of your PDFs may have limited text extraction, which could affect the responses. 
            Consider uploading documents with selectable text for better results.
          </p>
        </div>
      )}
      
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>No messages yet. Start by asking a question about your legal documents!</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div
              key={message.id || `msg-${index}-${Date.now()}`}
              className={`flex items-start space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3h.393a7.5 7.5 0 0 1 7.92 8.037l-.113.813a7.5 7.5 0 0 1-10.522 5.93l-.281-.113-.256.275A6.5 6.5 0 0 1 2.5 20.5V16" />
                    <path d="M8 11.5 L11 14.5 L16 9.5" />
                  </svg>
                </div>
              )}
              
              <div
                className={`max-w-[280px] sm:max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-3 sm:px-4 py-2 ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200 shadow-sm text-gray-800'
                }`}
              >
                {message.isUser ? (
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                ) : (
                  <div 
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                  />
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {(message.timestamp ? new Date(message.timestamp) : new Date()).toLocaleTimeString()}
                </span>
              </div>
              
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 5 4 8 6 11a17.9 17.9 0 0 0 6-11" />
                    <circle cx="12" cy="8" r="2" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-2 justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3h.393a7.5 7.5 0 0 1 7.92 8.037l-.113.813a7.5 7.5 0 0 1-10.522 5.93l-.281-.113-.256.275A6.5 6.5 0 0 1 2.5 20.5V16" />
                </svg>
              </div>
              <div className="max-w-[280px] sm:max-w-xs lg:max-w-md xl:max-w-lg rounded-lg px-3 sm:px-4 py-3 bg-white border border-gray-200 shadow-sm text-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-xs text-gray-500 ml-1">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* This element is for auto-scrolling */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
});

export default MessageList;