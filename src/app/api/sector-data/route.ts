import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { getWebScrapingHeaders } from '@/lib/api-headers';

interface SectorData {
  name: string;
  change: number;
  changePercent?: number;
  value: string;
  lastUpdated: Date;
}

export async function GET() {
  try {
    console.log('🔄 API: Fetching sector data...');
    
    const response = await fetch('https://dhan.co/all-nse-indices/', {
      headers: getWebScrapingHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // NSE Index mapping - expanded to include major indices
    const nseIndexMapping: Record<string, string> = {
      'IT': 'NIFTY IT',
      'NIFTY BANK': 'NIFTY BANK',
      'PSU Bank': 'NIFTY PSU BANK',
      'Private Bank': 'NIFTY PRIVATE BANK',
      'Pharma': 'NIFTY PHARMA',
      'Auto': 'NIFTY AUTO',
      'FMCG': 'NIFTY FMCG',
      'Energy': 'NIFTY ENERGY',
      'Oil & Gas': 'NIFTY OIL AND GAS',
      'Metals': 'NIFTY METAL',
      'Realty': 'NIFTY REALTY',
      'Nifty 50': 'NIFTY 50',
      'Finnifty': 'FINNIFTY',
      'Healthcare': 'NIFTY HEALTHCARE',
      'Consumption': 'NIFTY CONSUMPTION', 
      'CONSR DURBL': 'NIFTY CONSUMER DURABLE',
      'Infrastructure': 'NIFTY INFRA',
      'Media': 'NIFTY MEDIA'
    };
    
    const scrapedSectors: SectorData[] = [];
    
    // Log the first few rows for debugging
    console.log('📊 Parsing table data...');
    const firstRow = $('table tr').first();
    console.log('First row HTML:', firstRow.html()?.substring(0, 200));
    
    // Parse the table data
    $('table tr').each((index, row) => {
      const cells = $(row).find('td');
      
      // Log first 3 rows for debugging
      if (index < 3) {
        console.log(`Row ${index}: ${cells.length} cells`);
        if (cells.length >= 3) {
          console.log(`  - Cell 0: ${$(cells[0]).text().trim()}`);
          console.log(`  - Cell 1: ${$(cells[1]).text().trim()}`);
          console.log(`  - Cell 2: ${$(cells[2]).text().trim()}`);
        }
      }
      
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

    console.log(`✅ API: Found ${scrapedSectors.length} sectors`);
    
    // If no sectors found from scraping, return error
    if (scrapedSectors.length === 0) {
      console.error('❌ No sectors scraped from website');
      console.error('Response status:', response.status);
      console.error('Response content-type:', response.headers.get('content-type'));
      console.error('HTML length:', html.length);
      console.error('Table rows found:', $('table tr').length);
      
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to scrape sector data',
        debug: {
          status: response.status,
          htmlLength: html.length,
          tableRowsFound: $('table tr').length
        }
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: scrapedSectors,
      scrapedAt: new Date().toISOString(),
      source: 'scraped'
    });
    
  } catch (error) {
    console.error('❌ Error fetching sector data:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch sector data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 