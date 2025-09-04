import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface SectorData {
  name: string;
  change: number;
  value: string;
  lastUpdated: Date;
}

export async function GET() {
  try {
    console.log('🔄 API: Fetching sector data from Dhan...');
    
    const response = await fetch('https://dhan.co/all-nse-indices/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // NSE Index mapping - expanded to include major indices
    const nseIndexMapping: Record<string, string> = {
      'IT': 'NIFTY IT',
      'Banking': 'NIFTY BANK', 
      'Pharma': 'NIFTY PHARMA',
      'Auto': 'NIFTY AUTO',
      'FMCG': 'NIFTY FMCG',
      'Energy': 'NIFTY ENERGY',
      'Metals': 'NIFTY METAL',
      'Realty': 'NIFTY REALTY',
      'Nifty 50': 'NIFTY 50',
      'Finnifty': 'FINNIFTY',
      'Healthcare': 'NIFTY HEALTHCARE',
      'Consumption': 'NIFTY CONSUMPTION', 
      'Consumer Durables': 'NIFTY CONSUMER DURABLE',
      'Infrastructure': 'NIFTY INFRA',
      'Media': 'NIFTY MEDIA'
    };
    
    const scrapedSectors: SectorData[] = [];
    
    // Parse the table data
    $('table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        const indexNameText = $(cells[0]).text().trim();
        const ltpText = $(cells[1]).text().trim();
        const changeText = $(cells[2]).text().trim();
        
        // Find matching sector for this NSE index (exact match to avoid duplicates)
        for (const [sectorName, nseIndex] of Object.entries(nseIndexMapping)) {
          if (indexNameText.toLowerCase() === nseIndex.toLowerCase()) {
            const ltp = parseFloat(ltpText.replace(/[^0-9.-]/g, ''));
            const changeMatch = changeText.match(/([-+]?\d+\.?\d*)/);
            const change = changeMatch ? parseFloat(changeMatch[1]) : 0;
            
            if (!isNaN(ltp) && !isNaN(change)) {
              scrapedSectors.push({
                name: sectorName,
                change: Number(change.toFixed(2)),
                value: `₹${Math.round(ltp).toLocaleString('en-IN')}`,
                lastUpdated: new Date()
              });
              break; // Found the sector, move to next row
            }
          }
        }
      }
    });

    console.log(`✅ API: Found ${scrapedSectors.length} sectors from Dhan`);
    
    if (scrapedSectors.length === 0) {
      throw new Error('No sector data found');
    }

    return NextResponse.json({ 
      success: true, 
      data: scrapedSectors,
      scrapedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API: Failed to scrape sector data:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 });
  }
} 