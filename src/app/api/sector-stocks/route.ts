import { NextRequest, NextResponse } from 'next/server';
import { getWebScrapingHeaders } from '@/lib/api-headers';

// Mapping from sector names to Dhan URLs
const SECTOR_TO_DHAN_URL: Record<string, string> = {
  'IT': 'https://dhan.co/indices/nifty-it-companies/',
  'NIFTY BANK': 'https://dhan.co/indices/nifty-bank-companies/',
  'PSU Bank': 'https://dhan.co/indices/nifty-psu-bank-companies/',
  'Private Bank': 'https://dhan.co/indices/nifty-private-bank-companies/',
  'Pharma': 'https://dhan.co/indices/nifty-pharma-companies/',
  'Auto': 'https://dhan.co/indices/nifty-auto-companies/',
  'FMCG': 'https://dhan.co/indices/nifty-fmcg-companies/',
  'Energy': 'https://dhan.co/indices/nifty-energy-companies/',
  'Oil & Gas': 'https://dhan.co/indices/nifty-oil-and-gas-companies/',
  'Metals': 'https://dhan.co/indices/nifty-metal-companies/',
  'Realty': 'https://dhan.co/indices/nifty-realty-companies/',
  'Nifty 50': 'https://dhan.co/indices/nifty-50-companies/',
  'Finnifty': 'https://dhan.co/indices/nifty-financial-services-companies/',
  'Healthcare': 'https://dhan.co/indices/nifty-healthcare-companies/',
  'Consumption': 'https://dhan.co/indices/nifty-india-consumption-companies/',
  'CONSR DURBL': 'https://dhan.co/indices/nifty-consumer-durable-companies/',
  'Infrastructure': 'https://dhan.co/indices/nifty-infrastructure-companies/',
  'Media': 'https://dhan.co/indices/nifty-media-companies/',
  'Banking': 'https://dhan.co/indices/nifty-bank-companies/',
};

interface DhanStockData {
  Sym: string;
  DispSym: string;
  Pchange: string | number;
  PPerchange: string | number;
  Ltp: string | number;
  Volume: string | number;
  High: string | number;
  Low: string | number;
  Mcap: string | number;
  Pe: string | number;
}

interface StockData {
  symbol: string;
  name: string;
  change: number;
  changePercent: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  marketCap: number;
  pe: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');

    if (!sector) {
      return NextResponse.json(
        { success: false, error: 'Sector parameter is required' },
        { status: 400 }
      );
    }

    console.log(`📊 Fetching stocks for sector: ${sector}`);

    // Get the Dhan URL for this sector
    const dhanUrl = SECTOR_TO_DHAN_URL[sector];
    
    if (!dhanUrl) {
      console.error(`❌ No Dhan URL mapping found for sector: ${sector}`);
      return NextResponse.json(
        { success: false, error: `No data source configured for sector: ${sector}` },
        { status: 404 }
      );
    }

    console.log(`🌐 Fetching from: ${dhanUrl}`);

    // Fetch the page
    const response = await fetch(dhanUrl, {
      headers: getWebScrapingHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract __NEXT_DATA__ JSON
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    
    if (!nextDataMatch || !nextDataMatch[1]) {
      console.error('❌ Could not find __NEXT_DATA__ in page');
      return NextResponse.json(
        { success: false, error: 'Could not extract data from page' },
        { status: 500 }
      );
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const sniData = nextData?.props?.pageProps?.sniData;

    if (!sniData || !Array.isArray(sniData)) {
      console.error('❌ No sniData found in __NEXT_DATA__');
      return NextResponse.json(
        { success: false, error: 'No stock data available for this sector' },
        { status: 404 }
      );
    }

    console.log(`✅ Found ${sniData.length} stocks`);

    // Transform and sort the data
    const stocks: StockData[] = sniData.map((stock: DhanStockData) => ({
      symbol: stock.Sym || '',
      name: stock.DispSym || '',
      change: parseFloat(String(stock.Pchange)) || 0,
      changePercent: parseFloat(String(stock.PPerchange)) || 0,
      price: parseFloat(String(stock.Ltp)) || 0,
      volume: parseInt(String(stock.Volume)) || 0,
      high: parseFloat(String(stock.High)) || 0,
      low: parseFloat(String(stock.Low)) || 0,
      marketCap: parseFloat(String(stock.Mcap)) || 0,
      pe: parseFloat(String(stock.Pe)) || 0,
    }))
    // Sort by percentage change (highest to lowest)
    .sort((a, b) => b.changePercent - a.changePercent);

    return NextResponse.json({
      success: true,
      data: stocks,
      sector: sector,
      count: stocks.length,
      timestamp: new Date().toISOString(),
      source: 'dhan'
    });

  } catch (error) {
    console.error('❌ Error fetching sector stocks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sector stocks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

