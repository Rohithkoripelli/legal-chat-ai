import express from 'express';
import * as contractController from '../controllers/contractAnalysisController';
import { clerkAuthMiddleware } from '../middleware/auth'; // ADD AUTH MIDDLEWARE

const router = express.Router();

// APPLY AUTH MIDDLEWARE TO ALL CONTRACT ROUTES
router.use(clerkAuthMiddleware);

router.use((req, res, next) => {
  console.log(`📋 Contract API: ${req.method} ${req.path} - User: ${req.userId}`);
  next();
});

// POST /api/contracts/analyze/:documentId - Analyze contract (protected)
router.post('/analyze/:documentId', contractController.analyzeContractEndpoint);

// GET /api/contracts/analysis/:documentId - Get contract analysis (protected)
router.get('/analysis/:documentId', contractController.getContractAnalysis);

// GET /api/contracts/dashboard - Get risk dashboard (protected)
router.get('/dashboard', contractController.getRiskDashboard);

// GET /api/contracts/health - Health check (protected)
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Contract Analysis API',
    timestamp: new Date().toISOString(),
    user: req.userId // Include user info in health check
  });
});

export default router;