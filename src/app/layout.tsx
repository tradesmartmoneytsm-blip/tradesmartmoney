import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { AutoAds } from '@/components/AdSense';
import { StructuredData } from '@/components/StructuredData';

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
        <link rel="preconnect" href="https://dhan.co" />
        
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
        
        {/* Google AdSense Account */}
        <meta name="google-adsense-account" content="ca-pub-6601377389077210" />
        
        {/* Google Site Verification - PASTE YOUR CODE HERE */}
        {/* Step 1: Go to adsense.google.com → Sites → Get Code */}
        {/* Step 2: Copy the meta tag Google gives you */}
        {/* Step 3: Replace the line below with your actual verification code */}
        {/* EXAMPLE: <meta name="google-site-verification" content="ABC123XYZ..." /> */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_FROM_ADSENSE" /> */}
        
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6601377389077210"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50`}>
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

        {/* Auto Ads Component */}
        <AutoAds />
        
        {/* Structured Data - Added client-side to avoid hydration issues */}
        <StructuredData />
      </body>
    </html>
  );
}