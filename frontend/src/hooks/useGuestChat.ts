// src/hooks/useGuestChat.ts - FIXED to properly handle guest document IDs
import { useState, useCallback } from 'react';

export interface GuestMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface GuestDocument {
  id: string;
  name: string;
  content: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://legal-chat-ai.onrender.com';

export const useGuestChat = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async ({ message }: { message: string }) => {
    setIsLoading(true);
    setError(null);

    // Add user message first
    const userMessage: GuestMessage = {
      id: `user-${Date.now()}`,
      text: message,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get guest documents from session storage
      const storedDocs = sessionStorage.getItem('guestDocuments');
      let documents: GuestDocument[] = [];
      
      if (storedDocs) {
        try {
          documents = JSON.parse(storedDocs);
        } catch (e) {
          console.warn('Could not parse guest documents');
        }
      }

      console.log('🔍 Found guest documents:', documents.length);
      if (documents.length > 0) {
        console.log('📋 Guest document IDs:', documents.map(doc => doc.id));
        console.log('📋 Guest document names:', documents.map(doc => doc.name));
      }

      // FIXED: Prepare document context with proper IDs and full structure
      const documentContext = documents.map(doc => ({
        id: doc.id,           // CRITICAL: Include the actual document ID
        name: doc.name,
        content: doc.content.substring(0, 2000), // Limit content for free users
        type: doc.type,
        size: doc.size,
        uploadedAt: typeof doc.uploadedAt === 'string' ? doc.uploadedAt : doc.uploadedAt.toISOString()
      }));

      // Send message to the backend without authentication
      console.log('📤 Sending guest message to chat API with document context');
      console.log('📋 Sending document IDs:', documentContext.map(doc => doc.id));
      
      const response = await fetch(`${API_BASE_URL}/api/chat/guest`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          documents: documentContext // Send full document context with IDs
        }),
      });

      console.log('📡 Guest chat response status:', response.status);

      if (!response.ok) {
        // If guest endpoint doesn't exist, fallback to main chat endpoint
        if (response.status === 404) {
          console.log('📡 Guest endpoint not found, trying main chat endpoint');
          const fallbackResponse = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              message,
              documentIds: [] // Empty for guest users
            }),
          });

          if (!fallbackResponse.ok) {
            throw new Error(`Chat request failed: ${fallbackResponse.status}`);
          }

          const fallbackData = await fallbackResponse.json();
          
          // Add AI response
          const aiMessage: GuestMessage = {
            id: `ai-${Date.now()}`,
            text: fallbackData.response || generateGuestFallbackResponse(message, documents),
            isUser: false,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
          return;
        }
        
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Guest chat response received');
      
      // Add AI response
      const aiMessage: GuestMessage = {
        id: `ai-${Date.now()}`,
        text: data.response || 'Sorry, I could not process your request.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);

      console.log('✅ Guest chat message exchange completed successfully');

    } catch (err) {
      console.error('❌ Error sending guest chat message:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      
      // Provide fallback response for guest users
      const storedDocs = sessionStorage.getItem('guestDocuments');
      let docs: GuestDocument[] = [];
      try {
        docs = storedDocs ? JSON.parse(storedDocs) : [];
      } catch (e) {
        docs = [];
      }
      
      const fallbackResponse: GuestMessage = {
        id: `ai-${Date.now()}`,
        text: generateGuestFallbackResponse(message, docs),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // FIXED: Add function to properly store guest documents
  const addGuestDocument = useCallback((document: GuestDocument) => {
    try {
      const storedDocs = sessionStorage.getItem('guestDocuments');
      let documents: GuestDocument[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      // Add new document
      documents.push(document);
      
      // Store back to session storage
      sessionStorage.setItem('guestDocuments', JSON.stringify(documents));
      
      console.log('✅ Guest document added to session storage:', document.id);
    } catch (error) {
      console.error('❌ Error storing guest document:', error);
    }
  }, []);

  // FIXED: Add function to get current guest documents
  const getGuestDocuments = useCallback((): GuestDocument[] => {
    try {
      const storedDocs = sessionStorage.getItem('guestDocuments');
      return storedDocs ? JSON.parse(storedDocs) : [];
    } catch (error) {
      console.error('❌ Error getting guest documents:', error);
      return [];
    }
  }, []);

  // Return interface compatible with existing components
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    addGuestDocument,
    getGuestDocuments,
    isAuthenticated: false // Always false for guest users
  };
};

// Fallback response when AI service is unavailable for guests
const generateGuestFallbackResponse = (message: string, documents: GuestDocument[]): string => {
  const docNames = documents.map(doc => doc.name).join(', ');
  
  // Simple keyword-based responses for common legal questions
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
    return `I can see you're asking about payment terms. ${documents.length > 0 
      ? `Based on your uploaded documents (${docNames}), I would normally analyze the payment clauses for you.` 
      : 'Please upload your contract documents first so I can analyze the payment terms.'
    } 

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for full AI analysis.

**Free Legal Document Analysis**: Upload your contracts and get instant AI insights about payment terms, liability clauses, and more!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }
  
  if (lowerMessage.includes('risk') || lowerMessage.includes('liability')) {
    return `You're asking about risks and liability. ${documents.length > 0 
      ? `I can see you have ${documents.length} document(s) uploaded (${docNames}). Normally, I would analyze these for potential risks and liability clauses.` 
      : 'Upload your legal documents first so I can perform a comprehensive risk analysis.'
    }

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for detailed risk assessment.

**Free Risk Analysis**: Our AI typically identifies liability caps, indemnification clauses, and potential legal risks instantly!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }
  
  if (lowerMessage.includes('termination') || lowerMessage.includes('end') || lowerMessage.includes('cancel')) {
    return `You're asking about termination provisions. ${documents.length > 0 
      ? `With your uploaded documents (${docNames}), I would typically analyze termination clauses, notice periods, and cancellation terms.` 
      : 'Please upload your contract so I can analyze the termination and cancellation provisions.'
    }

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for full termination analysis.

**Free Contract Analysis**: Get instant insights about termination clauses, notice requirements, and exit provisions!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }
  
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    return `You want a summary of your documents. ${documents.length > 0 
      ? `I can see you have ${documents.length} document(s) uploaded (${docNames}). Our AI would normally provide a comprehensive summary highlighting key terms, obligations, and important clauses.` 
      : 'Upload your legal documents first so I can provide a detailed summary.'
    }

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for an AI-generated summary.

**Free Document Summaries**: Our AI creates easy-to-understand summaries of complex legal documents in seconds!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }

  if (lowerMessage.includes('clause') || lowerMessage.includes('term')) {
    return `You're asking about specific clauses or terms. ${documents.length > 0 
      ? `I can see you have ${documents.length} document(s) uploaded (${docNames}). Our AI would normally analyze these documents to identify and explain specific clauses and terms.` 
      : 'Upload your legal documents first so I can analyze specific clauses and terms for you.'
    }

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for detailed clause analysis.

**Free Clause Analysis**: Our AI can identify and explain complex legal clauses in plain English!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }

  if (lowerMessage.includes('compliance') || lowerMessage.includes('legal') || lowerMessage.includes('law')) {
    return `You're asking about legal compliance or legal matters. ${documents.length > 0 
      ? `Based on your uploaded documents (${docNames}), our AI would normally check for compliance issues and legal considerations.` 
      : 'Upload your legal documents first so I can help with compliance and legal analysis.'
    }

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for full legal analysis.

**Free Legal Analysis**: Our AI can help identify compliance issues and legal considerations in your documents!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }

  if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
    return `You're asking about contracts or agreements. ${documents.length > 0 
      ? `I can see you have contract documents uploaded (${docNames}). Our AI would normally provide comprehensive contract analysis including key terms, obligations, and potential issues.` 
      : 'Upload your contract or agreement documents first so I can provide detailed analysis.'
    }

**Note**: This is a fallback response. Our AI service is temporarily unavailable. Please try again in a moment for full contract analysis.

**Free Contract Analysis**: Our AI specializes in analyzing contracts, agreements, NDAs, and other legal documents!

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
  }
  
  // Generic response for any other questions
  return `Hello! I'm your free Legal Document AI Assistant. 

You asked: "${message}"

${documents.length > 0 
    ? `I can see you've uploaded ${documents.length} document(s): ${docNames}. Unfortunately, I'm temporarily unable to provide detailed AI analysis due to a service issue.` 
    : `I don't see any documents uploaded yet. Please upload your legal documents first for AI analysis.`
}

**What I can normally help with:**
• Contract analysis and risk assessment
• Payment terms and liability clauses
• Termination and cancellation provisions
• Legal document summaries in plain English
• Compliance and regulatory insights
• Clause identification and explanation
• Legal terminology explanations

**How to get started:**
1. Upload your legal documents (contracts, NDAs, agreements, etc.)
2. Ask specific questions about your documents
3. Get instant AI analysis and insights

**Note**: This is a fallback response. Please try again in a moment for full AI-powered legal analysis.

**💡 Tip**: For unlimited document analysis, permanent storage, and premium features, consider creating a free account!

**✨ Free Guest Analysis**: You're using our free guest mode! No signup required.

**⚖️ Legal Disclaimer**: This information is for educational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.`;
};

export default useGuestChat;