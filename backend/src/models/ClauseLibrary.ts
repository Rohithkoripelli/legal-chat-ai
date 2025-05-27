import mongoose from 'mongoose';

export interface IClause {
  title: string;
  category: 'LIABILITY' | 'TERMINATION' | 'IP' | 'PAYMENT' | 'CONFIDENTIALITY' | 'INDEMNIFICATION' | 'OTHER';
  industry: 'GENERAL' | 'TECH' | 'FINANCE' | 'HEALTHCARE' | 'MANUFACTURING' | 'OTHER';
  type: 'FAVORABLE' | 'STANDARD' | 'UNFAVORABLE';
  clauseText: string;
  explanation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  alternativeVersion?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const clauseSchema = new mongoose.Schema<IClause>({
  title: { type: String, required: true },
  category: { type: String, enum: ['LIABILITY', 'TERMINATION', 'IP', 'PAYMENT', 'CONFIDENTIALITY', 'INDEMNIFICATION', 'OTHER'], required: true },
  industry: { type: String, enum: ['GENERAL', 'TECH', 'FINANCE', 'HEALTHCARE', 'MANUFACTURING', 'OTHER'], default: 'GENERAL' },
  type: { type: String, enum: ['FAVORABLE', 'STANDARD', 'UNFAVORABLE'], required: true },
  clauseText: { type: String, required: true },
  explanation: { type: String, required: true },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  alternativeVersion: String,
  tags: [String]
}, { timestamps: true });

const ClauseLibrary = mongoose.model<IClause>('ClauseLibrary', clauseSchema);
export default ClauseLibrary;