// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Check if GA is configured
export const isGoogleAnalyticsConfigured = () => {
  return !!GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== '';
};

// Initialize Google Analytics
export const initGA = () => {
  if (!isGoogleAnalyticsConfigured()) {
    console.log('⚠️ Google Analytics not configured');
    return;
  }

  // Global site tag (gtag.js) - Google Analytics
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

// Track page views
export const trackPageView = (page_path: string, page_title?: string) => {
  if (!isGoogleAnalyticsConfigured()) return;

  window.gtag('event', 'page_view', {
    page_path,
    page_title: page_title || document.title,
    page_location: window.location.href,
  });
};

// Track custom events
export const trackEvent = (
  event_name: string, 
  parameters?: Record<string, any>
) => {
  if (!isGoogleAnalyticsConfigured()) return;

  window.gtag('event', event_name, parameters);
};

// Track business events
export const trackBusinessEvent = {
  // Track when user views FII/DII data
  viewFiiDiiData: () => {
    trackEvent('view_fii_dii_data', {
      event_category: 'engagement',
      event_label: 'FII DII Activity'
    });
  },

  // Track when user views sector performance
  viewSectorPerformance: () => {
    trackEvent('view_sector_performance', {
      event_category: 'engagement',
      event_label: 'Sector Performance'
    });
  },

  // Track manual refresh actions
  manualRefresh: (section: string) => {
    trackEvent('manual_refresh', {
      event_category: 'user_interaction',
      event_label: section
    });
  },

  // Track navigation between sections
  navigate: (from: string, to: string) => {
    trackEvent('navigation', {
      event_category: 'user_interaction',
      from_section: from,
      to_section: to
    });
  }
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 