'use client';

import { useEffect } from 'react';

export function StructuredData() {
  useEffect(() => {
    // Add structured data only after hydration to avoid hydration mismatches
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "TradeSmartMoney",
      "url": "https://tradesmartmoney.com",
      "description": "Professional trading platform with advanced market analysis and trading signals",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://tradesmartmoney.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "mainEntity": {
        "@type": "WebPage",
        "@id": "https://tradesmartmoney.com/#webpage"
      }
    };

    const businessSchema = {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "TradeSmartMoney",
      "description": "Professional trading platform providing real-time market data, smart money concepts, algorithmic trading, and swing trading opportunities for Indian stock market",
      "url": "https://tradesmartmoney.com",
      "logo": "https://tradesmartmoney.com/favicon.ico",
      "image": "https://tradesmartmoney.com/favicon.ico",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "tradesmartmoneytsm@gmail.com",
        "contactType": "customer service"
      },
      "sameAs": ["https://tradesmartmoney.com"],
      "serviceType": "Trading Platform",
      "areaServed": "India",
      "knowsAbout": [
        "Stock Trading",
        "Algorithmic Trading",
        "Swing Trading",
        "Smart Money Concepts",
        "Technical Analysis",
        "Market Data Analysis",
        "Risk Management"
      ],
      "offers": {
        "@type": "Service",
        "name": "Trading Analysis & Education",
        "description": "Real-time market data, trading signals, and educational content for Indian stock market traders"
      }
    };

    // Create and append structured data scripts to head
    const head = document.head;
    
    // Website schema script
    const websiteScript = document.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.textContent = JSON.stringify(websiteSchema);
    head.appendChild(websiteScript);
    
    // Business schema script
    const businessScript = document.createElement('script');
    businessScript.type = 'application/ld+json';
    businessScript.textContent = JSON.stringify(businessSchema);
    head.appendChild(businessScript);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      if (websiteScript.parentNode) {
        websiteScript.parentNode.removeChild(websiteScript);
      }
      if (businessScript.parentNode) {
        businessScript.parentNode.removeChild(businessScript);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
} 