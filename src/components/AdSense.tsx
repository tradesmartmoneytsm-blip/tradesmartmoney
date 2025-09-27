'use client';

import { useEffect } from 'react';

// Extend Window interface for AdSense
declare global {
  interface Window {
    adsbygoogle: unknown[];
    __adsense_auto_ads_initialized?: boolean;
  }
}

// Google Auto Ads - Let Google handle everything automatically
export function AutoAds() {
  useEffect(() => {
    // Initialize Google Auto Ads
    try {
      if (typeof window !== 'undefined') {
        // Check if Auto Ads is already initialized using window flag
        if (window.__adsense_auto_ads_initialized) {
          return; // Already initialized, skip
        }
        
        // Check if AdSense script is loaded
        const adsenseScript = document.querySelector('script[src*="pagead/js/adsbygoogle.js"]');
        if (!adsenseScript) {
          // AdSense script not loaded yet, skip initialization
          return;
        }
        
        // Mark as initialized before pushing to prevent race conditions
        window.__adsense_auto_ads_initialized = true;
        
        // Initialize adsbygoogle array if needed
        window.adsbygoogle = window.adsbygoogle || [];
        
        // Enable page-level ads (Auto Ads)
        window.adsbygoogle.push({
          google_ad_client: "ca-pub-6601377389077210",
          enable_page_level_ads: true,
          overlays: {bottom: true}
        });
      }
    } catch (error) {
      console.error('Auto Ads error:', error);
      // Reset flag on error so it can be retried
      if (typeof window !== 'undefined') {
        window.__adsense_auto_ads_initialized = false;
      }
    }
  }, []);

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