import { NextRequest, NextResponse } from 'next/server';
import { getWebScrapingHeaders } from '@/lib/api-headers';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required!');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

interface DatabaseStockRow {
  symbol: string;
  price_change_7d?: number;
  price_change_30d?: number;
  price_change_90d?: number;
  price_change_52w?: number;
  current_price?: number;
  updated_at: string;
  [key: string]: string | number | undefined;
}

// Map sector display names to database parent_sector names
const SECTOR_NAME_MAPPING: Record<string, string> = {
  'IT': 'NIFTY IT',
  'NIFTY BANK': 'NIFTY Bank',
  'Banking': 'NIFTY Bank',
  'PSU Bank': 'NIFTY PSU Bank',
  'Private Bank': 'NIFTY Private Bank',
  'Pharma': 'NIFTY Pharma',
  'Auto': 'NIFTY Auto',
  'FMCG': 'NIFTY FMCG',
  'Energy': 'NIFTY Energy',
  'Oil & Gas': 'Nifty Oil and Gas',
  'Metals': 'NIFTY Metal',
  'Realty': 'NIFTY Realty',
  'Nifty 50': 'Nifty 50',
  'Finnifty': 'Finnifty',
  'Healthcare': 'Nifty Healthcare',
  'Consumption': 'NIFTY Consumption',
  'CONSR DURBL': 'Nifty Consumer Durable',
  'Infrastructure': 'NIFTY Infra',
  'Media': 'NIFTY Media',
};

// Fetch historical stock data from database
async function fetchHistoricalStockData(
  sector: string,
  timeRange: '7D' | '30D' | '90D' | '52W'
): Promise<NextResponse> {
  console.log(`🔄 Fetching historical stock data for ${sector} (${timeRange}) from database...`);
  
  // Map the sector name to the database parent_sector name
  const parentSector = SECTOR_NAME_MAPPING[sector] || sector;
  console.log(`📍 Mapped sector "${sector}" to parent_sector "${parentSector}"`);
  
  const columnMap = {
    '7D': 'price_change_7d',
    '30D': 'price_change_30d',
    '90D': 'price_change_90d',
    '52W': 'price_change_52w'
  };
  const column = columnMap[timeRange];

  try {
    const { data, error } = await supabase
      .from('dhan_sector_data')
      .select(`symbol, ${column}, current_price, updated_at`)
      .eq('data_type', 'STOCK')
      .eq('parent_sector', parentSector);

    console.log(`🔍 Query result: ${data?.length || 0} stocks found`);
    
    if (error) {
      console.error(`❌ Supabase error for ${sector} ${timeRange}:`, error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.warn(`⚠️ No historical stock data found for ${sector} (${parentSector}) ${timeRange}`);
      
      // Debug: Check what parent_sectors exist in the database
      const { data: allParents } = await supabase
        .from('dhan_sector_data')
        .select('parent_sector')
        .eq('data_type', 'STOCK')
        .limit(20);
      
      const uniqueParents = [...new Set(allParents?.map(p => p.parent_sector) || [])];
      console.log(`📊 Available parent_sectors in DB:`, uniqueParents);
      
      return NextResponse.json({ 
        success: false, 
        error: `No stock data found for ${sector}`,
        hint: `Tried parent_sector="${parentSector}". Run dhan_historical_data_collector.py to populate data.`,
        availableParentSectors: uniqueParents
      }, { status: 404 });
    }

    // Transform database data to StockData format
    console.log(`🔧 Transforming data: using column "${column}" for timeRange ${timeRange}`);
    console.log(`📝 Sample raw data (first stock):`, data[0]);
    
    const stocks: StockData[] = (data as unknown as DatabaseStockRow[])
      .map((item: DatabaseStockRow) => ({
        symbol: item.symbol,
        name: item.symbol, // We don't store display name in DB
        change: 0, // Not stored
        changePercent: (item[column] as number) || 0,
        price: item.current_price || 0,
        volume: 0, // Not stored
        high: 0, // Not stored
        low: 0, // Not stored
        marketCap: 0, // Not stored
        pe: 0, // Not stored
      }))
      // Sort by percentage change (highest to lowest)
      .sort((a, b) => b.changePercent - a.changePercent);

    console.log(`📝 Sample transformed data (first stock):`, stocks[0]);
    console.log(`✅ Found ${stocks.length} stocks for ${sector} from database`);

    return NextResponse.json({
      success: true,
      data: stocks,
      sector: sector,
      count: stocks.length,
      timestamp: new Date().toISOString(),
      source: 'database',
      timeRange: timeRange
    });

  } catch (error) {
    console.error(`❌ Error fetching historical stock data for ${sector}:`, error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch historical stock data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Fetch 1D stock data from Dhan (scraping)
async function fetch1DStockData(sector: string): Promise<NextResponse> {
  console.log(`📊 Fetching 1D stocks for sector: ${sector}`);

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

  try {
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
    console.error('❌ Error fetching 1D sector stocks:', error);
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector');
  const timeRange = searchParams.get('timeRange') as '1D' | '7D' | '30D' | '90D' | '52W' || '1D';

  if (!sector) {
    return NextResponse.json(
      { success: false, error: 'Sector parameter is required' },
      { status: 400 }
    );
  }

  // Route based on time range
  if (timeRange === '1D') {
    return await fetch1DStockData(sector);
  } else {
    return await fetchHistoricalStockData(sector, timeRange);
  }
}
