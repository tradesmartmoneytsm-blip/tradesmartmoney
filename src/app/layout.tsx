import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { TrafficTracker } from '@/components/TrafficTracker';
import { Footer } from '@/components/Footer';
import { StructuredData } from '@/components/StructuredData';
import { AdvanceDeclineWidget } from '@/components/AdvanceDeclineWidget';
import { ActivityManager } from '@/components/ActivityManager';

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
  title: "Trade Smart Money | Professional Trading Platform & Smart Money Concepts | TradeSmartMoney",
  description: "Trade like smart money with professional trading platform. Learn smart money concepts, institutional trading patterns, and advanced market analysis. Master smart money trading strategies for consistent profits.",
  keywords: [
    // Primary Keywords
    "trade",
    "trading",
    "smart money",
    "trade smart money",
    "smart money trading",
    "smart money concepts",
    "smart money flow",
    "institutional trading",
    "professional trading",
    
    // Core Trading Terms
    "trading platform",
    "stock trading",
    "forex trading", 
    "options trading",
    "day trading",
    "swing trading",
    "intraday trading",
    "online trading",
    "trading software",
    "trading tools",
    
    // Finance & Investment
    "financial analysis",
    "investment platform",
    "stock market analysis", 
    "financial data",
    "market research",
    "investment tools",
    "portfolio management",
    "wealth management",
    "financial planning",
    "investment education",
    
    // Smart Money & Algo Trading
    "smart money",
    "smart money concepts", 
    "smart money trading",
    "smart money analysis",
    "smart money footprint",
    "institutional trading",
    "algo trading",
    "algorithmic trading",
    "automated trading",
    "quantitative trading",
    "ai trading",
    "machine learning trading",
    
    // Technical Analysis
    "technical analysis",
    "chart analysis",
    "price action trading",
    "market structure",
    "support resistance",
    "trading indicators",
    "trading education",
    "market patterns",
    "candlestick patterns",
    
    // Indian Market Specific
    "NSE trading",
    "BSE trading",
    "indian stock market",
    "nifty trading",
    "bank nifty",
    "sensex analysis",
    "indian trading platform",
    "fii dii data",
    "market indices india",
    
    // Advanced Features
    "order flow analysis",
    "liquidity analysis", 
    "institutional order flow",
    "market microstructure",
    "smart money indicators",
    "trading education",
    "risk management",
    "trading psychology"
  ],
  authors: [{ name: "TradeSmartMoney Team" }],
  creator: "TradeSmartMoney",
  publisher: "TradeSmartMoney",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.tradesmartmoney.com'),
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/',
  },
  openGraph: {
    title: "Trade Smart Money | Professional Trading Platform & Smart Money Concepts",
    description: "Trade like smart money with professional trading platform. Learn smart money concepts, institutional trading patterns, and advanced market analysis for consistent trading success.",
    url: 'https://www.tradesmartmoney.com',
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
    title: 'Trade Smart Money | Professional Trading Platform & Smart Money Concepts',
    description: 'Trade like smart money with professional trading platform. Learn smart money concepts, institutional trading patterns, and advanced market analysis.',
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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
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
    <html lang="en">
      <head>
        {/* Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Theme and Mobile Optimization */}
        <meta name="theme-color" content="#2563eb" />
        
        {/* Performance Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
        
        {/* Resource Hints */}
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50`}>
        {/* Skip link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        {/* Global Construction Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-4 text-center relative z-50">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <span className="animate-pulse">🚧</span>
            <span>Site Under Construction - Exciting New Features Coming Soon!</span>
            <span className="animate-bounce">🚀</span>
          </div>
        </div>
        
        {/* Traffic Tracking */}
        <TrafficTracker />
        
        <main role="main" id="main-content">
          {children}
        </main>
        <Footer />
        

        
        {/* Advance-Decline Widget - Global floating button */}
        <AdvanceDeclineWidget />
        
        {/* Activity Manager - Real-time stock activities */}
        <ActivityManager />
        
        {/* Structured Data - Added client-side to avoid hydration issues */}
        <StructuredData />
      </body>
    </html>
  );
}