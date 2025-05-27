import { Request, Response } from 'express';
import Message from '../models/Message';
import Document from '../models/Document';
import { processMessage } from '../services/aiService';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    console.log('\n======== CHAT CONTROLLER: SEND MESSAGE ========');
    console.log('Request body:', req.body);
    
    const { message, documentIds = [] } = req.body;

    if (!message || typeof message !== 'string') {
      console.log('Error: Message is required');
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`📩 Received message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    console.log(`🔍 Document IDs included: ${documentIds.length > 0 ? documentIds.join(', ') : 'none'}`);

    // Save user message first
    try {
      const userMessage = new Message({
        text: message,
        isUser: true,
        documentIds,
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
        timestamp: new Date()
      });
      await aiMessage.save();
      console.log('✅ Saved AI response to database');
    } catch (dbError) {
      console.warn('⚠️ Could not save AI response to database:', dbError);
      // Continue anyway - don't fail the request
    }

    console.log('📤 Sending response to client');
    res.json({
      response: aiResponse
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