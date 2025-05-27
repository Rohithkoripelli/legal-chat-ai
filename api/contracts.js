import { connectDB } from '../lib/utils/database';
import Document from '../lib/models/Document';
import ContractAnalysis from '../lib/models/ContractAnalysis';
import { analyzeContract } from '../lib/services/contractAnalysisService';

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
    await connectDB();
    console.log('📋 Contracts API called:', req.method, req.url);

    // Health check
    if (req.method === 'GET' && req.url === '/api/contracts/health') {
      return res.status(200).json({ 
        status: 'OK', 
        service: 'Contract Analysis API',
        timestamp: new Date().toISOString()
      });
    }

    // Risk dashboard
    if (req.method === 'GET' && req.url === '/api/contracts/dashboard') {
      const allAnalyses = await ContractAnalysis.find({});
      
      const totalContracts = allAnalyses.length;
      const highRiskCount = allAnalyses.filter(a => a.riskScore === 'HIGH').length;
      const mediumRiskCount = allAnalyses.filter(a => a.riskScore === 'MEDIUM').length;
      const lowRiskCount = allAnalyses.filter(a => a.riskScore === 'LOW').length;
      
      const recentHighRisk = allAnalyses
        .filter(a => a.riskScore === 'HIGH')
        .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
        .slice(0, 5);
      
      const averageRiskScore = allAnalyses.length > 0 
        ? allAnalyses.reduce((sum, a) => sum + a.riskAnalysis.overallScore, 0) / allAnalyses.length
        : 0;
      
      const riskFactors = {};
      allAnalyses.forEach(analysis => {
        analysis.riskAnalysis.riskFactors.forEach(factor => {
          riskFactors[factor.category] = (riskFactors[factor.category] || 0) + 1;
        });
      });
      
      const topRiskFactors = Object.entries(riskFactors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([category, count]) => ({ category, count }));

      const dashboard = {
        summary: {
          totalContracts,
          highRiskCount,
          mediumRiskCount,
          lowRiskCount,
          averageRiskScore: Math.round(averageRiskScore)
        },
        riskDistribution: {
          high: highRiskCount,
          medium: mediumRiskCount,
          low: lowRiskCount
        },
        recentHighRisk: recentHighRisk.map(contract => ({
          documentId: contract.documentId,
          documentName: contract.documentName,
          riskScore: contract.riskScore,
          overallScore: contract.riskAnalysis.overallScore,
          analyzedAt: contract.analyzedAt,
          topRiskFactors: contract.riskAnalysis.riskFactors
            .filter(rf => rf.severity === 'HIGH')
            .slice(0, 3)
        })),
        topRiskFactors
      };

      return res.status(200).json(dashboard);
    }

    // Analyze contract
    if (req.method === 'POST' && req.url.includes('/analyze/')) {
      const documentId = req.url.split('/analyze/')[1];
      
      console.log(`🔍 Starting contract analysis for document: ${documentId}`);

      const existingAnalysis = await ContractAnalysis.findOne({ documentId });
      if (existingAnalysis) {
        console.log('✅ Returning existing analysis');
        return res.status(200).json(existingAnalysis);
      }

      const document = await Document.findById(documentId);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (!document.content || document.content.length < 50) {
        return res.status(400).json({ 
          error: 'Document content is too short or missing for contract analysis' 
        });
      }

      console.log('🤖 Performing AI-powered contract analysis...');
      const analysis = await analyzeContract(document);

      const contractAnalysis = new ContractAnalysis(analysis);
      await contractAnalysis.save();
      console.log('💾 Analysis saved to database');

      return res.status(200).json(analysis);
    }

    // Get contract analysis
    if (req.method === 'GET' && req.url.includes('/analysis/')) {
      const documentId = req.url.split('/analysis/')[1];
      const analysis = await ContractAnalysis.findOne({ documentId });
      
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }
      
      return res.status(200).json(analysis);
    }

    return res.status(404).json({ error: 'Contract endpoint not found' });

  } catch (error) {
    console.error('❌ Error in contracts API:', error);
    return res.status(500).json({ 
      error: 'Contract analysis failed',
      details: error.message 
    });
  }
}
