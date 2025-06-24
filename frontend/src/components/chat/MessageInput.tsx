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

  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
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
    <form onSubmit={handleSubmit} className="">
      <div className="flex gap-2 items-end">
        {/* File Upload Clip Icon - Left Side */}
        {showFileUpload && (
          <button
            type="button"
            onClick={onFileUpload}
            className="p-3 text-gray-400 hover:text-blue-600 transition-colors rounded-lg border border-gray-300 hover:border-blue-400"
            title="Upload documents"
          >
            <Paperclip size={20} />
          </button>
        )}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about your legal documents..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-white"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;