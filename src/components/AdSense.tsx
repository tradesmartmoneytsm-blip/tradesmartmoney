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
    // Check if user has consented to ads
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'all') {
      // Enable Google Auto Ads only after consent
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
          
          // Also check if the AdSense script has already pushed auto ads config
          const adsbygoogle = window.adsbygoogle || [];
          
          // Ensure adsbygoogle is an array and check for existing auto ads config
          const adsArray = Array.isArray(adsbygoogle) ? adsbygoogle : [];
          const hasAutoAdsConfig = adsArray.some((item: unknown) => 
            item && typeof item === 'object' && item !== null && 'enable_page_level_ads' in item
          );
          
          if (hasAutoAdsConfig) {
            window.__adsense_auto_ads_initialized = true;
            return; // Auto ads already configured
          }
          
          // Mark as initialized before pushing to prevent race conditions
          window.__adsense_auto_ads_initialized = true;
          
          // Ensure we're pushing to a proper array
          if (Array.isArray(adsbygoogle)) {
            adsbygoogle.push({
              google_ad_client: "ca-pub-6601377389077210",
              enable_page_level_ads: true
            });
          } else {
            // Initialize the array if it's not already one
            window.adsbygoogle = [{
              google_ad_client: "ca-pub-6601377389077210",
              enable_page_level_ads: true
            }];
          }
        }
      } catch (error) {
        console.error('Auto Ads error:', error);
        // Reset flag on error so it can be retried
        if (typeof window !== 'undefined') {
          window.__adsense_auto_ads_initialized = false;
        }
      }
    }
  }, []);

  return null; // Auto ads don't need visual components
}

// Fallback manual ad component for specific placements if needed
interface ManualAdProps {
  className?: string;
  style?: React.CSSProperties;
}

export function ManualAd({ className = '', style }: ManualAdProps) {
  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent === 'all') {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Manual Ad error:', error);
      }
    }
  }, []);

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