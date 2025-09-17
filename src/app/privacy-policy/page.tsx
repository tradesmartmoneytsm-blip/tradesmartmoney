import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Data Protection & Cookie Policy | TradeSmart Money',
  description: 'Our privacy policy explains how we collect, use, and protect your data. Learn about cookies, Google Analytics, AdSense, and your privacy rights.',
  keywords: 'privacy policy, data protection, cookie policy, Google Analytics, AdSense privacy, user data, GDPR compliance',
  openGraph: {
    title: 'Privacy Policy - Data Protection & Cookie Policy',
    description: 'Our privacy policy explains how we collect, use, and protect your data. Learn about your privacy rights.',
    url: 'https://www.tradesmartmoney.com/privacy-policy',
    siteName: 'TradeSmart Money',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy - TradeSmart Money',
    description: 'Our privacy policy explains how we collect, use, and protect your data.',
  },
  alternates: {
    canonical: 'https://www.tradesmartmoney.com/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
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
              <li>Cookie and tracking data for advertising purposes</li>
              <li>Ad interaction data and preferences</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Advertising and Cookies</h2>
            <p className="text-gray-700 mb-4">
              <strong>Google AdSense:</strong> We use Google AdSense to display advertisements on our website. 
              Google AdSense uses cookies and similar technologies to serve ads based on your prior visits to our website and other websites.
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>We use cookies to enable ad delivery and measure ad effectiveness</li>
              <li>Third-party vendors, including Google, use cookies to serve ads based on your past visits</li>
              <li>Google&apos;s use of the DoubleClick cookie enables it and its partners to serve ads based on your visits to our site and/or other sites</li>
              <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a></li>
              <li>You can also opt out through the <a href="http://www.aboutads.info/choices/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
            </ul>

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

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
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