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

// NiftyTrader API endpoints
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
 * Fetch option chain data from NiftyTrader API
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
    
    // Analyze using the buildup classifications
    const buildupAnalysis = analyzeOptionBuildup(optionChain, currentPrice);
    
    // Calculate overall PCR from totals
    const totalCallsOI = totals?.total_calls_puts?.total_calls_oi_value || 1;
    const totalPutsOI = totals?.total_calls_puts?.total_puts_oi_value || 1;
    const overallPCR = totalCallsOI > 0 ? totalPutsOI / totalCallsOI : 1;
    
    console.log(`📊 ${symbol}: Overall PCR: ${overallPCR.toFixed(3)}, Max Pain: ${buildupAnalysis.maxPain}, Current: ${currentPrice}`);
    console.log(`📊 ${symbol}: ${buildupAnalysis.summary}`);
    
    // Determine sentiment based on buildup analysis and PCR
    let finalScore = buildupAnalysis.score;
    console.log(`📊 ${symbol}: Buildup Score: ${buildupAnalysis.score}, Initial Final Score: ${finalScore}`);
    let confidence = buildupAnalysis.confidence;
    let reasoning = buildupAnalysis.reasoning;
    const strengthSignals = [...buildupAnalysis.signals];
    
    // PCR-based scoring
    console.log(`📊 ${symbol}: Before PCR scoring - Final Score: ${finalScore}`);
    
    if (overallPCR < 0.6) {
      finalScore += 25;
      strengthSignals.push('VERY_LOW_PCR_BULLISH');
      reasoning += `Very low PCR (${overallPCR.toFixed(3)}) indicates strong bullish sentiment. `;
      confidence += 20;
      console.log(`📊 ${symbol}: Added +25 for very low PCR, new score: ${finalScore}`);
    } else if (overallPCR < 0.8) {
      finalScore += 15;
      strengthSignals.push('LOW_PCR_BULLISH');
      reasoning += `Low PCR (${overallPCR.toFixed(3)}) indicates bullish sentiment. `;
      confidence += 15;
      console.log(`📊 ${symbol}: Added +15 for low PCR, new score: ${finalScore}`);
    } else if (overallPCR > 1.5) {
      finalScore -= 25;
      strengthSignals.push('HIGH_PCR_BEARISH');
      reasoning += `High PCR (${overallPCR.toFixed(3)}) indicates strong bearish sentiment. `;
      confidence += 20;
      console.log(`📊 ${symbol}: Subtracted -25 for high PCR, new score: ${finalScore}`);
    } else if (overallPCR > 1.2) {
      finalScore -= 15;
      strengthSignals.push('MODERATE_PCR_BEARISH');
      reasoning += `Elevated PCR (${overallPCR.toFixed(3)}) indicates bearish sentiment. `;
      confidence += 15;
      console.log(`📊 ${symbol}: Subtracted -15 for elevated PCR, new score: ${finalScore}`);
    }
    
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
    
    // Determine final sentiment
    let institutionalSentiment: 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
    if (finalScore >= 25) institutionalSentiment = 'STRONGLY_BULLISH';
    else if (finalScore >= 10) institutionalSentiment = 'BULLISH';
    else if (finalScore <= -25) institutionalSentiment = 'STRONGLY_BEARISH';
    else if (finalScore <= -10) institutionalSentiment = 'BEARISH';
    else institutionalSentiment = 'NEUTRAL';
    
    return {
      symbol,
      score: finalScore, // Keep the actual score (positive/negative)
      strength_signals: strengthSignals,
      options_flow: {
        net_call_buildup: buildupAnalysis.callActivity,
        net_put_buildup: buildupAnalysis.putActivity,
        pcr_trend: finalScore > 0 ? 'BULLISH' : 'BEARISH',
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
        probability: confidence
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
 * Analyze option buildup patterns using NiftyTrader classifications
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
