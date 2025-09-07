'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
  enableVideo?: boolean;
  isResponsive?: boolean;
}

// AdSense Ad Component
export function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  className = '', 
  style,
  enableVideo = false,
  isResponsive = true 
}: AdSenseProps) {
  useEffect(() => {
    // Check if user has consented to ads
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'all') {
      // Initialize AdSense ads when consent is given
      try {
        if (typeof window !== 'undefined' && (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle) {
          ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  // Don't show ads if no consent
  const cookieConsent = typeof window !== 'undefined' ? localStorage.getItem('cookie-consent') : null;
  if (cookieConsent !== 'all') {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center ${className}`}>
        <div className="text-gray-500 text-sm">
          <div className="mb-2">📢 Advertisement Space</div>
          <div className="text-xs">Ads will appear here after cookie consent</div>
        </div>
      </div>
    );
  }

  // Build ad attributes
  const adAttributes: Record<string, string> = {
    'data-ad-client': 'ca-pub-6601377389077210',
    'data-ad-slot': adSlot,
    'data-ad-format': adFormat,
    'data-full-width-responsive': isResponsive ? 'true' : 'false'
  };

  // Add video support if enabled
  if (enableVideo) {
    adAttributes['data-ad-type'] = 'video';
    adAttributes['data-video-muted-autoplay'] = 'true';
  }

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        {...adAttributes}
      />
    </div>
  );
}

// Responsive Ad Units
export function HeaderAd() {
  return (
    <AdSenseAd
      adSlot="ca-pub-6601377389077210/1001" // Header leaderboard - UPDATE IN PRODUCTION
      adFormat="horizontal"
      className="w-full max-w-6xl mx-auto mb-6"
      style={{ minHeight: '90px' }}
    />
  );
}

export function SidebarAd() {
  return (
    <AdSenseAd
      adSlot="ca-pub-6601377389077210/1002" // Vertical sidebar - UPDATE IN PRODUCTION
      adFormat="vertical"
      className="w-full max-w-xs"
      style={{ minHeight: '600px' }}
    />
  );
}

export function InContentAd() {
  return (
    <AdSenseAd
      adSlot="ca-pub-6601377389077210/1003" // In-content rectangle - UPDATE IN PRODUCTION
      adFormat="rectangle"
      className="w-full max-w-md mx-auto my-8"
      style={{ minHeight: '250px' }}
    />
  );
}

export function FooterAd() {
  return (
    <AdSenseAd
      adSlot="ca-pub-6601377389077210/1004" // Footer banner - UPDATE IN PRODUCTION
      adFormat="horizontal"
      className="w-full max-w-6xl mx-auto mt-6"
      style={{ minHeight: '90px' }}
    />
  );
}

// Mobile-optimized ad
export function MobileAd() {
  return (
    <div className="block md:hidden">
      <AdSenseAd
        adSlot="ca-pub-6601377389077210/1005" // Mobile banner - UPDATE IN PRODUCTION
        adFormat="auto"
        className="w-full my-4"
        style={{ minHeight: '100px' }}
      />
    </div>
  );
}

// In-Feed Ad for content lists
export function InFeedAd() {
  return (
    <AdSenseAd
      adSlot="ca-pub-6601377389077210/1006" // In-feed native - UPDATE IN PRODUCTION
      className="w-full my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
      style={{ minHeight: '150px' }}
    />
  );
}

// Sticky Ad (for better engagement)
export function StickyAd() {
  return (
    <div className="hidden lg:block fixed bottom-4 right-4 z-40">
      <AdSenseAd
        adSlot="ca-pub-6601377389077210/1007" // Sticky rectangle - UPDATE IN PRODUCTION
        adFormat="rectangle"
        className="bg-white shadow-lg rounded-lg border border-gray-200"
        style={{ width: '300px', height: '250px' }}
      />
      <button 
        className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
        onClick={(e) => {
          e.currentTarget.parentElement?.style.setProperty('display', 'none');
        }}
      >
        ×
      </button>
    </div>
  );
}

// Video Ad Component for higher CPM
export function VideoAd() {
  return (
    <AdSenseAd
      adSlot="ca-pub-6601377389077210/1008" // Video ad unit - UPDATE IN PRODUCTION
      adFormat="auto"
      className="w-full max-w-2xl mx-auto my-8 bg-gray-100 rounded-lg"
      style={{ minHeight: '400px' }}
      enableVideo={true}
    />
  );
}

// Enhanced Mobile Ad Components
export function MobileBannerAd() {
  return (
    <div className="block md:hidden">
      <AdSenseAd
        adSlot="ca-pub-6601377389077210/1010" // Mobile banner 320x50 - UPDATE IN PRODUCTION
        adFormat="horizontal"
        className="w-full my-4 bg-gray-50 rounded-lg p-2"
        style={{ minHeight: '60px' }}
      />
    </div>
  );
}

export function MobileInterstitialAd() {
  return (
    <div className="block md:hidden">
      <AdSenseAd
        adSlot="ca-pub-6601377389077210/1011" // Mobile interstitial - UPDATE IN PRODUCTION
        adFormat="auto"
        className="w-full my-6 bg-white rounded-lg shadow-md p-4"
        style={{ minHeight: '280px' }}
      />
    </div>
  );
}

// Anchor Ad for mobile (fixed position)
export function MobileAnchorAd() {
  return (
    <div className="block md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <AdSenseAd
        adSlot="ca-pub-6601377389077210/1012" // Mobile anchor - UPDATE IN PRODUCTION
        adFormat="horizontal"
        className="w-full"
        style={{ minHeight: '50px' }}
      />
    </div>
  );
}

// Native Ad for better user experience
export function NativeAd() {
  return (
    <div className="w-full my-6">
      <div className="text-xs text-gray-500 mb-2 text-center">Advertisement</div>
      <AdSenseAd
        adSlot="ca-pub-6601377389077210/1009" // Native ad unit - UPDATE IN PRODUCTION
        adFormat="auto"
        className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
} 