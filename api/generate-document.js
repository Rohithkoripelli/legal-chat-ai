import { generateProfessionalDocument } from '../lib/services/documentGenerationService';

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
    console.log('📄 Document Generation API called:', req.method, req.url);

    // Health check
    if (req.method === 'GET' && req.url === '/api/generate-document/health') {
      let openaiStatus = 'not configured';
      if (process.env.OPENAI_API_KEY) {
        openaiStatus = 'configured';
      }

      const healthInfo = {
        status: 'healthy',
        service: 'Document Generation API',
        timestamp: new Date().toISOString(),
        openai: {
          status: openaiStatus,
          keyPresent: !!process.env.OPENAI_API_KEY
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

      return res.status(200).json(healthInfo);
    }

    // Get supported document types
    if (req.method === 'GET' && req.url === '/api/generate-document/types') {
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
          type: 'rental-agreement',
          name: 'Rental Agreement',
          description: 'Property rental and lease agreements',
          category: 'real-estate'
        }
      ];

      return res.status(200).json({
        success: true,
        count: supportedTypes.length,
        types: supportedTypes,
        timestamp: new Date().toISOString()
      });
    }

    // Generate document
    if (req.method === 'POST') {
      console.log('Request body keys:', Object.keys(req.body));
      
      const { templateType, templateName, templateDescription, formData } = req.body;

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

      const documentRequest = {
        templateType,
        templateName,
        templateDescription: templateDescription || `Professional ${templateName}`,
        formData
      };

      console.log('🤖 Calling AI-powered document generation service...');
      
      const result = await generateProfessionalDocument(documentRequest);
      
      if (result.success) {
        console.log('✅ Document generated successfully');
        
        return res.status(200).json({
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
        return res.status(500).json({
          success: false,
          error: result.error || 'Document generation failed'
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Error in document generation:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during document generation',
      details: error.message
    });
  }
}
