'use client';



export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TradeSmartMoney",
    "alternateName": "TradeSmart Money",
    "description": "Professional trading platform offering smart money concepts, AI-powered algo trading, and advanced market analysis tools for traders and investors.",
    "url": "https://www.tradesmartmoney.com",
    "logo": "https://www.tradesmartmoney.com/favicon.svg",
    "sameAs": [
      "https://twitter.com/tradesmartmoney",
      "https://www.youtube.com/@tradesmartmoney",
      "https://www.instagram.com/tradesmartmoneytsm/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "serviceType": [
      "Trading Platform",
      "Financial Analysis",
      "Investment Tools", 
      "Market Data",
      "Trading Signals",
      "Algorithmic Trading"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TradeSmartMoney",
    "alternateName": "TradeSmart Money Trading Platform", 
    "url": "https://www.tradesmartmoney.com",
    "description": "Professional trading platform with smart money concepts, AI algo trading, swing trading signals, and comprehensive market analysis.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.tradesmartmoney.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "about": [
      {
        "@type": "Thing",
        "name": "Trading",
        "sameAs": "https://en.wikipedia.org/wiki/Trading"
      },
      {
        "@type": "Thing", 
        "name": "Algorithmic Trading",
        "sameAs": "https://en.wikipedia.org/wiki/Algorithmic_trading"
      },
      {
        "@type": "Thing",
        "name": "Technical Analysis", 
        "sameAs": "https://en.wikipedia.org/wiki/Technical_analysis"
      }
    ]
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TradeSmartMoney Trading Platform",
    "description": "Advanced trading platform with AI-powered algorithms, smart money analysis, and real-time market data for professional traders.",
    "url": "https://www.tradesmartmoney.com", 
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "Smart Money Analysis",
      "AI Algo Trading", 
      "Swing Trading Signals",
      "Market Data Analysis",
      "FII/DII Data Tracking",
      "Technical Analysis Tools",
      "Real-time Market Indices",
      "Trading Education"
    ],
    "creator": {
      "@type": "Organization",
      "name": "TradeSmartMoney"
    }
  };

  // FAQ schema moved to homepage only to prevent duplicate content issues

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema)
        }}
      />
    </>
  );
} 