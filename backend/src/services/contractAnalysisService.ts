// backend/src/services/contractAnalysisService.ts - CLEAN SIMPLE VERSION
import { OpenAI } from 'openai';
import { IDocument } from '../models/Document';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContractAnalysis {
  documentId: string;
  documentName: string;
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

// Simple validation
const fixCategory = (cat: string) => {
  const valid = ['LIABILITY', 'TERMINATION', 'IP', 'PAYMENT', 'COMPLIANCE', 'CONFIDENTIALITY', 'DATA_PRIVACY', 'REGULATORY', 'OTHER'];
  return valid.includes(cat.toUpperCase()) ? cat.toUpperCase() : 'OTHER';
};

const fixSeverity = (sev: string) => {
  const valid = ['HIGH', 'MEDIUM', 'LOW'];
  return valid.includes(sev.toUpperCase()) ? sev.toUpperCase() : 'MEDIUM';
};

// Simple JSON parser
const parseJSON = (text: string, fallback: any = {}) => {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean.trim());
  } catch (error) {
    console.warn('JSON parse failed, using fallback');
    return fallback;
  }
};

// Simple OpenAI call
const callOpenAI = async (messages: any[], maxTokens: number = 1000, model: string = 'gpt-3.5-turbo') => {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.2,
      max_tokens: maxTokens,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }
    
    return content.trim();
  } catch (error) {
    console.error(`OpenAI call failed:`, error);
    throw error;
  }
};

export const analyzeContract = async (document: any): Promise<ContractAnalysis> => {
  try {
    console.log(`🔍 Analyzing contract: ${document.originalName || document.name}`);
    
    if (!document.content || document.content.length < 100) {
      throw new Error('Document content too short');
    }

    // Use reasonable content length
    const maxLength = 6000;
    const content = document.content.length > maxLength 
      ? document.content.substring(0, maxLength) + '...[truncated]'
      : document.content;

    console.log(`📄 Processing ${content.length} characters`);

    // STEP 1: Executive Summary
    let executiveSummary = '';
    try {
      const summaryPrompt = `Analyze this contract and provide a detailed executive summary:

${content}

Format your response with clear sections:

**Contract Overview:**
Brief description of the contract type, parties, and purpose.

**Key Business Risks:**
1. [First specific risk from the contract]
2. [Second specific risk from the contract]  
3. [Third specific risk from the contract]

**Recommended Actions:**
1. [First actionable recommendation]
2. [Second actionable recommendation]
3. [Third actionable recommendation]

**Key Dates and Deadlines:**
- [Important date/deadline 1]
- [Important date/deadline 2]
- [Important date/deadline 3]

Be specific to this contract's actual content.`;

      executiveSummary = await callOpenAI([
        { role: 'system', content: 'You are a senior legal analyst. Provide detailed, specific analysis based on the actual contract content.' },
        { role: 'user', content: summaryPrompt }
      ], 1000, 'gpt-3.5-turbo');
      
      console.log('✅ Executive summary generated');
    } catch (summaryError) {
      console.warn('Executive summary failed:', summaryError);
      executiveSummary = `**Contract Overview:**
This contract requires professional legal review to identify key terms and obligations.

**Key Business Risks:**
1. Liability and indemnification terms need careful evaluation
2. Payment obligations and financial terms require validation  
3. Termination conditions and exit clauses need review

**Recommended Actions:**
1. Schedule comprehensive legal review with qualified attorney
2. Extract and calendar all important dates and deadlines
3. Review financial terms and payment obligations with finance team

**Key Dates and Deadlines:**
- Contract review: Schedule within 7 business days
- Legal consultation: Arrange with qualified counsel
- Implementation: After legal approval and risk assessment`;
    }

    // STEP 2: Risk Analysis
    let riskData = { overallRiskScore: 50, riskFactors: [], problematicClauses: [] };
    try {
      const riskPrompt = `Analyze this contract for risks and return JSON:

${content}

Return this JSON structure:
{
  "overallRiskScore": [number 1-100 based on liability, financial exposure, complexity],
  "riskFactors": [
    {
      "category": "[LIABILITY/IP/PAYMENT/TERMINATION/COMPLIANCE/OTHER]",
      "severity": "[HIGH/MEDIUM/LOW]",
      "description": "[Detailed explanation of the risk]",
      "clause": "[Relevant clause or section reference]",
      "recommendation": "[Specific recommendation]"
    }
  ],
  "problematicClauses": [
    {
      "clause": "[Problematic clause text or reference]",
      "issue": "[What's problematic about it]",
      "severity": "[HIGH/MEDIUM/LOW]",
      "suggestion": "[How to improve it]"
    }
  ]
}

Focus on actual contract terms, not generic risks.`;

      const riskResponse = await callOpenAI([
        { role: 'system', content: 'You are a legal risk analyst. Return valid JSON only.' },
        { role: 'user', content: riskPrompt }
      ], 1200, 'gpt-3.5-turbo');

      riskData = parseJSON(riskResponse, riskData);
      console.log('✅ Risk analysis completed');
    } catch (riskError) {
      console.warn('Risk analysis failed:', riskError);
      // Use intelligent defaults based on content
      const hasLiability = content.toLowerCase().includes('liability') || content.toLowerCase().includes('indemnif');
      const hasIP = content.toLowerCase().includes('intellectual property') || content.toLowerCase().includes('work product');
      const hasPayment = content.toLowerCase().includes('payment') || content.toLowerCase().includes('$');
      
      let score = 45;
      if (hasLiability && !content.toLowerCase().includes('limit')) score += 15;
      if (hasIP) score += 10;
      if (hasPayment) score += 5;
      
      riskData = {
        overallRiskScore: Math.min(score, 85),
        riskFactors: [
          {
            category: hasLiability ? 'LIABILITY' : hasIP ? 'IP' : 'OTHER',
            severity: score > 65 ? 'HIGH' : 'MEDIUM',
            description: `Contract contains ${hasLiability ? 'liability provisions' : hasIP ? 'intellectual property terms' : 'business terms'} that require legal review.`,
            clause: 'Specific clauses require detailed legal analysis',
            recommendation: 'Review with qualified legal counsel to assess risk exposure'
          }
        ],
        problematicClauses: []
      };
    }

    // STEP 3: Key Terms
    let keyData = { keyTerms: [], keyDates: [], obligations: [] };
    try {
      const termsPrompt = `Extract key terms from this contract:

${content}

Return JSON:
{
  "keyTerms": [
    {
      "term": "[Term name]",
      "value": "[Value/amount]",
      "category": "[FINANCIAL/TIMELINE/LEGAL/OTHER]",
      "riskLevel": "[HIGH/MEDIUM/LOW]"
    }
  ],
  "keyDates": [
    {
      "date": "[Date or timeline]",
      "description": "[What happens]",
      "importance": "[HIGH/MEDIUM/LOW]"
    }
  ],
  "obligations": [
    {
      "party": "[Which party]",
      "obligation": "[What they must do]",
      "deadline": "[When due]"
    }
  ]
}

Extract actual values from the contract.`;

      const termsResponse = await callOpenAI([
        { role: 'system', content: 'Extract specific terms from the contract. Return valid JSON.' },
        { role: 'user', content: termsPrompt }
      ], 800, 'gpt-3.5-turbo');

      keyData = parseJSON(termsResponse, keyData);
      console.log('✅ Key terms extracted');
    } catch (termsError) {
      console.warn('Key terms extraction failed:', termsError);
      // Basic extraction using patterns
      const amounts = content.match(/\$[\d,]+(?:\.\d{2})?/g) || [];
      const dates = content.match(/\d{1,2}\/\d{1,2}\/\d{4}/g) || [];
      
      keyData = {
        keyTerms: amounts.slice(0, 3).map((amount, i) => ({
          term: `Financial Term ${i + 1}`,
          value: amount,
          category: 'FINANCIAL',
          riskLevel: 'MEDIUM'
        })),
        keyDates: dates.slice(0, 3).map((date, i) => ({
          date: date,
          description: `Important contract date`,
          importance: 'MEDIUM'
        })),
        obligations: [
          {
            party: 'Both parties',
            obligation: 'Comply with contract terms and conditions',
            deadline: 'Throughout contract term'
          }
        ]
      };
    }

    // Build final analysis
    const riskScore = riskData.overallRiskScore > 70 ? 'HIGH' : 
                     riskData.overallRiskScore > 40 ? 'MEDIUM' : 'LOW';

    const validatedRiskFactors = (riskData.riskFactors || []).map((risk: any) => ({
      category: fixCategory(risk.category || 'OTHER') as any,
      severity: fixSeverity(risk.severity || 'MEDIUM') as any,
      description: risk.description || 'Risk identified requiring legal review',
      clause: risk.clause || 'Specific clause reference not available',
      recommendation: risk.recommendation || 'Review with legal counsel'
    }));

    const validatedProblematicClauses = (riskData.problematicClauses || []).map((clause: any) => ({
      clause: clause.clause || 'Clause identification needed',
      issue: clause.issue || 'Issue requires legal analysis',
      severity: fixSeverity(clause.severity || 'MEDIUM') as any,
      suggestion: clause.suggestion || 'Legal counsel review recommended'
    }));

    const validatedKeyDates = (keyData.keyDates || []).map((date: any) => ({
      date: date.date || new Date().toISOString().split('T')[0],
      description: date.description || 'Important contract date',
      importance: fixSeverity(date.importance || 'MEDIUM') as any
    }));

    const validatedKeyTerms = (keyData.keyTerms || []).map((term: any) => ({
      term: term.term || 'Contract term',
      value: term.value || 'Value requires analysis',
      category: term.category || 'General',
      riskLevel: fixSeverity(term.riskLevel || 'LOW') as any
    }));

    const analysis: ContractAnalysis = {
      documentId: document._id?.toString() || document.id?.toString() || 'unknown',
      documentName: document.originalName || document.name || 'Unknown Document',
      riskScore: riskScore as any,
      executiveSummary: {
        overview: executiveSummary,
        keyDates: validatedKeyDates,
        obligations: keyData.obligations || [],
        recommendedActions: [
          'Schedule comprehensive legal review with qualified attorney',
          'Extract and calendar all critical dates and deadlines',
          'Review financial terms and payment obligations',
          'Establish contract compliance monitoring procedures',
          'Clarify any ambiguous terms with counterparty'
        ]
      },
      riskAnalysis: {
        overallScore: riskData.overallRiskScore,
        riskFactors: validatedRiskFactors
      },
      keyTerms: validatedKeyTerms,
      problematicClauses: validatedProblematicClauses,
      analyzedAt: new Date()
    };

    console.log(`✅ Analysis completed: ${riskData.overallRiskScore}/100 (${riskScore})`);
    return analysis;

  } catch (error: any) {
    console.error('❌ Contract analysis failed:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
};

export const generateContractSummary = async (document: any): Promise<string> => {
  try {
    const content = document.content?.substring(0, 5000) || 'No content';
    
    const prompt = `Create a professional summary of this contract:

${content}

Include:
- Contract type and parties involved
- Key business terms and obligations
- Important dates and deadlines  
- Main risks and recommendations

Keep it clear and business-focused.`;

    const summary = await callOpenAI([
      { role: 'system', content: 'You are a legal advisor creating contract summaries. Be professional and concise.' },
      { role: 'user', content: prompt }
    ], 1000, 'gpt-3.5-turbo');

    return summary;
    
  } catch (error) {
    console.error('❌ Summary failed:', error);
    return `# Contract Summary: ${document.originalName || document.name}

This contract has been uploaded and is ready for analysis.

**Key Information:**
- Document: ${document.originalName || document.name}
- Size: ${document.size ? Math.round(document.size / 1024) + ' KB' : 'Unknown'}
- Content: ${document.content?.length || 0} characters

**Recommended Actions:**
1. Schedule legal consultation with qualified attorney
2. Review contract terms and conditions thoroughly
3. Extract and calendar important dates and deadlines
4. Assess compliance requirements and obligations

**Note:** Professional legal review is recommended for detailed analysis.`;
  }
};

export default {
  analyzeContract,
  generateContractSummary
};