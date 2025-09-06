'use client';

import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

export default function Disclaimer() {
  useEffect(() => {
    trackPageView('/disclaimer', 'Financial Disclaimer');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Disclaimer</h1>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">⚠️ IMPORTANT RISK WARNING</h2>
            <p className="text-red-700 font-medium">
              Trading in financial markets carries a high level of risk and may not be suitable for all investors. 
              You could lose some or all of your initial investment. Never invest money you cannot afford to lose.
            </p>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. No Investment Advice</h2>
            <p className="text-gray-700 mb-6">
              TradeSmartMoney provides educational content, market analysis, and informational resources only. 
              <strong> We do not provide investment advice, financial planning, or recommendations to buy or sell any security.</strong> 
              All content is for educational and informational purposes only and should not be construed as professional financial advice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Risk of Trading</h2>
            <p className="text-gray-700 mb-4">
              Trading and investing in financial markets involves substantial risk, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6">
              <li><strong>Market Risk:</strong> Prices can move against your position</li>
              <li><strong>Liquidity Risk:</strong> You may not be able to exit positions when desired</li>
              <li><strong>Leverage Risk:</strong> Borrowed money amplifies both gains and losses</li>
              <li><strong>System Risk:</strong> Technical failures can impact trading</li>
              <li><strong>Regulatory Risk:</strong> Changes in regulations may affect markets</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Past Performance</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-gray-700 font-semibold">
                Past performance is not indicative of future results. Any historical returns, expected returns, 
                or probability projections may not reflect actual future performance.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Data Accuracy and Delays</h2>
            <p className="text-gray-700 mb-6">
              While we strive to provide accurate and timely information, we cannot guarantee the accuracy, 
              completeness, or timeliness of any data or information. Market data may be delayed by 15-20 minutes 
              or more. Always verify information from primary sources before making trading decisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. No Guarantee of Profits</h2>
            <p className="text-gray-700 mb-6">
              There is no guarantee that you will make money using our tools, strategies, or information. 
              Many factors affect trading results, including market conditions, your risk tolerance, and execution timing. 
              You should never risk more than you can afford to lose.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Professional Advice</h2>
            <p className="text-gray-700 mb-6">
              Before making any financial decisions, you should consult with qualified financial advisors, 
              tax professionals, or legal counsel who can provide advice tailored to your specific situation. 
              We are not licensed financial advisors, brokers, or investment professionals.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Regulatory Compliance</h2>
            <p className="text-gray-700 mb-6">
              Trading regulations vary by jurisdiction. You are responsible for ensuring that your trading activities 
              comply with all applicable laws and regulations in your country or region. We do not provide legal 
              or regulatory advice.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Third-Party Content</h2>
            <p className="text-gray-700 mb-6">
              Our platform may include content, data, or analysis from third-party sources. We do not endorse 
              or guarantee the accuracy of third-party content and are not responsible for any decisions made 
              based on such information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              Under no circumstances shall TradeSmartMoney be liable for any financial losses, trading losses, 
              or any other damages arising from the use of our platform or services. You use our services at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Your Responsibility</h2>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-gray-700">
                <strong>By using TradeSmartMoney, you acknowledge that:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 mt-2">
                <li>You understand the risks involved in trading</li>
                <li>You are making independent investment decisions</li>
                <li>You will not hold us responsible for any losses</li>
                <li>You will seek professional advice when appropriate</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 mb-6">
              If you have questions about this disclaimer, please contact us at:
              <br />
              Email: tradesmartmoneytsm@gmail.com
            </p>

            <p className="text-sm text-gray-500 mt-8 font-semibold">
              This disclaimer is effective as of {new Date().toLocaleDateString()} and forms an integral part of our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 