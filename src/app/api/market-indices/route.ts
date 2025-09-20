import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface MarketIndex {
  name: string;
  displayName: string;
  current: number;
  change: number;
  changePercent: number;
}

export async function GET() {
  try {
    const response = await fetch('https://dhan.co/all-nse-indices/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 900 } // 15 minutes cache
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Target NSE indices
    const targetIndices = {
      'Nifty 50': 'Nifty',
      'Nifty Bank': 'Bank Nifty',
      'Finnifty': 'Finnifty',
      'India VIX': 'India VIX'
    };

    const marketIndices: MarketIndex[] = [];

    // Parse table rows to find our target indices
                $('table tr').each((_index: number, rowElement) => {
        const cells = $(rowElement).find('td');
      if (cells.length >= 3) {
        const nameCell = $(cells[0]).text().trim();
        const priceCell = $(cells[1]).text().trim();
        const changeCell = $(cells[2]).text().trim();

        Object.entries(targetIndices).forEach(([key, displayName]) => {
          if (nameCell === key && !marketIndices.find(item => item.displayName === displayName)) {
            const current = parseFloat(priceCell.replace(/,/g, ''));
            const changeMatch = changeCell.match(/([-+]?\d+\.?\d*)%/);
            const changePercent = changeMatch ? parseFloat(changeMatch[1]) : 0;
            const change = (current * changePercent) / 100;

            if (!isNaN(current) && !isNaN(changePercent)) {
              marketIndices.push({
                name: key,
                displayName,
                current,
                change: Math.round(change * 100) / 100,
                changePercent: Math.round(changePercent * 100) / 100
              });
            }
          }
        });
      }
    });

    if (marketIndices.length === 0) {
      // Return fallback data if scraping fails
      const fallbackData = [
        { name: 'Nifty_50', displayName: 'Nifty', current: 24741.00, change: 7.40, changePercent: 0.03 },
        { name: 'Bank_Nifty', displayName: 'Bank Nifty', current: 54114.55, change: 37.85, changePercent: 0.07 },
        { name: 'Finnifty', displayName: 'Finnifty', current: 25889.30, change: 36.15, changePercent: 0.14 },
        { name: 'India_VIX', displayName: 'India VIX', current: 13.42, change: -0.18, changePercent: -1.32 }
      ];

      return NextResponse.json({
        success: true,
        message: 'Using fallback market data due to scraping issues',
        data: fallbackData,
        source: 'fallback_static',
        count: fallbackData.length,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Market indices data retrieved successfully',
      data: marketIndices,
      count: marketIndices.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Market indices API error:', error);
    
    // Return fallback data on complete failure
    const fallbackData = [
      { name: 'Nifty_50', displayName: 'Nifty', current: 24741.00, change: 7.40, changePercent: 0.03 },
      { name: 'Bank_Nifty', displayName: 'Bank Nifty', current: 54114.55, change: 37.85, changePercent: 0.07 },
      { name: 'Finnifty', displayName: 'Finnifty', current: 25889.30, change: 36.15, changePercent: 0.14 },
      { name: 'India_VIX', displayName: 'India VIX', current: 13.42, change: -0.18, changePercent: -1.32 }
    ];

    return NextResponse.json({
      success: true,
      message: 'Using fallback market data due to API error',
      data: fallbackData,
      source: 'fallback_error',
      count: fallbackData.length,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 