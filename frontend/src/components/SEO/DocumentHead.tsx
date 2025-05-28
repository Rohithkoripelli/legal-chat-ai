import { useEffect } from 'react';

interface DocumentHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  verification?: string;
}

export const DocumentHead: React.FC<DocumentHeadProps> = ({
  title = "LegalChatAI - Free AI Legal Document Analysis & Chat Platform",
  description = "Upload legal documents and chat with AI for instant analysis. Get contract insights, clause explanations, and legal guidance powered by advanced AI technology. Free to use.",
  keywords = "legal AI, legal chat ai, contract analysis, document review, AI lawyer, legal assistant, free legal analysis",
  canonical = "https://legalchatai.com",
  image = "https://legalchatai.com/og-image.jpg",
  verification
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large');
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'LegalChatAI', true);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Update canonical URL
    updateLinkTag('canonical', canonical);

    // Add Google verification if provided
    if (verification) {
      updateMetaTag('google-site-verification', verification);
    }

    // Add structured data
    const addStructuredData = () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "LegalChatAI",
        "description": "AI-powered legal document analysis and chat platform",
        "url": "https://legalchatai.com",
        "applicationCategory": "LegalTech",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "provider": {
          "@type": "Organization",
          "name": "LegalChatAI",
          "url": "https://legalchatai.com"
        },
        "featureList": [
          "AI Document Analysis",
          "Legal Contract Review", 
          "Interactive Legal Chat",
          "Risk Assessment",
          "Clause Identification"
        ]
      });
      document.head.appendChild(script);
    };

    addStructuredData();

  }, [title, description, keywords, canonical, image, verification]);

  return null; // This component doesn't render anything
};
