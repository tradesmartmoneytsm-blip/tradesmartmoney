import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Footer } from '@/components/Footer';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "TradeSmartMoney - Professional Trading Platform | Stock Market Analysis & Trading Signals",
  description: "Advanced trading platform offering swing trading, intraday signals, market analysis, algorithmic trading education, and real-time financial data. Professional tools for smart trading decisions.",
  keywords: [
    "stock trading",
    "trading signals", 
    "market analysis",
    "swing trading",
    "intraday trading",
    "algorithmic trading",
    "financial data",
    "stock screener",
    "trading platform",
    "investment tools",
    "technical analysis",
    "market news",
    "trading education",
    "portfolio management",
    "risk management",
    "smart money",
    "smart money concepts",
    "smc",
    "trade smart money",
  ],
  authors: [{ name: "TradeSmartMoney Team" }],
  creator: "TradeSmartMoney",
  publisher: "TradeSmartMoney",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tradesmartmoney.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TradeSmartMoney - Professional Trading Platform",
    description: "Advanced trading platform with swing trading, intraday signals, market analysis, and algorithmic trading education. Make smart trading decisions with professional tools.",
    url: 'https://tradesmartmoney.com',
    siteName: 'TradeSmartMoney',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeSmartMoney - Professional Trading Platform',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeSmartMoney - Professional Trading Platform',
    description: 'Advanced trading platform with real-time signals, market analysis, and algorithmic trading education.',
    creator: '@tradesmartmoney',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme and Mobile Optimization */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TradeSmartMoney" />
        
        {/* Performance Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "TradeSmartMoney",
              "description": "Professional trading platform offering advanced market analysis, trading signals, and algorithmic trading education.",
              "url": "https://tradesmartmoney.com",
              "logo": "https://tradesmartmoney.com/logo.png",
              "sameAs": [
                "https://twitter.com/tradesmartmoney",
                "https://linkedin.com/company/tradesmartmoney"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English"
              },
              "areaServed": "IN",
              "serviceType": [
                "Stock Trading Platform",
                "Market Analysis",
                "Trading Education",
                "Financial Data Services"
              ],
              "offers": {
                "@type": "Offer",
                "name": "Trading Platform Services",
                "description": "Comprehensive trading tools and market analysis"
              }
            })
          }}
        />
        
        {/* Additional Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
        
        {/* Google Analytics */}
        <GoogleAnalytics />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main role="main" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
