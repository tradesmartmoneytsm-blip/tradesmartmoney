import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: 'swap',
  preload: false,
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon.png',
      },
    ],
  },
  manifest: '/manifest.json',
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
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Performance Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://dhan.co" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
        
        {/* Resource Hints */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
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
        
        {/* Google AdSense Account */}
        <meta name="google-adsense-account" content="ca-pub-6601377389077210" />
        
        {/* Google Site Verification - Add your verification code here when you get it */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" /> */}
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6601377389077210"
          crossOrigin="anonymous"
        />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              "sameAs": [
                "https://tradesmartmoney.com"
              ],
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
            })
          }}
        />
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
        
        {/* Cookie Consent Banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
