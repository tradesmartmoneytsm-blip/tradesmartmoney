'use client';

import { useState, lazy, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';

// Dynamic imports for better performance
const SwingTrades = lazy(() => import('@/components/SwingTrades').then(module => ({ default: module.SwingTrades })));
const IntradayTrades = lazy(() => import('@/components/IntradayTrades').then(module => ({ default: module.IntradayTrades })));
const News = lazy(() => import('@/components/News').then(module => ({ default: module.News })));
const Market = lazy(() => import('@/components/Market').then(module => ({ default: module.Market })));
const EodScans = lazy(() => import('@/components/EodScans').then(module => ({ default: module.EodScans })));
const AlgoTrading = lazy(() => import('@/components/AlgoTrading').then(module => ({ default: module.AlgoTrading })));
import { Brain, Bot, Settings, ArrowRight, BookOpen, TrendingUp, BarChart3, Zap, Shield, Users, Star, Play, ChevronRight } from 'lucide-react';
import { brandTokens } from '@/lib/design-tokens';
import { SubmenuCards } from '@/components/ui/SubmenuCards';
import { FAQSchema } from '@/components/FAQSchema';

// Advanced SEO Schema for Homepage
function HomepageSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "TradeSmart Money",
    "description": "Educational trading platform for learning smart money concepts, market analysis, and trading education",
    "url": "https://www.tradesmartmoney.com",
    "logo": "https://www.tradesmartmoney.com/logo.png",
    "sameAs": [
      "https://twitter.com/tradesmartmoney",
      "https://youtube.com/@tradesmartmoney"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Maharashtra"
    },
    "areaServed": "IN",
    "serviceType": "Educational Trading Platform",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Trading Education Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Course",
            "name": "Smart Money Concepts Education",
            "description": "Learn institutional trading patterns and market analysis"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Course",
            "name": "Market Analysis Training",
            "description": "Educational market data analysis and trading concepts"
          }
        }
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is TradeSmart Money?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TradeSmart Money is an educational platform that provides market data, analysis examples, and educational content to help users learn about the Indian financial markets. All content is for educational purposes only."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide investment advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, we do not provide investment advice. We are not SEBI registered advisors. We provide educational content and market analysis examples for learning purposes only. Please consult SEBI registered investment advisors for personalized advice."
        }
      },
      {
        "@type": "Question",
        "name": "What are Smart Money Concepts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Smart Money Concepts (SMC) is an educational trading methodology that focuses on understanding how institutional investors and market makers operate in financial markets through market structure analysis, order flow, and liquidity concepts."
        }
      },
      {
        "@type": "Question",
        "name": "Is the platform free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer both free and premium educational features. Basic market data and educational content are available for free, while advanced educational analytics and premium learning tools require a subscription."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

function HomeComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('home'); // Changed default to 'home'
  const [activeMarketSubSection, setActiveMarketSubSection] = useState('market'); // Default to show submenu cards
  const [activeEodScansSubSection, setActiveEodScansSubSection] = useState('eodscans'); // Default to show submenu cards
  const [activeAlgoTradingSubSection, setActiveAlgoTradingSubSection] = useState('algo-trading'); // Default to show submenu cards

  // Handle URL parameters for deep linking from blog
  useEffect(() => {
    const section = searchParams.get('section');
    const subsection = searchParams.get('subsection');
    
    if (section) {
      setActiveSection(section as 'home' | 'swing' | 'intraday' | 'news' | 'market' | 'eodscans' | 'algo-trading');
      
      // Handle subsections
      if (section === 'market' && subsection) {
        setActiveMarketSubSection(subsection);
      } else if (section === 'eodscans' && subsection) {
        setActiveEodScansSubSection(subsection);
      } else if (section === 'algo-trading' && subsection) {
        setActiveAlgoTradingSubSection(subsection);
      }
    }
  }, [searchParams]);

  const handleSectionChange = (section: string) => {
    // Navigate to dedicated pages for better SEO
    const routes: { [key: string]: string } = {
      'market': '/market/sector-performance',
      'swing': '/swing-trades/momentum-strategy', 
      'fno': '/fno/option-analysis',
      'equity': '/equity/smart-money-flow',
      'intraday': '/intraday-trades',
      'smart-money-flow': '/smart-money-flow',
      'news': '/news',
      'eodscans': '/eod-scans',
      'algo-trading': '/algo-trading',
    };
    
    // If it's a main section with a dedicated page, navigate there
    if (routes[section]) {
      router.push(routes[section]);
      return;
    }
    
    // Handle homepage sections (for backward compatibility)
    const previousSection = activeSection;
    setActiveSection(section as 'home' | 'swing' | 'intraday' | 'news' | 'market' | 'eodscans' | 'algo-trading');

    // Scroll to top smoothly when navigating to a different main section
    if (previousSection !== section) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // Optimized Hero Section Component
  const HeroSection = () => (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Lazy-loaded Background Effects */}
      <div className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0s', transform: 'translate3d(0,0,0)'}}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s', transform: 'translate3d(0,0,0)'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" style={{transform: 'translate3d(-50%,-50%,0)'}}></div>
      </div>
      
      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Hero Content */}
      <div className="relative pt-4 pb-32 lg:pt-8 lg:pb-40">
        <div className={`${brandTokens.spacing.page.container} ${brandTokens.spacing.page.x}`}>
          
          {/* Main Hero Content */}
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">Trusted by 10,000+ Professional Traders</span>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            
            {/* Main Heading - Optimized for LCP */}
            <h1 className={`${brandTokens.typography.display.xl} text-white mb-6 premium-text`} style={{willChange: 'transform'}}>
              Trade Smart Money Like
              <span className="block mt-2 text-gradient-brand">Professional Institutions</span>
            </h1>
            
            {/* Subheading */}
            <p className={`${brandTokens.typography.body.xl} text-blue-100 mb-10 max-w-4xl mx-auto animate-slide-up delay-200`}>
              Master smart money trading with our professional platform. Learn smart money concepts, institutional trading patterns, and advanced market analysis. Trade like smart money with real-time data and proven smart money strategies.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-slide-up delay-400">
              <button 
                onClick={() => handleSectionChange('market')}
                className="group btn-brand px-8 py-4 text-lg font-semibold flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start Trading Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link 
                href="/smart-money-concepts"
                className="group px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-3"
              >
                <BookOpen className="w-5 h-5" />
                Learn SMC
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Platform Features Section */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">Why Smart Money Traders Choose Us</h2>
              <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                Trade smart money strategies with professional-grade tools and institutional-level market analysis to master smart money concepts
              </p>
            </div>

            {/* Development Progress Notice */}
            <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-blue-400/30">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Bot className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">🚀 Exciting Features in Development</h3>
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-blue-100 mb-4">
                  We're actively building advanced trading tools, real-time alerts, portfolio analytics, and AI-powered market insights. 
                  Stay tuned for regular updates and new features!
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-blue-500/30 rounded-full text-blue-200">📊 Advanced Analytics</span>
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-purple-200">🤖 AI Insights</span>
                  <span className="px-3 py-1 bg-green-500/30 rounded-full text-green-200">⚡ Real-time Alerts</span>
                  <span className="px-3 py-1 bg-orange-500/30 rounded-full text-orange-200">📱 Mobile App</span>
                </div>
              </div>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in delay-600">
              <button 
                onClick={() => handleSectionChange('market')}
                className="glass-card p-6 text-center hover:scale-105 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-200">Real-time Data</h3>
                <p className="text-blue-200 text-sm">Live market indices, sector performance, and institutional activity</p>
              </button>
              
              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI Algorithms</h3>
                <p className="text-blue-200 text-sm">Machine learning powered trading signals and market predictions</p>
              </div>
              
              <Link 
                href="/smart-money-concepts"
                className="glass-card p-6 text-center hover:scale-105 hover:bg-white/5 transition-all duration-300 group cursor-pointer block"
              >
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                  <Zap className="w-6 h-6 text-green-400 group-hover:text-green-300" />
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-green-200">Smart Money</h3>
                <p className="text-blue-200 text-sm">Institutional order flow analysis and smart money concepts</p>
              </Link>
              
              <div className="glass-card p-6 text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Risk Management</h3>
                <p className="text-blue-200 text-sm">Advanced risk assessment and portfolio protection strategies</p>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/80 animate-fade-in delay-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm">10,000+ Active Traders</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm">₹50Cr+ Trading Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HeroSection />;
      case 'swing':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SwingTrades />
          </Suspense>
        );
      case 'intraday':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <IntradayTrades />
          </Suspense>
        );
      case 'news':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <News />
          </Suspense>
        );
      case 'market':
        // Show submenu cards if no specific subsection, otherwise show the Market component
        if (!activeMarketSubSection || activeMarketSubSection === 'market') {
          return <SubmenuCards section="market" onSubItemClick={(sectionId, subItemId) => {
            // For market section, navigate to separate pages
            if (sectionId === 'market') {
              router.push(`/market/${subItemId}`);
            } else {
              handleSectionChange(sectionId);
            }
          }} />;
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <Market initialSubSection={activeMarketSubSection} />
          </Suspense>
        );
      case 'eodscans':
        // Show submenu cards if no specific subsection, otherwise show the EodScans component
        if (!activeEodScansSubSection || activeEodScansSubSection === 'eodscans') {
          return <SubmenuCards section="eodscans" onSubItemClick={handleSectionChange} />;
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <EodScans initialSubSection={activeEodScansSubSection} />
          </Suspense>
        );
      case 'algo-trading':
        // Show submenu cards if no specific subsection, otherwise show the AlgoTrading component
        if (!activeAlgoTradingSubSection || activeAlgoTradingSubSection === 'algo-trading') {
          return <SubmenuCards section="algo-trading" onSubItemClick={handleSectionChange} />;
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <AlgoTrading initialSubSection={activeAlgoTradingSubSection} />
          </Suspense>
        );
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Advanced SEO Schema */}
      <HomepageSchema />
      
      {/* FAQ Schema only on homepage */}
      {activeSection === 'home' && <FAQSchema />}
      
      {/* Show Navigation for non-home sections */}
      {activeSection !== 'home' && (
      <Navigation
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      )}
      
      {/* Main Content */}
      <main className="relative" role="main" aria-label={`${activeSection} content`}>
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
      
      {/* Google Auto Ads will automatically place ads throughout the page */}
      
      {/* Educational Resources Section - Always Visible */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-16 px-4">
        <div className={`${brandTokens.spacing.page.container}`}>
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <BookOpen className={`${brandTokens.icons.xl} text-blue-300`} />
            </div>
            <h2 className={`${brandTokens.typography.heading.xl} mb-4`}>Master Professional Trading</h2>
            <p className={`${brandTokens.typography.body.lg} text-blue-100 max-w-3xl mx-auto`}>
              Learn advanced trading concepts used by institutions and professional traders to consistently profit from the markets.
            </p>
          </div>
          
          <div className={`${brandTokens.grids.oneToThree} ${brandTokens.spacing.grid.gap.md}`}>
            <Link href="/trading-guide" className="group">
              <div className="premium-card bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                  <BookOpen className={`${brandTokens.icons.xl} text-green-300`} />
                </div>
                <h3 className={`${brandTokens.typography.heading.sm} mb-3 group-hover:text-green-300 transition-colors`}>Complete Trading Guide</h3>
                <p className={`${brandTokens.typography.body.md} text-blue-100 mb-4 group-hover:text-white transition-colors`}>
                  Master trading fundamentals, technical analysis, risk management, and trading psychology with our comprehensive guide.
                </p>
                <div className="flex items-center text-green-300 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Start Learning</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link href="/smart-money-concepts" className="group">
              <div className="premium-card bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                  <Brain className={`${brandTokens.icons.xl} text-blue-300`} />
                </div>
                <h3 className={`${brandTokens.typography.heading.sm} mb-3 group-hover:text-blue-300 transition-colors`}>Smart Money Concepts</h3>
                <p className={`${brandTokens.typography.body.md} text-blue-100 mb-4 group-hover:text-white transition-colors`}>
                  Master institutional trading patterns, order flow analysis, and smart money footprint to trade like the pros.
                </p>
                <div className="flex items-center text-blue-300 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Learn SMC</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link href="/ai-powered-trading" className="group">
              <div className="premium-card bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                  <Bot className={`${brandTokens.icons.xl} text-purple-300`} />
                </div>
                <h3 className={`${brandTokens.typography.heading.sm} mb-3 group-hover:text-purple-300 transition-colors`}>AI-Powered Trading</h3>
                <p className={`${brandTokens.typography.body.md} text-blue-100 mb-4 group-hover:text-white transition-colors`}>
                  Harness artificial intelligence and machine learning algorithms for superior trading performance and automation.
                </p>
                <div className="flex items-center text-purple-300 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Explore AI Trading</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link href="/algo-trading" className="group">
              <div className="premium-card bg-white/10 backdrop-blur-sm p-6 hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:transform hover:scale-105">
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                  <Settings className={`${brandTokens.icons.xl} text-green-300`} />
                </div>
                <h3 className={`${brandTokens.typography.heading.sm} mb-3 group-hover:text-green-300 transition-colors`}>Algorithmic Trading</h3>
                <p className={`${brandTokens.typography.body.md} text-blue-100 mb-4 group-hover:text-white transition-colors`}>
                  Build, backtest, and deploy automated trading systems with advanced algorithms and risk management.
                </p>
                <div className="flex items-center text-green-300 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Start Algo Trading</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-blue-100">Join 10,000+ learners studying professional trading concepts</span>
            </div>
          </div>
          
          {/* SEBI Disclaimer */}
          <div className="text-center mt-8">
            <div className="max-w-4xl mx-auto bg-red-50/90 backdrop-blur-sm rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-800 font-medium">
                <strong>SEBI DISCLAIMER:</strong> This website is not registered with SEBI. We do not provide investment advisory services. 
                All content is for educational purposes only and should not be considered as recommendations to buy or sell securities. 
                Please consult with SEBI registered investment advisors before making any investment decisions.
              </p>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="text-center mt-8">
            <p className="text-blue-100/80 text-sm">
              Copyright © 2025 - TradeSmartMoney.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading TradeSmart Money...</p>
      </div>
    </div>}>
      <HomeComponent />
    </Suspense>
  );
}
