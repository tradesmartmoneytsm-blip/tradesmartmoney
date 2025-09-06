'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function TermsOfService() {
  useEffect(() => {
    trackPageView('/terms-of-service', 'Terms of Service');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-6">
              By accessing and using TradeSmartMoney ("the Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-6">
              TradeSmartMoney provides financial market analysis, trading signals, educational content, and market data 
              for informational purposes. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Real-time market data and sector performance analysis</li>
              <li>FII/DII activity tracking and reporting</li>
              <li>Trading educational content and algorithmic trading strategies</li>
              <li>Market news and analysis</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">As a user of our service, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li>Provide accurate and current information when creating an account</li>
              <li>Use the service for lawful purposes only</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not redistribute or resell our content without permission</li>
              <li>Make your own independent investment decisions</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Investment Disclaimer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-gray-700 font-semibold">
                IMPORTANT: All information provided on TradeSmartMoney is for educational and informational purposes only. 
                We do not provide investment advice, and you should not construe any information as such.
              </p>
            </div>
            <p className="text-gray-700 mb-6">
              Trading and investing in financial markets involves substantial risk of loss and is not suitable for every investor. 
              Past performance does not guarantee future results. You should carefully consider your financial situation and 
              consult with financial advisors before making any investment decisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-6">
              All content on TradeSmartMoney, including but not limited to text, graphics, logos, images, software, 
              and data compilations, is the property of TradeSmartMoney or its content suppliers and is protected by 
              international copyright laws.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              TradeSmartMoney shall not be liable for any direct, indirect, incidental, special, or consequential damages 
              resulting from the use or inability to use our service, including but not limited to damages for loss of profits, 
              business interruption, or loss of information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Service Availability</h2>
            <p className="text-gray-700 mb-6">
              We strive to maintain high availability of our services but do not guarantee uninterrupted access. 
              We may temporarily suspend service for maintenance, updates, or other operational requirements.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Data Accuracy</h2>
            <p className="text-gray-700 mb-6">
              While we make every effort to ensure the accuracy of our data, we cannot guarantee that all information 
              is accurate, complete, or current. Market data may be delayed, and you should verify information from 
              primary sources before making trading decisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-6">
              We may terminate your access to the service at any time without notice for conduct that we believe 
              violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 mb-6">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting 
              on our website. Your continued use of the service constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              Email: legal@tradesmartmoney.com
              <br />
              Address: [Your Business Address]
            </p>

            <p className="text-sm text-gray-500 mt-8">
              By using TradeSmartMoney, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 