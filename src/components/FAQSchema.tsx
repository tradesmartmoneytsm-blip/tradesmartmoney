export function FAQSchema() {
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
      }}
    />
  );
} 