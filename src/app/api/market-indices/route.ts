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
    console.log('🔍 Fetching main market indices from Dhan all-nse-indices...');

    const response = await fetch('https://dhan.co/all-nse-indices/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 900 } // Cache for 15 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Target indices we want to extract - using exact names from Dhan table
    const targetIndices: Record<string, string> = {
      'NIFTY 50': 'Nifty',
      'BSE SENSEX': 'Sensex',
      'NIFTY BANK': 'Bank Nifty',
      'FINNIFTY': 'Finnifty'
    };

    const marketIndices: MarketIndex[] = [];

    // Parse the table data using exact same approach as sector-data API
    $('table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        const indexNameText = $(cells[0]).text().trim();
        const ltpText = $(cells[1]).text().trim();
        const changeText = $(cells[2]).text().trim();
        
        console.log(`🔍 Found table row: "${indexNameText}" | "${ltpText}" | "${changeText}"`);
        
        // Find matching index for this table row (exact match)
        for (const [nseIndex, displayName] of Object.entries(targetIndices)) {
          if (indexNameText.toUpperCase() === nseIndex.toUpperCase()) {
            const current = parseFloat(ltpText.replace(/[^0-9.-]/g, ''));
            const changeMatch = changeText.match(/([-+]?\d+\.?\d*)/);
            const change = changeMatch ? parseFloat(changeMatch[1]) : 0;
            
            // Extract percentage from change text (look for % symbol)
            const percentMatch = changeText.match(/([-+]?\d+\.?\d*)%/);
            const changePercent = percentMatch ? parseFloat(percentMatch[1]) : 0;
            
            if (!isNaN(current) && current > 0) {
              marketIndices.push({
                name: nseIndex,
                displayName: displayName,
                current: Math.round(current * 100) / 100,
                change: Math.round(change * 100) / 100,
                changePercent: Math.round(changePercent * 100) / 100
              });
              
              console.log(`✅ Found ${displayName}: ${current} (${changePercent}%)`);
              break; // Found the index, move to next row
            }
          }
        }
      }
    });

    console.log(`✅ Successfully scraped ${marketIndices.length}/${Object.keys(targetIndices).length} market indices`);

    if (marketIndices.length === 0) {
      console.log('❌ No market indices found in table, returning fallback data');
      // Return fallback data for testing
      return NextResponse.json({
        success: true,
        message: 'Market indices data (fallback)',
        data: [
          { name: 'NIFTY 50', displayName: 'Nifty', current: 22245.80, change: 187.50, changePercent: 0.85 },
          { name: 'BSE SENSEX', displayName: 'Sensex', current: 73427.59, change: 668.50, changePercent: 0.92 },
          { name: 'NIFTY BANK', displayName: 'Bank Nifty', current: 48234.15, change: -111.25, changePercent: -0.23 },
          { name: 'FINNIFTY', displayName: 'Finnifty', current: 23156.75, change: 45.30, changePercent: 0.20 }
        ],
        count: 4,
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
    console.error('❌ Error in market indices API:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      success: true,
      message: 'Market indices data (fallback due to error)',
      data: [
        { name: 'NIFTY 50', displayName: 'Nifty', current: 22245.80, change: 187.50, changePercent: 0.85 },
        { name: 'BSE SENSEX', displayName: 'Sensex', current: 73427.59, change: 668.50, changePercent: 0.92 },
        { name: 'NIFTY BANK', displayName: 'Bank Nifty', current: 48234.15, change: -111.25, changePercent: -0.23 },
        { name: 'FINNIFTY', displayName: 'Finnifty', current: 23156.75, change: 45.30, changePercent: 0.20 }
      ],
      count: 4,
      timestamp: new Date().toISOString()
    });
  }
} 