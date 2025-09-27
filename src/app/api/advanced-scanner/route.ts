import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import advancedScannerCache from './cache';

// NiftyTrader API endpoints
const NIFTY_TRADER_BASE = 'https://webapi.niftytrader.in/webapi';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://niftytrader.in/',
  'Origin': 'https://niftytrader.in'
};

interface OptionsOIData {
  symbol_name: string;
  expiry_date: string;
  strike_price: number;
  time: string;
  index_close: number;
  calls_oi: number;
  calls_oi_value: number;
  puts_oi: number;
  puts_oi_value: number;
}

interface OptionsChangeData {
  symbol_name: string;
  expiry_date: string;
  strike_price: number;
  time: string;
  index_close: number;
  calls_change_oi: number;
  calls_change_oi_value: number;
  puts_change_oi: number;
  puts_change_oi_value: number;
}

interface PCRData {
  pcr: number;
  time: string;
  // Add other PCR fields as needed
}

interface OptionsData {
  oi: OptionsOIData[];
  change: OptionsChangeData[];
  pcr: PCRData[];
}

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
    const { 
      startTime = '09:15', 
      endTime = '15:30', 
      minScore = 75, 
      maxResults = 15,
      analysisType = 'COMPREHENSIVE' 
    } = await request.json();
    

    // Get FNO symbols
    const symbols = await getFnoSymbols();

    if (symbols.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No symbols found for analysis',
        results: []
      }, { status: 404 });
    }

    // Check cache first for all symbols
    const { cached, missing } = advancedScannerCache.getBatch(symbols, analysisType, startTime, endTime);

    const analysisResults: AdvancedAnalysis[] = [];
    let processed = 0;
    let errors = 0;

    // Add cached results
    cached.forEach((result) => {
      if (result && result.score >= minScore) {
        analysisResults.push(result);
      }
    });

    // Process only missing symbols (not in cache)
    if (missing.length > 0) {
      console.log(`🔄 Processing ${missing.length} uncached symbols...`);
      const newResults: Array<{symbol: string; data: AdvancedAnalysis}> = [];

      // Process in smaller batches to respect API limits  
      const batchSize = 5;
      for (let i = 0; i < missing.length; i += batchSize) {
        const batch = missing.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (symbol) => {
          try {
            console.log(`🔍 Deep analysis of ${symbol}... (${processed + 1}/${missing.length})`);
            
            // Fetch comprehensive options data
            const optionsData = await fetchOptionsData(symbol, startTime, endTime);
            const analysis = await performAdvancedAnalysis(symbol, optionsData, analysisType);
            
            // Cache the result regardless of score (for future requests)
            if (analysis) {
              newResults.push({ symbol, data: analysis });
              
              // Add to final results if it meets criteria
              if (analysis.score >= minScore) {
                return analysis;
              }
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

      // Batch cache all new results
      if (newResults.length > 0) {
        advancedScannerCache.setBatch(newResults, analysisType, startTime, endTime);
      }
    }

    // Sort by score and confidence
    const sortedResults = analysisResults
      .sort((a, b) => {
        const scoreA = a.score * (a.confidence / 100);
        const scoreB = b.score * (b.confidence / 100);
        return scoreB - scoreA;
      })
      .slice(0, maxResults);


    // Get cache statistics
    const cacheStats = advancedScannerCache.getStats();

    return NextResponse.json({
      success: true,
      results: sortedResults,
      summary: {
        total_analyzed: symbols.length,
        opportunities_found: sortedResults.length,
        processed,
        errors,
        analysis_type: analysisType,
        min_score: minScore,
        avg_confidence: sortedResults.length > 0 
          ? Math.round(sortedResults.reduce((sum, r) => sum + r.confidence, 0) / sortedResults.length)
          : 0,
        avg_risk_reward: sortedResults.length > 0
          ? Number((sortedResults.reduce((sum, r) => sum + r.risk_reward.risk_reward_ratio, 0) / sortedResults.length).toFixed(2))
          : 0,
        cache_stats: {
          cached_results: cached.size,
          fresh_analysis: missing.length,
          cache_hit_rate: cacheStats.hitRate,
          cache_size: cacheStats.cacheSize,
          cache_age_avg: cacheStats.avgAge
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Advanced scanner failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Advanced scanner failed',
      results: []
    }, { status: 500 });
  }
}

/**
 * Fetch comprehensive options data from NiftyTrader APIs
 */
async function fetchOptionsData(symbol: string, startTime: string, endTime: string) {
  try {
    const [oiData, changeData, pcrData] = await Promise.all([
      fetchOIData(symbol, startTime, endTime),
      fetchOIChangeData(symbol, startTime, endTime), 
      fetchPCRData(symbol)
    ]);

    return {
      oi: oiData,
      change: changeData,
      pcr: pcrData
    };
  } catch (error) {
    console.error(`❌ Failed to fetch options data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Fetch Open Interest data
 */
async function fetchOIData(symbol: string, startTime: string, endTime: string): Promise<OptionsOIData[]> {
  const url = `${NIFTY_TRADER_BASE}/Option/oi-time-range?symbol=${symbol.toLowerCase()}&start_time=${startTime}:00&end_time=${endTime}:00&expiry=`;
  
  try {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`OI API failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.resultData || [];
  } catch (error) {
    console.error(`❌ OI data fetch failed for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch Open Interest Change data
 */
async function fetchOIChangeData(symbol: string, startTime: string, endTime: string): Promise<OptionsChangeData[]> {
  const url = `${NIFTY_TRADER_BASE}/Option/change-oi-time-range?symbol=${symbol.toLowerCase()}&start_time=${startTime}:00&end_time=${endTime}:00&expiry=`;
  
  try {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`OI Change API failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.resultData || [];
  } catch (error) {
    console.error(`❌ OI Change data fetch failed for ${symbol}:`, error);
    return [];
  }
}

/**
 * Fetch PCR data
 */
async function fetchPCRData(symbol: string): Promise<PCRData[]> {
  const url = `${NIFTY_TRADER_BASE}/option/oi-pcr-data?symbolName=${symbol.toLowerCase()}&reqType=nse_pcr_data`;
  
  try {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`PCR API failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.resultData?.oiDatas || [];
  } catch (error) {
    console.error(`❌ PCR data fetch failed for ${symbol}:`, error);
    return [];
  }
}

/**
 * Perform advanced analysis using real options data
 */
async function performAdvancedAnalysis(
  symbol: string, 
  optionsData: OptionsData, 
  analysisType: string
): Promise<AdvancedAnalysis | null> {
  
  try {
    const { oi, change, pcr } = optionsData;
    
    if (!oi.length && !change.length && !pcr.length) {
      return null;
    }

    let score = 0;
    // eslint-disable-next-line prefer-const
    let strengthSignals: string[] = [];
    let reasoning = '';
    let confidence = 0;

    // Get current price from the most recent data
    const currentPrice = oi[0]?.index_close || change[0]?.index_close || 100;
    
    // 1. CALL/PUT OI ANALYSIS (0-25 points) - SIMPLIFIED VERSION  
    const { netCallBuildup, netPutBuildup, callPutRatio } = analyzeOIBuildup(oi, change, currentPrice);
    
    console.log(`📊 ${symbol}: Call buildup: ${(netCallBuildup/100000).toFixed(1)}L, Put buildup: ${(netPutBuildup/100000).toFixed(1)}L, C/P Ratio: ${callPutRatio.toFixed(2)}`);
    
    // SIMPLIFIED LOGIC: Traditional options flow analysis
    if (netCallBuildup > 100000 && callPutRatio > 1.2) { // Strong call activity with high call/put ratio
      score += 25;
      strengthSignals.push('STRONG_CALL_BUILDUP');
      reasoning += `Significant call buildup (${netCallBuildup >= 10000000 ? (netCallBuildup/10000000).toFixed(1) + ' Cr' : (netCallBuildup/100000).toFixed(1) + 'L'}) indicates bullish institutional positioning. `;
      confidence += 20;
    } else if (netPutBuildup > 100000 && callPutRatio < 0.8) { // Strong put activity with low call/put ratio
      score += 20;
      strengthSignals.push('STRONG_PUT_BUILDUP');
      reasoning += `Notable put buildup (${netPutBuildup >= 10000000 ? (netPutBuildup/10000000).toFixed(1) + ' Cr' : (netPutBuildup/100000).toFixed(1) + 'L'}) suggests bearish institutional sentiment. `;
      confidence += 15;
    } else if (netCallBuildup > 50000 || netPutBuildup > 50000) { // Give some points for moderate activity
      score += 10;
      strengthSignals.push('MODERATE_OI_ACTIVITY');
      reasoning += `Moderate options activity detected. `;
      confidence += 8;
    }

    // 2. UNUSUAL OPTIONS ACTIVITY (0-20 points) - LOWERED THRESHOLDS
    const unusualActivity = detectUnusualActivity(change, currentPrice);
    if (unusualActivity.length > 0) {
      score += 15 + (unusualActivity.length * 5);
      strengthSignals.push('UNUSUAL_ACTIVITY');
      reasoning += `Unusual activity detected: ${unusualActivity.join(', ')}. `;
      confidence += 15;
    }
    
    // Give points for any options activity
    if (change.length > 0) {
      score += 5;
      strengthSignals.push('OPTIONS_DATA_AVAILABLE');
      reasoning += `Live options data available for analysis. `;
      confidence += 5;
    }

    // 3. PCR TREND ANALYSIS (0-20 points)
    const pcrTrend = analyzePCRTrend(pcr);
    if (pcrTrend.signal !== 'NEUTRAL') {
      score += pcrTrend.strength * 4; // 0-20 points
      strengthSignals.push(`PCR_${pcrTrend.signal}`);
      reasoning += `PCR trend shows ${pcrTrend.signal.toLowerCase()} sentiment with ${pcrTrend.strength}/5 strength. `;
      confidence += pcrTrend.strength * 3;
    }

    // 4. SUPPORT/RESISTANCE FROM OPTIONS (0-15 points)
    const { supportLevels, resistanceLevels, maxPain } = calculateKeyLevels(oi, currentPrice);
    const nearKeyLevel = isNearKeyLevel(currentPrice, supportLevels, resistanceLevels);
    if (nearKeyLevel.isNear) {
      score += 15;
      strengthSignals.push(`NEAR_${nearKeyLevel.type}_LEVEL`);
      reasoning += `Trading near key ${nearKeyLevel.type.toLowerCase()} level (${nearKeyLevel.level}), high probability setup. `;
      confidence += 10;
    }

    // 5. INSTITUTIONAL FLOW STRENGTH (0-20 points)
    const flowStrength = calculateInstitutionalFlow(change);
    if (flowStrength.score > 15) {
      score += flowStrength.score;
      strengthSignals.push('INSTITUTIONAL_FLOW');
      reasoning += `Strong institutional flow detected: ${flowStrength.description}. `;
      confidence += 12;
    }

    // Calculate Risk-Reward based on options data
    const riskReward = calculateRiskReward(
      currentPrice, 
      supportLevels, 
      resistanceLevels, 
      maxPain,
      pcrTrend.signal
    );

    // Minimum thresholds for quality - LOWERED FOR TESTING
    
    if (score < 15 || confidence < 10 || riskReward.risk_reward_ratio < 0.5) { // Much lower thresholds
      console.log(`❌ ${symbol} filtered out: Score=${score}, Confidence=${confidence}, RR=${riskReward.risk_reward_ratio}`);
      return null;
    }

    // Determine institutional sentiment
    const institutionalSentiment = determineInstitutionalSentiment(
      callPutRatio,
      pcrTrend.signal,
      flowStrength.direction
    );

    // FILTER BASED ON ANALYSIS TYPE - SIMPLIFIED TRADITIONAL APPROACH
    if (analysisType === 'BULLISH_SETUPS') {
      // Only return strongly bullish opportunities
      const isBullishSignal = callPutRatio > 1.3 || netCallBuildup > netPutBuildup * 1.5;
      const hasBearishSignals = institutionalSentiment === 'BEARISH' || 
                               callPutRatio < 1.0 || 
                               pcrTrend.signal === 'BEARISH' ||
                               netPutBuildup > netCallBuildup * 2;
      
      if (!isBullishSignal || hasBearishSignals) {
        console.log(`❌ ${symbol} filtered out for BULLISH_SETUPS: Sentiment=${institutionalSentiment}, C/P=${callPutRatio.toFixed(2)}, CallBuildup=${(netCallBuildup/100000).toFixed(1)}L, PutBuildup=${(netPutBuildup/100000).toFixed(1)}L`);
        return null;
      }
    } else if (analysisType === 'BEARISH_SETUPS') {
      // Only return strongly bearish opportunities
      const isBearishSignal = callPutRatio < 0.8 || netPutBuildup > netCallBuildup * 1.5;
      const hasBullishSignals = institutionalSentiment === 'BULLISH' || 
                               callPutRatio > 1.3 || 
                               pcrTrend.signal === 'BULLISH' ||
                               netCallBuildup > netPutBuildup * 2;
      
      if (!isBearishSignal || hasBullishSignals) {
        console.log(`❌ ${symbol} filtered out for BEARISH_SETUPS: Sentiment=${institutionalSentiment}, C/P=${callPutRatio.toFixed(2)}, CallBuildup=${(netCallBuildup/100000).toFixed(1)}L, PutBuildup=${(netPutBuildup/100000).toFixed(1)}L`);
        return null;
      }
    } else if (analysisType === 'UNUSUAL_ACTIVITY') {
      // Only return if there's significant unusual activity
      if (unusualActivity.length === 0 || score < 25) {
        console.log(`❌ ${symbol} filtered out for UNUSUAL_ACTIVITY: Unusual activities=${unusualActivity.length}, Score=${score}`);
        return null;
      }
    }
    // COMPREHENSIVE returns all qualifying opportunities (no additional filtering)

    return {
      symbol,
      score: Math.min(score, 100), // Cap at 100
      strength_signals: strengthSignals,
      options_flow: {
        net_call_buildup: netCallBuildup,
        net_put_buildup: netPutBuildup,
        pcr_trend: pcrTrend.signal,
        unusual_activity: unusualActivity,
        max_pain: maxPain,
        support_levels: supportLevels.slice(0, 3), // Top 3 support levels
        resistance_levels: resistanceLevels.slice(0, 3) // Top 3 resistance levels
      },
      risk_reward: riskReward,
      institutional_sentiment: institutionalSentiment,
      reasoning: reasoning.trim(),
      timeframe: getCurrentTimeframe(),
      confidence: Math.min(confidence, 100) // Cap at 100
    };

  } catch (error) {
    console.error(`❌ Analysis failed for ${symbol}:`, error);
    return null;
  }
}

/**
 * Analyze OI buildup patterns - FIXED VERSION
 */
function analyzeOIBuildup(oi: OptionsOIData[], change: OptionsChangeData[], currentPrice: number) {
  let netCallBuildup = 0;
  let netPutBuildup = 0;
  let totalCallsValue = 0;
  let totalPutsValue = 0;

  change.forEach(item => {
    const callChange = item.calls_change_oi_value || 0;
    const putChange = item.puts_change_oi_value || 0;
    
    // Focus on ATM and near-ATM strikes for directional signals (more reliable)
    if (item.strike_price >= currentPrice * 0.95 && item.strike_price <= currentPrice * 1.05) {
      netCallBuildup += callChange;            // ATM call changes (keep direction)
      netPutBuildup += Math.abs(putChange);    // ATM put activity (absolute)
    }
    
    // Use all strikes for total activity ratio
    totalCallsValue += Math.abs(callChange);
    totalPutsValue += Math.abs(putChange);
  });

  const callPutRatio = totalPutsValue > 0 ? totalCallsValue / totalPutsValue : 1;

  return {
    netCallBuildup: Math.abs(netCallBuildup),  // For display (absolute value)
    netPutBuildup: netPutBuildup,              // Already absolute from loop
    callPutRatio,
    callSentiment: netCallBuildup > 0 ? 'BULLISH' : 'BEARISH'  // Simple direction
  };
}

/**
 * Detect unusual options activity
 */
function detectUnusualActivity(change: OptionsChangeData[], currentPrice: number): string[] {
  const unusual: string[] = [];
  
  change.forEach(item => {
    const callValue = Math.abs(item.calls_change_oi_value || 0);
    const putValue = Math.abs(item.puts_change_oi_value || 0);
    
    // Large single-strike activity - LOWERED THRESHOLDS FOR TESTING
    if (callValue > 500000) { // 5 lakh+ (was 50 lakh)
      unusual.push(`Large Call Activity at ${item.strike_price}`);
    }
    if (putValue > 500000) { // 5 lakh+ (was 50 lakh)
      unusual.push(`Large Put Activity at ${item.strike_price}`);
    }
    
    // Unusual far OTM activity - LOWERED THRESHOLDS
    if (item.strike_price > currentPrice * 1.1 && callValue > 200000) { // 2 lakh+ (was 20 lakh)
      unusual.push(`Far OTM Call Interest at ${item.strike_price}`);
    }
    if (item.strike_price < currentPrice * 0.9 && putValue > 200000) { // 2 lakh+ (was 20 lakh)
      unusual.push(`Far OTM Put Interest at ${item.strike_price}`);
    }
  });

  return unusual.slice(0, 3); // Top 3 unusual activities
}

/**
 * Analyze PCR trend
 */
function analyzePCRTrend(pcr: PCRData[]): { signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; strength: number } {
  if (pcr.length < 2) {
    return { signal: 'NEUTRAL', strength: 0 };
  }

  const recentPCR = pcr[0]?.pcr || 1;
  const earlierPCR = pcr[Math.floor(pcr.length / 2)]?.pcr || 1;
  const pcrChange = ((recentPCR - earlierPCR) / earlierPCR) * 100;

  let signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
  let strength = 0;

  if (recentPCR < 0.7 && pcrChange < -10) {
    signal = 'BULLISH';
    strength = 5; // Strongest bullish
  } else if (recentPCR < 0.8 && pcrChange < -5) {
    signal = 'BULLISH';
    strength = 4;
  } else if (recentPCR > 1.3 && pcrChange > 10) {
    signal = 'BEARISH';
    strength = 5; // Strongest bearish
  } else if (recentPCR > 1.2 && pcrChange > 5) {
    signal = 'BEARISH';
    strength = 4;
  }

  return { signal, strength };
}

/**
 * Calculate key support/resistance levels from options data
 */
function calculateKeyLevels(oi: OptionsOIData[], currentPrice: number) {
  const strikesData: { [strike: number]: { calls: number; puts: number; total: number } } = {};
  
  // Aggregate OI by strike
  oi.forEach(item => {
    const strike = item.strike_price;
    if (!strikesData[strike]) {
      strikesData[strike] = { calls: 0, puts: 0, total: 0 };
    }
    strikesData[strike].calls += item.calls_oi || 0;
    strikesData[strike].puts += item.puts_oi || 0;
    strikesData[strike].total += (item.calls_oi || 0) + (item.puts_oi || 0);
  });

  // Find max pain (strike with highest total OI)
  let maxPain = currentPrice;
  let maxOI = 0;
  
  Object.entries(strikesData).forEach(([strike, data]) => {
    if (data.total > maxOI) {
      maxOI = data.total;
      maxPain = Number(strike);
    }
  });

  // Find support levels (high put OI below current price)
  const supportLevels = Object.entries(strikesData)
    .filter(([strike]) => Number(strike) < currentPrice)
    .sort((a, b) => b[1].puts - a[1].puts)
    .slice(0, 5)
    .map(([strike]) => Number(strike));

  // Find resistance levels (high call OI above current price)
  const resistanceLevels = Object.entries(strikesData)
    .filter(([strike]) => Number(strike) > currentPrice)
    .sort((a, b) => b[1].calls - a[1].calls)
    .slice(0, 5)
    .map(([strike]) => Number(strike));

  return { supportLevels, resistanceLevels, maxPain };
}

/**
 * Check if price is near key levels
 */
function isNearKeyLevel(
  currentPrice: number, 
  supportLevels: number[], 
  resistanceLevels: number[]
): { isNear: boolean; type: 'SUPPORT' | 'RESISTANCE'; level: number } {
  
  const tolerance = currentPrice * 0.02; // 2% tolerance
  
  // Check support levels
  for (const support of supportLevels) {
    if (Math.abs(currentPrice - support) <= tolerance) {
      return { isNear: true, type: 'SUPPORT', level: support };
    }
  }
  
  // Check resistance levels
  for (const resistance of resistanceLevels) {
    if (Math.abs(currentPrice - resistance) <= tolerance) {
      return { isNear: true, type: 'RESISTANCE', level: resistance };
    }
  }
  
  return { isNear: false, type: 'SUPPORT', level: 0 };
}

/**
 * Calculate institutional flow strength
 */
function calculateInstitutionalFlow(change: OptionsChangeData[]) {
  let totalInflow = 0;
  let totalOutflow = 0;
  let direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
  
  change.forEach(item => {
    const callValue = item.calls_change_oi_value || 0;
    const putValue = item.puts_change_oi_value || 0;
    
    if (callValue > 0) totalInflow += callValue;
    if (callValue < 0) totalOutflow += Math.abs(callValue);
    if (putValue < 0) totalInflow += Math.abs(putValue); // Put selling is bullish
    if (putValue > 0) totalOutflow += putValue; // Put buying is bearish
  });
  
  const netFlow = totalInflow - totalOutflow;
  const flowStrength = Math.abs(netFlow);
  
  if (netFlow > 1000000) direction = 'BULLISH'; // 10 lakh+ bullish flow (was 1 crore)
  else if (netFlow < -1000000) direction = 'BEARISH'; // 10 lakh+ bearish flow (was 1 crore)
  
  const score = Math.min(20, flowStrength / 1000000); // Scale to 20 points max
  
  return {
    score,
    direction,
    description: `₹${(flowStrength/10000000).toFixed(1)} Cr ${direction.toLowerCase()} flow`
  };
}

/**
 * Calculate risk-reward based on options levels
 */
function calculateRiskReward(
  currentPrice: number,
  supportLevels: number[],
  resistanceLevels: number[],
  maxPain: number,
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
) {
  let target1, target2, stopLoss;
  
  if (trend === 'BULLISH') {
    target1 = resistanceLevels[0] || currentPrice * 1.03;
    target2 = resistanceLevels[1] || currentPrice * 1.06;
    stopLoss = supportLevels[0] || currentPrice * 0.97;
  } else if (trend === 'BEARISH') {
    target1 = supportLevels[0] || currentPrice * 0.97;
    target2 = supportLevels[1] || currentPrice * 0.94;
    stopLoss = resistanceLevels[0] || currentPrice * 1.03;
  } else {
    // Neutral - trade towards max pain
    if (maxPain > currentPrice) {
      target1 = maxPain;
      target2 = maxPain * 1.02;
      stopLoss = currentPrice * 0.98;
    } else {
      target1 = maxPain;
      target2 = maxPain * 0.98;
      stopLoss = currentPrice * 1.02;
    }
  }
  
  const risk = Math.abs(currentPrice - stopLoss);
  const reward = Math.abs(target1 - currentPrice);
  const riskRewardRatio = risk > 0 ? reward / risk : 0;
  
  // Calculate probability based on options data
  const probability = Math.min(90, 60 + (riskRewardRatio * 10)); // Base 60% + RR bonus
  
  return {
    entry_price: Number(currentPrice.toFixed(2)),
    target_1: Number(target1.toFixed(2)),
    target_2: Number(target2.toFixed(2)),
    stop_loss: Number(stopLoss.toFixed(2)),
    risk_reward_ratio: Number(riskRewardRatio.toFixed(2)),
    probability: Number(probability.toFixed(1))
  };
}

/**
 * Determine institutional sentiment
 */
function determineInstitutionalSentiment(
  callPutRatio: number,
  pcrTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL',
  flowDirection: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
): 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH' {
  
  let bullishScore = 0;
  
  if (callPutRatio > 2) bullishScore += 2;
  else if (callPutRatio > 1.5) bullishScore += 1;
  else if (callPutRatio < 0.5) bullishScore -= 2;
  else if (callPutRatio < 0.8) bullishScore -= 1;
  
  if (pcrTrend === 'BULLISH') bullishScore += 2;
  else if (pcrTrend === 'BEARISH') bullishScore -= 2;
  
  if (flowDirection === 'BULLISH') bullishScore += 2;
  else if (flowDirection === 'BEARISH') bullishScore -= 2;
  
  if (bullishScore >= 4) return 'STRONGLY_BULLISH';
  else if (bullishScore >= 2) return 'BULLISH';
  else if (bullishScore <= -4) return 'STRONGLY_BEARISH';
  else if (bullishScore <= -2) return 'BEARISH';
  else return 'NEUTRAL';
}

/**
 * Get current timeframe
 */
function getCurrentTimeframe(): string {
  const hour = new Date().getHours();
  if (hour >= 9 && hour < 11) return 'EARLY_SESSION';
  else if (hour >= 11 && hour < 14) return 'MID_SESSION';
  else if (hour >= 14) return 'LATE_SESSION';
  else return 'PRE_MARKET';
}

/**
 * Get FNO symbols from database
 */
async function getFnoSymbols(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BHARTIARTL'];
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
    return ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
  }
}

/**
 * GET endpoint for cache statistics and management
 * Usage: 
 * - GET /api/advanced-scanner - Get cache stats
 * - GET /api/advanced-scanner?action=clear - Clear all cache
 * - GET /api/advanced-scanner?action=invalidate&symbol=RELIANCE - Invalidate specific symbol
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    
    if (action === 'clear') {
      advancedScannerCache.clear();
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    }
    
    if (action === 'invalidate') {
      const symbol = url.searchParams.get('symbol');
      const analysisType = url.searchParams.get('analysisType') || undefined;
      
      if (symbol) {
        advancedScannerCache.invalidate(symbol, analysisType);
        return NextResponse.json({
          success: true,
          message: `Cache invalidated for ${symbol}${analysisType ? ` (${analysisType})` : ''}`
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'Symbol parameter required for invalidation'
        }, { status: 400 });
      }
    }
    
    // Default: return cache statistics
    const stats = advancedScannerCache.getStats();
    return NextResponse.json({
      success: true,
      cache_stats: stats,
      message: 'Advanced Options Scanner Cache Statistics'
    });
    
  } catch (error) {
    console.error('❌ Cache management failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Cache management failed'
    }, { status: 500 });
  }
} 