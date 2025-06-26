import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onFileUpload?: () => void;
  showFileUpload?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, onFileUpload, showFileUpload }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input when the component mounts (except on mobile to prevent keyboard pop-up)
  useEffect(() => {
    if (textareaRef.current && window.innerWidth >= 768) {
      textareaRef.current.focus();
    }
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      console.log('Sending message:', message);
      
      try {
        onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Error in message submission:', error);
        alert('Error sending message. Check the console for details.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <div className="flex items-end bg-white border border-gray-300 rounded-2xl shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Legal AI..."
              className="w-full px-4 py-3 pr-12 rounded-2xl resize-none focus:outline-none bg-transparent text-sm sm:text-base max-h-32 min-h-[48px]"
              disabled={isLoading}
              rows={1}
            />
            {showFileUpload && (
              <button
                type="button"
                onClick={onFileUpload}
                className="absolute right-12 bottom-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Upload documents"
              >
                <Paperclip size={18} />
              </button>
            )}
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="absolute right-3 bottom-3 p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-300 transition-colors"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;