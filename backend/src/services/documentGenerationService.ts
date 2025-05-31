// backend/src/services/documentGenerationService.ts - COMPLETE FIXED VERSION
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// FIXED: Better OpenAI initialization with proper error handling
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI initialized successfully for document generation');
  } else {
    console.warn('⚠️ OPENAI_API_KEY not found - document generation will use fallback templates');
  }
} catch (error) {
  console.error('❌ Error initializing OpenAI for document generation:', error);
  openai = null;
}

export interface DocumentGenerationRequest {
  templateType: string;
  templateName: string;
  templateDescription: string;
  formData: Record<string, any>;
}

export interface DocumentGenerationResponse {
  success: boolean;
  document?: string;
  error?: string;
  warning?: string;
}

// Rate limit handler
class RateLimitHandler {
  private static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async handleRateLimit<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        if (error.status === 429 && attempt < maxRetries) {
          console.log(`Rate limit hit. Attempt ${attempt}/${maxRetries}`);
          
          const retryAfter = error.headers?.['retry-after-ms'] 
            ? parseInt(error.headers['retry-after-ms'])
            : Math.pow(2, attempt) * 1000;
          
          console.log(`Waiting ${retryAfter}ms before retry...`);
          await this.delay(retryAfter);
          continue;
        }
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }
}

export const generateProfessionalDocument = async (
  request: DocumentGenerationRequest
): Promise<DocumentGenerationResponse> => {
  try {
    console.log(`🤖 Starting document generation: ${request.templateName}`);
    console.log(`📊 Form data keys: ${Object.keys(request.formData).join(', ')}`);
    
    // DEBUG: Check if job responsibilities are in the form data
    if (request.formData.job_responsibilities) {
      console.log('📝 Job responsibilities found:', request.formData.job_responsibilities.substring(0, 100) + '...');
      console.log('📏 Job responsibilities length:', request.formData.job_responsibilities.length);
    } else {
      console.log('❌ Job responsibilities NOT found in form data');
      console.log('🔍 Available form data keys:', Object.keys(request.formData));
    }
    
    console.log(`🔑 OpenAI available: ${!!openai}`);
    console.log(`🔑 API Key exists: ${!!process.env.OPENAI_API_KEY}`);
    
    // Check if logo is included
    if (request.formData.company_logo) {
      console.log('🖼️ Logo detected in form data');
    }
    
    // FIXED: Better check for OpenAI availability
    if (openai && process.env.OPENAI_API_KEY) {
      try {
        console.log('🤖 Using OpenAI for professional document generation');
        const aiDocument = await generateAIEnhancedDocument(request);
        console.log('✅ AI document generated successfully');
        return {
          success: true,
          document: aiDocument
        };
      } catch (aiError: any) {
        console.warn('⚠️ AI generation failed, falling back to enhanced template:', aiError.message);
        return {
          success: true,
          document: generateEnhancedTemplate(request),
          warning: `AI generation failed: ${aiError.message} - using enhanced template`
        };
      }
    } else {
      console.log('📝 OpenAI not available, using enhanced template');
      console.log(`🔍 Debug - OpenAI instance: ${!!openai}, API Key: ${!!process.env.OPENAI_API_KEY}`);
      return {
        success: true,
        document: generateEnhancedTemplate(request),
        warning: 'OpenAI service unavailable - using enhanced template'
      };
    }
    
  } catch (error: any) {
    console.error('❌ Error generating document:', error);
    
    return {
      success: true,
      document: generateEnhancedTemplate(request),
      warning: `Error: ${error.message} - using fallback template`
    };
  }
};

// FIXED: Better error handling and logging in AI generation
const generateAIEnhancedDocument = async (request: DocumentGenerationRequest): Promise<string> => {
  try {
    const hasLogo = !!request.formData.company_logo;
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create a detailed system prompt based on the document type
    const systemPrompt = getSystemPromptForDocumentType(request.templateType, hasLogo);
    
    // Create the user prompt with all form data
    const userPrompt = createUserPrompt(request, today);

    console.log('🔄 Sending request to OpenAI...');
    console.log(`📏 System prompt length: ${systemPrompt.length}`);
    console.log(`📏 User prompt length: ${userPrompt.length}`);
    
    // FIXED: Better error handling with detailed logging
    const response = await RateLimitHandler.handleRateLimit(async () => {
      if (!openai) {
        throw new Error('OpenAI client not initialized');
      }
      
      return await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1, // Low temperature for consistent, professional output
        max_tokens: 2500, // Increased for longer documents
      });
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated by OpenAI');
    }

    console.log('✅ AI document generated successfully');
    console.log(`📄 Generated content length: ${content.length} characters`);
    return content;
    
  } catch (error: any) {
    console.error('❌ AI generation failed with error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type
    });
    throw error;
  }
};

// Get appropriate system prompt for each document type
const getSystemPromptForDocumentType = (templateType: string, hasLogo: boolean): string => {
  const logoInstruction = hasLogo 
    ? 'IMPORTANT: Start the document with [COMPANY LOGO PLACEHOLDER] at the very top where a company logo will be inserted.' 
    : '';

  const baseInstructions = `You are a professional legal document generator specializing in creating realistic, comprehensive business documents. 

${logoInstruction}

Create a document that looks and reads like it came from a real company's HR or legal department. Use professional language, proper formatting, and include all necessary legal clauses.

Requirements:
- Use professional, formal business language
- Include proper headers, sections, and formatting
- Add signature lines and date fields
- Include legal disclaimers where appropriate
- Make it comprehensive and realistic
- Use proper business letter format
- Include all standard clauses for this document type
- NEVER use placeholder text - always use the actual information provided`;

  switch (templateType) {
    case 'employment-agreement':
      return `${baseInstructions}

For Employment Agreements specifically:
- Start with company letterhead format
- Include a warm, welcoming tone while remaining professional
- Structure with clear sections: Position Details, Compensation, Benefits, Responsibilities, Terms & Conditions
- CRITICAL: Include the EXACT job responsibilities provided in detail - do not use placeholder text like "(Here list the job responsibilities)"
- If job responsibilities are provided, list them in a professional format with proper numbering or bullets
- Add comprehensive benefits information exactly as provided
- Include standard employment clauses (confidentiality, IP assignment, termination, etc.)
- End with acceptance signature section
- Use phrases like "We are delighted to extend an offer of employment"
- Include probation period details if specified
- Add governing law and dispute resolution clauses`;

    case 'service-agreement':
      return `${baseInstructions}

For Service Agreements specifically:
- Start with a professional contract header
- Include detailed scope of work and deliverables
- Add comprehensive payment terms and billing procedures
- Include IP ownership, confidentiality, and liability clauses
- Add termination and dispute resolution sections
- Use contract-style formatting with numbered sections`;

    case 'nda':
      return `${baseInstructions}

For Non-Disclosure Agreements specifically:
- Use formal legal contract language
- Include comprehensive definitions of confidential information
- Add detailed obligations and restrictions
- Include return of materials and non-solicitation if specified
- Add liquidated damages and injunctive relief clauses if requested`;

    default:
      return baseInstructions;
  }
};

// Create detailed user prompt with form data - FIXED TO HANDLE JOB RESPONSIBILITIES PROPERLY
const createUserPrompt = (request: DocumentGenerationRequest, today: string): string => {
  // FIXED: Better formatting for form data, especially multi-line text like job responsibilities
  const formDataForAI = Object.entries(request.formData)
    .filter(([key]) => key !== 'company_logo')
    .map(([key, value]) => {
      const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (typeof value === 'object' && value?.street) {
        // Address formatting
        return `${fieldName}: ${value.street}, ${value.city}, ${value.state} ${value.zip}, ${value.country}`;
      } else if (Array.isArray(value)) {
        // Array formatting  
        return `${fieldName}: ${value.join(', ')}`;
      } else if (typeof value === 'boolean') {
        return `${fieldName}: ${value ? 'Yes' : 'No'}`;
      } else if (key === 'job_responsibilities' && value) {
        // FIXED: Special handling for job responsibilities to preserve formatting
        return `${fieldName}:\n${value}`;
      } else if (typeof value === 'string' && value.includes('\n')) {
        // FIXED: Handle any multi-line text fields properly
        return `${fieldName}:\n${value}`;
      }
      return `${fieldName}: ${value || 'Not specified'}`;
    })
    .join('\n\n');

  return `Create a professional ${request.templateName} dated ${today} with the following information:

${formDataForAI}

IMPORTANT INSTRUCTIONS:
1. Use ALL the information provided above - do not use placeholder text
2. If job responsibilities are listed, include them in full detail in the RESPONSIBILITIES section
3. Format job responsibilities as a numbered list for clarity
4. Make the document comprehensive and professional
5. Include proper legal clauses and signature sections

Make this document look like it came from a real company's legal or HR department.`;
};

// Enhanced fallback template - FIXED TO HANDLE JOB RESPONSIBILITIES PROPERLY
const generateEnhancedTemplate = (request: DocumentGenerationRequest): string => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatAddress = (addr: any) => {
    if (!addr || typeof addr !== 'object') return '[Address]';
    return `${addr.street || '[Street]'}, ${addr.city || '[City]'}, ${addr.state || '[State]'} ${addr.zip || '[ZIP]'}, ${addr.country || '[Country]'}`;
  };

  // FIXED: Better formatting for multi-line text like job responsibilities
  const formatMultiLineText = (text: string, useNumbers: boolean = false): string => {
    if (!text) return '';
    
    // Handle both line breaks and manual numbering
    const lines = text
      .split(/\n|\\n/) // Handle both actual newlines and escaped newlines
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.trim());
    
    return lines
      .map((line: string, index: number) => {
        // Remove existing numbering if present
        const cleanLine = line.replace(/^\d+\.\s*/, '').replace(/^[•\-\*]\s*/, '');
        if (useNumbers) {
          return `${index + 1}. ${cleanLine}`;
        } else {
          return `• ${cleanLine}`;
        }
      })
      .join('\n');
  };

  const addLogoPlaceholder = (companyName: string = ''): string => {
    return request.formData.company_logo 
      ? `[COMPANY LOGO PLACEHOLDER]\n\n${companyName}\n`
      : `${companyName}\n`;
  };

  // Generate enhanced templates based on type
  switch (request.templateType) {
    case 'employment-agreement':
      const benefits = request.formData.benefits && Array.isArray(request.formData.benefits) 
        ? request.formData.benefits.join(', ')
        : 'Health insurance, paid time off, and other benefits as per company policy';

      // FIXED: Better handling of job responsibilities
      const jobResponsibilities = request.formData.job_responsibilities 
        ? formatMultiLineText(request.formData.job_responsibilities, true)
        : '1. Perform duties as assigned by supervisor\n2. Maintain professional standards\n3. Collaborate effectively with team members\n4. Complete projects within deadlines\n5. Participate in meetings and training as required';

      const companyName = request.formData.company_name || 'Company Name';

      return `${addLogoPlaceholder(companyName)}${formatAddress(request.formData.company_address)}
${request.formData.company_phone ? `Phone: ${request.formData.company_phone}` : ''}
${request.formData.company_email ? `Email: ${request.formData.company_email}` : ''}

${today}

EMPLOYMENT OFFER LETTER

Dear ${request.formData.employee_name || '[Employee Name]'},

We are delighted to extend an offer of employment for the position of ${request.formData.job_title || '[Job Title]'} in our ${request.formData.department || '[Department]'} department at ${companyName}. After careful consideration of your qualifications and experience, we believe you will be an excellent addition to our team.

EMPLOYMENT DETAILS

Position: ${request.formData.job_title || '[Job Title]'}
Department: ${request.formData.department || '[Department]'}
Reporting Manager: ${request.formData.reporting_manager || '[Manager Name]'}
Employment Type: ${request.formData.employment_type || 'Full-time'}
Start Date: ${request.formData.start_date || '[Start Date]'}
Work Schedule: ${request.formData.work_schedule || 'Monday to Friday, 9:00 AM - 5:00 PM'}

POSITION RESPONSIBILITIES

As ${request.formData.job_title || '[Job Title]'}, your key responsibilities will include:

${jobResponsibilities}

COMPENSATION PACKAGE

Annual Salary: $${request.formData.salary ? Number(request.formData.salary).toLocaleString() : '[Salary Amount]'}
Pay Frequency: ${request.formData.pay_frequency || 'Bi-weekly'}
${request.formData.overtime_eligible && request.formData.overtime_eligible !== 'Not applicable' 
  ? `Overtime Status: ${request.formData.overtime_eligible}`
  : 'Overtime Status: Exempt from overtime pay'}

BENEFITS AND TIME OFF

You will be eligible for our comprehensive benefits package, including:
${benefits}

Vacation Days: ${request.formData.vacation_days || '15'} days annually
Sick Days: ${request.formData.sick_days || '10'} days annually
Performance Reviews: ${request.formData.performance_review || 'Annually'}

${request.formData.probation_period && request.formData.probation_period !== 'None' 
  ? `PROBATIONARY PERIOD\n\nYour employment will include a probationary period of ${request.formData.probation_period}. During this time, either party may terminate employment with immediate notice.\n\n`
  : ''}EMPLOYMENT TERMS AND CONDITIONS

${request.formData.confidentiality_agreement 
  ? '• You will be required to sign and comply with our confidentiality agreement.\n'
  : ''}${request.formData.non_compete && request.formData.non_compete_duration
  ? `• You agree to a non-compete restriction for ${request.formData.non_compete_duration} following termination.\n`
  : ''}${request.formData.intellectual_property 
  ? '• All intellectual property created during your employment belongs to the company.\n'
  : ''}

TERMINATION

Either party may terminate this employment relationship with ${request.formData.termination_notice || '30 days'} written notice.

GOVERNING LAW

This employment agreement is governed by the laws of ${request.formData.governing_law || '[State/Country]'}.

We are excited about the prospect of you joining our team and contributing to ${companyName}'s continued success. Please sign and return this letter to confirm your acceptance.

Welcome to the team!

Sincerely,

[Hiring Manager Name]
[Title]
${companyName}

---

ACCEPTANCE OF EMPLOYMENT OFFER

I, ${request.formData.employee_name || '[Employee Name]'}, hereby accept the terms and conditions of employment as outlined in this letter.

Employee Signature: _________________________    Date: _________

Print Name: ${request.formData.employee_name || '[Employee Name]'}`;

    // Add other document types here with similar enhanced templates...
    
    default:
      return `${request.templateName.toUpperCase()}

${today}

This document serves as a ${request.templateName.toLowerCase()} between the parties listed below.

${Object.entries(request.formData).map(([key, value]) => {
        if (key === 'company_logo') return '';
        if (typeof value === 'object' && value?.street) {
          return `${key.replace(/_/g, ' ').toUpperCase()}: ${formatAddress(value)}`;
        }
        return `${key.replace(/_/g, ' ').toUpperCase()}: ${value || 'Not specified'}`;
      }).filter(Boolean).join('\n\n')}

The parties agree to the terms and conditions as outlined in this document.

SIGNATURES

Party 1: _________________________    Date: _________

Party 2: _________________________    Date: _________`;
  }
};

export default {
  generateProfessionalDocument
};