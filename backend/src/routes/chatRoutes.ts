import express from 'express';
import Document from '../models/Document';
import { processMessage } from '../services/aiService';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  console.log('Chat test route hit');
  res.json({ message: 'Chat API working!', timestamp: new Date() });
});

// POST /api/chat - Send a message with AI
router.post('/', async (req, res) => {
  try {
    console.log('📩 POST /api/chat hit');
    console.log('Request body:', req.body);
    
    const { message, documentIds = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`📩 Received message: "${message}"`);
    console.log(`🔍 Document IDs: ${documentIds.length > 0 ? documentIds.join(', ') : 'none'}`);

    // Get documents if IDs provided
    let documents: any[] = [];
    if (documentIds && documentIds.length > 0) {
      try {
        console.log('🔍 Fetching documents from database...');
        documents = await Document.find({ _id: { $in: documentIds } });
        console.log(`📄 Found ${documents.length} documents`);
      } catch (docError) {
        console.warn('⚠️ Could not fetch documents:', docError);
        // Continue without documents
      }
    }

    // Process message with AI
    console.log('🤖 Processing message with AI...');
    const aiResponse = await processMessage(message, documents);
    console.log('✅ Received AI response');

    console.log('📤 Sending response to client');
    res.json({ response: aiResponse });
    
  } catch (error) {
    console.error('❌ Error in POST /api/chat:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'I apologize, but I encountered an error while processing your message. Please try again.',
      details: errorMessage
    });
  }
});

// History routes
router.get('/history', (req, res) => {
  res.json([]);
});

router.delete('/history', (req, res) => {
  res.json({ message: 'History cleared' });
});

export default router;