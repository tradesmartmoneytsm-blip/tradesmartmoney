/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

interface ValueStock {
  symbol: string;
  name: string;
  fullName?: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  category: string;
  high?: number;
  low?: number;
  previousClose?: number;
  imageUrl?: string;
  volume?: number;
  pe?: number;
  pb?: number;
}

export async function GET() {
  try {
    console.log(`🔄 API: Fetching value buying opportunities...`);

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
          
          const company = item.company;
          const stats = item.stats;
          
          // Extract comprehensive data
          const stock: ValueStock = {
            symbol: company.nseScriptCode ?? '',
            name: company.companyShortName || company.companyName || '',
            fullName: company.companyName || company.companyShortName || '',
            price: stats.ltp ?? 0,
            change: stats.dayChange ?? 0,
            changePercent: stats.dayChangePerc ?? 0,
            marketCap: 0, // Not available in Groww's MOST_VALUABLE data
            category: 'LARGE_CAP',
            high: stats.high ?? undefined,
            low: stats.low ?? undefined,
            previousClose: stats.close ?? undefined,
            imageUrl: company.imageUrl ?? undefined,
            volume: stats.volume ?? undefined,
            pe: stats.pe ?? undefined,
            pb: stats.pb ?? undefined
          };
          
          stocks.push(stock);
          
          console.log(`📈 ${index + 1}. ${company.companyShortName} (${company.nseScriptCode}): ₹${stats.ltp} (${(stats.dayChangePerc ?? 0).toFixed(2)}%) | H: ₹${stats.high ?? 'N/A'} L: ₹${stats.low ?? 'N/A'}`);
        });
      }
    }

    // Sort by change percentage (highest first)
    const sortedStocks = stocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 50);

    console.log(`✅ API: Retrieved ${sortedStocks.length} value buying opportunities`);

    return NextResponse.json({
      success: true,
      data: sortedStocks,
      timestamp: new Date().toISOString(),
      totalOpportunities: sortedStocks.length,
      summary: {
        averageChange: sortedStocks.reduce((sum, stock) => sum + stock.changePercent, 0) / sortedStocks.length || 0,
        positiveStocks: sortedStocks.filter(stock => stock.changePercent > 0).length,
        averagePrice: sortedStocks.reduce((sum, stock) => sum + stock.price, 0) / sortedStocks.length || 0,
        priceRange: {
          min: Math.min(...sortedStocks.map(s => s.price)),
          max: Math.max(...sortedStocks.map(s => s.price))
        }
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