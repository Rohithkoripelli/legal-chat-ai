import { connectDB } from '../lib/utils/database';
import Document from '../lib/models/Document';
import { extractTextFromDocument, validateDocumentType } from '../lib/services/documentService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
    await connectDB();
    console.log('📂 Documents API called:', req.method, req.url);

    if (req.method === 'GET' && req.url.includes('/test')) {
      const documents = await Document.find().sort({ uploadedAt: -1 });
      
      const testResponse = documents.map(doc => ({
        id: doc._id.toString(),
        name: doc.originalName || doc.name,
        size: doc.size,
        type: doc.type,
        uploadedAt: doc.uploadedAt
      }));
      
      return res.status(200).json({
        message: 'Documents API working!',
        count: testResponse.length,
        documents: testResponse
      });
    }

    if (req.method === 'GET') {
      const documents = await Document.find()
        .select('-content -path')
        .sort({ uploadedAt: -1 });

      const responseData = documents.map(doc => ({
        id: doc._id.toString(),
        name: doc.originalName,
        size: doc.size,
        type: doc.type,
        uploadedAt: doc.uploadedAt
      }));

      return res.status(200).json(responseData);
    }

    if (req.method === 'POST') {
      const { fileName, fileContent, fileType } = req.body;
      
      if (!fileName || !fileContent) {
        return res.status(400).json({ error: 'File name and content are required' });
      }

      if (fileType && !validateDocumentType(fileType)) {
        return res.status(400).json({ 
          error: 'Invalid file type. Supported: PDF, Word, Text, RTF files' 
        });
      }

      console.log(`📄 Processing upload: ${fileName} (${fileType})`);

      try {
        const textContent = extractTextFromDocument(fileName, fileContent);

        const document = new Document({
          name: fileName,
          originalName: fileName,
          size: Buffer.byteLength(fileContent, 'base64'),
          type: fileType || 'application/octet-stream',
          path: `/uploads/${Date.now()}-${fileName}`,
          content: textContent,
          uploadedAt: new Date()
        });

        const savedDocument = await document.save();
        console.log('�� Document saved:', savedDocument._id);

        return res.status(201).json({
          id: savedDocument._id.toString(),
          name: savedDocument.originalName,
          size: savedDocument.size,
          type: savedDocument.type,
          uploadedAt: savedDocument.uploadedAt
        });

      } catch (extractError) {
        console.error('Text extraction error:', extractError);
        
        const document = new Document({
          name: fileName,
          originalName: fileName,
          size: Buffer.byteLength(fileContent, 'base64'),
          type: fileType || 'application/octet-stream',
          path: `/uploads/${Date.now()}-${fileName}`,
          content: `Document uploaded: ${fileName}. Text extraction failed but file is stored.`,
          uploadedAt: new Date()
        });

        const savedDocument = await document.save();

        return res.status(201).json({
          id: savedDocument._id.toString(),
          name: savedDocument.originalName,
          size: savedDocument.size,
          type: savedDocument.type,
          uploadedAt: savedDocument.uploadedAt,
          warning: 'Document uploaded but text extraction failed'
        });
      }
    }

    if (req.method === 'DELETE') {
      const urlParts = req.url.split('/');
      const documentId = urlParts[urlParts.length - 1];
      
      if (!documentId || documentId === 'undefined') {
        return res.status(400).json({ error: 'Document ID is required' });
      }

      const document = await Document.findById(documentId);
      
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      await Document.findByIdAndDelete(documentId);
      console.log('🗑️ Document deleted:', documentId);

      return res.status(200).json({ 
        message: 'Document deleted successfully',
        deletedId: documentId 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('❌ Error in documents API:', error);
    return res.status(500).json({ 
      error: 'Document operation failed',
      details: error.message 
    });
  }
}
