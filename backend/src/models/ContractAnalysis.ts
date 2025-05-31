// backend/src/models/ContractAnalysis.ts - UPDATED WITH userId
import mongoose, { Schema, Document } from 'mongoose';

export interface IContractAnalysis extends Document {
  documentId: string;
  documentName: string;
  userId: string; // ADD THIS FIELD
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  executiveSummary: {
    overview: string;
    keyDates: Array<{
      date: string;
      description: string;
      importance: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    obligations: Array<{
      party: string;
      obligation: string;
      deadline?: string;
    }>;
    recommendedActions: string[];
  };
  riskAnalysis: {
    overallScore: number;
    riskFactors: Array<{
      category: 'LIABILITY' | 'TERMINATION' | 'IP' | 'PAYMENT' | 'COMPLIANCE' | 'CONFIDENTIALITY' | 'DATA_PRIVACY' | 'REGULATORY' | 'OTHER';
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
      description: string;
      clause: string;
      recommendation: string;
    }>;
  };
  keyTerms: Array<{
    term: string;
    value: string;
    category: string;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  problematicClauses: Array<{
    clause: string;
    issue: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    suggestion: string;
  }>;
  analyzedAt: Date;
}

const KeyDateSchema = new Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  importance: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  }
});

const ObligationSchema = new Schema({
  party: { type: String, required: true },
  obligation: { type: String, required: true },
  deadline: { type: String }
});

const RiskFactorSchema = new Schema({
  category: { 
    type: String, 
    enum: [
      'LIABILITY', 
      'TERMINATION', 
      'IP', 
      'PAYMENT', 
      'COMPLIANCE', 
      'CONFIDENTIALITY', 
      'DATA_PRIVACY', 
      'REGULATORY', 
      'OTHER'
    ], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  description: { type: String, required: true },
  clause: { type: String, required: true },
  recommendation: { type: String, required: true }
});

const KeyTermSchema = new Schema({
  term: { type: String, required: true },
  value: { type: String, required: true },
  category: { type: String, required: true },
  riskLevel: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  }
});

const ProblematicClauseSchema = new Schema({
  clause: { type: String, required: true },
  issue: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  suggestion: { type: String, required: true }
});

const ExecutiveSummarySchema = new Schema({
  overview: { type: String, required: true },
  keyDates: [KeyDateSchema],
  obligations: [ObligationSchema],
  recommendedActions: [{ type: String }]
});

const RiskAnalysisSchema = new Schema({
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  riskFactors: [RiskFactorSchema]
});

const ContractAnalysisSchema = new Schema<IContractAnalysis>({
  documentId: { type: String, required: true },
  documentName: { type: String, required: true },
  userId: { // ADD THIS FIELD
    type: String, 
    required: true,
    index: true // For fast user-specific queries
  },
  riskScore: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    required: true 
  },
  executiveSummary: { type: ExecutiveSummarySchema, required: true },
  riskAnalysis: { type: RiskAnalysisSchema, required: true },
  keyTerms: [KeyTermSchema],
  problematicClauses: [ProblematicClauseSchema],
  analyzedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for better query performance
ContractAnalysisSchema.index({ documentId: 1 });
ContractAnalysisSchema.index({ riskScore: 1 });
ContractAnalysisSchema.index({ analyzedAt: -1 });
ContractAnalysisSchema.index({ userId: 1 }); // ADD INDEX FOR USER QUERIES
ContractAnalysisSchema.index({ userId: 1, riskScore: 1 }); // COMPOUND INDEX FOR DASHBOARD
ContractAnalysisSchema.index({ userId: 1, analyzedAt: -1 }); // COMPOUND INDEX FOR RECENT ANALYSES

export default mongoose.model<IContractAnalysis>('ContractAnalysis', ContractAnalysisSchema);