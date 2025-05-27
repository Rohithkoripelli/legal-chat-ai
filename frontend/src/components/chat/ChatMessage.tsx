import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import { Person, SmartToy } from '@mui/icons-material';
import { adaptMessage } from '../../utils/messageAdapter';

interface ChatMessageProps {
  message: any; // Accept any message format
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Adapt the message to our expected format
  const adaptedMessage = adaptMessage(message);
  const isUser = adaptedMessage.isUser;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          maxWidth: '80%',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 32,
            height: 32,
          }}
        >
          {isUser ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
        </Avatar>

        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.main' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {adaptedMessage.text}
          </Typography>

          {/* Show document references for AI messages */}
          {!isUser && adaptedMessage.documentReferences && adaptedMessage.documentReferences.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                Referenced from:
              </Typography>
              {adaptedMessage.documentReferences.map((ref, index) => (
                <Chip
                  key={index}
                  label={`Document ${ref.documentId.slice(-6)} (${Math.round(ref.confidence * 100)}%)`}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.7,
              textAlign: isUser ? 'right' : 'left',
            }}
          >
            {adaptedMessage.timestamp.toLocaleTimeString()}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;