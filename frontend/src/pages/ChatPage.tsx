// src/pages/ChatPage.tsx - Updated to work for both guests and authenticated users
import React from 'react';
import ModernChatInterface from '../components/chat/ModernChatInterface';
import ModernGuestChatInterface from '../components/chat/ModernGuestChatInterface';
import { useAuth } from '@clerk/clerk-react';
import { DocumentHead } from '../components/SEO/DocumentHead';

const ChatPage: React.FC = () => {
  const { isSignedIn } = useAuth();

  // For signed-in users, use the authenticated chat interface
  if (isSignedIn) {
    return (
      <>
        <DocumentHead
          title="AI Legal Chat Assistant | Personal Legal AI | LegalChatAI"
          description="Personal AI legal assistant with chat history, unlimited document uploads, and advanced analysis features. Your conversations are saved and secure."
          keywords="personal legal AI, legal chat history, AI legal assistant, legal conversation history, personal AI lawyer"
          canonical="https://www.legalchatai.com/chat"
          jsonLD={{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Personal AI Legal Chat Assistant",
            "description": "Personal AI-powered legal consultation with chat history and unlimited uploads",
            "url": "https://www.legalchatai.com/chat",
            "about": {
              "@type": "Service",
              "name": "Personal AI Legal Chat Assistant",
              "description": "Personal AI-powered legal consultation with advanced features",
              "provider": {
                "@type": "Organization",
                "name": "LegalChatAI",
                "url": "https://www.legalchatai.com"
              },
              "serviceType": "Personal Legal AI Consultation",
              "audience": {
                "@type": "Audience",
                "audienceType": ["Legal Professionals", "Business Owners", "Individuals"]
              }
            }
          }}
        />
        <div className="h-screen overflow-hidden">
          <ModernChatInterface />
        </div>
      </>
    );
  }

  // For guest users, use the modern guest chat interface
  return (
    <>
      <DocumentHead
        title="AI Legal Chat Assistant | Free Legal AI Consultation | LegalChatAI"
        description="Chat with AI for instant legal document analysis and consultation. Get immediate answers to legal questions, contract reviews, and legal guidance. Free to use."
        keywords="legal AI chat, AI legal consultation, legal chat assistant, AI lawyer chat, legal questions AI, contract chat AI"
        canonical="https://www.legalchatai.com/chat"
        jsonLD={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "AI Legal Chat Assistant",
          "description": "Free AI-powered legal consultation and chat service",
          "url": "https://www.legalchatai.com/chat",
          "about": {
            "@type": "Service",
            "name": "AI Legal Chat Assistant",
            "description": "Free AI-powered legal consultation and chat service",
            "provider": {
              "@type": "Organization",
              "name": "LegalChatAI",
              "url": "https://www.legalchatai.com"
            },
            "serviceType": "Legal AI Consultation",
            "audience": {
              "@type": "Audience",
              "audienceType": ["Legal Professionals", "Business Owners", "Individuals"]
            }
          }
        }}
      />
      <div className="h-screen overflow-hidden">
        <ModernGuestChatInterface />
      </div>
    </>
  );
};

export default ChatPage;