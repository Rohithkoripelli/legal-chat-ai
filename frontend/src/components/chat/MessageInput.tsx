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
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the component mounts (except on mobile to prevent keyboard pop-up)
  useEffect(() => {
    if (inputRef.current && window.innerWidth >= 768) {
      inputRef.current.focus();
    }
  }, []);

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

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2 sm:gap-3 items-end">
        {/* File Upload Clip Icon - Left Side */}
        {showFileUpload && (
          <button
            type="button"
            onClick={onFileUpload}
            className="p-2.5 sm:p-3 text-gray-400 hover:text-blue-600 transition-colors rounded-xl bg-white border border-gray-300 hover:border-blue-400 shadow-sm flex-shrink-0"
            title="Upload documents"
          >
            <Paperclip size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl shadow-sm hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message Legal AI..."
              className="w-full rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none bg-transparent text-sm sm:text-base"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="mr-2 p-2 rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-white"></div>
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;