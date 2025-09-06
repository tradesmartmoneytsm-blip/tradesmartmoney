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
  title: "Smart Money Trading Platform | AI Powered Algo Trading & Smart Money Concepts | TradeSmartMoney",
  description: "Master smart money concepts with our AI-powered trading platform. Advanced algo trading strategies, smart money footprint analysis, swing trading signals, and AI trading algorithms for professional traders.",
  keywords: [
    "smart money",
    "smart money concepts", 
    "smart money footprint",
    "smart money algo",
    "algo trading",
    "algorithmic trading",
    "ai powered trading",
    "ai trading algorithm",
    "swing trading",
    "smart money trading",
    "smart money analysis",
    "institutional trading patterns",
    "order flow analysis",
    "liquidity analysis",
    "market structure",
    "supply and demand trading",
    "price action trading",
    "trading platform",
    "automated trading",
    "quantitative trading",
    "machine learning trading",
    "trading signals",
    "market analysis",
    "intraday trading",
    "financial data",
    "stock screener",
    "investment tools",
    "technical analysis",
    "market news",
    "trading education",
    "portfolio management",
    "risk management",
    "smc trading",
    "institutional order flow",
    "smart money indicators"
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
    title: "Smart Money Trading Platform | AI Powered Algo Trading & Smart Money Concepts",
    description: "Master smart money concepts with AI-powered algo trading. Advanced smart money footprint analysis, swing trading signals, and institutional trading patterns for professional traders.",
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
    title: 'Smart Money Trading Platform | AI Powered Algo Trading',
    description: 'Master smart money concepts with AI-powered algo trading. Advanced smart money footprint analysis and institutional trading patterns.',
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
              "description": "AI-powered smart money trading platform specializing in smart money concepts, algorithmic trading, and institutional order flow analysis for professional traders.",
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
                "Smart Money Trading Platform",
                "AI Powered Algo Trading",
                "Smart Money Concepts Education",
                "Algorithmic Trading Systems",
                "Smart Money Footprint Analysis",
                "Institutional Order Flow Analysis",
                "AI Trading Algorithms"
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
