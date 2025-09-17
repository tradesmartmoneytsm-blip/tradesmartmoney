import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';


interface TechnicalData {
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume20: number;
  relativeVolume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  rsi: number;
  ema9: number;
  ema21: number;
  resistance: number;
  support: number;
  impliedVolatility?: number;
}

interface ScannerResult {
  symbol: string;
  score: number;
  signals: string[];
  technicals: {
    ltp: number;
    changePercent: number;
    relativeVolume: number;
    rsi: number;
    breakoutType?: string;
    target?: number;
    stopLoss?: number;
  };
  reasoning: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: 'IMMEDIATE' | 'MORNING' | 'AFTERNOON' | 'LATE';
}

export async function POST(request: Request) {
  try {
    const { scanType = 'BREAKOUT', minScore = 70, maxResults = 20 } = await request.json();
    
    console.log(`🔍 Intraday Scanner: ${scanType}, min score: ${minScore}, max results: ${maxResults}`);

    // Get FNO symbols for scanning
    const symbols = await getFnoSymbols();
    console.log(`📊 Scanning ${symbols.length} symbols`);

    if (symbols.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No symbols found for scanning',
        results: []
      }, { status: 404 });
    }

    // Analyze each symbol
    const scanResults: ScannerResult[] = [];
    let processed = 0;
    let errors = 0;

    // Process in batches to avoid overwhelming APIs
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(async (symbol) => {
        try {
          console.log(`🔍 Analyzing ${symbol}... (${processed + 1}/${symbols.length})`);
          
          const technicalData = await fetchTechnicalData(symbol);
          const scanResult = analyzeTechnicals(symbol, technicalData, scanType);
          
          if (scanResult && scanResult.score >= minScore) {
            return scanResult;
          }
          
          return null;
        } catch (error) {
          console.error(`❌ Error analyzing ${symbol}:`, error instanceof Error ? error.message : 'Unknown error');
          errors++;
          return null;
        } finally {
          processed++;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      scanResults.push(...batchResults.filter(result => result !== null) as ScannerResult[]);

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Sort by score and limit results
    const sortedResults = scanResults
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);

    console.log(`⚡ Scanner Complete: ${sortedResults.length} opportunities found, ${errors} errors`);

    return NextResponse.json({
      success: true,
      results: sortedResults,
      summary: {
        total_scanned: symbols.length,
        opportunities_found: sortedResults.length,
        processed,
        errors,
        scan_type: scanType,
        min_score: minScore,
        top_score: sortedResults[0]?.score || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Intraday scanner failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Scanner failed',
      results: []
    }, { status: 500 });
  }
}

/**
 * Fetch FNO symbols from database
 */
async function getFnoSymbols(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('fno_symbols')
      .select('symbol_name')
      .eq('is_active', true)
      .order('symbol_name');

    if (error) {
      throw new Error(`Failed to fetch symbols: ${error.message}`);
    }

    return data?.map(row => row.symbol_name) || [];
  } catch (error) {
    console.error('❌ Error fetching symbols:', error);
    return ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK'];
  }
}

/**
 * Fetch comprehensive technical data for a symbol
 */
async function fetchTechnicalData(symbol: string): Promise<TechnicalData> {
  try {
    // In a real implementation, you'd fetch from multiple endpoints
    // For now, we'll simulate with reasonable data
    const mockData: TechnicalData = {
      symbol,
      ltp: 100 + Math.random() * 900, // Random price between 100-1000
      change: (Math.random() - 0.5) * 10, // Random change between -5% to +5%
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.random() * 1000000, // Random volume
      avgVolume20: Math.random() * 500000, // 20-day average volume
      relativeVolume: 0.5 + Math.random() * 3, // 0.5x to 3.5x relative volume
      high: 0,
      low: 0,
      open: 0,
      close: 0,
      rsi: 30 + Math.random() * 40, // RSI between 30-70
      ema9: 0,
      ema21: 0,
      resistance: 0,
      support: 0
    };

    // Calculate derived values
    mockData.high = mockData.ltp * (1 + Math.random() * 0.02);
    mockData.low = mockData.ltp * (1 - Math.random() * 0.02);
    mockData.open = mockData.ltp * (0.99 + Math.random() * 0.02);
    mockData.close = mockData.ltp;
    mockData.ema9 = mockData.ltp * (0.98 + Math.random() * 0.04);
    mockData.ema21 = mockData.ltp * (0.96 + Math.random() * 0.08);
    mockData.resistance = mockData.ltp * (1.02 + Math.random() * 0.03);
    mockData.support = mockData.ltp * (0.95 + Math.random() * 0.03);

    return mockData;

  } catch (error) {
    console.error(`Error fetching technical data for ${symbol}:`, error);
    throw new Error(`Failed to fetch technical data for ${symbol}`);
  }
}

/**
 * Analyze technical data and generate scanner result
 */
function analyzeTechnicals(symbol: string, data: TechnicalData, scanType: string): ScannerResult | null {
  const signals: string[] = [];
  let score = 0;
  let reasoning = '';
  let risk: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
  let timeframe: 'IMMEDIATE' | 'MORNING' | 'AFTERNOON' | 'LATE' = 'IMMEDIATE';
  let breakoutType: string | undefined;
  let target: number | undefined;
  let stopLoss: number | undefined;

  // 1. Volume Analysis (0-25 points)
  if (data.relativeVolume > 2.0) {
    score += 25;
    signals.push('HIGH_VOLUME');
    reasoning += 'Exceptional volume surge (>2x average). ';
  } else if (data.relativeVolume > 1.5) {
    score += 15;
    signals.push('ELEVATED_VOLUME');
    reasoning += 'Elevated volume activity. ';
  }

  // 2. Price Momentum (0-25 points)
  if (Math.abs(data.changePercent) > 3) {
    score += 20;
    signals.push('STRONG_MOMENTUM');
    reasoning += `Strong ${data.changePercent > 0 ? 'bullish' : 'bearish'} momentum. `;
  } else if (Math.abs(data.changePercent) > 1.5) {
    score += 10;
    signals.push('MODERATE_MOMENTUM');
    reasoning += 'Building momentum. ';
  }

  // 3. Technical Breakout Analysis (0-30 points)
  const distanceToResistance = (data.resistance - data.ltp) / data.ltp * 100;
  const distanceToSupport = (data.ltp - data.support) / data.ltp * 100;

  if (distanceToResistance < 1 && data.changePercent > 0) {
    score += 30;
    signals.push('RESISTANCE_BREAKOUT');
    breakoutType = 'BULLISH_BREAKOUT';
    target = data.resistance * 1.02;
    stopLoss = data.support;
    reasoning += 'Near resistance breakout with bullish momentum. ';
  } else if (distanceToSupport < 1 && data.changePercent < 0) {
    score += 25;
    signals.push('SUPPORT_BREAKDOWN');
    breakoutType = 'BEARISH_BREAKDOWN';
    target = data.support * 0.98;
    stopLoss = data.resistance;
    reasoning += 'Near support breakdown with bearish momentum. ';
  }

  // 4. RSI Analysis (0-15 points)
  if (data.rsi < 30 && data.changePercent > 0) {
    score += 15;
    signals.push('RSI_REVERSAL');
    reasoning += 'RSI oversold with bullish reversal. ';
  } else if (data.rsi > 70 && data.changePercent < 0) {
    score += 15;
    signals.push('RSI_REVERSAL');
    reasoning += 'RSI overbought with bearish reversal. ';
  }

  // 5. Moving Average Analysis (0-5 points)
  if (data.ema9 > data.ema21 && data.ltp > data.ema9) {
    score += 5;
    signals.push('MA_BULLISH');
    reasoning += 'Above rising moving averages. ';
  } else if (data.ema9 < data.ema21 && data.ltp < data.ema9) {
    score += 5;
    signals.push('MA_BEARISH');
    reasoning += 'Below falling moving averages. ';
  }

  // Risk Assessment
  if (data.relativeVolume > 3 || Math.abs(data.changePercent) > 5) {
    risk = 'HIGH';
  } else if (data.relativeVolume < 1.2 && Math.abs(data.changePercent) < 1) {
    risk = 'LOW';
  }

  // Time of day considerations
  const currentHour = new Date().getHours();
  if (currentHour >= 9 && currentHour < 11) {
    timeframe = 'MORNING';
  } else if (currentHour >= 11 && currentHour < 14) {
    timeframe = 'AFTERNOON';
  } else if (currentHour >= 14) {
    timeframe = 'LATE';
  }

  // Filter based on scan type
  if (scanType === 'BREAKOUT' && !signals.some(s => s.includes('BREAKOUT') || s.includes('BREAKDOWN'))) {
    return null;
  }

  if (scanType === 'HIGH_VOLUME' && data.relativeVolume < 1.5) {
    return null;
  }

  if (scanType === 'MOMENTUM' && Math.abs(data.changePercent) < 1) {
    return null;
  }

  // Minimum score threshold
  if (score < 30) {
    return null;
  }

  return {
    symbol,
    score,
    signals,
    technicals: {
      ltp: Number(data.ltp.toFixed(2)),
      changePercent: Number(data.changePercent.toFixed(2)),
      relativeVolume: Number(data.relativeVolume.toFixed(2)),
      rsi: Number(data.rsi.toFixed(1)),
      breakoutType,
      target: target ? Number(target.toFixed(2)) : undefined,
      stopLoss: stopLoss ? Number(stopLoss.toFixed(2)) : undefined
    },
    reasoning: reasoning.trim(),
    risk,
    timeframe
  };
} 