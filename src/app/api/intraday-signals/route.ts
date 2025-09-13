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
// Using the exact working query from your Python code
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

// Fetch data from ChartInk API (exact Python approach with session and CSRF)
async function fetchChartInkData(): Promise<ChartInkResponse> {
  try {
    console.log('🔍 Fetching data from ChartInk API...');
    
    // Step 1: GET the ChartInk screener page to establish session and get CSRF token
    console.log('🍪 Establishing session and getting CSRF token...');
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
    
    console.log(`🍪 Session cookies: ${cookieHeader ? 'Obtained' : 'None'}`);

    // Step 2: Extract CSRF token from HTML (matching Python BeautifulSoup approach)
    const htmlContent = await sessionResponse.text();
    
    // Try multiple CSRF token patterns (matching Python BeautifulSoup selector)
    const csrfPatterns = [
      /name=['"]csrf-token['"][^>]*content=['"]([^'"]+)['"]/i,
      /content=['"]([^'"]+)['"][^>]*name=['"]csrf-token['"]/i,
      /<meta[^>]*name=['"]csrf-token['"][^>]*content=['"]([^'"]+)['"][^>]*>/i,
      /<meta[^>]*content=['"]([^'"]+)['"][^>]*name=['"]csrf-token['"][^>]*>/i,
      /csrf-token['"]\s+content=['"]([^'"]+)['"]/i,
    ];
    
    let csrfToken = '';
    let csrfMatch = null;
    
    for (const pattern of csrfPatterns) {
      csrfMatch = htmlContent.match(pattern);
      if (csrfMatch) {
        csrfToken = csrfMatch[1];
        break;
      }
    }
    
    // Debug: Log part of HTML content to see the actual format
    console.log('🔍 HTML snippet around CSRF:', htmlContent.substring(0, 2000).includes('csrf') ? 'Found csrf in HTML' : 'No csrf found');
    
    if (!csrfToken) {
      console.log('⚠️ CSRF token not found, proceeding without it...');
    } else {
      console.log(`🔑 CSRF token extracted: ${csrfToken.substring(0, 10)}...`);
    }

    // Step 3: Prepare the POST request (matching Python payload)
    const requestBody = new URLSearchParams({
      query: CHARTINK_QUERY,
      use_live: '1',
      limit: '3000',
      size: '1',
      widget_id: '3556153'
    });

    // Step 4: POST to widget URL with session cookies and CSRF token
    const headers: HeadersInit = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://chartink.com/screener/',
      'Origin': 'https://chartink.com',
    };

    // Add CSRF token if found
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }

    // Add session cookies
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(CHARTINK_API_URL, {
      method: 'POST',
      headers,
      body: requestBody.toString(),
    });

    console.log(`📡 ChartInk API response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`ChartInk API responded with status: ${response.status}`);
    }

    const rawData: ChartInkRawResponse = await response.json();
    console.log('✅ ChartInk API response received');
    console.log('🔍 Raw API response structure:', JSON.stringify(rawData, null, 2).substring(0, 1000) + '...');
    console.log(`📊 Found ${rawData.groups?.length || 0} symbols`);
    
    if (!rawData || !rawData.groups || !Array.isArray(rawData.groups) || !rawData.groupData) {
      console.error('❌ Invalid response format from ChartInk API');
      console.error('📋 Available keys:', Object.keys(rawData || {}));
      throw new Error('Invalid response format from ChartInk API');
    }

    // Convert ChartInk format to our expected format
    const processedData = rawData.groupData.map((group) => {
      const symbol = group.name;
      
      // Extract BIT+SIT values from results - matching the new query structure
      // The results array contains objects with column names as keys
      let bitSit1 = 0, bitSit2 = 0;
      
      group.results.forEach((result) => {
        const key = Object.keys(result)[0];
        const value = result[key][0]; // ChartInk returns values as arrays
        
        if (key === 'BIT+SIT1') {
          bitSit1 = value;
        } else if (key === 'BIT+SIT2') {
          bitSit2 = value;
        }
      });

      return {
        symbol,
        'BIT+SIT1': bitSit1,
        'BIT+SIT2': bitSit2,
      };
    });

    console.log(`📈 Processed ${processedData.length} symbols with BIT+SIT data`);

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
async function storeSignalsInSupabase(signals: IntradaySignal[]): Promise<{success: boolean, error?: any}> {
  try {
    console.log(`📊 Storing ${signals.length} signals in Supabase...`);
    
    // First, test if table exists by doing a simple query
    console.log('🔍 Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('intraday_signals')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      return { success: false, error: testError };
    }
    
    console.log('✅ Database connection successful, inserting signals...');
    
    const { error } = await supabase
      .from('intraday_signals')
      .insert(signals);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return { success: false, error };
    }

    console.log('✅ Signals stored successfully in Supabase');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error storing signals in Supabase:', error);
    return { success: false, error };
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
      // Extract BIT+SIT values directly from the new ChartInk query
      const bitSit1 = Number(stock['BIT+SIT1']) || 0;
      const bitSit2 = Number(stock['BIT+SIT2']) || 0;
      const totalScore = bitSit1 + bitSit2;
      
      signals.push({
        symbol: stock.symbol.toUpperCase(),
        bit_sit_score: totalScore,
        bit_sit1: bitSit1,
        bit_sit2: bitSit2,
        current_price: null, // Price not available in this ChartInk query
        volume: null, // Volume not available in this ChartInk query
        market_session: marketSession,
        rank_position: index + 1
      });
    });

    console.log(`💾 Attempting to store ${signals.length} signals in database...`);
    
    // Store signals in Supabase
    const storeResult = await storeSignalsInSupabase(signals);
    
    if (!storeResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to store signals in database',
        details: storeResult.error
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