'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { IntradayInsightsTables } from '@/components/IntradayInsightsTables';

export function SmartMoneyFlowPageClient() {
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'smart-money-flow') {
      // Stay on current page
      return;
    }
    
    // Navigate to different sections
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'intraday': '/intraday-trades',
      'news': '/news',
      'eodscans': '/eod-scans',
      'algo-trading': '/algo-trading',
    };
    
    const route = routes[section];
    if (route) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation 
        activeSection="smart-money-flow" 
        onSectionChange={handleSectionChange}
      />
      <main className="relative" role="main" aria-label="Smart Money Flow">
        <IntradayInsightsTables />
      </main>
    </div>
  );
} 