'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { ChevronDown, ChevronRight, HelpCircle, Search } from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Platform',
    question: 'What is TradeSmartMoney?',
    answer: 'TradeSmartMoney is an educational platform that provides market data, analysis examples, and educational content to help users learn about the Indian financial markets. All content is for educational purposes only. Visit our <a href="/" class="text-blue-600 hover:underline font-medium">main platform</a> to explore educational features and start your learning journey.'
  },
  {
    id: '2',
    category: 'Platform',
    question: 'Is TradeSmartMoney free to use?',
    answer: 'We offer both free and premium educational features. Basic market data and educational content are available for free, while advanced educational analytics and premium learning tools require a subscription. All content is for educational purposes only.'
  },
  {
    id: '3',
    category: 'Data',
    question: 'How accurate is your market data?',
    answer: 'We source our data from reliable providers including NSE and BSE. While we strive for accuracy, market data may be delayed by 15-20 minutes for free users. Premium users get near real-time data.'
  },
  {
    id: '4',
    category: 'Data',
    question: 'What is FII/DII data and why is it important?',
    answer: 'FII (Foreign Institutional Investors) and DII (Domestic Institutional Investors) data shows buying and selling activity by institutional investors. This data is crucial as institutional activity often indicates market sentiment and potential price movements.'
  },
  {
    id: '5',
    category: 'Trading',
    question: 'Do you provide investment advice?',
    answer: 'No, TradeSmartMoney does not provide investment advice. We are not SEBI registered advisors. We provide educational content, market analysis examples, and learning tools for educational purposes only. All content is for learning and research purposes. Please consult SEBI registered investment advisors for personalized advice.'
  },
  {
    id: '6',
    category: 'Trading',
    question: 'Can I execute trades directly through your platform?',
    answer: 'No, TradeSmartMoney is an analysis and educational platform. To execute trades, you need to use your broker\'s platform or trading app. We provide analysis to help you make informed decisions.'
  },
  {
    id: '7',
    category: 'Account',
    question: 'Do I need to create an account?',
    answer: 'Basic features are available without an account. However, creating a free account gives you access to personalized watchlists, portfolio tracking, and saved preferences.'
  },
  {
    id: '8',
    category: 'Account',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription anytime from your account settings. Cancellation takes effect at the end of your current billing period, and you retain access until then.'
  },
  {
    id: '9',
    category: 'Technical',
    question: 'Why is the data not loading or showing errors?',
    answer: 'Data issues can occur due to market holidays, technical maintenance, or network problems. Try refreshing the page or clearing your browser cache. If problems persist, contact our support team.'
  },
  {
    id: '10',
    category: 'Technical',
    question: 'Which browsers are supported?',
    answer: 'TradeSmartMoney works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for optimal performance.'
  },
  {
    id: '11',
    category: 'Legal',
    question: 'Are you SEBI registered?',
    answer: 'TradeSmartMoney is not a SEBI registered investment advisor. We provide educational content and analysis tools only. For investment advice, consult qualified, SEBI-registered financial advisors.'
  },
  {
    id: '12',
    category: 'Legal',
    question: 'How do you protect my personal data?',
    answer: 'We take data privacy seriously and follow industry-standard security practices. Please read our Privacy Policy for detailed information about how we collect, use, and protect your data.'
  }
];

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    trackPageView('/faq', 'FAQ');
  }, []);

  const categories = ['All', ...Array.from(new Set(faqData.map(item => item.category)))];

  const toggleItem = (id: string) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id);
    } else {
      newExpandedItems.add(id);
      trackEvent('faq_item_expanded', {
        event_category: 'engagement',
        event_label: id
      });
    }
    setExpandedItems(newExpandedItems);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">
            Find answers to common questions about our trading platform and services.
            New to TradeSmart Money? <Link href="/" className="text-white underline hover:text-blue-200 font-semibold">Explore our platform</Link> to get started.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {item.question}
                  </h3>
                </div>
                {expandedItems.has(item.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedItems.has(item.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="text-gray-700 leading-relaxed pt-4" dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            You can also <Link href="/" className="text-white underline hover:text-blue-200 font-semibold">return to the main platform</Link> to explore our features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </a>
                         <a 
               href="mailto:tradesmartmoneytsm@gmail.com" 
               className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-400 transition-colors"
             >
               Email Us
             </a>
          </div>
        </div>
      </div>
    </div>
  );
} 