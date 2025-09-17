'use client';

import Script from 'next/script';
import { GA_MEASUREMENT_ID, isGoogleAnalyticsConfigured } from '@/lib/analytics';

export function GoogleAnalytics() {
  if (!isGoogleAnalyticsConfigured()) {
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Set default consent for Analytics (GDPR compliant)
            gtag('consent', 'default', {
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_storage: 'denied'
            });
            
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              page_title: document.title,
              send_page_view: true,
              anonymize_ip: true,
              cookie_expires: 63072000
            });
            
            
            // Track initial page view
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname
            });
          `,
        }}
      />
    </>
  );
} 