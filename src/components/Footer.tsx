'use client';

import Link from 'next/link';
import { TrendingUp, Mail, Shield, FileText, HelpCircle, Building2, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Information */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">TradeSmartMoney</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Professional trading platform providing real-time market data, analysis, and educational content 
              to empower smart investment decisions in the Indian financial markets.
            </p>
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:tradesmartmoneytsm@gmail.com" className="hover:text-white transition-colors">
                tradesmartmoneytsm@gmail.com
              </a>
            </div>
            
            {/* Social Media Links */}
            <div>
              <h4 className="font-semibold text-gray-300 mb-3 text-sm">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/tradesmartmoneytsm/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/tradesmartmoney" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@tradesmartmoney" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/market" className="text-gray-300 hover:text-white transition-colors">
                  Market Analysis
                </Link>
              </li>
              <li>
                <Link href="/swing-trades" className="text-gray-300 hover:text-white transition-colors">
                  Swing Trades
                </Link>
              </li>
              <li>
                <Link href="/intraday-trades" className="text-gray-300 hover:text-white transition-colors">
                  Intraday Trades
                </Link>
              </li>
              <li>
                <Link href="/eod-scans" className="text-gray-300 hover:text-white transition-colors">
                  EOD Scans
                </Link>
              </li>
              <li>
                <Link href="/algo-trading" className="text-gray-300 hover:text-white transition-colors">
                  Algo Trading
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                  Market News
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Building2 className="h-3 w-3 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <HelpCircle className="h-3 w-3 mr-2" />
                  FAQ
                </Link>
              </li>
                             <li>
                 <a 
                   href="mailto:tradesmartmoneytsm@gmail.com" 
                   className="text-gray-300 hover:text-white transition-colors"
                 >
                   Careers
                 </a>
               </li>
                             <li>
                 <a 
                   href="mailto:tradesmartmoneytsm@gmail.com" 
                   className="text-gray-300 hover:text-white transition-colors"
                 >
                   Partnerships
                 </a>
               </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Legal & Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Shield className="h-3 w-3 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="h-3 w-3 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Shield className="h-3 w-3 mr-2" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Shield className="h-3 w-3 mr-2 text-yellow-400" />
                  Financial Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} TradeSmartMoney. All rights reserved.
              </p>
              <p className="text-gray-300 text-xs mt-1">
                Made with ❤️ for Indian traders and investors
              </p>
            </div>

            {/* Important Disclaimers */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-xs leading-relaxed max-w-md">
                <span className="font-semibold text-yellow-400">Risk Warning:</span> Trading involves substantial risk of loss. 
                Past performance does not guarantee future results. 
                <Link href="/disclaimer" className="underline hover:text-white ml-1">
                  Read full disclaimer
                </Link>
              </p>
            </div>
          </div>

          {/* Compliance Information */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-300">
              <div>
                <h4 className="font-semibold text-gray-400 mb-2">Data Sources & Disclaimers</h4>
                <p className="leading-relaxed">
                  Market data provided by NSE, BSE and other exchanges. 
                  TradeSmartMoney does not guarantee accuracy of data and is not liable for any trading decisions made using this information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400 mb-2">Investment Advisory Disclaimer</h4>
                <p className="leading-relaxed">
                  TradeSmartMoney is not a SEBI registered investment advisor. We provide educational content and analysis tools only. 
                  Consult qualified financial advisors before making investment decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Version & Build Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-center">
                          <p className="text-gray-200 text-xs">
              Platform v1.0.0 • Built with Next.js & Real-time Data APIs • 
              <span className="ml-2">
                Last updated: {new Date().toISOString().split('T')[0]}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 