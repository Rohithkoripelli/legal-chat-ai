import express from 'express';
import { processMessage } from '../services/aiService';
import Document from '../models/Document';

const router = express.Router();

// GET /api/test - Basic test endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Test API is working!' });
});

// GET /api/test/openai - Test OpenAI integration
router.get('/openai', async (req, res) => {
  try {
    console.log('Testing OpenAI integration...');
    
    // Try to get a document for context
    const documents = await Document.find().limit(1);
    
    // Process a test message
    const response = await processMessage(
      'This is a test message to check if OpenAI integration is working.',
      documents
    );
    
    res.json({ 
      success: true,
      message: 'OpenAI test completed',
      aiResponse: response,
      documents: documents.map(doc => ({
        id: doc._id,
        name: doc.originalName || doc.name,
        contentLength: doc.content ? doc.content.length : 0
      }))
    });
  } catch (error) {
    console.error('OpenAI test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;