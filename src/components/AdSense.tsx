'use client';

import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

// AdSense Ad Component
export function AdSenseAd({ adSlot, adFormat = 'auto', className = '', style }: AdSenseProps) {
  useEffect(() => {
    // Check if user has consented to ads
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'all') {
      // Initialize AdSense ads when consent is given
      try {
        if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
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

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6601377389077210"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Responsive Ad Units
export function HeaderAd() {
  return (
    <AdSenseAd
      adSlot="1234567890"
      adFormat="horizontal"
      className="w-full max-w-6xl mx-auto mb-6"
      style={{ minHeight: '90px' }}
    />
  );
}

export function SidebarAd() {
  return (
    <AdSenseAd
      adSlot="1234567891"
      adFormat="vertical"
      className="w-full max-w-xs"
      style={{ minHeight: '600px' }}
    />
  );
}

export function InContentAd() {
  return (
    <AdSenseAd
      adSlot="1234567892"
      adFormat="rectangle"
      className="w-full max-w-md mx-auto my-8"
      style={{ minHeight: '250px' }}
    />
  );
}

export function FooterAd() {
  return (
    <AdSenseAd
      adSlot="1234567893"
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
        adSlot="1234567894"
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
      adSlot="1234567895"
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
        adSlot="1234567896"
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