'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackPageView } from '@/lib/analytics';
import { Shield, Home } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    trackPageView('/privacy-policy', 'Privacy Policy');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-blue-100 mb-8">
            Learn how we protect your data and respect your privacy on our trading platform.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Access Trading Platform
            </Link>
            <Link 
              href="/contact" 
              className="bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-400 transition-colors inline-flex items-center justify-center shadow-lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              At TradeSmartMoney, we collect information you provide directly to us, such as when you create an account, 
              use our trading analysis tools, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Personal information (name, email address, phone number)</li>
              <li>Trading preferences and investment goals</li>
              <li>Usage data and analytics through Google Analytics</li>
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Cookie and tracking data for analytics purposes</li>
            </ul>

            <h2 id="cookies" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Cookies and Analytics</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to analyze traffic and improve user experience.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Analytics cookies help us understand website usage and improve our services</li>
              <li>We use Google Analytics to track website performance and user behavior</li>
              <li>You can opt out of Google Analytics by visiting <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2a. Third-Party Advertising (Google AdSense)</h2>
            <p className="text-gray-700 mb-4">
              We use Google AdSense to display advertisements on our website. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to our website and other websites on the Internet.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites</li>
              <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet</li>
              <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
              <li>You can also opt out of a third-party vendor&apos;s use of cookies by visiting the <a href="http://www.networkadvertising.org/managing/opt_out.asp" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative opt-out page</a></li>
            </ul>
            <p className="text-gray-700 mb-6">
              For more information on Google&apos;s privacy policy, please visit <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google&apos;s Advertising Privacy Policy</a>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Provide, maintain, and improve our trading analysis services</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Analyze market trends and user preferences</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Google Analytics</h2>
            <p className="text-gray-700 mb-4">
              We use Google Analytics to understand how our website is used. Google Analytics collects information 
              such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site.
            </p>
            <p className="text-gray-700 mb-6">
              You can opt-out of Google Analytics by installing the 
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 underline">
                Google Analytics opt-out browser add-on
              </a>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. 
              We may share information with trusted service providers who assist us in operating our website and conducting our business.
            </p>

            <h2 id="data-security" className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Contact Us</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: tradesmartmoneytsm@gmail.com
              <br />
              Address: Pune, Maharashtra, India
            </p>

            <p className="text-sm text-gray-500 mt-8">
              This privacy policy is effective as of the date stated above and will remain in effect except with respect to any 
              changes in its provisions in the future, which will be in effect immediately after being posted on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 