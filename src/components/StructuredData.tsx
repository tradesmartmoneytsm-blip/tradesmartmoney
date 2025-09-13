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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is smart money trading?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Smart money trading involves following institutional money flow and understanding how big players (banks, hedge funds, institutions) move the market. It includes analyzing order flow, liquidity, and market structure."
        }
      },
      {
        "@type": "Question", 
        "name": "How does algo trading work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Algorithmic trading uses computer programs to execute trades based on predefined rules and market conditions. Our AI-powered algorithms analyze market patterns, price action, and institutional flow to generate trading signals."
        }
      },
      {
        "@type": "Question",
        "name": "What markets does TradeSmartMoney cover?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "We focus primarily on Indian equity markets including NSE and BSE, covering indices like Nifty 50, Bank Nifty, and individual stocks. We provide FII/DII data, sector analysis, and swing trading opportunities."
        }
      }
    ]
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema)
        }}
      />
    </>
  );
} 