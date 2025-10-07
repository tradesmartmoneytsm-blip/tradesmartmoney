import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Market Data API headers
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://niftytrader.in/',
  'Origin': 'https://niftytrader.in'
};

interface PCREntry {
  time: string;
  pcr: number;
}

interface StormResult {
  symbol: string;
  start_time: string;
  trigger_time: string;
  start_pcr: number;
  changed_pcr: number;
  change_percent: number;
  direction: 'increase' | 'decrease';
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const { startTime, endTime, thresholdPercent = 10 } = await request.json();
    
    if (!startTime || !endTime) {
      return NextResponse.json({
        success: false,
        error: 'Start time and end time are required'
      }, { status: 400 });
    }


    // Get active FNO symbols from database
    const symbols = await getFnoSymbols();

    if (symbols.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No FNO symbols found. Please run the daily FNO symbols fetch first.',
        results: []
      }, { status: 404 });
    }

    // Analyze PCR for each symbol
    const stormResults: StormResult[] = [];
    let processed = 0;
    let errors = 0;

    for (const symbol of symbols) {
      try {
        console.log(`🔍 Analyzing ${symbol}... (${processed + 1}/${symbols.length})`);
        
        const pcrData = await fetchPcrData(symbol);
        const movement = checkPcrMovement(symbol, pcrData, startTime, endTime, thresholdPercent);
        
        if (movement) {
          stormResults.push({
            symbol,
            start_time: movement.start_time,
            trigger_time: movement.trigger_time,
            start_pcr: movement.start_pcr,
            changed_pcr: movement.changed_pcr,
            change_percent: movement.change_percent,
            direction: movement.changed_pcr > movement.start_pcr ? 'increase' : 'decrease',
            timestamp: new Date().toISOString()
          });
        }
        
        processed++;
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error analyzing ${symbol}:`, error instanceof Error ? error.message : 'Unknown error');
        errors++;
        processed++;
      }
    }

    // Sort by most recent trigger time and highest change percentage
    stormResults.sort((a, b) => {
      // First sort by trigger time (most recent first)
      if (a.trigger_time !== b.trigger_time) {
        return b.trigger_time.localeCompare(a.trigger_time);
      }
      // Then by change percentage (highest first)
      return b.change_percent - a.change_percent;
    });


    return NextResponse.json({
      success: true,
      results: stormResults,
      summary: {
        total_symbols: symbols.length,
        storms_found: stormResults.length,
        processed,
        errors,
        start_time: startTime,
        end_time: endTime,
        threshold_percent: thresholdPercent
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Storm analysis failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results: []
    }, { status: 500 });
  }
}

/**
 * Fetch active FNO symbols from Supabase
 */
async function getFnoSymbols(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, using fallback symbols');
    return ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK'];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('fno_symbols')
      .select('symbol_name')
      .eq('is_active', true)
      .order('symbol_name');

    if (error) {
      throw new Error(`Failed to fetch FNO symbols: ${error.message}`);
    }

    return data?.map(row => row.symbol_name) || [];

  } catch (error) {
    console.error('❌ Error fetching FNO symbols from database:', error);
    // Return fallback symbols if database fails
    return ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK'];
  }
}

/**
 * Fetch PCR data for a specific symbol
 */
async function fetchPcrData(symbol: string): Promise<PCREntry[]> {
  const url = `https://services.niftytrader.in/webapi/option/oi-pcr-data?type=otherpcr&expiry=&symbol=${symbol}`;
  
  try {
    const response = await fetch(url, { headers: HEADERS });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result || !data.result.oiDatas) {
      throw new Error('Invalid PCR data format');
    }
    
    return data.result.oiDatas;
    
  } catch (error) {
    console.error(`❌ Failed to fetch PCR data for ${symbol}:`, error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Check for PCR movement within the specified time range
 */
function checkPcrMovement(
  symbol: string, 
  oiData: PCREntry[], 
  startTimeStr: string, 
  endTimeStr: string, 
  thresholdPercent: number = 10
) {
  if (!oiData || oiData.length === 0) {
    return null;
  }

  try {
    // Convert time strings to time objects for comparison
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);
    let pcrStart: number | null = null;

    for (const entry of oiData) {
      try {
        const entryTime = parseTime(entry.time);
        
        if (isTimeInRange(entryTime, startTime, endTime)) {
          if (pcrStart === null) {
            pcrStart = entry.pcr;
            // Filter condition: only analyze if PCR starts below 0.49
            if (pcrStart >= 0.49) {
              return null;
            }
          } else {
            const pcrCurrent = entry.pcr;
            const changePercent = Math.abs(pcrCurrent - pcrStart) / pcrStart * 100;
            
            if (changePercent >= thresholdPercent) {
              return {
                start_time: startTimeStr,
                trigger_time: entry.time,
                start_pcr: Number(pcrStart.toFixed(4)),
                changed_pcr: Number(pcrCurrent.toFixed(4)),
                change_percent: Number(changePercent.toFixed(2))
              };
            }
          }
        }
      } catch {
        // Skip invalid entries
        continue;
      }
    }
    
    return null;
    
  } catch (error) {
    console.error(`❌ Error checking PCR movement for ${symbol}:`, error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Parse time string (HH:MM or HH:MM:SS) to minutes for comparison
 */
function parseTime(timeStr: string): number {
  const timeParts = timeStr.split(':').map(Number);
  const hours = timeParts[0] || 0;
  const minutes = timeParts[1] || 0;
  return hours * 60 + minutes;
}

/**
 * Check if a time falls within the specified range
 */
function isTimeInRange(timeMinutes: number, startMinutes: number, endMinutes: number): boolean {
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
} 