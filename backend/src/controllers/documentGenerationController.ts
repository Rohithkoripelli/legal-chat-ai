import { Request, Response } from 'express';
import { generateProfessionalDocument, DocumentGenerationRequest } from '../services/documentGenerationService';

export const generateDocument = async (req: Request, res: Response) => {
  try {
    console.log('\n======== DOCUMENT GENERATION CONTROLLER ========');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Template type:', req.body.templateType);
    console.log('Template name:', req.body.templateName);
    
    const { templateType, templateName, templateDescription, formData } = req.body;

    // Validate required fields
    if (!templateType || !templateName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: templateType and templateName'
      });
    }

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No form data provided'
      });
    }

    // Create document request
    const documentRequest: DocumentGenerationRequest = {
      templateType,
      templateName,
      templateDescription: templateDescription || `Professional ${templateName}`,
      formData
    };

    console.log('🤖 Calling AI-powered document generation service...');
    
    // Generate the document using AI
    const result = await generateProfessionalDocument(documentRequest);
    
    if (result.success) {
      console.log('✅ Document generated successfully');
      console.log('Document length:', result.document?.length || 0, 'characters');
      
      if (result.warning) {
        console.log('⚠️ Warning:', result.warning);
      }
      
      res.json({
        success: true,
        document: result.document,
        warning: result.warning,
        metadata: {
          templateType,
          templateName,
          generatedAt: new Date().toISOString(),
          documentLength: result.document?.length || 0
        }
      });
    } else {
      console.log('❌ Document generation failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error || 'Document generation failed'
      });
    }
  } catch (error) {
    console.error('❌ Error in document generation controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during document generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDocumentHealth = async (req: Request, res: Response) => {
  try {
    console.log('🏥 Document generation health check requested');
    
    // Check OpenAI configuration
    let openaiStatus = 'not configured';
    if (process.env.OPENAI_API_KEY) {
      openaiStatus = 'configured';
    }

    // Check service availability
    let serviceStatus = 'available';
    try {
      const { generateProfessionalDocument } = await import('../services/documentGenerationService');
      if (typeof generateProfessionalDocument !== 'function') {
        serviceStatus = 'unavailable';
      }
    } catch (error) {
      serviceStatus = 'error';
    }

    const healthInfo = {
      status: 'healthy',
      service: 'Document Generation API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      openai: {
        status: openaiStatus,
        keyPresent: !!process.env.OPENAI_API_KEY
      },
      documentService: {
        status: serviceStatus
      },
      supportedTypes: [
        'contract',
        'nda',
        'employment-agreement',
        'consulting-agreement',
        'lease-agreement',
        'partnership-agreement',
        'rental-agreement',
        'purchase-agreement'
      ],
      features: {
        logoSupport: true,
        multipleFormats: true,
        professionalTemplates: true,
        dynamicContent: true,
        aiPowered: openaiStatus === 'configured'
      }
    };

    console.log('✅ Health check completed:', healthInfo.status);
    res.json(healthInfo);
  } catch (error) {
    console.error('❌ Error in document health check:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getTemplateInfo = async (req: Request, res: Response) => {
  try {
    const { templateType } = req.params;
    console.log('📋 Getting template info for:', templateType);

    const templateInfoMap: Record<string, any> = {
      'contract': {
        name: 'Service Contract',
        description: 'Professional service agreements and contracts',
        fields: [
          { name: 'clientName', label: 'Client Name', type: 'text', required: true },
          { name: 'providerName', label: 'Service Provider Name', type: 'text', required: true },
          { name: 'serviceDescription', label: 'Service Description', type: 'textarea', required: true },
          { name: 'totalAmount', label: 'Total Amount', type: 'text', required: true },
          { name: 'startDate', label: 'Start Date', type: 'date', required: true },
          { name: 'endDate', label: 'End Date', type: 'date', required: false }
        ]
      },
      'nda': {
        name: 'Non-Disclosure Agreement',
        description: 'Confidentiality and non-disclosure agreements',
        fields: [
          { name: 'disclosingParty', label: 'Disclosing Party', type: 'text', required: true },
          { name: 'receivingParty', label: 'Receiving Party', type: 'text', required: true },
          { name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true },
          { name: 'termLength', label: 'Term Length (years)', type: 'number', required: true }
        ]
      },
      'employment-agreement': {
        name: 'Employment Agreement',
        description: 'Employment contracts and agreements',
        fields: [
          { name: 'employerName', label: 'Employer Name', type: 'text', required: true },
          { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
          { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
          { name: 'baseSalary', label: 'Base Salary', type: 'text', required: true },
          { name: 'startDate', label: 'Start Date', type: 'date', required: true }
        ]
      }
    };

    const templateInfo = templateInfoMap[templateType];
    
    if (!templateInfo) {
      return res.status(404).json({
        success: false,
        error: 'Template type not found'
      });
    }

    res.json({
      success: true,
      templateType,
      ...templateInfo
    });
  } catch (error) {
    console.error('❌ Error getting template info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get template info',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add the missing healthCheck function (alias for getDocumentHealth)
export const healthCheck = getDocumentHealth;

// Add the missing getSupportedDocumentTypes function
export const getSupportedDocumentTypes = async (req: Request, res: Response) => {
  try {
    console.log('📋 Getting supported document types...');
    
    const supportedTypes = [
      {
        type: 'contract',
        name: 'Service Contract',
        description: 'Professional service agreements and contracts',
        category: 'business'
      },
      {
        type: 'nda',
        name: 'Non-Disclosure Agreement',
        description: 'Confidentiality and non-disclosure agreements',
        category: 'legal'
      },
      {
        type: 'employment-agreement',
        name: 'Employment Agreement',
        description: 'Employment contracts and agreements',
        category: 'hr'
      },
      {
        type: 'consulting-agreement',
        name: 'Consulting Agreement',
        description: 'Independent contractor and consulting agreements',
        category: 'business'
      },
      {
        type: 'lease-agreement',
        name: 'Lease Agreement',
        description: 'Property rental and lease agreements',
        category: 'real-estate'
      },
      {
        type: 'partnership-agreement',
        name: 'Partnership Agreement',
        description: 'Business partnership agreements',
        category: 'business'
      }
    ];

    console.log(`✅ Returning ${supportedTypes.length} supported document types`);

    res.json({
      success: true,
      count: supportedTypes.length,
      types: supportedTypes,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Error getting supported types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get supported document types',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Export default object with all functions
export default {
  generateDocument,
  getDocumentHealth,
  getTemplateInfo,
  healthCheck,
  getSupportedDocumentTypes
};