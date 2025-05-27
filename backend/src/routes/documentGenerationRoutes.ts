import express from 'express';
import * as documentGenerationController from '../controllers/documentGenerationController';

const router = express.Router();

// Enhanced middleware for request logging and validation
router.use((req, res, next) => {
  console.log(`📄 Document Generation API: ${req.method} ${req.path}`);
  console.log('Request body size:', JSON.stringify(req.body || {}).length);
  next();
});

// Enhanced rate limiting middleware (simple implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 50; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const rateLimitMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_WINDOW });
    next();
  } else if (clientData.count < RATE_LIMIT) {
    clientData.count++;
    next();
  } else {
    res.status(429).json({ 
      error: 'Too many requests', 
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000) 
    });
  }
};

// Request size limiting middleware
const requestSizeLimit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 1024 * 1024; // 1MB limit
  
  if (contentLength > maxSize) {
    return res.status(413).json({ error: 'Request too large' });
  }
  next();
};

// Security headers middleware
const securityHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

// Apply security and rate limiting to all routes
router.use(securityHeaders);
router.use(requestSizeLimit);
router.use(rateLimitMiddleware);

// =========================
// ROUTE DEFINITIONS
// =========================

// Health check endpoint - MUST be defined
router.get('/health', documentGenerationController.healthCheck);

// Get supported document types - MUST be defined  
router.get('/types', documentGenerationController.getSupportedDocumentTypes);

// Main document generation endpoint
router.post('/', documentGenerationController.generateDocument);

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({
    message: 'Document generation service is running',
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      'GET /health - Health check',
      'GET /types - Get supported document types',
      'POST / - Generate document'
    ]
  });
});

export default router;