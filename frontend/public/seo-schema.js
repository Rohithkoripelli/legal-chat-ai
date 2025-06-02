// public/seo-schema.js
// Dynamic SEO and Schema Markup for LegalChatAI
(function() {
    'use strict';
    
    // Schema configurations for different pages
    const pageConfigs = {
      '/chat': {
        title: 'Legal Chat AI - Free AI Legal Document Analysis & Chat Assistant | LegalChatAI',
        description: 'Chat with AI for instant legal document analysis. Upload contracts, NDAs, agreements and get AI insights, risk assessment, and clause explanations. Free legal AI chat with no signup required.',
        keywords: 'legal chat ai, ai legal assistant, legal document analysis, contract analysis ai, legal ai chat, document review ai, free legal chat, ai legal consultation',
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "Legal Chat AI Assistant - Free AI Legal Document Analysis",
              "description": "Interactive AI chat for legal document analysis, contract review, and legal questions. Upload documents and get instant AI insights, risk assessment, and clause explanations.",
              "url": "https://legalchatai.com/chat",
              "applicationCategory": "LegalTechnology",
              "operatingSystem": "Web Browser",
              "browserRequirements": "Requires JavaScript",
              "isPartOf": {
                "@type": "SoftwareApplication",
                "name": "LegalChatAI",
                "url": "https://legalchatai.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free AI legal chat and document analysis with unlimited usage",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Legal Document Upload and Analysis",
                "AI Legal Chat Assistant",
                "Contract Risk Assessment",
                "Real-time Legal Document Review",
                "Document Question Answering",
                "Clause Identification and Explanation",
                "Legal Language Translation",
                "Risk Scoring and Analysis"
              ],
              "keywords": "legal chat ai, ai legal assistant, legal document analysis, contract analysis ai, legal ai chat, document review ai",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "189",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Person",
                "name": "Rohith Koripelli",
                "email": "reddyrohith705@gmail.com"
              }
            },
            {
              "@type": "Service",
              "name": "AI Legal Chat Consultation Service",
              "description": "Free AI-powered legal document analysis and chat consultation service. Get instant answers about your legal documents, contracts, and agreements.",
              "provider": {
                "@type": "Organization",
                "name": "LegalChatAI",
                "url": "https://legalchatai.com"
              },
              "serviceType": "Legal AI Consultation",
              "category": [
                "Legal Document Analysis",
                "AI Legal Chat",
                "Contract Review",
                "Legal AI Assistant",
                "Document Risk Assessment"
              ],
              "areaServed": "Worldwide",
              "availableChannel": {
                "@type": "ServiceChannel",
                "serviceUrl": "https://legalchatai.com/chat",
                "serviceType": "Online Chat Service"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free unlimited AI legal chat and document analysis"
              }
            },
            {
              "@type": "HowTo",
              "name": "How to Use Legal Chat AI for Document Analysis",
              "description": "Step-by-step guide to analyzing legal documents using AI chat assistant",
              "totalTime": "PT2M",
              "supply": [
                {
                  "@type": "HowToSupply",
                  "name": "Legal Document (PDF, Word, or Text)"
                }
              ],
              "tool": [
                {
                  "@type": "HowToTool",
                  "name": "LegalChatAI Platform"
                }
              ],
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Upload Your Legal Document",
                  "text": "Upload your contract, NDA, or legal document in PDF, Word, or text format to the AI chat interface.",
                  "url": "https://legalchatai.com/chat#upload"
                },
                {
                  "@type": "HowToStep",
                  "name": "Ask Questions About Your Document",
                  "text": "Use the AI chat to ask specific questions about clauses, terms, risks, or any part of your legal document.",
                  "url": "https://legalchatai.com/chat#questions"
                },
                {
                  "@type": "HowToStep",
                  "name": "Get Instant AI Analysis",
                  "text": "Receive immediate AI analysis including risk assessment, clause explanations, and recommendations in plain English.",
                  "url": "https://legalchatai.com/chat#analysis"
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How accurate is legal chat AI analysis?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our legal chat AI achieves 95%+ accuracy in identifying key contract terms, risks, and compliance issues. However, AI analysis should complement, not replace, professional legal review."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What legal documents can I analyze with AI chat?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can analyze contracts, NDAs, employment agreements, service agreements, lease agreements, purchase agreements, terms of service, privacy policies, and most legal documents."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How fast is AI legal document analysis?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Legal chat AI provides instant analysis within seconds of uploading your document. Complex documents may take up to 30 seconds for comprehensive review."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is legal chat AI free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, our legal chat AI is completely free with no hidden fees, subscription costs, or usage limits. No signup required."
                  }
                }
              ]
            }
          ]
        }
      },
      
      '/create-document': {
        title: 'AI Legal Document Generator - Free Contract Creator & NDA Generator | LegalChatAI',
        description: 'Free AI legal document generator for contracts, NDAs, service agreements, employment contracts. Professional templates with AI customization. Download in PDF/Word format instantly.',
        keywords: 'ai legal document generator, contract generator ai, nda generator, service agreement generator, legal document creator, ai contract templates, free legal templates, employment contract generator',
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              "name": "AI Legal Document Generator - Free Contract & Agreement Creator",
              "description": "Free AI-powered legal document generator for contracts, NDAs, service agreements, employment contracts, and more. Professional templates with AI customization.",
              "url": "https://legalchatai.com/create-document",
              "applicationCategory": "LegalTechnology",
              "operatingSystem": "Web Browser",
              "isPartOf": {
                "@type": "SoftwareApplication",
                "name": "LegalChatAI",
                "url": "https://legalchatai.com"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free AI legal document generation with unlimited downloads",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "AI Legal Document Generation",
                "Contract Template Creator",
                "NDA Generator with AI",
                "Service Agreement Generator",
                "Employment Contract Creator",
                "Rental Agreement Generator",
                "Custom Legal Document Templates",
                "PDF and Word Download"
              ],
              "keywords": "ai legal document generator, contract generator ai, nda generator, service agreement generator, legal document creator, ai contract templates",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "156",
                "bestRating": "5",
                "worstRating": "1"
              },
              "author": {
                "@type": "Person",
                "name": "Rohith Koripelli",
                "email": "reddyrohith705@gmail.com"
              }
            },
            {
              "@type": "Product",
              "name": "AI Legal Document Templates Collection",
              "description": "Professional legal document templates generated by AI including contracts, NDAs, service agreements, employment contracts, and rental agreements",
              "category": "Legal Document Templates",
              "brand": {
                "@type": "Brand",
                "name": "LegalChatAI"
              },
              "manufacturer": {
                "@type": "Organization",
                "name": "LegalChatAI"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": "https://legalchatai.com/create-document"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "156"
              }
            },
            {
              "@type": "ItemList",
              "name": "AI Legal Document Templates",
              "description": "Collection of AI-generated legal document templates for various business and personal needs",
              "numberOfItems": 5,
              "itemListElement": [
                {
                  "@type": "CreativeWork",
                  "position": 1,
                  "name": "AI Service Agreement Generator",
                  "description": "Professional service agreement template with AI-powered customization for freelancers and businesses",
                  "url": "https://legalchatai.com/create-document#service-agreement",
                  "creator": {
                    "@type": "Organization",
                    "name": "LegalChatAI"
                  },
                  "keywords": "service agreement generator, ai contract creator, freelance contract template"
                },
                {
                  "@type": "CreativeWork",
                  "position": 2,
                  "name": "AI NDA Generator",
                  "description": "Non-disclosure agreement template with customizable terms and AI-powered legal language",
                  "url": "https://legalchatai.com/create-document#nda",
                  "creator": {
                    "@type": "Organization",
                    "name": "LegalChatAI"
                  },
                  "keywords": "nda generator, non disclosure agreement template, confidentiality agreement ai"
                },
                {
                  "@type": "CreativeWork",
                  "position": 3,
                  "name": "AI Employment Agreement Creator",
                  "description": "Comprehensive employment contract template with AI customization for HR departments",
                  "url": "https://legalchatai.com/create-document#employment",
                  "creator": {
                    "@type": "Organization",
                    "name": "LegalChatAI"
                  },
                  "keywords": "employment contract generator, job agreement template, hr contract ai"
                },
                {
                  "@type": "CreativeWork",
                  "position": 4,
                  "name": "AI Rental Agreement Generator",
                  "description": "Residential and commercial rental agreement template with AI-powered customization",
                  "url": "https://legalchatai.com/create-document#rental",
                  "creator": {
                    "@type": "Organization",
                    "name": "LegalChatAI"
                  },
                  "keywords": "rental agreement generator, lease contract template, property agreement ai"
                },
                {
                  "@type": "CreativeWork",
                  "position": 5,
                  "name": "AI Purchase Agreement Creator",
                  "description": "Goods and services purchase agreement template with customizable terms",
                  "url": "https://legalchatai.com/create-document#purchase",
                  "creator": {
                    "@type": "Organization",
                    "name": "LegalChatAI"
                  },
                  "keywords": "purchase agreement generator, sales contract template, business agreement ai"
                }
              ]
            },
            {
              "@type": "HowTo",
              "name": "How to Generate Legal Documents with AI",
              "description": "Complete guide to creating professional legal documents using AI generator",
              "totalTime": "PT5M",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Choose Document Type",
                  "text": "Select the type of legal document you need: contract, NDA, employment agreement, rental agreement, or purchase agreement.",
                  "url": "https://legalchatai.com/create-document#choose"
                },
                {
                  "@type": "HowToStep",
                  "name": "Fill Document Details",
                  "text": "Complete the AI-guided questionnaire with your specific requirements, party information, and contract terms.",
                  "url": "https://legalchatai.com/create-document#fill"
                },
                {
                  "@type": "HowToStep",
                  "name": "AI Generates Document",
                  "text": "Our AI creates a professional legal document based on your inputs, incorporating best practices and legal standards.",
                  "url": "https://legalchatai.com/create-document#generate"
                },
                {
                  "@type": "HowToStep",
                  "name": "Download and Customize",
                  "text": "Download your document in PDF or Word format and make any final customizations before use.",
                  "url": "https://legalchatai.com/create-document#download"
                }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Are AI-generated legal documents legally valid?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI-generated legal documents can be legally valid when properly customized and executed. However, we recommend having important documents reviewed by a qualified attorney before signing."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What types of legal documents can I generate with AI?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can generate service agreements, NDAs, employment contracts, rental agreements, purchase agreements, and various other business and personal legal documents."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How long does it take to generate a legal document with AI?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI legal document generation typically takes 3-5 minutes to complete the questionnaire and receive your customized professional document."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I customize the AI-generated legal documents?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, all AI-generated documents are fully customizable. You can download them in Word format and make any necessary modifications to suit your specific needs."
                  }
                }
              ]
            }
          ]
        }
      }
    };
  
    // Function to update page SEO dynamically
    function updatePageSEO() {
      const currentPath = window.location.pathname;
      const config = pageConfigs[currentPath];
      
      if (!config) return; // Use default homepage schema from index.html
      
      console.log('🔄 Updating SEO for:', currentPath);
      
      // Update title
      document.title = config.title;
      
      // Update meta tags
      updateMetaTag('description', config.description);
      updateMetaTag('keywords', config.keywords);
      
      // Update Open Graph tags
      updateMetaTag('og:title', config.title, 'property');
      updateMetaTag('og:description', config.description, 'property'); 
      updateMetaTag('og:url', `https://legalchatai.com${currentPath}`, 'property');
      
      // Update Twitter tags
      updateMetaTag('twitter:title', config.title, 'property');
      updateMetaTag('twitter:description', config.description, 'property');
      updateMetaTag('twitter:url', `https://legalchatai.com${currentPath}`, 'property');
      
      // Update canonical URL
      updateCanonicalURL(`https://legalchatai.com${currentPath}`);
      
      // Add page-specific schema
      addPageSchema(config.schema, currentPath);
      
      console.log('✅ SEO updated for:', currentPath);
    }
    
    function updateMetaTag(name, content, attribute = 'name') {
      let tag = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    }
    
    function updateCanonicalURL(url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }
    
    function addPageSchema(schema, path) {
      // Remove existing page-specific schema
      const existingSchema = document.getElementById('page-specific-schema');
      if (existingSchema) {
        existingSchema.remove();
      }
      
      // Add new schema
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-specific-schema';
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
      
      console.log('📋 Schema added for:', path);
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updatePageSEO, 100);
      });
    } else {
      setTimeout(updatePageSEO, 100);
    }
    
    // Update on route changes (for React Router)
    let lastPath = window.location.pathname;
    
    // Method 1: MutationObserver for DOM changes
    const observer = new MutationObserver(function(mutations) {
      if (lastPath !== window.location.pathname) {
        lastPath = window.location.pathname;
        setTimeout(updatePageSEO, 200); // Small delay for React to render
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: false,
      attributeOldValue: false,
      characterData: false,
      characterDataOldValue: false
    });
    
    // Method 2: PopState event for browser navigation
    window.addEventListener('popstate', function() {
      setTimeout(updatePageSEO, 100);
    });
    
    // Method 3: Periodic check as fallback
    setInterval(function() {
      if (lastPath !== window.location.pathname) {
        lastPath = window.location.pathname;
        updatePageSEO();
      }
    }, 1000);
    
    // Debug helper
    window.legalChatAISEO = {
      getCurrentConfig: () => pageConfigs[window.location.pathname],
      updateSEO: updatePageSEO,
      getSchemas: () => {
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        return Array.from(schemas).map(schema => JSON.parse(schema.textContent));
      }
    };
    
  })();