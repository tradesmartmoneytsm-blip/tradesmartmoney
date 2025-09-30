'use client';

import { useEffect, useRef } from 'react';

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: unknown[];
    __tradesmartmoney_adsense_initialized?: boolean;
  }
}

// Global initialization flag - survives all React lifecycle events
if (typeof window !== 'undefined') {
  (window as Window & { __TRADESMARTMONEY_ADSENSE_GLOBAL_INIT?: boolean }).__TRADESMARTMONEY_ADSENSE_GLOBAL_INIT = false;
}

// Google Auto Ads - Let Google handle everything automatically
export function AutoAds() {
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations within this component instance
    if (initRef.current) return;
    
    const initializeAutoAds = () => {
      try {
        if (typeof window === 'undefined') return;

        // Ultimate check: Global flag that survives everything
        if ((window as Window & { __TRADESMARTMONEY_ADSENSE_GLOBAL_INIT?: boolean }).__TRADESMARTMONEY_ADSENSE_GLOBAL_INIT) {
          return;
        }

        // Check if AdSense script is loaded
        const adsenseScript = document.querySelector('script[src*="pagead/js/adsbygoogle.js"]');
        if (!adsenseScript) {
          return;
        }

        // Initialize adsbygoogle array safely
        window.adsbygoogle = window.adsbygoogle || [];
        if (!Array.isArray(window.adsbygoogle)) {
          window.adsbygoogle = [];
        }

        // Check if page-level ads already configured
        const hasPageLevelConfig = window.adsbygoogle.some((ad: unknown) => {
          return ad && 
                 typeof ad === 'object' && 
                 ad !== null && 
                 'enable_page_level_ads' in ad;
        });

        if (hasPageLevelConfig) {
          (window as Window & { __TRADESMARTMONEY_ADSENSE_GLOBAL_INIT?: boolean }).__TRADESMARTMONEY_ADSENSE_GLOBAL_INIT = true;
          initRef.current = true;
          return;
        }

        // Set global flag IMMEDIATELY before any operations
        (window as Window & { __TRADESMARTMONEY_ADSENSE_GLOBAL_INIT?: boolean }).__TRADESMARTMONEY_ADSENSE_GLOBAL_INIT = true;
        initRef.current = true;
        
        // Push the configuration
        window.adsbygoogle.push({
          google_ad_client: "ca-pub-6601377389077210",
          enable_page_level_ads: true,
          overlays: { bottom: true }
        });
        
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };

    // Single initialization attempt
    initializeAutoAds();

  }, []); // Empty dependency array - run only once per component instance

  return null; // Auto ads don't need visual components
}

// Manual ad component for specific placements if needed
interface ManualAdProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ManualAd({ className = '', style }: ManualAdProps) {
  useEffect(() => {
    // Initialize ads
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Manual Ad error:', error);
    }
  }, []);

  return (
    <div className={className} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6601377389077210"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Legacy component exports for backward compatibility
export const HeaderAd = () => <ManualAd className="w-full max-w-6xl mx-auto mb-6" style={{ minHeight: '90px' }} />;
export const InContentAd = () => <ManualAd className="w-full max-w-md mx-auto my-8" style={{ minHeight: '250px' }} />;
export const FooterAd = () => <ManualAd className="w-full max-w-6xl mx-auto mt-6" style={{ minHeight: '90px' }} />;
export const MobileAd = () => <div className="block md:hidden"><ManualAd className="w-full my-4" style={{ minHeight: '100px' }} /></div>;
export const StickyAd = () => null;