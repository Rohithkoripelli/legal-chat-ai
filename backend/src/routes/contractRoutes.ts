import express from 'express';
import * as contractController from '../controllers/contractAnalysisController';

const router = express.Router();

router.use((req, res, next) => {
  console.log(`📋 Contract API: ${req.method} ${req.path}`);
  next();
});

router.post('/analyze/:documentId', contractController.analyzeContractEndpoint);
router.get('/analysis/:documentId', contractController.getContractAnalysis);
router.get('/dashboard', contractController.getRiskDashboard);

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Contract Analysis API',
    timestamp: new Date().toISOString()
  });
});

export default router;