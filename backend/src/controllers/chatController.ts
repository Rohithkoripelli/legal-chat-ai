import { Request, Response } from 'express';
import Message from '../models/Message';
import Document from '../models/Document';
import Conversation from '../models/Conversation';
import { processMessage } from '../services/aiService';

export const sendMessage = async (req: Request & { userId?: string }, res: Response) => {
  try {
    console.log('\n======== CHAT CONTROLLER: SEND MESSAGE ========');
    console.log('Request body:', req.body);
    
    const { message, documentIds = [], conversationId } = req.body;
    const userId = req.userId;

    if (!message || typeof message !== 'string') {
      console.log('Error: Message is required');
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    console.log(`📩 Received message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    console.log(`🔍 Document IDs included: ${documentIds.length > 0 ? documentIds.join(', ') : 'none'}`);
    console.log(`💬 Conversation ID: ${conversationId || 'new conversation'}`);

    // Handle conversation creation or retrieval
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      // Create new conversation with first few words of message as title
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      const newConversation = new Conversation({
        title,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await newConversation.save();
      currentConversationId = newConversation._id.toString();
      console.log(`✅ Created new conversation: ${currentConversationId}`);
    } else {
      // Verify conversation belongs to user
      const existingConversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!existingConversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    }

    // Save user message first
    try {
      const userMessage = new Message({
        text: message,
        isUser: true,
        documentIds,
        userId,
        conversationId: currentConversationId,
        timestamp: new Date()
      });
      await userMessage.save();
      console.log('✅ Saved user message to database');
    } catch (dbError) {
      console.warn('⚠️ Could not save user message to database:', dbError);
      // Continue anyway - don't fail the request
    }

    // Get relevant documents if documentIds provided
    let documents: any[] = [];
    if (documentIds && documentIds.length > 0) {
      try {
        console.log('🔍 Fetching documents from database...');
        documents = await Document.find({ _id: { $in: documentIds } });
        console.log(`📄 Found ${documents.length} documents`);
        console.log('Document IDs found:', documents.map(d => d._id.toString()));
      } catch (docError) {
        console.warn('⚠️ Could not fetch documents:', docError);
        // Continue without documents
      }
    }

    // Process message with AI service
    console.log('🤖 Processing message with AI service...');
    const aiResponse = await processMessage(message, documents);
    console.log('✅ Received AI response');

    // Try to save AI response
    try {
      const aiMessage = new Message({
        text: aiResponse,
        isUser: false,
        documentIds,
        userId,
        conversationId: currentConversationId,
        timestamp: new Date()
      });
      await aiMessage.save();
      console.log('✅ Saved AI response to database');
    } catch (dbError) {
      console.warn('⚠️ Could not save AI response to database:', dbError);
      // Continue anyway - don't fail the request
    }

    // Update conversation timestamp and message count
    try {
      await Conversation.findByIdAndUpdate(currentConversationId, {
        updatedAt: new Date(),
        $inc: { messageCount: 2 } // User message + AI response
      });
      console.log('✅ Updated conversation metadata');
    } catch (convError) {
      console.warn('⚠️ Could not update conversation metadata:', convError);
    }

    console.log('📤 Sending response to client');
    res.json({
      response: aiResponse,
      conversationId: currentConversationId
    });
    console.log('======== END CHAT CONTROLLER ========\n');
    
  } catch (error) {
    console.error('❌ Error in chat controller:', error);
    
    // Return a user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({ 
      error: 'I apologize, but I encountered an error while processing your message. Please try again.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

export const getMessageHistory = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ 
      error: 'Could not fetch message history' 
    });
  }
};

export const clearMessageHistory = async (req: Request, res: Response) => {
  try {
    await Message.deleteMany({});
    res.json({ message: 'Message history cleared successfully' });
  } catch (error) {
    console.error('Error clearing message history:', error);
    res.status(500).json({ 
      error: 'Could not clear message history' 
    });
  }
};

// Conversation management methods
export const createConversation = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversation = new Conversation({
      title: title || 'New Conversation',
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Could not create conversation' });
  }
};

export const getConversations = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Could not fetch conversations' });
  }
};

export const getConversation = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversation = await Conversation.findOne({ _id: id, userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId: id, userId })
      .sort({ timestamp: 1 });

    res.json({
      conversation,
      messages
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Could not fetch conversation' });
  }
};

export const deleteConversation = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversation = await Conversation.findOneAndDelete({ _id: id, userId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Delete associated messages
    await Message.deleteMany({ conversationId: id, userId });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Could not delete conversation' });
  }
};