import express, { Request, Response } from 'express';
import Document from '../models/Document';
import { processMessage } from '../services/aiService';
import { clerkAuthMiddleware } from '../middleware/auth';
import { 
  sendMessage, 
  createConversation, 
  getConversations, 
  getConversation, 
  deleteConversation 
} from '../controllers/chatController';

const router = express.Router();

// Define interfaces for type safety
interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface GuestDocument {
  id: string;        // FIXED: Use id instead of just name
  name: string;
  content: string;
  type?: string;
  size?: number;
  uploadedAt?: string;
}

interface GuestChatBody {
  message: string;
  documents?: GuestDocument[];
}

interface AuthenticatedChatBody {
  message: string;
  documentIds?: string[];
}

// GUEST CHAT ENDPOINT - NO AUTH REQUIRED (place before auth middleware)
router.post('/guest', async (req: Request<{}, {}, GuestChatBody>, res: Response) => {
  try {
    console.log('🎯 GUEST POST /api/chat/guest');
    const { message, documents = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('📩 Guest chat request received');
    console.log(`📩 Guest message: "${message}"`);
    console.log(`📄 Guest documents: ${documents.length} provided`);

    // FIXED: Create guest document objects with proper IDs for vectorization
    const guestDocuments = documents.map((doc, index) => {
      // Use the actual document ID if provided, otherwise create consistent fallback
      const documentId = doc.id || `guest-doc-${index}`;
      
      console.log(`📋 Processing guest document: ${doc.name} with ID: ${documentId}`);
      
      return {
        _id: documentId,  // Use the actual guest document ID
        id: documentId,   // Also set id field for compatibility
        name: doc.name || `Document ${index + 1}`,
        originalName: doc.name || `Document ${index + 1}`,
        content: doc.content || '',
        type: doc.type || 'guest-document',
        size: doc.size || doc.content?.length || 0,
        uploadedAt: new Date(doc.uploadedAt || new Date())
      };
    });

    // Log the document IDs being used for vectorization
    if (guestDocuments.length > 0) {
      console.log('📋 Guest document IDs for vector search:', guestDocuments.map(doc => doc._id));
    }

    // Process message with AI (same service as authenticated users)
    console.log('🤖 Processing guest message with AI...');
    const aiResponse = await processMessage(message, guestDocuments);
    
    // Add guest-specific disclaimer
    const guestDisclaimer = "\n\n**✨ Free Guest Analysis**: You're using our free guest mode! Create an account for unlimited uploads, chat history, and premium features.";
    const finalResponse = aiResponse.includes("**⚖️ Legal Disclaimer**") 
      ? aiResponse.replace("**⚖️ Legal Disclaimer**", guestDisclaimer + "\n\n**⚖️ Legal Disclaimer**")
      : aiResponse + guestDisclaimer;
    
    console.log('✅ Guest AI response generated');
    res.json({ response: finalResponse });
    
  } catch (error) {
    console.error('❌ Error in guest chat:', error);
    res.status(500).json({ 
      error: 'I apologize, but I encountered an error while processing your message. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test endpoint for guest chat - NO AUTH REQUIRED
router.get('/guest/test', (req: Request, res: Response) => {
  console.log('Guest chat test endpoint accessed');
  res.json({ 
    message: 'Guest chat API is working!',
    timestamp: new Date().toISOString(),
    features: ['Free document analysis', 'No signup required', 'Instant AI chat'],
    endpoint: '/api/chat/guest'
  });
});

// APPLY AUTH MIDDLEWARE TO ALL OTHER ROUTES (authenticated endpoints)
router.use(clerkAuthMiddleware);

// Debug middleware to log authenticated requests
router.use((req: AuthenticatedRequest, res: Response, next) => {
  console.log(`
======== AUTHENTICATED CHAT API REQUEST ========
Method: ${req.method}
Path: ${req.path}
User: ${req.userId}
Body: ${JSON.stringify(req.body, null, 2)}
======== END REQUEST ========
`);
  next();
});

// POST /api/chat - Send a message (authenticated users only)
router.post('/', sendMessage);

// Conversation management routes
// GET /api/chat/conversations - List user conversations
router.get('/conversations', getConversations);

// GET /api/chat/conversations/:id - Get specific conversation with messages
router.get('/conversations/:id', getConversation);

// POST /api/chat/conversations - Create new conversation
router.post('/conversations', createConversation);

// DELETE /api/chat/conversations/:id - Delete conversation
router.delete('/conversations/:id', deleteConversation);

// GET /api/chat/test - Test if chat API is working (authenticated)
router.get('/test', (req: AuthenticatedRequest, res: Response) => {
  console.log('Chat test route accessed by authenticated user:', req.userId);
  res.json({ 
    message: `Chat API is working for authenticated user: ${req.userId}!`,
    timestamp: new Date().toISOString(),
    userInfo: {
      userId: req.userId,
      authenticated: true,
      type: 'premium'
    }
  });
});

// GET /api/chat/history - Get message history (authenticated) - placeholder
router.get('/history', (req: AuthenticatedRequest, res: Response) => {
  console.log('Chat history requested by authenticated user:', req.userId);
  // TODO: Implement chat history with user filtering
  res.json({
    message: 'Chat history endpoint - coming soon',
    userId: req.userId,
    history: []
  });
});

// DELETE /api/chat/history - Clear message history (authenticated) - placeholder
router.delete('/history', (req: AuthenticatedRequest, res: Response) => {
  console.log('Chat history clear requested by authenticated user:', req.userId);
  // TODO: Implement chat history clearing for specific user
  res.json({ 
    message: 'Chat history cleared for user: ' + req.userId,
    userId: req.userId
  });
});

// GET /api/chat/user-documents - Get user's documents for chat context (authenticated)
router.get('/user-documents', async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('📋 Fetching documents for chat context for authenticated user:', req.userId);
    
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
      userId: req.userId,
      type: 'premium'
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