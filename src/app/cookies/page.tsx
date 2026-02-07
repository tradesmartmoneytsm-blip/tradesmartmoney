'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { trackPageView } from '@/lib/analytics';
import { Cookie, Home, Shield } from 'lucide-react';

export default function CookiePolicy() {
  useEffect(() => {
    trackPageView('/cookies', 'Cookie Policy');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Cookie className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-xl text-blue-100 mb-8">
            Learn how we use cookies and similar technologies to enhance your experience on TradeSmartMoney.
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
              href="/privacy-policy" 
              className="bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-blue-400 transition-colors inline-flex items-center justify-center shadow-lg"
            >
              <Shield className="w-5 h-5 mr-2" />
              Privacy Policy
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
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-6">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to website owners.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">
              TradeSmartMoney uses cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Understand how you use our platform and improve user experience</li>
              <li>Remember your preferences and settings</li>
              <li>Provide personalized content and features</li>
              <li>Analyze traffic and usage patterns</li>
              <li>Enable security features and prevent fraud</li>
              <li>Deliver relevant advertisements (when applicable)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Types of Cookies We Use</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Essential Cookies (Required)</h3>
              <p className="text-blue-800 text-sm">
                These cookies are necessary for the website to function properly. They enable basic features like 
                page navigation, access to secure areas, and session management. The website cannot function 
                properly without these cookies.
              </p>
              <div className="mt-3 text-blue-800 text-sm">
                <strong>Examples:</strong> Session cookies, authentication tokens, security cookies
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">2. Analytics Cookies (Optional)</h3>
              <p className="text-green-800 text-sm">
                These cookies help us understand how visitors interact with our website by collecting and 
                reporting information anonymously. We use Google Analytics to track website usage, page views, 
                and user behavior patterns.
              </p>
              <div className="mt-3 text-green-800 text-sm">
                <strong>Examples:</strong> _ga, _gid, _gat (Google Analytics cookies)
              </div>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">3. Functional Cookies (Optional)</h3>
              <p className="text-purple-800 text-sm">
                These cookies enable enhanced functionality and personalization, such as remembering your 
                preferences (e.g., theme selection, language), and providing personalized features.
              </p>
              <div className="mt-3 text-purple-800 text-sm">
                <strong>Examples:</strong> User preferences, theme settings, display settings
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">4. Advertising Cookies (Optional - If AdSense Approved)</h3>
              <p className="text-yellow-800 text-sm">
                When we implement Google AdSense, advertising cookies will be used to deliver relevant 
                advertisements and measure their effectiveness. These cookies track your browsing activity 
                to show you ads that might interest you.
              </p>
              <div className="mt-3 text-yellow-800 text-sm">
                <strong>Examples:</strong> Google AdSense cookies, remarketing cookies
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use services from trusted third-party providers who may also set cookies on your device:
            </p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Purpose
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      More Info
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">Google Analytics</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Website analytics and performance tracking</td>
                    <td className="px-4 py-3 text-sm">
                      <a 
                        href="https://policies.google.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">Google AdSense</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Personalized advertising (when approved)</td>
                    <td className="px-4 py-3 text-sm">
                      <a 
                        href="https://policies.google.com/technologies/ads" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ad Policies
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-gray-700">Supabase</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Authentication and database services</td>
                    <td className="px-4 py-3 text-sm">
                      <a 
                        href="https://supabase.com/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How to Manage Cookies</h2>
            <p className="text-gray-700 mb-4">
              You have several options to manage and control cookies:
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h3>
              <p className="text-gray-700 mb-3">
                Most web browsers allow you to control cookies through their settings. You can typically:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>View what cookies are stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Clear cookies when you close your browser</li>
              </ul>
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Blocking or deleting cookies may impact your ability to use certain 
                features of our website.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Browser-Specific Instructions:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong className="text-gray-900">Google Chrome:</strong>
                    <a 
                      href="https://support.google.com/chrome/answer/95647" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Cookie Settings
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong className="text-gray-900">Mozilla Firefox:</strong>
                    <a 
                      href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Cookie Settings
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong className="text-gray-900">Safari:</strong>
                    <a 
                      href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Cookie Settings
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong className="text-gray-900">Microsoft Edge:</strong>
                    <a 
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      Cookie Settings
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Opt-Out Options</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Google Analytics Opt-Out</h3>
                <p className="text-blue-800 text-sm mb-2">
                  You can prevent Google Analytics from collecting your data by installing the official 
                  Google Analytics Opt-out Browser Add-on.
                </p>
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  Download Opt-Out Add-on
                </a>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Google Ads Opt-Out</h3>
                <p className="text-purple-800 text-sm mb-2">
                  You can customize or opt-out of personalized Google ads through Google&apos;s Ads Settings.
                </p>
                <a 
                  href="https://adssettings.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm"
                >
                  Manage Ad Settings
                </a>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Network Advertising Initiative (NAI)</h3>
                <p className="text-green-800 text-sm mb-2">
                  Opt-out of interest-based advertising from NAI member companies.
                </p>
                <a 
                  href="https://optout.networkadvertising.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                >
                  NAI Opt-Out
                </a>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Do Not Track (DNT)</h2>
            <p className="text-gray-700 mb-6">
              Some browsers have a &quot;Do Not Track&quot; (DNT) feature that signals to websites that you don&apos;t want to 
              have your online activity tracked. Currently, there is no industry standard for how to respond to DNT 
              signals. At this time, our website does not respond to DNT browser settings or signals.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Mobile Device Identifiers</h2>
            <p className="text-gray-700 mb-6">
              When you access our platform through a mobile device, we may collect unique device identifiers 
              (such as IDFA on iOS or Advertising ID on Android). You can reset or limit ad tracking through 
              your device settings:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>iOS:</strong> Settings → Privacy → Advertising → Limit Ad Tracking</li>
              <li><strong>Android:</strong> Settings → Google → Ads → Opt out of Ads Personalization</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cookie Retention</h2>
            <p className="text-gray-700 mb-6">
              Cookies have different lifespans:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 2 years) or until you manually delete them</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              operational, legal, or regulatory reasons. We encourage you to review this page periodically 
              for the latest information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                <strong>Email:</strong> tradesmartmoneytsm@gmail.com
                <br />
                <strong>Website:</strong>{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  www.tradesmartmoney.com
                </Link>
                <br />
                <strong>Contact Page:</strong>{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  Contact Us Form
                </Link>
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
              <h3 className="font-semibold text-blue-900 mb-2">Related Policies</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  {' '}- Learn how we collect and use your personal data
                </div>
                <div>
                  <Link href="/terms-of-service" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>
                  {' '}- Understand the terms of using our platform
                </div>
                <div>
                  <Link href="/disclaimer" className="text-blue-600 hover:underline">
                    Financial Disclaimer
                  </Link>
                  {' '}- Important risk warnings and disclosures
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-8 italic">
              This Cookie Policy is effective as of {new Date().toLocaleDateString()} and was last updated on {new Date().toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
