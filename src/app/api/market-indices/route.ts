import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface MarketIndex {
  name: string;
  displayName: string;
  current: number;
  change: number;
  changePercent: number;
}

interface YahooFinanceData {
  chart: {
    result: [{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        regularMarketChange?: number;
        regularMarketChangePercent?: number;
        currency: string;
        symbol: string;
      }
    }]
  }
}

export async function GET() {
  try {
    console.log('🔍 Fetching market indices - trying Yahoo Finance first...');

    // Yahoo Finance API endpoints for Indian indices
    const yahooEndpoints = {
      'NIFTY 50': '^NSEI',
      'Bank Nifty': '^NSEBANK',
      'BSE Sensex': '^BSESN',
      'Finnifty': 'NIFTY_FIN_SERVICE.NS'
    };

    const marketIndices: MarketIndex[] = [];

    // Try Yahoo Finance API first
    try {
      const yahooPromises = Object.entries(yahooEndpoints).map(async ([displayName, symbol]) => {
        try {
          const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (!response.ok) {
            throw new Error(`Yahoo API failed for ${displayName}: ${response.status}`);
          }

          const data: YahooFinanceData = await response.json();
          const meta = data.chart.result[0].meta;

          // Calculate change from current price and previous close
          const current = meta.regularMarketPrice;
          const previousClose = meta.previousClose;
          const change = current - previousClose;
          const changePercent = (change / previousClose) * 100;

          return {
            name: symbol,
            displayName,
            current,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100
          };
        } catch (error) {
          console.warn(`⚠️ Yahoo API failed for ${displayName}:`, error);
          return null;
        }
      });

      const yahooResults = await Promise.all(yahooPromises);
      const validResults = yahooResults.filter(result => result !== null);

      if (validResults.length > 0) {
        console.log(`✅ Yahoo Finance: Successfully fetched ${validResults.length}/4 indices`);
        marketIndices.push(...validResults as MarketIndex[]);
      } else {
        throw new Error('All Yahoo Finance requests failed');
      }
    } catch (yahooError) {
      console.warn('⚠️ Yahoo Finance API failed completely:', yahooError);
      console.log('🔄 Falling back to Dhan scraping...');

      // Fallback to Dhan scraping
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
        throw new Error(`Dhan fallback failed: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

             const targetIndices = {
         'Nifty 50': 'Nifty',
         'Nifty Bank': 'Bank Nifty',
         'BSE Sensex': 'Sensex', 
         'Finnifty': 'Finnifty'
       };

      // Parse table rows
      $('table tr').each((_, row) => {
        const cells = $(row).find('td');
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
                console.log(`✅ Found ${displayName}: ${current} (${changePercent}%)`);
                marketIndices.push({
                  name: key,
                  displayName,
                  current,
                  change,
                  changePercent
                });
              }
            }
          });
        }
      });

      if (marketIndices.length === 0) {
        throw new Error('Dhan fallback also failed to find any indices');
      }

      console.log(`✅ Dhan Fallback: Successfully scraped ${marketIndices.length}/4 market indices`);
    }

    // Final fallback data if both APIs fail
    if (marketIndices.length === 0) {
      console.warn('⚠️ Both Yahoo and Dhan failed, using fallback data');
      marketIndices.push(
        { name: 'NIFTY_50', displayName: 'Nifty', current: 24741.00, change: 7.40, changePercent: 0.03 },
        { name: 'BANK_NIFTY', displayName: 'Bank Nifty', current: 54114.55, change: 37.85, changePercent: 0.07 },
        { name: 'BSE_SENSEX', displayName: 'Sensex', current: 81741.73, change: 98.89, changePercent: 0.12 },
        { name: 'FINNIFTY', displayName: 'Finnifty', current: 25889.30, change: 36.15, changePercent: 0.14 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Market indices data retrieved successfully',
      data: marketIndices,
      source: marketIndices.length > 2 ? 'yahoo_finance' : 'dhan_fallback',
      count: marketIndices.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Market indices API error:', error);
    
    // Return fallback data on complete failure
    const fallbackData = [
      { name: 'NIFTY_50', displayName: 'Nifty', current: 24741.00, change: 7.40, changePercent: 0.03 },
      { name: 'BANK_NIFTY', displayName: 'Bank Nifty', current: 54114.55, change: 37.85, changePercent: 0.07 },
      { name: 'BSE_SENSEX', displayName: 'Sensex', current: 81741.73, change: 98.89, changePercent: 0.12 },
      { name: 'FINNIFTY', displayName: 'Finnifty', current: 25889.30, change: 36.15, changePercent: 0.14 }
    ];

    return NextResponse.json({
      success: true,
      message: 'Using fallback market data due to API issues',
      data: fallbackData,
      source: 'fallback_static',
      count: fallbackData.length,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 