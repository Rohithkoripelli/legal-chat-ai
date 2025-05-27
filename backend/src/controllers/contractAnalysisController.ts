import { Request, Response } from 'express';
import Document from '../models/Document';
import ContractAnalysis from '../models/ContractAnalysis';
import ClauseLibrary from '../models/ClauseLibrary';
import { analyzeContract } from '../services/contractAnalysisService';

export const analyzeContractEndpoint = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    console.log(`🔍 Starting contract analysis for document: ${documentId}`);

    const existingAnalysis = await ContractAnalysis.findOne({ documentId });
    if (existingAnalysis) {
      console.log('✅ Returning existing analysis');
      return res.json(existingAnalysis);
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

    res.json(analysis);
  } catch (error) {
    console.error('❌ Error in contract analysis:', error);
    res.status(500).json({ 
      error: 'Contract analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getContractAnalysis = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const analysis = await ContractAnalysis.findOne({ documentId });
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching contract analysis:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
};

export const getRiskDashboard = async (req: Request, res: Response) => {
  try {
    console.log('📊 Generating risk dashboard...');
    
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
    
    const riskFactors: { [key: string]: number } = {};
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
      topRiskFactors,
      trends: {
        thisMonth: allAnalyses.filter(a => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(a.analyzedAt) > monthAgo;
        }).length,
        lastMonth: allAnalyses.filter(a => {
          const twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return new Date(a.analyzedAt) > twoMonthsAgo && new Date(a.analyzedAt) <= monthAgo;
        }).length
      }
    };

    res.json(dashboard);
  } catch (error) {
    console.error('Error generating risk dashboard:', error);
    res.status(500).json({ error: 'Failed to generate risk dashboard' });
  }
};