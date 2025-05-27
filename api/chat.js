import { connectDB } from '../lib/utils/database';
import Document from '../lib/models/Document';
import { processMessage } from '../lib/services/aiService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    console.log('📩 Chat API called:', req.method, req.url);
    await connectDB();

    if (req.method === 'GET' && req.url.includes('/test')) {
      return res.status(200).json({ 
        message: 'Chat API working!', 
        timestamp: new Date().toISOString() 
      });
    }

    if (req.method === 'POST') {
      const { message, documentIds = [] } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log(`📩 Processing message: "${message}"`);
      console.log(`🔍 Document IDs: ${documentIds.length > 0 ? documentIds.join(', ') : 'none'}`);

      let documents = [];
      if (documentIds && documentIds.length > 0) {
        try {
          documents = await Document.find({ _id: { $in: documentIds } });
          console.log(`📄 Found ${documents.length} documents`);
        } catch (docError) {
          console.warn('⚠️ Could not fetch documents:', docError);
        }
      }

      console.log('🤖 Processing with AI...');
      const aiResponse = await processMessage(message, documents);
      
      return res.status(200).json({ 
        response: aiResponse,
        documentCount: documents.length 
      });
    }

    if (req.method === 'GET' && req.url.includes('/history')) {
      return res.status(200).json([]);
    }

    if (req.method === 'DELETE' && req.url.includes('/history')) {
      return res.status(200).json({ message: 'History cleared' });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Error in chat API:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
}
