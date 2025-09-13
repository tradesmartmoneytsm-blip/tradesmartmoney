import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ChartInk API configuration
const CHARTINK_API_URL = 'https://chartink.com/widget/process';
const CHARTINK_QUERY = `select [=1] 30 minute Buyer initiated trades + [=1] 30 minute Seller initiated trades as 'BIT+SIT1', [=2] 30 minute Buyer initiated trades + [=2] 30 minute Seller initiated trades as 'BIT+SIT2' WHERE( {cash} ( [0] 5 minute close > 100 and yearly debt equity ratio <= 1 ) ) GROUP BY symbol ORDER BY 1 desc`;

interface ChartInkResponse {
  success: boolean;
  data?: Array<{
    symbol: string;
    'BIT+SIT1': number;
    'BIT+SIT2': number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  error?: string;
}

interface IntradaySignal {
  symbol: string;
  bit_sit_score: number;
  bit_sit1: number;
  bit_sit2: number;
  current_price: number | null;
  volume: number | null;
  market_session: string;
  rank_position: number;
}

// Determine market session based on current IST time
function getMarketSession(): string {
  const now = new Date();
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
  const hour = istTime.getHours();
  const minute = istTime.getMinutes();
  const currentTimeMinutes = hour * 60 + minute;
  
  // 9:25 AM to 10:25 AM IST = Opening Hour (565 to 625 minutes)
  if (currentTimeMinutes >= 565 && currentTimeMinutes <= 625) {
    return 'OPENING_HOUR';
  }
  
  return 'INTRADAY';
}

// Fetch data from ChartInk API
async function fetchChartInkData(): Promise<ChartInkResponse> {
  try {
    console.log('🔍 Fetching data from ChartInk API...');
    
    const requestBody = new URLSearchParams({
      query: CHARTINK_QUERY,
      use_live: '1',
      limit: '50',
      size: '1',
      widget_id: '3799905'
    });

    const response = await fetch(CHARTINK_API_URL, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7,mr;q=0.6',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://chartink.com',
        'Referer': 'https://chartink.com/dashboard/328974',
        'Sec-Ch-Ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: requestBody.toString(),
    });

    if (!response.ok) {
      throw new Error(`ChartInk API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ ChartInk API response received');
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from ChartInk API');
    }

    return {
      success: true,
      data: data.data
    };

  } catch (error) {
    console.error('❌ Error fetching from ChartInk API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Store signals in Supabase
async function storeSignalsInSupabase(signals: IntradaySignal[]): Promise<boolean> {
  try {
    console.log(`📊 Storing ${signals.length} signals in Supabase...`);
    
    const { error } = await supabase
      .from('intraday_signals')
      .insert(signals);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return false;
    }

    console.log('✅ Signals stored successfully in Supabase');
    return true;
    
  } catch (error) {
    console.error('❌ Error storing signals in Supabase:', error);
    return false;
  }
}

// GET endpoint - Retrieve latest intraday signals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const session = searchParams.get('session') || 'all';
    
    console.log(`📡 Fetching latest ${limit} intraday signals for session: ${session}`);

    let query = supabase
      .from('intraday_signals')
      .select('*')
      .eq('is_active', true)
      .eq('scan_date', new Date().toISOString().split('T')[0])
      .order('bit_sit_score', { ascending: false })
      .limit(limit);

    // Filter by market session if specified
    if (session !== 'all') {
      query = query.eq('market_session', session.toUpperCase());
    }

    const { data: signals, error } = await query;

    if (error) {
      console.error('❌ Error fetching signals from Supabase:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch signals'
      }, { status: 500 });
    }

    console.log(`✅ Retrieved ${signals?.length || 0} signals`);

    return NextResponse.json({
      success: true,
      data: signals || [],
      timestamp: new Date().toISOString(),
      session: session
    });

  } catch (error) {
    console.error('❌ Error in GET /api/intraday-signals:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// POST endpoint - Fetch and store new signals (for automated scanning)
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting intraday signals scan...');
    
    // Check if we're in the scanning time window (9:25 AM to 10:25 AM IST)
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const currentTimeMinutes = hour * 60 + minute;
    
    // Only scan between 9:25 AM to 10:25 AM IST (565 to 625 minutes)
    // Allow manual override with ?force=true
    const { searchParams } = new URL(request.url);
    const forceRun = searchParams.get('force') === 'true';
    
    if (!forceRun && (currentTimeMinutes < 565 || currentTimeMinutes > 625)) {
      return NextResponse.json({
        success: false,
        message: 'Scanning only active between 9:25 AM to 10:25 AM IST',
        currentTime: istTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
      }, { status: 200 });
    }

    // Fetch data from ChartInk
    const chartinkResult = await fetchChartInkData();
    
    if (!chartinkResult.success || !chartinkResult.data) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch data from ChartInk API',
        details: chartinkResult.error
      }, { status: 500 });
    }

    // Process and prepare signals for storage
    const marketSession = getMarketSession();
    const signals: IntradaySignal[] = [];
    
    // Take top 10 results
    const topStocks = chartinkResult.data.slice(0, 10);
    
    topStocks.forEach((stock, index) => {
      const bitSit1 = Number(stock['BIT+SIT1']) || 0;
      const bitSit2 = Number(stock['BIT+SIT2']) || 0;
      const totalScore = bitSit1 + bitSit2;
      
      signals.push({
        symbol: stock.symbol.toUpperCase(),
        bit_sit_score: totalScore,
        bit_sit1: bitSit1,
        bit_sit2: bitSit2,
        current_price: stock.close || null,
        volume: stock.volume || null,
        market_session: marketSession,
        rank_position: index + 1
      });
    });

    // Store signals in Supabase
    const storeSuccess = await storeSignalsInSupabase(signals);
    
    if (!storeSuccess) {
      return NextResponse.json({
        success: false,
        error: 'Failed to store signals in database'
      }, { status: 500 });
    }

    console.log('🎯 Intraday signals scan completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Intraday signals updated successfully',
      data: {
        signalsCount: signals.length,
        marketSession,
        timestamp: new Date().toISOString(),
        topSignal: signals[0]
      }
    });

  } catch (error) {
    console.error('❌ Error in POST /api/intraday-signals:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 