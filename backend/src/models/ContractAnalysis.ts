// backend/src/models/ContractAnalysis.ts - UPDATED WITH userId
import mongoose, { Schema, Document } from 'mongoose';

export interface IContractAnalysis extends Document {
  documentId: string;
  documentName: string;
  userId: string;
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
  contractSnapshot: {
    title: string;
    contractType: string;
    effectiveDate?: string;
    expirationDate?: string;
    renewalTerms?: string;
    parties: Array<{
      name: string;
      role: string;
      contactInfo?: string;
    }>;
  };
  keyInformationAndClauses: {
    confidentialityObligations: Array<{
      party: string;
      obligation: string;
      duration?: string;
      scope: string;
    }>;
    nonCircumvention: Array<{
      description: string;
      restrictions: string;
      penalties?: string;
    }>;
    nonSolicitationOfPersonnel: Array<{
      restrictions: string;
      duration?: string;
      exceptions?: string;
    }>;
    nonCompete: Array<{
      restrictions: string;
      duration?: string;
      geography?: string;
      exceptions?: string;
    }>;
    intellectualProperty: Array<{
      ownership: string;
      description: string;
      restrictions?: string;
    }>;
    remediesAndEnforcement: Array<{
      remedy: string;
      conditions: string;
      enforcement?: string;
    }>;
    termsAndTermination: Array<{
      terminationCondition: string;
      noticePeriod?: string;
      consequences?: string;
    }>;
    limitationAndLiability: Array<{
      limitation: string;
      scope: string;
      exceptions?: string;
    }>;
  };
  riskAssessment: {
    overallScore: number;
    keyConsiderations: Array<{
      category: string;
      consideration: string;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
      recommendation: string;
    }>;
    missingClauses: Array<{
      clause: string;
      importance: 'HIGH' | 'MEDIUM' | 'LOW';
      recommendation: string;
    }>;
    nonStandardTerms: Array<{
      term: string;
      description: string;
      risk: 'HIGH' | 'MEDIUM' | 'LOW';
      suggestion: string;
    }>;
    ambiguities: Array<{
      clause: string;
      ambiguity: string;
      risk: 'HIGH' | 'MEDIUM' | 'LOW';
      clarification: string;
    }>;
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

// Contract Snapshot Schemas
const PartySchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  contactInfo: { type: String }
});

const ContractSnapshotSchema = new Schema({
  title: { type: String, required: true },
  contractType: { type: String, required: true },
  effectiveDate: { type: String },
  expirationDate: { type: String },
  renewalTerms: { type: String },
  parties: [PartySchema]
});

// Key Information & Clauses Schemas
const ConfidentialityObligationSchema = new Schema({
  party: { type: String, required: true },
  obligation: { type: String, required: true },
  duration: { type: String },
  scope: { type: String, required: true }
});

const NonCircumventionSchema = new Schema({
  description: { type: String, required: true },
  restrictions: { type: String, required: true },
  penalties: { type: String }
});

const NonSolicitationSchema = new Schema({
  restrictions: { type: String, required: true },
  duration: { type: String },
  exceptions: { type: String }
});

const NonCompeteSchema = new Schema({
  restrictions: { type: String, required: true },
  duration: { type: String },
  geography: { type: String },
  exceptions: { type: String }
});

const IntellectualPropertySchema = new Schema({
  ownership: { type: String, required: true },
  description: { type: String, required: true },
  restrictions: { type: String }
});

const RemediesEnforcementSchema = new Schema({
  remedy: { type: String, required: true },
  conditions: { type: String, required: true },
  enforcement: { type: String }
});

const TermsTerminationSchema = new Schema({
  terminationCondition: { type: String, required: true },
  noticePeriod: { type: String },
  consequences: { type: String }
});

const LimitationLiabilitySchema = new Schema({
  limitation: { type: String, required: true },
  scope: { type: String, required: true },
  exceptions: { type: String }
});

const KeyInformationClausesSchema = new Schema({
  confidentialityObligations: [ConfidentialityObligationSchema],
  nonCircumvention: [NonCircumventionSchema],
  nonSolicitationOfPersonnel: [NonSolicitationSchema],
  nonCompete: [NonCompeteSchema],
  intellectualProperty: [IntellectualPropertySchema],
  remediesAndEnforcement: [RemediesEnforcementSchema],
  termsAndTermination: [TermsTerminationSchema],
  limitationAndLiability: [LimitationLiabilitySchema]
});

// Risk Assessment Schemas
const KeyConsiderationSchema = new Schema({
  category: { type: String, required: true },
  consideration: { type: String, required: true },
  impact: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  recommendation: { type: String, required: true }
});

const MissingClauseSchema = new Schema({
  clause: { type: String, required: true },
  importance: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  recommendation: { type: String, required: true }
});

const NonStandardTermSchema = new Schema({
  term: { type: String, required: true },
  description: { type: String, required: true },
  risk: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  suggestion: { type: String, required: true }
});

const AmbiguitySchema = new Schema({
  clause: { type: String, required: true },
  ambiguity: { type: String, required: true },
  risk: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  clarification: { type: String, required: true }
});

const RiskAssessmentSchema = new Schema({
  overallScore: { type: Number, required: true, min: 0, max: 100 },
  keyConsiderations: [KeyConsiderationSchema],
  missingClauses: [MissingClauseSchema],
  nonStandardTerms: [NonStandardTermSchema],
  ambiguities: [AmbiguitySchema],
  riskFactors: [RiskFactorSchema]
});

const ContractAnalysisSchema = new Schema<IContractAnalysis>({
  documentId: { type: String, required: true },
  documentName: { type: String, required: true },
  userId: {
    type: String, 
    required: true,
    index: true
  },
  riskScore: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    required: true 
  },
  executiveSummary: { type: ExecutiveSummarySchema, required: true },
  contractSnapshot: { type: ContractSnapshotSchema, required: true },
  keyInformationAndClauses: { type: KeyInformationClausesSchema, required: true },
  riskAssessment: { type: RiskAssessmentSchema, required: true },
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