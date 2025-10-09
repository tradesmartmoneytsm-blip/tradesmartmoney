import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Option Chain Data Interfaces
interface OptionData {
  strike_price: number;
  index_close: number;
  calls_oi: number;
  puts_oi: number;
  calls_volume: number;
  puts_volume: number;
  calls_change_oi_value: number;
  puts_change_oi_value: number;
  calls_builtup: string;
  puts_builtup: string;
  calls_ltp: number;
  puts_ltp: number;
}

interface OptionTotals {
  total_calls_puts: {
    total_calls_oi_value: number;
    total_puts_oi_value: number;
  };
}

interface OptionChainData {
  optionChain: OptionData[];
  totals: OptionTotals;
}

// Market Data API endpoints
const NIFTY_TRADER_BASE = 'https://webapi.niftytrader.in/webapi';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://niftytrader.in/',
  'Origin': 'https://niftytrader.in'
};

interface AdvancedAnalysis {
  symbol: string;
  score: number;
  strength_signals: string[];
  options_flow: {
    net_call_buildup: number;
    net_put_buildup: number;
    pcr_trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    unusual_activity: string[];
    max_pain: number;
    support_levels: number[];
    resistance_levels: number[];
  };
  risk_reward: {
    entry_price: number;
    target_1: number;
    target_2: number;
    stop_loss: number;
    risk_reward_ratio: number;
    probability: number;
  };
  institutional_sentiment: 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
  reasoning: string;
  timeframe: string;
  confidence: number;
}

export async function POST(request: Request) {
  try {
    const { symbols, analysis_type, min_score } = await request.json();
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid symbols array'
      }, { status: 400 });
    }

    const analysisType = analysis_type || 'COMPREHENSIVE';
    const minScore = min_score || 15;

    console.log(`🔍 Advanced Scanner: Analyzing ${symbols.length} symbols for ${analysisType}`);

    const analysisResults: AdvancedAnalysis[] = [];
    let processed = 0;
    let errors = 0;

    // Process symbols in batches
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (symbol: string) => {
        try {
          console.log(`🔍 Analyzing ${symbol}... (${processed + 1}/${symbols.length})`);
          
          // Fetch option chain data
          const optionChainData = await fetchOptionChainData(symbol);
          const analysis = await performOptionChainAnalysis(symbol, optionChainData, analysisType);
          
          if (analysis && Math.abs(analysis.score) >= minScore) {
            return analysis;
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
      analysisResults.push(...batchResults.filter(result => result !== null) as AdvancedAnalysis[]);

      // Respectful delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Sort by score
    const sortedResults = analysisResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Top 50 results

    console.log(`✅ Advanced Scanner: Found ${sortedResults.length} qualifying opportunities (${errors} errors)`);

    return NextResponse.json({
      success: true,
      data: {
        analysis_type: analysisType,
        total_analyzed: symbols.length,
        qualifying_results: sortedResults.length,
        min_score: minScore,
        results: sortedResults,
        timestamp: new Date().toISOString(),
        processing_stats: {
          processed,
          errors,
          success_rate: ((processed - errors) / processed * 100).toFixed(1)
        }
      }
    });

  } catch (error) {
    console.error('❌ Advanced scanner failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Advanced scanner failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Fetch option chain data from market data API
 */
async function fetchOptionChainData(symbol: string) {
  try {
    const url = `${NIFTY_TRADER_BASE}/option/option-chain-data?symbol=${symbol.toLowerCase()}&exchange=nse&expiryDate=&atmBelow=5&atmAbove=5`;
    
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Option chain API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result || !data.resultData || !data.resultData.opDatas) {
      throw new Error('Invalid option chain data structure');
    }
    
    return {
      optionChain: data.resultData.opDatas,
      totals: data.resultData.opTotals
    };
  } catch (error) {
    console.error(`❌ Failed to fetch option chain data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Perform option chain analysis using buildup classifications
 */
async function performOptionChainAnalysis(
  symbol: string,
  optionChainData: OptionChainData,
  analysisType: string
): Promise<AdvancedAnalysis | null> {
  try {
    const { optionChain, totals } = optionChainData;
    
    if (!optionChain || optionChain.length === 0) {
      return null;
    }
    
    // Get current price from the option chain data
    const currentPrice = optionChain[0]?.index_close || 100;
    
    // Indian Market Specific Enhancements
    const marketContext = await getIndianMarketContext(symbol);
    
    // Analyze using the buildup classifications
    const buildupAnalysis = analyzeOptionBuildup(optionChain, currentPrice);
    
    // Calculate overall PCR from totals with Indian market adjustments
    const totalCallsOI = totals?.total_calls_puts?.total_calls_oi_value || 1;
    const totalPutsOI = totals?.total_calls_puts?.total_puts_oi_value || 1;
    const overallPCR = totalCallsOI > 0 ? totalPutsOI / totalCallsOI : 1;
    
    // Apply Indian market PCR normalization (Indian retail traders are more put-heavy)
    const normalizedPCR = normalizeIndianPCR(overallPCR, symbol, marketContext);
    
    console.log(`📊 ${symbol}: Overall PCR: ${overallPCR.toFixed(3)}, Max Pain: ${buildupAnalysis.maxPain}, Current: ${currentPrice}`);
    console.log(`📊 ${symbol}: ${buildupAnalysis.summary}`);
    
    // Get current price movement and momentum
    const priceMovement = await getPriceMovementData(symbol, currentPrice);
    
    // Determine sentiment based on buildup analysis and PCR
    let finalScore = buildupAnalysis.score;
    console.log(`📊 ${symbol}: Buildup Score: ${buildupAnalysis.score}, Initial Final Score: ${finalScore}`);
    let confidence = buildupAnalysis.confidence;
    let reasoning = buildupAnalysis.reasoning;
    const strengthSignals = [...buildupAnalysis.signals];
    
    // CRITICAL ENHANCEMENT: Add price momentum validation
    const momentumScore = calculateMomentumScore(priceMovement, buildupAnalysis.score);
    finalScore += momentumScore.score;
    confidence += momentumScore.confidence;
    reasoning += momentumScore.reasoning;
    strengthSignals.push(...momentumScore.signals);
    
    console.log(`📊 ${symbol}: After momentum adjustment - Final Score: ${finalScore}`);
    
    // Enhanced Indian Market PCR-based scoring
    console.log(`📊 ${symbol}: Before PCR scoring - Final Score: ${finalScore}`);
    
    const pcrScore = calculateIndianPCRScore(normalizedPCR, overallPCR, symbol, marketContext);
    finalScore += pcrScore.score;
    strengthSignals.push(...pcrScore.signals);
    reasoning += pcrScore.reasoning;
    confidence += pcrScore.confidence;
    
    console.log(`📊 ${symbol}: PCR Score: ${pcrScore.score}, New Final Score: ${finalScore}`);
    
    console.log(`📊 ${symbol}: After PCR scoring - Final Score: ${finalScore}`);
    
    // Max pain analysis
    const maxPainDistance = Math.abs(buildupAnalysis.maxPain - currentPrice) / currentPrice * 100;
    if (maxPainDistance > 3) {
      if (buildupAnalysis.maxPain > currentPrice) {
        finalScore += 10;
        strengthSignals.push('MAX_PAIN_BULLISH');
        reasoning += `Max Pain (${buildupAnalysis.maxPain}) above current price suggests upward bias. `;
      } else {
        finalScore -= 10;
        strengthSignals.push('MAX_PAIN_BEARISH');
        reasoning += `Max Pain (${buildupAnalysis.maxPain}) below current price suggests downward bias. `;
      }
    }
    
    // Filter based on analysis type using PCR and buildup score
    if (analysisType === 'BULLISH_SETUPS') {
      const isBullishSignal = overallPCR < 0.8 || finalScore > 10;
      if (!isBullishSignal) {
        console.log(`❌ ${symbol} filtered out for BULLISH_SETUPS: PCR=${overallPCR.toFixed(3)}, Score=${finalScore}`);
        return null;
      }
    }
    
    if (analysisType === 'BEARISH_SETUPS') {
      const isBearishSignal = overallPCR > 1.2 || finalScore < -10;
      if (!isBearishSignal) {
        console.log(`❌ ${symbol} filtered out for BEARISH_SETUPS: PCR=${overallPCR.toFixed(3)}, Score=${finalScore}`);
        return null;
      }
    }
    
    // Determine final sentiment - Fix: Consider PCR impact on sentiment
    // Enhanced Indian Market Sentiment Determination
    const institutionalSentiment = determineIndianMarketSentiment(
      finalScore, 
      normalizedPCR, 
      overallPCR, 
      marketContext
    );
    
    return {
      symbol,
      score: finalScore, // Keep the actual score (positive/negative)
      strength_signals: strengthSignals,
      options_flow: {
        net_call_buildup: buildupAnalysis.callActivity,
        net_put_buildup: buildupAnalysis.putActivity,
        pcr_trend: overallPCR < 1.0 ? 'BULLISH' : 'BEARISH',
        unusual_activity: buildupAnalysis.unusualActivity,
        max_pain: buildupAnalysis.maxPain,
        support_levels: buildupAnalysis.supportLevels,
        resistance_levels: buildupAnalysis.resistanceLevels
      },
      risk_reward: {
        entry_price: currentPrice,
        target_1: finalScore > 0 ? buildupAnalysis.resistanceLevels[0] || currentPrice * 1.03 : buildupAnalysis.supportLevels[0] || currentPrice * 0.97,
        target_2: finalScore > 0 ? buildupAnalysis.resistanceLevels[1] || currentPrice * 1.05 : buildupAnalysis.supportLevels[1] || currentPrice * 0.95,
        stop_loss: finalScore > 0 ? buildupAnalysis.supportLevels[0] || currentPrice * 0.97 : buildupAnalysis.resistanceLevels[0] || currentPrice * 1.03,
        risk_reward_ratio: 1.5,
        probability: Math.min(confidence, 100)
      },
      institutional_sentiment: institutionalSentiment,
      reasoning: reasoning.trim(),
      timeframe: 'INTRADAY',
      confidence: Math.min(confidence, 100)
    };
    
  } catch (error) {
    console.error(`❌ Option chain analysis failed for ${symbol}:`, error);
    return null;
  }
}

/**
 * Analyze option buildup patterns using market data classifications
 */
function analyzeOptionBuildup(optionChain: OptionData[], currentPrice: number) {
  // Advanced Smart Money Analysis - Professional Grade
  let institutionalBullishFlow = 0;
  let institutionalBearishFlow = 0;
  let retailBullishFlow = 0;
  let retailBearishFlow = 0;
  
  let callActivity = 0;
  let putActivity = 0;
  let maxPain = currentPrice;
  let maxOI = 0;
  const supportLevels: number[] = [];
  const resistanceLevels: number[] = [];
  const unusualActivity: string[] = [];
  const detailedAnalysis: string[] = [];
  
  optionChain.forEach((option: OptionData) => {
    const strike = option.strike_price;
    const callBuildup = option.calls_builtup || '';
    const putBuildup = option.puts_builtup || '';
    const totalOI = (option.calls_oi || 0) + (option.puts_oi || 0);
    const callVolume = option.calls_volume || 0;
    const putVolume = option.puts_volume || 0;
    const callOIValue = Math.abs(option.calls_change_oi_value || 0);
    const putOIValue = Math.abs(option.puts_change_oi_value || 0);
    
    // Find max pain (highest total OI)
    if (totalOI > maxOI) {
      maxOI = totalOI;
      maxPain = strike;
    }
    
    // Distance from current price (weight by proximity)
    const distanceFromSpot = Math.abs(strike - currentPrice) / currentPrice;
    const proximityWeight = distanceFromSpot < 0.05 ? 3 : distanceFromSpot < 0.1 ? 2 : 1; // ATM gets 3x weight
    
    // Advanced Call Analysis
    if (callBuildup.includes('Call Buying')) {
      const weight = proximityWeight * 2;
      institutionalBullishFlow += weight;
      callActivity += callOIValue;
      detailedAnalysis.push(`${strike}: Call Buying (+${weight})`);
      if (callVolume > 100000) unusualActivity.push(`Large Call Buying at ${strike}`);
    } else if (callBuildup.includes('Call Writing')) {
      const weight = proximityWeight * 2;
      institutionalBearishFlow += weight; // Call writing = bearish (institutions selling calls)
      callActivity += callOIValue;
      detailedAnalysis.push(`${strike}: Call Writing (-${weight})`);
      if (callVolume > 100000) unusualActivity.push(`Heavy Call Writing at ${strike}`);
    } else if (callBuildup.includes('Call Short Covering')) {
      const weight = proximityWeight * 0.5;
      retailBullishFlow += weight; // Retail covering shorts = mildly bullish
      detailedAnalysis.push(`${strike}: Call Short Covering (+${weight})`);
    } else if (callBuildup.includes('Call Long Covering')) {
      const weight = proximityWeight * 0.5;
      retailBearishFlow += weight; // Retail covering longs = mildly bearish
      detailedAnalysis.push(`${strike}: Call Long Covering (-${weight})`);
    }
    
    // Advanced Put Analysis  
    if (putBuildup.includes('Put Writing')) {
      const weight = proximityWeight * 2;
      institutionalBullishFlow += weight; // Put writing = bullish (institutions selling puts)
      putActivity += putOIValue;
      detailedAnalysis.push(`${strike}: Put Writing (+${weight})`);
      if (putVolume > 100000) unusualActivity.push(`Heavy Put Writing at ${strike}`);
    } else if (putBuildup.includes('Put Buying')) {
      const weight = proximityWeight * 2;
      institutionalBearishFlow += weight; // Put buying = bearish (fear/hedging)
      putActivity += putOIValue;
      detailedAnalysis.push(`${strike}: Put Buying (-${weight})`);
      if (putVolume > 100000) unusualActivity.push(`Large Put Buying at ${strike}`);
    } else if (putBuildup.includes('Put Long Covering')) {
      const weight = proximityWeight * 0.5;
      retailBullishFlow += weight; // Retail covering puts = mildly bullish
      detailedAnalysis.push(`${strike}: Put Long Covering (+${weight})`);
    } else if (putBuildup.includes('Put Short Covering')) {
      const weight = proximityWeight * 0.5;
      retailBearishFlow += weight; // Retail covering put shorts = mildly bearish
      detailedAnalysis.push(`${strike}: Put Short Covering (-${weight})`);
    }
    
    // Identify key levels
    if (strike < currentPrice && option.puts_oi > 100000) {
      supportLevels.push(strike);
    }
    if (strike > currentPrice && option.calls_oi > 100000) {
      resistanceLevels.push(strike);
    }
  });
  
  // Calculate net institutional flow (most important)
  const netInstitutionalFlow = institutionalBullishFlow - institutionalBearishFlow;
  const netRetailFlow = retailBullishFlow - retailBearishFlow;
  
  // Institutional flow is weighted 4x more than retail flow
  const finalNetScore = netInstitutionalFlow + (netRetailFlow * 0.25);
  
  const signals = [];
  let reasoning = '';
  
  console.log(`📊 ${currentPrice} Buildup Analysis - Institutional: +${institutionalBullishFlow.toFixed(1)} / -${institutionalBearishFlow.toFixed(1)}, Retail: +${retailBullishFlow.toFixed(1)} / -${retailBearishFlow.toFixed(1)}, Net: ${finalNetScore.toFixed(1)}`);
  
  if (finalNetScore >= 8) {
    signals.push('STRONG_INSTITUTIONAL_BULLISH');
    reasoning += 'Strong institutional bullish flow dominates. ';
  } else if (finalNetScore >= 4) {
    signals.push('MODERATE_INSTITUTIONAL_BULLISH');
    reasoning += 'Moderate institutional bullish flow. ';
  } else if (finalNetScore <= -8) {
    signals.push('STRONG_INSTITUTIONAL_BEARISH');
    reasoning += 'Strong institutional bearish flow dominates. ';
  } else if (finalNetScore <= -4) {
    signals.push('MODERATE_INSTITUTIONAL_BEARISH');
    reasoning += 'Moderate institutional bearish flow. ';
  } else {
    signals.push('MIXED_INSTITUTIONAL_FLOW');
    reasoning += 'Mixed institutional signals. ';
  }
  
  return {
    score: finalNetScore * 3, // Scale appropriately
    signals,
    reasoning,
    confidence: Math.abs(finalNetScore) * 3,
    callActivity,
    putActivity,
    maxPain,
    supportLevels: supportLevels.sort((a, b) => b - a).slice(0, 3),
    resistanceLevels: resistanceLevels.sort((a, b) => a - b).slice(0, 3),
    unusualActivity,
    summary: `Smart Money Flow: Institutional ${netInstitutionalFlow > 0 ? 'Bullish' : 'Bearish'} (${netInstitutionalFlow.toFixed(1)}), Retail ${netRetailFlow > 0 ? 'Bullish' : 'Bearish'} (${netRetailFlow.toFixed(1)}), Final: ${finalNetScore.toFixed(1)}`,
    detailedAnalysis
  };
}

/**
 * Get FNO symbols from database
 */
async function getFnoSymbols(): Promise<string[]> {
  try {
    console.log('🔍 Checking Supabase configuration...');
    
    if (!isSupabaseConfigured()) {
      console.log('❌ Supabase not configured');
      throw new Error('Database not configured');
    }

    console.log('✅ Supabase configured, querying fno_symbols table...');

    const { data, error } = await supabaseAdmin
      .from('fno_symbols')
      .select('symbol_name')
      .eq('is_active', true)
      .limit(500);

    console.log('📊 Database query result:', { data: data?.length || 0, error: error?.message });

    if (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No symbols found in fno_symbols table');
      throw new Error('No symbols found in database');
    }

    const symbols = data.map(item => item.symbol_name);
    console.log('✅ Successfully fetched symbols:', symbols.length);
    
    return symbols;
  } catch (error) {
    console.error('❌ Error in getFnoSymbols:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const symbols = await getFnoSymbols();
    
    return NextResponse.json({
      success: true,
      data: {
        available_symbols: symbols,
        total_symbols: symbols.length,
        analysis_types: ['BULLISH_SETUPS', 'BEARISH_SETUPS', 'UNUSUAL_ACTIVITY', 'COMPREHENSIVE'],
        cache_info: {
          cache_duration: '5 minutes',
          last_updated: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('❌ Cache management failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Cache management failed'
    }, { status: 500 });
  }
}

// ==================== INDIAN MARKET SPECIFIC ENHANCEMENTS ====================

interface IndianMarketContext {
  sector: string;
  marketCap: 'LARGE_CAP' | 'MID_CAP' | 'SMALL_CAP';
  isNifty50: boolean;
  isBankNifty: boolean;
  volatilityTier: 'LOW' | 'MEDIUM' | 'HIGH';
  liquidityTier: 'HIGH' | 'MEDIUM' | 'LOW';
  fiiHolding: 'HIGH' | 'MEDIUM' | 'LOW';
  retailInterest: 'HIGH' | 'MEDIUM' | 'LOW';
  expiryWeek: boolean;
  monthlyExpiry: boolean;
  resultsWeek: boolean;
}

async function getIndianMarketContext(symbol: string): Promise<IndianMarketContext> {
  // Indian Market Stock Classification
  const stockClassification = getIndianStockClassification(symbol);
  
  // Check if it's expiry week
  const now = new Date();
  const lastThursday = getLastThursdayOfMonth(now);
  const expiryWeek = Math.abs(now.getTime() - lastThursday.getTime()) <= 7 * 24 * 60 * 60 * 1000;
  const monthlyExpiry = now.getDate() >= lastThursday.getDate() - 2 && now.getDate() <= lastThursday.getDate() + 2;
  
  // Check if it's results season (typically Jan, Apr, Jul, Oct)
  const resultsWeek = [1, 4, 7, 10].includes(now.getMonth() + 1) && now.getDate() >= 10 && now.getDate() <= 25;
  
  return {
    ...stockClassification,
    expiryWeek,
    monthlyExpiry,
    resultsWeek
  };
}

function getIndianStockClassification(symbol: string): Omit<IndianMarketContext, 'expiryWeek' | 'monthlyExpiry' | 'resultsWeek'> {
  // Nifty 50 stocks (updated list)
  const nifty50Stocks = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'KOTAKBANK',
    'SBIN', 'BHARTIARTL', 'ITC', 'ASIANPAINT', 'LT', 'AXISBANK', 'MARUTI', 'SUNPHARMA',
    'ULTRACEMCO', 'TITAN', 'WIPRO', 'NESTLEIND', 'POWERGRID', 'NTPC', 'TECHM', 'HCLTECH',
    'BAJFINANCE', 'ONGC', 'TATASTEEL', 'COALINDIA', 'INDUSINDBK', 'ADANIENT', 'JSWSTEEL',
    'GRASIM', 'HINDALCO', 'BRITANNIA', 'DRREDDY', 'EICHERMOT', 'APOLLOHOSP', 'CIPLA',
    'DIVISLAB', 'BAJAJFINSV', 'HEROMOTOCO', 'TATACONSUM', 'BPCL', 'SBILIFE', 'SHRIRAMFIN',
    'HDFCLIFE', 'TATAMOTORS', 'ADANIPORTS', 'BAJAJ-AUTO', 'LTIM'
  ];
  
  // Bank Nifty stocks
  const bankNiftyStocks = [
    'HDFCBANK', 'ICICIBANK', 'KOTAKBANK', 'SBIN', 'AXISBANK', 'INDUSINDBK',
    'BAJFINANCE', 'BANDHANBNK', 'FEDERALBNK', 'IDFCFIRSTB', 'PNB', 'AUBANK'
  ];
  
  // Comprehensive sector classification for ALL FNO stocks
  const sectorMap: Record<string, string> = {
    // Banking & Financial Services
    'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'KOTAKBANK': 'Banking',
    'AXISBANK': 'Banking', 'INDUSINDBK': 'Banking', 'BANDHANBNK': 'Banking', 'FEDERALBNK': 'Banking',
    'IDFCFIRSTB': 'Banking', 'PNB': 'Banking', 'AUBANK': 'Banking', 'BANKBARODA': 'Banking',
    'BANKINDIA': 'Banking', 'INDIANB': 'Banking', 'UNIONBANK': 'Banking', 'YESBANK': 'Banking',
    'RBLBANK': 'Banking', 'CANBK': 'Banking',
    
    // NBFC & Financial Services
    'BAJFINANCE': 'NBFC', 'BAJAJFINSV': 'NBFC', 'SHRIRAMFIN': 'NBFC', 'CHOLAFIN': 'NBFC',
    'LICHSGFIN': 'NBFC', 'MANAPPURAM': 'NBFC', 'MUTHOOTFIN': 'NBFC', 'PNBHOUSING': 'NBFC',
    'PFC': 'NBFC', 'RECLTD': 'NBFC', 'HUDCO': 'NBFC', 'IRFC': 'NBFC',
    
    // Insurance & Asset Management
    'SBILIFE': 'Insurance', 'HDFCLIFE': 'Insurance', 'ICICIGI': 'Insurance', 'ICICIPRULI': 'Insurance',
    'LICI': 'Insurance', 'HDFCAMC': 'Asset Management', 'MFSL': 'Asset Management', 'NUVAMA': 'Asset Management',
    '360ONE': 'Asset Management',
    
    // Fintech & Financial Technology
    'PAYTM': 'Fintech', 'ANGELONE': 'Fintech', 'BSE': 'Fintech', 'MCX': 'Fintech', 'CDSL': 'Fintech',
    'KFINTECH': 'Fintech', 'CAMS': 'Fintech', 'IIFL': 'Fintech', 'POLICYBZR': 'Fintech',
    'JIOFIN': 'Fintech', 'SBICARD': 'Fintech',
    
    // Information Technology
    'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'HCLTECH': 'IT', 'TECHM': 'IT', 'LTIM': 'IT',
    'COFORGE': 'IT', 'PERSISTENT': 'IT', 'MPHASIS': 'IT', 'OFSS': 'IT', 'CYIENT': 'IT',
    'KPITTECH': 'IT', 'NAUKRI': 'IT',
    
    // Oil & Gas
    'RELIANCE': 'Oil & Gas', 'ONGC': 'Oil & Gas', 'BPCL': 'Oil & Gas', 'IOC': 'Oil & Gas',
    'HINDPETRO': 'Oil & Gas', 'OIL': 'Oil & Gas', 'GAIL': 'Oil & Gas', 'PETRONET': 'Oil & Gas',
    
    // Automobiles & Auto Components
    'MARUTI': 'Auto', 'TATAMOTORS': 'Auto', 'BAJAJ-AUTO': 'Auto', 'HEROMOTOCO': 'Auto', 'EICHERMOT': 'Auto',
    'M&M': 'Auto', 'ASHOKLEY': 'Auto', 'TVSMOTOR': 'Auto', 'MOTHERSON': 'Auto Components',
    'BOSCHLTD': 'Auto Components', 'BHARATFORG': 'Auto Components', 'SONACOMS': 'Auto Components',
    'EXIDEIND': 'Auto Components', 'UNOMINDA': 'Auto Components',
    
    // Pharmaceuticals & Healthcare
    'SUNPHARMA': 'Pharma', 'DRREDDY': 'Pharma', 'CIPLA': 'Pharma', 'DIVISLAB': 'Pharma',
    'LUPIN': 'Pharma', 'BIOCON': 'Pharma', 'ALKEM': 'Pharma', 'AUROPHARMA': 'Pharma',
    'TORNTPHARM': 'Pharma', 'GLENMARK': 'Pharma', 'LAURUSLABS': 'Pharma', 'MANKIND': 'Pharma',
    'ZYDUSLIFE': 'Pharma', 'PPLPHARMA': 'Pharma', 'APOLLOHOSP': 'Healthcare', 'FORTIS': 'Healthcare',
    'MAXHEALTH': 'Healthcare',
    
    // FMCG & Consumer Goods
    'HINDUNILVR': 'FMCG', 'ITC': 'FMCG', 'NESTLEIND': 'FMCG', 'BRITANNIA': 'FMCG', 'TATACONSUM': 'FMCG',
    'DABUR': 'FMCG', 'MARICO': 'FMCG', 'GODREJCP': 'FMCG', 'COLPAL': 'FMCG', 'PATANJALI': 'FMCG',
    'JUBLFOOD': 'FMCG', 'VBL': 'FMCG', 'UNITDSPR': 'FMCG',
    
    // Metals & Mining
    'TATASTEEL': 'Metals', 'JSWSTEEL': 'Metals', 'HINDALCO': 'Metals', 'COALINDIA': 'Metals',
    'JINDALSTEL': 'Metals', 'SAIL': 'Metals', 'VEDL': 'Metals', 'NATIONALUM': 'Metals',
    'HINDZINC': 'Metals', 'NMDC': 'Metals',
    
    // Cement
    'ULTRACEMCO': 'Cement', 'GRASIM': 'Cement', 'SHREECEM': 'Cement', 'AMBUJACEM': 'Cement',
    'DALBHARAT': 'Cement',
    
    // Telecommunications
    'BHARTIARTL': 'Telecom', 'IDEA': 'Telecom', 'INDIGO': 'Telecom', 'INDUSTOWER': 'Telecom',
    
    // Power & Utilities
    'NTPC': 'Power', 'POWERGRID': 'Power', 'TATAPOWER': 'Power', 'TORNTPOWER': 'Power',
    'NHPC': 'Power', 'SJVN': 'Power', 'IREDA': 'Power', 'ADANIGREEN': 'Power', 'INOXWIND': 'Power',
    'JSWENERGY': 'Power', 'ADANIENSOL': 'Power', 'SOLARINDS': 'Power',
    
    // Infrastructure & Construction
    'LT': 'Infrastructure', 'ADANIPORTS': 'Infrastructure', 'NCC': 'Infrastructure', 'NBCC': 'Infrastructure',
    'CONCOR': 'Infrastructure', 'GMRAIRPORT': 'Infrastructure', 'RVNL': 'Infrastructure', 'IRCTC': 'Infrastructure',
    'HAL': 'Infrastructure', 'BEL': 'Infrastructure', 'BDL': 'Infrastructure', 'MAZDOCK': 'Infrastructure',
    
    // Real Estate
    'DLF': 'Real Estate', 'GODREJPROP': 'Real Estate', 'OBEROIRLTY': 'Real Estate', 'PRESTIGE': 'Real Estate',
    'LODHA': 'Real Estate', 'PHOENIXLTD': 'Real Estate', 'INDHOTEL': 'Real Estate',
    
    // Retail & E-commerce
    'DMART': 'Retail', 'TRENT': 'Retail', 'NYKAA': 'Retail', 'KALYANKJIL': 'Retail',
    
    // Chemicals & Petrochemicals
    'UPL': 'Chemicals', 'SRF': 'Chemicals', 'PIDILITIND': 'Chemicals', 'AARTI': 'Chemicals',
    'DEEPAKNTR': 'Chemicals', 'GNFC': 'Chemicals', 'CHAMBLFERT': 'Chemicals', 'COROMANDEL': 'Chemicals',
    
    // Textiles
    'WELSPUNIND': 'Textiles', 'TRIDENT': 'Textiles', 'RTNPOWER': 'Textiles',
    
    // Capital Goods & Engineering
    'ABB': 'Capital Goods', 'SIEMENS': 'Capital Goods', 'BHEL': 'Capital Goods', 'CUMMINSIND': 'Capital Goods',
    'VOLTAS': 'Capital Goods', 'HAVELLS': 'Capital Goods', 'CROMPTON': 'Capital Goods', 'KEI': 'Capital Goods',
    'POLYCAB': 'Capital Goods', 'APLAPOLLO': 'Capital Goods', 'ASTRAL': 'Capital Goods', 'DIXON': 'Capital Goods',
    'KAYNES': 'Capital Goods', 'AMBER': 'Capital Goods', 'BLUESTARCO': 'Capital Goods',
    
    // Diversified & Conglomerates
    'ADANIENT': 'Diversified',
    
    // Specialty & Others
    'ASIANPAINT': 'Paints', 'TITAN': 'Jewellery', 'PAGEIND': 'Paper', 'SUPREMEIND': 'Plastics',
    'PIIND': 'Chemicals', 'CGPOWER': 'Power Equipment', 'HFCL': 'Telecom Equipment',
    'IEX': 'Power Trading', 'IGL': 'Gas Distribution', 'DELHIVERY': 'Logistics',
    'SUZLON': 'Renewable Energy', 'SYNGENE': 'Contract Research', 'ETERNAL': 'Materials',
    'TIINDIA': 'Cycles', 'TITAGARH': 'Engineering', 'TATATECH': 'IT Services', 'TATAELXSI': 'IT Services',
    'ABCAPITAL': 'NBFC', 'LTF': 'NBFC', 'PGEL': 'Power'
  };
  
  // Volatility classification based on historical Indian market data
  const highVolatilityStocks = [
    'TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'COALINDIA', 'ONGC', 'BPCL', 'ADANIENT',
    'TATAMOTORS', 'BAJFINANCE', 'INDUSINDBK', 'AXISBANK', 'ADANIPORTS'
  ];
  
  const lowVolatilityStocks = [
    'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'ITC', 'POWERGRID', 'NTPC',
    'SBILIFE', 'HDFCLIFE', 'TCS', 'INFY', 'WIPRO'
  ];
  
  // FII holding classification (based on typical FII preferences)
  const highFIIStocks = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'KOTAKBANK',
    'ASIANPAINT', 'MARUTI', 'SUNPHARMA', 'ULTRACEMCO', 'TITAN', 'NESTLEIND'
  ];
  
  // Retail interest classification (based on trading volumes and retail participation)
  const highRetailStocks = [
    'BAJFINANCE', 'TATAMOTORS', 'AXISBANK', 'INDUSINDBK', 'TATASTEEL', 'JSWSTEEL',
    'ADANIENT', 'ONGC', 'COALINDIA', 'ADANIPORTS'
  ];
  
  return {
    sector: sectorMap[symbol] || 'Others',
    marketCap: nifty50Stocks.includes(symbol) ? 'LARGE_CAP' : 'MID_CAP',
    isNifty50: nifty50Stocks.includes(symbol),
    isBankNifty: bankNiftyStocks.includes(symbol),
    volatilityTier: highVolatilityStocks.includes(symbol) ? 'HIGH' : 
                   lowVolatilityStocks.includes(symbol) ? 'LOW' : 'MEDIUM',
    liquidityTier: nifty50Stocks.includes(symbol) ? 'HIGH' : 'MEDIUM',
    fiiHolding: highFIIStocks.includes(symbol) ? 'HIGH' : 'MEDIUM',
    retailInterest: highRetailStocks.includes(symbol) ? 'HIGH' : 'MEDIUM'
  };
}

function normalizeIndianPCR(rawPCR: number, symbol: string, context: IndianMarketContext): number {
  let adjustedPCR = rawPCR;
  
  // Indian retail traders are more put-heavy, especially in volatile stocks
  if (context.retailInterest === 'HIGH' && context.volatilityTier === 'HIGH') {
    adjustedPCR = rawPCR * 0.85; // Reduce PCR by 15% for high retail, high volatility stocks
  }
  
  // Banking stocks typically have different PCR patterns due to institutional preference
  if (context.isBankNifty) {
    adjustedPCR = rawPCR * 0.9; // Banks typically have lower PCR baseline
  }
  
  // During expiry week, PCR patterns change significantly
  if (context.expiryWeek) {
    adjustedPCR = rawPCR * 1.1; // PCR tends to be higher during expiry due to hedging
  }
  
  // Results week adjustments - more hedging activity
  if (context.resultsWeek) {
    adjustedPCR = rawPCR * 1.05; // Slight increase in hedging during results
  }
  
  // FMCG stocks typically have lower PCR due to defensive nature
  if (context.sector === 'FMCG') {
    adjustedPCR = rawPCR * 0.95;
  }
  
  return adjustedPCR;
}

async function getPriceMovementData(symbol: string, currentPrice: number) {
  try {
    // UNIVERSAL PRICE MOVEMENT DETECTION FOR ALL STOCKS
    // This should work for any stock symbol dynamically
    
    // Try to get price movement from the option chain data itself
    // The option chain contains price change information
    
    // For now, we'll extract momentum from the option chain patterns
    // This is a more universal approach that works for all stocks
    
    // Default values
    let dayChangePercent = 0;
    let momentum: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    let trend: 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS' = 'SIDEWAYS';
    let volume = 0;
    
    // TODO: In production, replace this with actual NSE API call:
    // const response = await fetch(`https://api.nse.com/quote/${symbol}`)
    // const priceData = await response.json()
    // dayChangePercent = priceData.change_percent
    
    // For now, we'll disable price momentum to avoid hardcoding
    // The algorithm will rely on option flow analysis only
    
    return {
      currentPrice,
      dayChange: 0,
      dayChangePercent: 0, // Disabled until real API integration
      volume: 0,
      momentum: 'NEUTRAL' as 'BULLISH' | 'BEARISH' | 'NEUTRAL',
      trend: 'SIDEWAYS' as 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS'
    };
  } catch (error) {
    console.error(`❌ Error fetching price movement for ${symbol}:`, error);
    return {
      currentPrice,
      dayChange: 0,
      dayChangePercent: 0,
      volume: 0,
      momentum: 'NEUTRAL' as 'BULLISH' | 'BEARISH' | 'NEUTRAL',
      trend: 'SIDEWAYS' as 'UPTREND' | 'DOWNTREND' | 'SIDEWAYS'
    };
  }
}

function calculateMomentumScore(priceMovement: any, optionScore: number) {
  let score = 0;
  let confidence = 0;
  let reasoning = '';
  const signals: string[] = [];
  
  // CRITICAL FIX: If option signals are bullish but price is falling, reduce score significantly
  if (optionScore > 50 && priceMovement.dayChangePercent < -2) {
    score -= 100; // Heavy penalty for bullish options with falling price
    confidence -= 30;
    reasoning += '⚠️ Price declining despite bullish options - conflicting signals. ';
    signals.push('PRICE_OPTION_CONFLICT');
  }
  
  // If option signals are bearish but price is rising, reduce bearish score
  if (optionScore < -50 && priceMovement.dayChangePercent > 2) {
    score += 50; // Reduce bearish score if price is rising
    confidence -= 20;
    reasoning += '⚠️ Price rising despite bearish options - mixed signals. ';
    signals.push('PRICE_OPTION_DIVERGENCE');
  }
  
  // Reward alignment between options and price action
  if (optionScore > 50 && priceMovement.dayChangePercent > 1) {
    score += 25; // Bonus for aligned bullish signals
    confidence += 15;
    reasoning += '✅ Price momentum confirms bullish options. ';
    signals.push('PRICE_OPTION_ALIGNMENT');
  }
  
  if (optionScore < -50 && priceMovement.dayChangePercent < -1) {
    score -= 25; // Bonus for aligned bearish signals (more negative)
    confidence += 15;
    reasoning += '✅ Price decline confirms bearish options. ';
    signals.push('PRICE_OPTION_ALIGNMENT');
  }
  
  return {
    score,
    confidence,
    reasoning,
    signals
  };
}

function calculateIndianPCRScore(
  normalizedPCR: number, 
  rawPCR: number, 
  symbol: string, 
  context: IndianMarketContext
): { score: number; signals: string[]; reasoning: string; confidence: number } {
  let score = 0;
  const signals: string[] = [];
  let reasoning = '';
  let confidence = 0;
  
  // Enhanced PCR thresholds for Indian market
  const veryLowThreshold = context.isBankNifty ? 0.5 : 0.6;
  const lowThreshold = context.isBankNifty ? 0.7 : 0.8;
  const highThreshold = context.volatilityTier === 'HIGH' ? 1.3 : 1.2;
  const veryHighThreshold = context.volatilityTier === 'HIGH' ? 1.6 : 1.5;
  
  if (normalizedPCR < veryLowThreshold) {
    score += context.isNifty50 ? 30 : 25; // Higher score for Nifty 50 stocks
    signals.push('VERY_LOW_PCR_BULLISH');
    reasoning += `Very low PCR (${rawPCR.toFixed(3)}, adj: ${normalizedPCR.toFixed(3)}) indicates strong bullish sentiment. `;
    confidence += 25;
    
    if (context.expiryWeek) {
      score += 5; // Extra bullish during expiry week with low PCR
      reasoning += 'Expiry week amplifies bullish signal. ';
    }
  } else if (normalizedPCR < lowThreshold) {
    score += context.isNifty50 ? 20 : 15;
    signals.push('LOW_PCR_BULLISH');
    reasoning += `Low PCR (${rawPCR.toFixed(3)}, adj: ${normalizedPCR.toFixed(3)}) indicates bullish sentiment. `;
    confidence += 20;
  } else if (normalizedPCR > veryHighThreshold) {
    score -= context.volatilityTier === 'HIGH' ? 30 : 25;
    signals.push('VERY_HIGH_PCR_BEARISH');
    reasoning += `Very high PCR (${rawPCR.toFixed(3)}, adj: ${normalizedPCR.toFixed(3)}) indicates strong bearish sentiment. `;
    confidence += 25;
    
    if (context.retailInterest === 'HIGH') {
      score -= 5; // Extra bearish for high retail interest stocks
      reasoning += 'High retail interest amplifies bearish signal. ';
    }
  } else if (normalizedPCR > highThreshold) {
    score -= context.volatilityTier === 'HIGH' ? 20 : 15;
    signals.push('HIGH_PCR_BEARISH');
    reasoning += `High PCR (${rawPCR.toFixed(3)}, adj: ${normalizedPCR.toFixed(3)}) indicates bearish sentiment. `;
    confidence += 20;
  }
  
  // Enhanced sector-specific adjustments based on Indian market behavior
  if (context.sector === 'Banking' && normalizedPCR < 0.8) {
    score += 5;
    reasoning += 'Banking sector showing institutional confidence. ';
  }
  
  if (context.sector === 'IT' && normalizedPCR > 1.2) {
    score -= 5;
    reasoning += 'IT sector showing defensive positioning. ';
  }
  
  if (context.sector === 'Metals' && normalizedPCR < 0.9) {
    score += 3;
    reasoning += 'Metals sector showing cyclical optimism. ';
  }
  
  // Additional sector-specific logic
  if (context.sector === 'FMCG' && normalizedPCR < 0.7) {
    score += 4;
    reasoning += 'FMCG sector showing defensive strength. ';
  }
  
  if (context.sector === 'Pharma' && normalizedPCR > 1.3) {
    score -= 3;
    reasoning += 'Pharma sector showing regulatory concerns. ';
  }
  
  if (context.sector === 'Auto' && normalizedPCR < 0.8) {
    score += 2;
    reasoning += 'Auto sector showing demand recovery. ';
  }
  
  if (context.sector === 'Real Estate' && normalizedPCR < 0.9) {
    score += 3;
    reasoning += 'Real estate sector showing revival signs. ';
  }
  
  if (context.sector === 'Fintech' && normalizedPCR > 1.4) {
    score -= 4;
    reasoning += 'Fintech sector showing regulatory headwinds. ';
  }
  
  return { score, signals, reasoning, confidence };
}

function determineIndianMarketSentiment(
  finalScore: number,
  normalizedPCR: number,
  rawPCR: number,
  context: IndianMarketContext
): 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH' {
  
  // Enhanced sentiment logic for Indian market
  
  // During results week, be more conservative
  if (context.resultsWeek && Math.abs(finalScore) < 30) {
    return 'NEUTRAL';
  }
  
  // High volatility stocks need higher conviction
  const scoreThreshold = context.volatilityTier === 'HIGH' ? 1.2 : 1.0;
  const adjustedScore = finalScore * scoreThreshold;
  
  // PCR override logic with Indian market context
  if (rawPCR > 1.8 && adjustedScore > 0) {
    // Very high PCR overrides bullish signals, but consider market cap
    return context.isNifty50 && adjustedScore > 60 ? 'NEUTRAL' : 'BEARISH';
  }
  
  if (rawPCR > 1.4 && adjustedScore > 25) {
    // High PCR reduces bullish sentiment
    return context.marketCap === 'LARGE_CAP' ? 'NEUTRAL' : 'BEARISH';
  }
  
  // Enhanced thresholds for Indian market
  if (adjustedScore >= 40) return 'STRONGLY_BULLISH';
  else if (adjustedScore >= 15) return 'BULLISH';
  else if (adjustedScore <= -40) return 'STRONGLY_BEARISH';
  else if (adjustedScore <= -15) return 'BEARISH';
  else return 'NEUTRAL';
}

function getLastThursdayOfMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for (let day = lastDay; day >= 1; day--) {
    const testDate = new Date(year, month, day);
    if (testDate.getDay() === 4) { // Thursday
      return testDate;
    }
  }
  
  return new Date(year, month, lastDay);
}
