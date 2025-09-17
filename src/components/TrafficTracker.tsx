'use client';

import { useEffect } from 'react';

export function TrafficTracker() {
  useEffect(() => {
    // Simple traffic tracking that works immediately
    const trackVisit = async () => {
      try {
        // Track page view to your own analytics
        const visitData = {
          url: window.location.href,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          sessionId: sessionStorage.getItem('session_id') || 
                    (() => {
                      const id = Math.random().toString(36).substring(2);
                      sessionStorage.setItem('session_id', id);
                      return id;
                    })()
        };

        // Log for debugging (you can see this in browser console)
        console.log('📊 Page visit tracked:', {
          page: window.location.pathname,
          title: document.title,
          timestamp: visitData.timestamp
        });

        // Optional: Send to your own analytics endpoint
        // fetch('/api/analytics/track', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(visitData)
        // });

        // Force GA tracking if available
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            custom_parameter_1: 'force_track'
          });
          
          // Track as a custom event too
          window.gtag('event', 'user_engagement', {
            engagement_time_msec: 1000
          });
          
          console.log('🔥 GA tracking forced');
        }

      } catch (error) {
        console.error('Traffic tracking error:', error);
      }
    };

    // Track immediately
    trackVisit();

    // Track engagement after 10 seconds
    const engagementTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'user_engagement', {
          engagement_time_msec: 10000
        });
      }
    }, 10000);

    return () => clearTimeout(engagementTimer);
  }, []);

  return null;
}

// Global gtag interface - using proper Google Analytics types
declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
    dataLayer: Record<string, unknown>[];
  }
}
