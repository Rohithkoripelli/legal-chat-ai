import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Send, RefreshCw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { chatService } from '../../services/chatService';
import { Message, ChatSession } from '../../types';
import { adaptMessages } from '../../utils/messageAdapter';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      const response = await chatService.createSession();
      if (response.success && response.data) {
        setCurrentSession(response.data);
        setError(null);
      } else {
        setError('Failed to initialize chat session');
      }
    } catch (err) {
      setError('Failed to initialize chat session');
      console.error('Session initialization error:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentSession || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatService.sendMessage(currentSession.sessionId, userMessage);
      
      // Fixed: Added proper null checking for response.data
      if (response.success && response.data) {
        // Adapt the messages to our format before adding to state
        const adaptedMessages = adaptMessages([
          response.data.userMessage,
          response.data.aiMessage
        ]);
        
        setMessages(prev => [...prev, ...adaptedMessages]);
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewSession = () => {
    setMessages([]);
    setCurrentSession(null);
    setError(null);
    initializeSession();
  };

  if (!currentSession && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Initializing chat session...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1">
          Legal Document Chat
        </Typography>
        <IconButton onClick={handleNewSession} disabled={isLoading}>
          <RefreshCw />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            backgroundColor: '#f5f5f5',
          }}
        >
          {messages.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              flexDirection="column"
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Welcome to Legal Document Chat!
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Start a conversation by asking questions about your legal documents.
                <br />
                Upload documents first in the Documents section if you haven't already.
              </Typography>
            </Box>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <Box display="flex" justifyContent="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      AI is thinking...
                    </Typography>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </Box>

        <Divider />

        <Box sx={{ p: 2, backgroundColor: 'white' }}>
          <Box display="flex" gap={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your legal documents..."
              disabled={isLoading}
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                '&:disabled': {
                  backgroundColor: 'grey.300',
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Press Enter to send, Shift+Enter for new line
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatWindow;