import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface MidSmallCapStock {
  symbol: string;
  company_name: string;
  index_name: string;
  current_price: number;
  day_change: number;
  day_change_percent: number;
  total_traded_value: number;
  total_traded_volume: number;
  analysis_timestamp: string;
  category: 'MIDCAP' | 'SMALLCAP';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // 'MIDCAP', 'SMALLCAP', or null for all
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get latest data from both NIFTY MIDCAP 50 and NIFTY SMALLCAP 50

    // Get the latest timestamp first
    const { data: latestData, error: latestError } = await supabaseAdmin
      .from('nse_sector_data')
      .select('analysis_timestamp')
      .in('index_name', ['NIFTY MIDCAP 50', 'NIFTY SMALLCAP 50'])
      .eq('data_type', 'STOCK')
      .order('analysis_timestamp', { ascending: false })
      .limit(1);

    if (latestError) {
      throw new Error(`Failed to get latest timestamp: ${latestError.message}`);
    }

    if (!latestData || latestData.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No data available yet'
      });
    }

    const latestTimestamp = latestData[0].analysis_timestamp;

    // Get all stocks from the latest timestamp
    const { data: stocksData, error } = await supabaseAdmin
      .from('nse_sector_data')
      .select(`
        symbol,
        company_name,
        index_name,
        current_price,
        day_change,
        day_change_percent,
        total_traded_value,
        total_traded_volume,
        analysis_timestamp
      `)
      .in('index_name', ['NIFTY MIDCAP 50', 'NIFTY SMALLCAP 50'])
      .eq('data_type', 'STOCK')
      .eq('analysis_timestamp', latestTimestamp)
      .order('total_traded_value', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    // Process and categorize the data
    const processedStocks: MidSmallCapStock[] = (stocksData || []).map(stock => ({
      symbol: stock.symbol,
      company_name: stock.company_name,
      index_name: stock.index_name,
      current_price: stock.current_price,
      day_change: stock.day_change,
      day_change_percent: stock.day_change_percent,
      total_traded_value: stock.total_traded_value,
      total_traded_volume: stock.total_traded_volume,
      analysis_timestamp: stock.analysis_timestamp,
      category: stock.index_name === 'NIFTY MIDCAP 50' ? 'MIDCAP' : 'SMALLCAP'
    }));

    // Apply category filter if specified
    const filteredStocks = category 
      ? processedStocks.filter(stock => stock.category === category)
      : processedStocks;

    return NextResponse.json({
      success: true,
      data: filteredStocks,
      count: filteredStocks.length,
      lastUpdated: latestTimestamp,
      filters: {
        category: category || 'ALL',
        limit
      }
    });

  } catch (error) {
    console.error('❌ SmartMoneyFlow API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch smart money flow data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
