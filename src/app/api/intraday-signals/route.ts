import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getWebScrapingHeaders, getChartinkHeaders } from '@/lib/api-headers';

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
  m30_1: number;
  m30_2: number;
  m30_3: number;
  m60_1: number;
  rank_position: number;
}



// Fetch data from ChartInk API with session management
async function fetchChartInkData(): Promise<ChartInkResponse> {
  try {
    
    // Get ChartInk session and CSRF token
    const sessionResponse = await fetch(CHARTINK_SCREENER_URL, {
      method: 'GET',
      headers: getWebScrapingHeaders()
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

    const headers: Record<string, string> = getChartinkHeaders() as Record<string, string>;

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
        
        // Parse momentum columns - ChartInk returns lowercase keys!
        if (key === 'm30-1') {
          m30_1 = value;
        } else if (key === 'm30-2') {
          m30_2 = value;
        } else if (key === 'm30-3') {
          m30_3 = value;
        } else if (key === 'm60-1') {
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

// GET endpoint - Retrieve existing signals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const query = supabase
      .from('intraday_signals')
      .select('*')
      .order('m30_1', { ascending: false })
      .limit(limit);
    
    const { data: signals, error } = await query;

    if (error) {
      console.error('❌ Error fetching signals from database:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch signals from database'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: signals || [],
      count: signals?.length || 0,
      timestamp: new Date().toISOString()
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
    const signals: IntradaySignal[] = chartinkResult.data.slice(0, 10).map((stock, index) => {
      const m30_1 = Number(stock['M30-1']) || 0;
      const m30_2 = Number(stock['M30-2']) || 0;
      const m30_3 = Number(stock['M30-3']) || 0;
      const m60_1 = Number(stock['M60-1']) || 0;
      
      return {
        symbol: stock.symbol.toUpperCase(),
        m30_1,
        m30_2,
        m30_3,
        m60_1,
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

    const response = {
      success: true,
      message: 'Intraday signals updated successfully',
      data: {
        signalsCount: signals.length,
        timestamp: new Date().toISOString(),
        topSignals: signals.slice(0, 3)
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error in POST /api/intraday-signals:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 