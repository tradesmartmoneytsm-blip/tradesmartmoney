import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildMarketOutlook1DSectors } from '@/lib/dhan-sector-indices';

interface SectorData {
  name: string;
  change: number;
  changePercent?: number;
  value: string;
  lastUpdated: Date;
  seosym?: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejnuocizpsfcobhyxgrd.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMTIwMjAsImV4cCI6MjA3MjU4ODAyMH0.r5EkP_91v9e9yuBZj2KCOxXZS8K1sKSVx_QY7xqZQ1k';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1D';
    
    console.log(`🔄 API: Fetching sector data for ${timeRange}...`);
    
    // For historical data (7D, 30D, 90D, 52W), fetch from database
    if (timeRange !== '1D') {
      return await fetchHistoricalData(timeRange);
    }
    
    // For 1D, use existing scraping logic
    return await fetch1DData();
    
  } catch (error) {
    console.error('❌ Error fetching sector data:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch sector data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function fetchHistoricalData(timeRange: string) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Map time range to column name
    const columnMap: Record<string, string> = {
      '7D': 'price_change_7d',
      '30D': 'price_change_30d',
      '90D': 'price_change_90d',
      '52W': 'price_change_52w'
    };
    
    const column = columnMap[timeRange];
    if (!column) {
      throw new Error(`Invalid time range: ${timeRange}`);
    }
    
    const { data, error } = await supabase
      .from('dhan_sector_data')
      .select(`symbol, ${column}, current_price, updated_at`)
      .eq('data_type', 'SECTOR')  // Only fetch sectors, not stocks
      .order(column, { ascending: false, nullsFirst: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error('❌ No historical data found in database');
      return NextResponse.json({ 
        success: false, 
        error: 'No historical data available',
        message: 'Please run the dhan_historical_data_collector script first'
      }, { status: 404 });
    }
    
    // Map symbol names to display names (matching 1D scraping format)
    const symbolToDisplayName: Record<string, string> = {
      'NIFTY Auto': 'Auto',
      'Nifty Bank': 'NIFTY BANK',
      'Finnifty': 'Finnifty',
      'NIFTY FMCG': 'FMCG',
      'Nifty IT': 'IT',
      'NIFTY Media': 'Media',
      'NIFTY Metal': 'Metals',
      'NIFTY Pharma': 'Pharma',
      'NIFTY PSU Bank': 'PSU Bank',
      'NIFTY Realty': 'Realty',
      'NIFTY Consumption': 'Consumption',
      'NIFTY Energy': 'Energy',
      'NIFTY Infra': 'Infrastructure',
      'Nifty Consumer Durable': 'CONSR DURBL',
      'NIFTY Private Bank': 'Private Bank',
      'Nifty Healthcare': 'Healthcare',
      'Nifty Oil and Gas': 'Oil & Gas',
      'Nifty 50': 'Nifty 50'
    };
    
    const sectors: SectorData[] = data.map((row) => {
      const typedRow = row as unknown as { 
        symbol: string; 
        [key: string]: number | string | null | undefined; 
        updated_at: string; 
        current_price?: number 
      };
      return {
        name: symbolToDisplayName[typedRow.symbol] || typedRow.symbol,
        change: (typedRow[column] as number) || 0,
        value: typedRow.current_price ? `₹${Math.round(typedRow.current_price).toLocaleString('en-IN')}` : 'N/A',
        lastUpdated: new Date(typedRow.updated_at)
      };
    });
    
    // Deduplicate sectors by name (keep first occurrence)
    const uniqueSectors = sectors.reduce((acc: SectorData[], current: SectorData) => {
      const exists = acc.find(item => item.name === current.name);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    console.log(`✅ API: Found ${uniqueSectors.length} unique sectors from database (${timeRange})`);
    
    return NextResponse.json({ 
      success: true, 
      data: uniqueSectors,
      scrapedAt: new Date().toISOString(),
      source: 'database',
      timeRange
    });
    
  } catch (error) {
    console.error('❌ Error fetching historical data:', error);
    throw error;
  }
}

async function fetch1DData() {
  try {
    console.log('🔄 API: Building 1D Market Outlook sector basket...');
    const items = await buildMarketOutlook1DSectors();

    const sectors: SectorData[] = items.map((item) => ({
      name: item.name,
      change: item.change,
      value: item.value,
      lastUpdated: item.lastUpdated,
      seosym: item.seosym,
    }));

    console.log(`✅ API: Found ${sectors.length} sector indices (1D)`);

    return NextResponse.json({
      success: true,
      data: sectors,
      scrapedAt: new Date().toISOString(),
      source: 'dhan-next-data',
      timeRange: '1D',
    });
  } catch (error) {
    console.error('❌ Error fetching 1D sector data:', error);
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Unable to fetch sector data at the moment. Please try again later.',
      scrapedAt: new Date().toISOString(),
      source: 'dhan-next-data',
      timeRange: '1D',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
