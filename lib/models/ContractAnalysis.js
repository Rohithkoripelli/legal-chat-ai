import mongoose from 'mongoose';

const KeyDateSchema = new mongoose.Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  importance: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  }
});

const ObligationSchema = new mongoose.Schema({
  party: { type: String, required: true },
  obligation: { type: String, required: true },
  deadline: { type: String }
});

const RiskFactorSchema = new mongoose.Schema({
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

const KeyTermSchema = new mongoose.Schema({
  term: { type: String, required: true },
  value: { type: String, required: true },
  category: { type: String, required: true },
  riskLevel: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  }
});

const ProblematicClauseSchema = new mongoose.Schema({
  clause: { type: String, required: true },
  issue: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  suggestion: { type: String, required: true }
});

const ExecutiveSummarySchema = new mongoose.Schema({
  overview: { type: String, required: true },
  keyDates: [KeyDateSchema],
  obligations: [ObligationSchema],
  recommendedActions: [{ type: String }]
});

const RiskAnalysisSchema = new mongoose.Schema({
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  riskFactors: [RiskFactorSchema]
});

const ContractAnalysisSchema = new mongoose.Schema({
  documentId: { type: String, required: true },
  documentName: { type: String, required: true },
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

ContractAnalysisSchema.index({ documentId: 1 });
ContractAnalysisSchema.index({ riskScore: 1 });
ContractAnalysisSchema.index({ analyzedAt: -1 });

const ContractAnalysis = mongoose.models.ContractAnalysis || mongoose.model('ContractAnalysis', ContractAnalysisSchema);

export default ContractAnalysis;
