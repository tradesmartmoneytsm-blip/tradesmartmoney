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
  parameters?: Record<string, string | number | boolean>
) => {
  if (!isGoogleAnalyticsConfigured()) return;

  window.gtag('event', event_name, parameters);
};

// Track conversions and business events
export const trackConversion = {
  // Email signup conversion
  emailSignup: (method: string = 'unknown') => {
    trackEvent('sign_up', {
      method: method,
      event_category: 'conversion',
      value: 1
    });
  },

  // Scanner usage conversion
  useAdvancedScanner: () => {
    trackEvent('use_advanced_scanner', {
      event_category: 'conversion',
      event_label: 'Advanced Options Scanner',
      value: 5
    });
  },

  // Platform feature usage
  useFiiDiiTracker: () => {
    trackEvent('use_fii_dii_tracker', {
      event_category: 'conversion',
      event_label: 'FII DII Tracker',
      value: 3
    });
  },

  // Contact/inquiry
  contactInquiry: (method: string = 'contact_form') => {
    trackEvent('generate_lead', {
      method: method,
      event_category: 'conversion',
      value: 10
    });
  }
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
  },

  // Track time spent on platform features
  timeSpent: (section: string, seconds: number) => {
    trackEvent('time_on_section', {
      event_category: 'engagement',
      event_label: section,
      value: seconds
    });
  }
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string | Date, config?: Record<string, unknown>) => void;
  }
} 