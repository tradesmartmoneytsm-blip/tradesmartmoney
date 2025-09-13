/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

interface ValueStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  category: string;
  opportunity: 'OVERSOLD' | 'BREAKOUT' | 'MOMENTUM';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const opportunityType = searchParams.get('type') as 'OVERSOLD' | 'BREAKOUT' | 'MOMENTUM' | null;

    console.log(`🔄 API: Fetching ${opportunityType || 'all'} value buying opportunities...`);

    // Fetch market data
    const response = await fetch('https://groww.in/share-market-today', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TradeSmart/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.status}`);
    }

    const html = await response.text();

    // Extract JSON data from page (handle additional script attributes)
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/);
    if (!nextDataMatch) {
      throw new Error('No market data found on page');
    }

    let jsonData;
    try {
      jsonData = JSON.parse(nextDataMatch[1]);
    } catch {
      throw new Error('Failed to parse market data');
    }

    const stocks: ValueStock[] = [];
    const dataRoot = jsonData?.props?.pageProps?.data;
    
    if (dataRoot) {
      // Look for MOST_VALUABLE stocks section
      const findMostValuable = (obj: any, currentPath = ''): any => {
        if (typeof obj !== 'object' || obj === null) return null;
        
        for (const [key, value] of Object.entries(obj)) {
          const fullPath = currentPath ? `${currentPath}.${key}` : key;
          
          if (key === 'MOST_VALUABLE' && Array.isArray(value)) {
            console.log(`🎯 Found MOST_VALUABLE at: ${fullPath} with ${value.length} items`);
            return value;
          }
          
          if (typeof value === 'object' && value !== null && currentPath.split('.').length < 4) {
            const result = findMostValuable(value, fullPath);
            if (result) return result;
          }
        }
        return null;
      };
      
      const mostValuableStocks = findMostValuable(dataRoot);
      
      if (mostValuableStocks && mostValuableStocks.length > 0) {
        console.log(`✅ Found ${mostValuableStocks.length} stocks in MOST_VALUABLE`);
        
        mostValuableStocks.forEach((item: any, index: number) => {
          if (!item?.company || !item?.stats) {
            console.log(`⚠️ Skipping item ${index + 1}: Missing data`);
            return;
          }
          
          const opportunity = (item.stats.dayChangePerc ?? 0) >= 0 
            ? ((item.stats.dayChangePerc ?? 0) > 1 ? 'BREAKOUT' : 'MOMENTUM')
            : 'OVERSOLD';
          
          if (!opportunityType || opportunity === opportunityType) {
            stocks.push({
              symbol: item.company.nseScriptCode ?? '',
              name: item.company.companyShortName || item.company.companyName || '',
              price: item.stats.ltp ?? 0,
              change: item.stats.dayChange ?? 0,
              changePercent: item.stats.dayChangePerc ?? 0,
              marketCap: item.company.marketCap ?? 0,
              category: 'LARGE_CAP',
              opportunity
            });
          }
          
          console.log(`📈 ${index + 1}. ${item.company.companyShortName} (${item.company.nseScriptCode}): ₹${item.stats.ltp} (${(item.stats.dayChangePerc ?? 0).toFixed(2)}%)`);
        });
      }
    }

    // Sort by change percentage (highest first)
    const sortedStocks = stocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 50);

    console.log(`✅ API: Retrieved ${sortedStocks.length} ${opportunityType || 'value buying'} opportunities`);

    return NextResponse.json({
      success: true,
      data: sortedStocks,
      timestamp: new Date().toISOString(),
      totalOpportunities: sortedStocks.length,
      breakdown: {
        oversold: sortedStocks.filter(s => s.opportunity === 'OVERSOLD').length,
        breakout: sortedStocks.filter(s => s.opportunity === 'BREAKOUT').length,
        momentum: sortedStocks.filter(s => s.opportunity === 'MOMENTUM').length
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60', // 5 minute cache
      },
    });

  } catch (error: unknown) {
    console.error('❌ API: Value buying error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch value buying data',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'public, s-maxage=60', // 1 minute cache for errors
      },
    });
  }
} 