'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Shield, Settings } from 'lucide-react';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    // Initialize Google Analytics and AdSense
    initializeTrackingServices();
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
  };

  const initializeTrackingServices = () => {
    // This will be called when user accepts all cookies
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        personalization_storage: 'granted',
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
              <Cookie className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍪 We value your privacy
              </h3>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze traffic, and serve personalized ads. 
                This helps us provide better services and support our platform. 
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 hover:underline ml-1 font-medium"
                >
                  Learn more
                </button>
              </p>

              {showDetails && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
                  <h4 className="font-semibold mb-2 text-gray-900">Cookie Categories:</h4>
                  <div className="space-y-2 text-gray-700">
                    <div>
                      <strong>Essential Cookies:</strong> Required for basic site functionality and security.
                    </div>
                    <div>
                      <strong>Analytics Cookies:</strong> Help us understand how you use our site to improve performance.
                    </div>
                    <div>
                      <strong>Advertising Cookies:</strong> Used to show relevant ads and measure campaign effectiveness.
                    </div>
                    <div>
                      <strong>Personalization:</strong> Remember your preferences for a customized experience.
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Accept All
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Necessary Only
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3">
                By continuing to use our site, you consent to our use of cookies. 
                Read our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for details.
              </p>
            </div>

            <button
              onClick={() => setShowBanner(false)}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {showBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-40" />
      )}
    </>
  );
} 