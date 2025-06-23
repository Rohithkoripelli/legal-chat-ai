import { Request, Response } from 'express';
import Document from '../models/Document';
import ContractAnalysis from '../models/ContractAnalysis';
import ClauseLibrary from '../models/ClauseLibrary';
import { analyzeContract } from '../services/contractAnalysisService';

export const analyzeContractEndpoint = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = req.userId;
    
    console.log(`🔍 Starting contract analysis for document: ${documentId} by user: ${userId}`);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // CHECK: Find existing analysis for this user's document
    const existingAnalysis = await ContractAnalysis.findOne({ 
      documentId,
      userId // FILTER BY USER
    });
    
    if (existingAnalysis) {
      console.log('✅ Returning existing analysis for user:', userId);
      return res.json(existingAnalysis);
    }

    // SECURITY CHECK: Verify document ownership
    const document = await Document.findOne({ 
      _id: documentId, 
      userId // ONLY USER'S DOCUMENTS
    });
    
    if (!document) {
      console.log('❌ Document not found or access denied for user:', userId);
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    if (!document.content || document.content.length < 50) {
      return res.status(400).json({ 
        error: 'Document content is too short or missing for contract analysis' 
      });
    }

    console.log('🤖 Performing AI-powered contract analysis...');
    const analysis = await analyzeContract(document, userId);

    // ADD USER ID TO ANALYSIS
    const analysisWithUser = {
      ...analysis,
      userId // CRITICAL: Associate analysis with user
    };

    const contractAnalysis = new ContractAnalysis(analysisWithUser);
    await contractAnalysis.save();
    console.log('💾 Analysis saved to database for user:', userId);

    res.json(analysisWithUser);
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
    const userId = req.userId;
    
    console.log(`📄 Fetching contract analysis for document: ${documentId} by user: ${userId}`);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // SECURITY CHECK: Only return user's analysis
    const analysis = await ContractAnalysis.findOne({ 
      documentId,
      userId // FILTER BY USER
    });
    
    if (!analysis) {
      console.log('❌ Analysis not found or access denied for user:', userId);
      return res.status(404).json({ error: 'Analysis not found or access denied' });
    }

    console.log('✅ Contract analysis found for user:', userId);
    
    // Backward compatibility: migrate old riskAnalysis to riskAssessment
    const analysisObj = analysis.toObject();
    if (!analysisObj.riskAssessment && (analysisObj as any).riskAnalysis) {
      console.log('🔄 Migrating old riskAnalysis to riskAssessment structure');
      analysisObj.riskAssessment = {
        overallScore: (analysisObj as any).riskAnalysis.overallScore || 50,
        keyConsiderations: [],
        missingClauses: [],
        nonStandardTerms: [],
        ambiguities: [],
        riskFactors: (analysisObj as any).riskAnalysis.riskFactors || []
      };
    }
    
    // Ensure we have default values for missing fields
    if (!analysisObj.contractSnapshot) {
      analysisObj.contractSnapshot = {
        title: analysisObj.documentName || 'Unknown Contract',
        contractType: 'Unknown Type',
        effectiveDate: '',
        expirationDate: '',
        renewalTerms: 'Manual review required',
        parties: []
      };
    }
    
    if (!analysisObj.keyInformationAndClauses) {
      analysisObj.keyInformationAndClauses = {
        confidentialityObligations: [],
        nonCircumvention: [],
        nonSolicitationOfPersonnel: [],
        nonCompete: [],
        intellectualProperty: [],
        remediesAndEnforcement: [],
        termsAndTermination: [],
        limitationAndLiability: []
      };
    }
    
    res.json(analysisObj);
  } catch (error) {
    console.error('❌ Error fetching contract analysis:', error);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
};

// Helper function to safely get risk data from old or new structure
const getRiskData = (analysis: any) => {
  // Check if new structure exists
  if (analysis.riskAssessment) {
    return {
      overallScore: analysis.riskAssessment.overallScore || 50,
      riskFactors: analysis.riskAssessment.riskFactors || []
    };
  }
  // Fallback to old structure
  if (analysis.riskAnalysis) {
    return {
      overallScore: analysis.riskAnalysis.overallScore || 50,
      riskFactors: analysis.riskAnalysis.riskFactors || []
    };
  }
  // Ultimate fallback
  return {
    overallScore: 50,
    riskFactors: []
  };
};

export const getRiskDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    console.log('📊 Generating risk dashboard for user:', userId);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // CRITICAL SECURITY FIX: Only get user's analyses
    const userAnalyses = await ContractAnalysis.find({ userId });
    console.log(`📄 Found ${userAnalyses.length} analyses for user: ${userId}`);
    
    const totalContracts = userAnalyses.length;
    const highRiskCount = userAnalyses.filter(a => a.riskScore === 'HIGH').length;
    const mediumRiskCount = userAnalyses.filter(a => a.riskScore === 'MEDIUM').length;
    const lowRiskCount = userAnalyses.filter(a => a.riskScore === 'LOW').length;
    
    const recentHighRisk = userAnalyses
      .filter(a => a.riskScore === 'HIGH')
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime())
      .slice(0, 5);
    
    const averageRiskScore = userAnalyses.length > 0 
      ? userAnalyses.reduce((sum, a) => sum + getRiskData(a).overallScore, 0) / userAnalyses.length
      : 0;
    
    // Calculate risk factors from user's analyses only
    const riskFactors: { [key: string]: number } = {};
    userAnalyses.forEach(analysis => {
      const riskData = getRiskData(analysis);
      riskData.riskFactors.forEach(factor => {
        riskFactors[factor.category] = (riskFactors[factor.category] || 0) + 1;
      });
    });
    
    const topRiskFactors = Object.entries(riskFactors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));

    // Calculate trends from user's data only
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const thisMonth = userAnalyses.filter(a => 
      new Date(a.analyzedAt) > monthAgo
    ).length;
    
    const lastMonth = userAnalyses.filter(a => 
      new Date(a.analyzedAt) > twoMonthsAgo && new Date(a.analyzedAt) <= monthAgo
    ).length;

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
      recentHighRisk: recentHighRisk.map(contract => {
        const riskData = getRiskData(contract);
        return {
          documentId: contract.documentId,
          documentName: contract.documentName,
          riskScore: contract.riskScore,
          overallScore: riskData.overallScore,
          analyzedAt: contract.analyzedAt,
          topRiskFactors: riskData.riskFactors
            .filter(rf => rf.severity === 'HIGH')
            .slice(0, 3)
        };
      }),
      topRiskFactors,
      trends: {
        thisMonth,
        lastMonth
      }
    };

    console.log('✅ Risk dashboard generated for user:', userId);
    console.log('📊 Dashboard stats:', {
      totalContracts,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount
    });

    res.json(dashboard);
  } catch (error) {
    console.error('❌ Error generating risk dashboard:', error);
    res.status(500).json({ 
      error: 'Failed to generate risk dashboard',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};