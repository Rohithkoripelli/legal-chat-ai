import express from 'express';
import Document from '../models/Document';
import { processMessage } from '../services/aiService';
import { clerkAuthMiddleware } from '../middleware/auth';

const router = express.Router();

// APPLY AUTH MIDDLEWARE TO ALL CHAT ROUTES
router.use(clerkAuthMiddleware);

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`
======== CHAT API REQUEST ========
Method: ${req.method}
Path: ${req.path}
User: ${req.userId}
Body: ${JSON.stringify(req.body, null, 2)}
======== END REQUEST ========
`);
  next();
});

// POST /api/chat - Send a message (protected)
router.post('/', async (req, res) => {
  try {
    console.log('📩 POST /api/chat from user:', req.userId);
    const { message, documentIds = [] } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`📩 Received message from user ${req.userId}: "${message}"`);
    console.log(`🔍 Requested document IDs: ${documentIds.length > 0 ? documentIds.join(', ') : 'none'}`);

    // CRITICAL SECURITY FIX: Get only user's documents
    let documents = [];
    if (documentIds && documentIds.length > 0) {
      try {
        documents = await Document.find({ 
          _id: { $in: documentIds },
          userId: req.userId // ONLY USER'S DOCUMENTS
        });
        console.log(`📄 Found ${documents.length} documents belonging to user ${req.userId}`);
      } catch (docError) {
        console.warn('⚠️ Could not fetch user documents:', docError);
      }
    } else {
      // If no specific documents requested, get all user's documents
      try {
        documents = await Document.find({ userId: req.userId });
        console.log(`📄 Using all ${documents.length} documents from user ${req.userId}`);
      } catch (docError) {
        console.warn('⚠️ Could not fetch all user documents:', docError);
      }
    }

    // Process message with AI using only user's documents
    console.log('🤖 Processing message with AI...');
    const aiResponse = await processMessage(message, documents);
    
    console.log('✅ AI response generated for user:', req.userId);
    res.json({ response: aiResponse });
    
  } catch (error) {
    console.error('❌ Error in POST /api/chat for user', req.userId, ':', error);
    res.status(500).json({ 
      error: 'I apologize, but I encountered an error while processing your message. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/chat/test - Test if chat API is working (protected)
router.get('/test', (req, res) => {
  console.log('Chat test route accessed by user:', req.userId);
  res.json({ 
    message: `Chat API is working for user: ${req.userId}!`,
    timestamp: new Date().toISOString(),
    userInfo: {
      userId: req.userId,
      authenticated: true
    }
  });
});

// GET /api/chat/history - Get message history (protected) - placeholder
router.get('/history', (req, res) => {
  console.log('Chat history requested by user:', req.userId);
  // TODO: Implement chat history with user filtering
  res.json({
    message: 'Chat history endpoint - coming soon',
    userId: req.userId,
    history: []
  });
});

// DELETE /api/chat/history - Clear message history (protected) - placeholder
router.delete('/history', (req, res) => {
  console.log('Chat history clear requested by user:', req.userId);
  // TODO: Implement chat history clearing for specific user
  res.json({ 
    message: 'Chat history cleared for user: ' + req.userId,
    userId: req.userId
  });
});

// GET /api/chat/user-documents - Get user's documents for chat context (protected)
router.get('/user-documents', async (req, res) => {
  try {
    console.log('📋 Fetching documents for chat context for user:', req.userId);
    
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const documents = await Document.find({ userId: req.userId })
      .select('_id originalName size type uploadedAt')
      .sort({ uploadedAt: -1 });

    const documentList = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.originalName,
      size: doc.size,
      type: doc.type,
      uploadedAt: doc.uploadedAt
    }));

    console.log(`📄 Returning ${documentList.length} documents for chat context`);
    res.json({
      documents: documentList,
      count: documentList.length,
      userId: req.userId
    });
    
  } catch (error) {
    console.error('❌ Error fetching user documents for chat:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents for chat context',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;