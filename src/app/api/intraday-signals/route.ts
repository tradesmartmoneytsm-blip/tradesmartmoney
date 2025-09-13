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
const CHARTINK_SCREENER_URL = 'https://chartink.com/screener/';
const CHARTINK_API_URL = 'https://chartink.com/widget/process';
const CHARTINK_QUERY = `select [=1] 30 minute Buyer initiated trades + [=1] 30 minute Seller initiated trades as 'M30-1', [=2] 30 minute Buyer initiated trades + [=2] 30 minute Seller initiated trades as 'M30-2', [=3] 30 minute Buyer initiated trades + [=3] 30 minute Seller initiated trades as 'M30-3', [=1] 1 hour Buyer initiated trades + [=1] 1 hour Seller initiated trades as 'M60-1' WHERE( {cash} ( [0] 5 minute close > 100 and yearly debt equity ratio <= 1 ) ) GROUP BY symbol ORDER BY 1 desc`;

interface ChartInkResponse {
  success: boolean;
  data?: Array<{
    symbol: string;
    'M30-1': number;
    'M30-2': number;
    'M30-3': number;
    'M60-1': number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }>;
  error?: string;
}

// ChartInk raw response interface (matching the working Python example)
interface ChartInkRawResponse {
  metaData: Array<{
    columnAliases: string[];
    availableLimit: number;
    maxRows: number;
    isTrend: boolean;
    limit: number;
    groups: string[];
    tradeTimes: number[];
    lastUpdateTime: number;
  }>;
  groups: string[];
  time: number;
  groupData: Array<{
    name: string;
    results: Array<{ [key: string]: number[] }>;
  }>;
}

interface IntradaySignal {
  symbol: string;
  total_score: number;
  m30_1: number;
  m30_2: number;
  m30_3: number;
  m60_1: number;
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

// Fetch data from ChartInk API with session management
async function fetchChartInkData(): Promise<ChartInkResponse> {
  try {
    console.log('🔍 Fetching data from ChartInk API...');
    
    // Get ChartInk session and CSRF token
    const sessionResponse = await fetch(CHARTINK_SCREENER_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!sessionResponse.ok) {
      throw new Error(`Failed to establish ChartInk session: ${sessionResponse.status}`);
    }

    // Extract cookies for session persistence
    const sessionCookies = sessionResponse.headers.get('set-cookie') || '';
    const cookieHeader = sessionCookies
      .split(',')
      .map(cookie => cookie.split(';')[0].trim())
      .join('; ');

    // Extract CSRF token from HTML
    const htmlContent = await sessionResponse.text();
    const csrfPatterns = [
      /name=['"]csrf-token['"][^>]*content=['"]([^'"]+)['"]/i,
      /content=['"]([^'"]+)['"][^>]*name=['"]csrf-token['"]/i,
      /<meta[^>]*name=['"]csrf-token['"][^>]*content=['"]([^'"]+)['"][^>]*>/i,
      /<meta[^>]*content=['"]([^'"]+)['"][^>]*name=['"]csrf-token['"][^>]*>/i,
      /csrf-token['"]\s+content=['"]([^'"]+)['"]/i,
    ];
    
    let csrfToken = '';
    for (const pattern of csrfPatterns) {
      const match = htmlContent.match(pattern);
      if (match) {
        csrfToken = match[1];
        break;
      }
    }

    // Prepare POST request
    const requestBody = new URLSearchParams({
      query: CHARTINK_QUERY,
      use_live: '1',
      limit: '50',
      size: '357',
      widget_id: '3799905'
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://chartink.com/screener/',
      'Origin': 'https://chartink.com',
    };

    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(CHARTINK_API_URL, {
      method: 'POST',
      headers,
      body: requestBody.toString(),
    });

    if (!response.ok) {
      throw new Error(`ChartInk API responded with status: ${response.status}`);
    }

    const rawData: ChartInkRawResponse = await response.json();
    console.log(`✅ ChartInk API: Found ${rawData.groups?.length || 0} symbols`);
    
    if (!rawData?.groups || !rawData?.groupData) {
      throw new Error('Invalid response format from ChartInk API');
    }

    // Convert ChartInk format to expected format
    const processedData = rawData.groupData.map((group) => {
      let m30_1 = 0, m30_2 = 0, m30_3 = 0, m60_1 = 0;
      
      group.results.forEach((result) => {
        const key = Object.keys(result)[0];
        const value = result[key][0];
        
        if (key === 'M30-1') {
          m30_1 = value;
        } else if (key === 'M30-2') {
          m30_2 = value;
        } else if (key === 'M30-3') {
          m30_3 = value;
        } else if (key === 'M60-1') {
          m60_1 = value;
        }
      });

      return {
        symbol: group.name,
        'M30-1': m30_1,
        'M30-2': m30_2,
        'M30-3': m30_3,
        'M60-1': m60_1,
      };
    });

    return {
      success: true,
      data: processedData
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
async function storeSignalsInSupabase(signals: IntradaySignal[]): Promise<{success: boolean, error?: unknown}> {
  try {
    const { error } = await supabase
      .from('intraday_signals')
      .insert(signals);

    if (error) {
      console.error('❌ Database insert error:', error);
      return { success: false, error };
    }

    console.log(`✅ Stored ${signals.length} signals successfully`);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error storing signals:', error);
    return { success: false, error };
  }
}

// GET endpoint - Retrieve latest intraday signals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const session = searchParams.get('session') || 'all';

    let query = supabase
      .from('intraday_signals')
      .select('*')
      .eq('is_active', true)
      .eq('scan_date', new Date().toISOString().split('T')[0])
      .order('total_score', { ascending: false })
      .limit(limit);

    if (session !== 'all') {
      query = query.eq('market_session', session.toUpperCase());
    }

    const { data: signals, error } = await query;

    if (error) {
      console.error('❌ Error fetching signals:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch signals'
      }, { status: 500 });
    }

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

// POST endpoint - Fetch and store new signals
export async function POST(request: NextRequest) {
  try {
    // Check scanning time window (9:25-10:25 AM IST) or allow force override
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const currentTimeMinutes = istTime.getHours() * 60 + istTime.getMinutes();
    
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
    const signals: IntradaySignal[] = chartinkResult.data.slice(0, 10).map((stock, index) => {
      const m30_1 = Number(stock['M30-1']) || 0;
      const m30_2 = Number(stock['M30-2']) || 0;
      const m30_3 = Number(stock['M30-3']) || 0;
      const m60_1 = Number(stock['M60-1']) || 0;
      
      return {
        symbol: stock.symbol.toUpperCase(),
        total_score: m30_1 + m30_2 + m30_3 + m60_1,
        m30_1,
        m30_2,
        m30_3,
        m60_1,
        market_session: marketSession,
        rank_position: index + 1
      };
    });

    // Store signals in Supabase
    const storeResult = await storeSignalsInSupabase(signals);
    
    if (!storeResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to store signals in database',
        details: storeResult.error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Intraday signals updated successfully',
      data: {
        signalsCount: signals.length,
        marketSession,
        timestamp: new Date().toISOString(),
        topSignals: signals.slice(0, 3)
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