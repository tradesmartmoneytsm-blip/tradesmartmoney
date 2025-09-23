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

    console.log(`✅ API: Found ${scrapedSectors.length} sectors`);
    
    // If no sectors found from scraping, return fallback data
    if (scrapedSectors.length === 0) {
      console.warn('⚠️ No sectors scraped, returning fallback data');
      const fallbackSectors = getFallbackSectorData();
      return NextResponse.json({ 
        success: true, 
        data: fallbackSectors,
        scrapedAt: new Date().toISOString(),
        source: 'fallback'
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: scrapedSectors,
      scrapedAt: new Date().toISOString(),
      source: 'scraped'
    });
    
  } catch (error) {
    console.error('❌ API: Failed to scrape sector data:', error);
    
    // Return fallback data even on complete failure
    console.log('🔄 Returning fallback data due to scraping error');
    const fallbackSectors = getFallbackSectorData();
    
    return NextResponse.json({ 
      success: true, 
      data: fallbackSectors,
      scrapedAt: new Date().toISOString(),
      source: 'fallback_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Fallback sector data when scraping fails
function getFallbackSectorData(): SectorData[] {
  return [
    { name: 'Banking', change: -0.48, value: '₹55,459', lastUpdated: new Date() },
    { name: 'IT', change: -0.47, value: '₹36,578', lastUpdated: new Date() },
    { name: 'Pharma', change: 0.50, value: '₹22,687', lastUpdated: new Date() },
    { name: 'Auto', change: -0.40, value: '₹27,220', lastUpdated: new Date() },
    { name: 'FMCG', change: -0.44, value: '₹56,273', lastUpdated: new Date() },
    { name: 'Energy', change: 0.86, value: '₹35,746', lastUpdated: new Date() },
    { name: 'Metals', change: 0.35, value: '₹9,990', lastUpdated: new Date() },
    { name: 'Realty', change: 0.55, value: '₹924', lastUpdated: new Date() },
    { name: 'Healthcare', change: 0.17, value: '₹14,881', lastUpdated: new Date() },
    { name: 'Infrastructure', change: 0.08, value: '₹9,238', lastUpdated: new Date() },
    { name: 'Consumption', change: -0.18, value: '₹12,463', lastUpdated: new Date() },
    { name: 'Consumer Durables', change: -0.65, value: '₹39,342', lastUpdated: new Date() },
    { name: 'Media', change: -0.50, value: '₹1,619', lastUpdated: new Date() },
    { name: 'Finnifty', change: -0.64, value: '₹26,528', lastUpdated: new Date() },
    { name: 'Nifty 50', change: -0.38, value: '₹25,327', lastUpdated: new Date() }
  ];
} 