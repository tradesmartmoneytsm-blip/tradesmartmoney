import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface TradingSignal {
  symbol: string
  signal_type: 'BUY' | 'SELL' | 'HOLD' | 'AVOID'
  signal_strength: 'STRONG' | 'MODERATE' | 'WEAK'
  confidence: number
  entry_price: number
  target_1: number
  target_2: number
  stop_loss: number
  risk_reward_ratio: number
  timeframe: 'INTRADAY' | 'SWING' | 'POSITIONAL'
  reasoning: string
  score: number
  factors: {
    option_flow_score: number
    momentum_score: number
    volume_score: number
    technical_score: number
    risk_score: number
  }
  alerts: string[]
  sector: string
  market_cap_category: 'LARGE' | 'MID' | 'SMALL'
  liquidity_rating: 'HIGH' | 'MEDIUM' | 'LOW'
  analysis_timestamp: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const signal_type = searchParams.get('signal_type') || 'ALL'
    const min_confidence = parseInt(searchParams.get('min_confidence') || '70')
    const timeframe = searchParams.get('timeframe') || 'ALL'
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log('🎯 Generating trading signals with filters:', {
      signal_type,
      min_confidence,
      timeframe,
      limit
    })

    // Get latest option analysis data
    const { data: optionData, error: optionError } = await supabaseAdmin
      .from('latest_option_analysis')
      .select('*')
      .order('score', { ascending: false })

    if (optionError) {
      console.error('❌ Error fetching option data:', optionError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch option analysis data'
      }, { status: 500 })
    }

    if (!optionData || optionData.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          signals: [],
          total_signals: 0,
          message: 'No option analysis data available for signal generation'
        }
      })
    }

    // Generate trading signals
    const tradingSignals: TradingSignal[] = []

    for (const stock of optionData) {
      try {
        const signal = await generateTradingSignal(stock)
        
        if (signal && signal.confidence >= min_confidence) {
          // Apply filters
          if (signal_type !== 'ALL' && signal.signal_type !== signal_type) continue
          if (timeframe !== 'ALL' && signal.timeframe !== timeframe) continue
          
          tradingSignals.push(signal)
        }
      } catch (error) {
        console.error(`❌ Error generating signal for ${stock.symbol}:`, error)
      }
    }

    // Sort by confidence and score
    const sortedSignals = tradingSignals
      .sort((a, b) => {
        // Primary: Signal strength (STRONG > MODERATE > WEAK)
        const strengthOrder = { 'STRONG': 3, 'MODERATE': 2, 'WEAK': 1 }
        const strengthDiff = strengthOrder[b.signal_strength] - strengthOrder[a.signal_strength]
        if (strengthDiff !== 0) return strengthDiff
        
        // Secondary: Confidence
        const confidenceDiff = b.confidence - a.confidence
        if (confidenceDiff !== 0) return confidenceDiff
        
        // Tertiary: Absolute score
        return Math.abs(b.score) - Math.abs(a.score)
      })
      .slice(0, limit)

    console.log(`✅ Generated ${sortedSignals.length} trading signals`)

    return NextResponse.json({
      success: true,
      data: {
        signals: sortedSignals,
        total_signals: sortedSignals.length,
        filters: {
          signal_type,
          min_confidence,
          timeframe,
          limit
        },
        timestamp: new Date().toISOString(),
        market_summary: generateMarketSummary(tradingSignals)
      }
    })

  } catch (error) {
    console.error('❌ Trading signals API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

interface OptionAnalysisData {
  symbol: string
  score: number
  institutional_sentiment: string
  overall_pcr: number
  current_price: number
  max_pain: number
  support_levels: number[]
  resistance_levels: number[]
  net_call_buildup: number
  net_put_buildup: number
  institutional_bullish_flow: number
  institutional_bearish_flow: number
  net_institutional_flow: number
  unusual_activity: string[]
  strength_signals: string[]
  reasoning: string
}

async function generateTradingSignal(optionData: OptionAnalysisData): Promise<TradingSignal | null> {
  try {
    const {
      symbol,
      score,
      institutional_sentiment,
      overall_pcr,
      current_price,
      max_pain,
      support_levels,
      resistance_levels,
      net_call_buildup,
      net_put_buildup,
      institutional_bullish_flow,
      institutional_bearish_flow,
      net_institutional_flow,
      unusual_activity,
      strength_signals,
      reasoning
    } = optionData

    // MULTI-FACTOR SCORING SYSTEM
    let totalScore = 0
    let confidence = 50
    const alerts: string[] = []
    const factors = {
      option_flow_score: 0,
      momentum_score: 0,
      volume_score: 0,
      technical_score: 0,
      risk_score: 0
    }

    // 1. OPTION FLOW ANALYSIS (40% weight)
    const optionFlowScore = calculateOptionFlowScore(
      score,
      institutional_sentiment,
      overall_pcr,
      net_institutional_flow,
      net_call_buildup,
      net_put_buildup
    )
    factors.option_flow_score = optionFlowScore.score
    totalScore += optionFlowScore.score * 0.4
    confidence += optionFlowScore.confidence
    alerts.push(...optionFlowScore.alerts)

    // 2. MOMENTUM ANALYSIS (25% weight)
    const momentumScore = calculateMomentumScore(
      score,
      institutional_bullish_flow,
      institutional_bearish_flow,
      strength_signals
    )
    factors.momentum_score = momentumScore.score
    totalScore += momentumScore.score * 0.25
    confidence += momentumScore.confidence
    alerts.push(...momentumScore.alerts)

    // 3. VOLUME & ACTIVITY ANALYSIS (15% weight)
    const volumeScore = calculateVolumeScore(
      net_call_buildup,
      net_put_buildup,
      unusual_activity
    )
    factors.volume_score = volumeScore.score
    totalScore += volumeScore.score * 0.15
    confidence += volumeScore.confidence

    // 4. TECHNICAL ANALYSIS (15% weight)
    const technicalScore = calculateTechnicalScore(
      current_price,
      max_pain,
      support_levels,
      resistance_levels
    )
    factors.technical_score = technicalScore.score
    totalScore += technicalScore.score * 0.15
    confidence += technicalScore.confidence
    alerts.push(...technicalScore.alerts)

    // 5. RISK ASSESSMENT (5% weight)
    const riskScore = calculateRiskScore(
      symbol,
      current_price
    )
    factors.risk_score = riskScore.score
    totalScore += riskScore.score * 0.05
    confidence += riskScore.confidence
    alerts.push(...riskScore.alerts)

    // DETERMINE FINAL SIGNAL
    const finalSignal = determineFinalSignal(totalScore, confidence)
    
    // Calculate entry, targets, and stop loss
    const tradeLevels = calculateTradeLevels(
      current_price,
      support_levels,
      resistance_levels,
      max_pain,
      finalSignal.signal_type
    )

    // Get market context
    const marketContext = getMarketContext(symbol, current_price)

    return {
      symbol,
      signal_type: finalSignal.signal_type,
      signal_strength: finalSignal.strength,
      confidence: Math.min(Math.max(confidence, 0), 100),
      entry_price: tradeLevels.entry,
      target_1: tradeLevels.target_1,
      target_2: tradeLevels.target_2,
      stop_loss: tradeLevels.stop_loss,
      risk_reward_ratio: tradeLevels.risk_reward_ratio,
      timeframe: finalSignal.timeframe,
      reasoning: generateTradingReasoning(finalSignal, factors, alerts, reasoning),
      score: totalScore,
      factors,
      alerts: alerts.filter(alert => alert.length > 0),
      sector: marketContext.sector,
      market_cap_category: marketContext.market_cap_category,
      liquidity_rating: marketContext.liquidity_rating,
      analysis_timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error(`❌ Error generating signal for ${optionData.symbol}:`, error)
    return null
  }
}

function calculateOptionFlowScore(
  score: number,
  sentiment: string,
  pcr: number,
  netFlow: number,
  callBuildup: number,
  putBuildup: number
) {
  let flowScore = 0
  let confidence = 0
  const alerts: string[] = []

  // Base score from existing analysis
  flowScore = score * 0.3

  // PCR analysis
  if (pcr < 0.6) {
    flowScore += 25
    confidence += 15
    alerts.push('VERY_LOW_PCR_BULLISH')
  } else if (pcr > 1.4) {
    flowScore -= 25
    confidence += 15
    alerts.push('HIGH_PCR_BEARISH')
  }

  // Institutional flow
  if (Math.abs(netFlow) > 50) {
    flowScore += netFlow > 0 ? 20 : -20
    confidence += 20
    alerts.push(netFlow > 0 ? 'STRONG_INSTITUTIONAL_BUYING' : 'STRONG_INSTITUTIONAL_SELLING')
  }

  // Call/Put buildup analysis
  const totalBuildup = Math.abs(callBuildup) + Math.abs(putBuildup)
  if (totalBuildup > 50000000) { // 5 Cr+
    confidence += 15
    alerts.push('HIGH_VOLUME_ACTIVITY')
  }

  return { score: flowScore, confidence, alerts }
}

function calculateMomentumScore(
  baseScore: number,
  bullishFlow: number,
  bearishFlow: number,
  strengthSignals: string[]
) {
  let momentumScore = 0
  let confidence = 0
  const alerts: string[] = []

  // Momentum from institutional flows
  const flowDifference = bullishFlow - bearishFlow
  if (Math.abs(flowDifference) > 60) {
    momentumScore += flowDifference > 0 ? 30 : -30
    confidence += 25
    alerts.push(flowDifference > 0 ? 'STRONG_BULLISH_MOMENTUM' : 'STRONG_BEARISH_MOMENTUM')
  }

  // Strength signals analysis
  const strongSignals = strengthSignals.filter(s => s.includes('STRONG')).length
  if (strongSignals >= 2) {
    momentumScore += baseScore > 0 ? 20 : -20
    confidence += 15
    alerts.push('MULTIPLE_STRENGTH_SIGNALS')
  }

  return { score: momentumScore, confidence, alerts }
}

function calculateVolumeScore(
  callBuildup: number,
  putBuildup: number,
  unusualActivity: string[]
) {
  let volumeScore = 0
  let confidence = 0

  // Volume analysis
  const totalVolume = Math.abs(callBuildup) + Math.abs(putBuildup)
  if (totalVolume > 100000000) { // 10 Cr+
    volumeScore += 15
    confidence += 10
  } else if (totalVolume > 50000000) { // 5 Cr+
    volumeScore += 10
    confidence += 5
  }

  // Unusual activity
  const heavyActivity = unusualActivity.filter(a => a.includes('Heavy')).length
  if (heavyActivity >= 5) {
    volumeScore += 10
    confidence += 10
  }

  return { score: volumeScore, confidence }
}

function calculateTechnicalScore(
  currentPrice: number,
  maxPain: number,
  supportLevels: number[],
  resistanceLevels: number[]
) {
  let technicalScore = 0
  let confidence = 0
  const alerts: string[] = []

  // Max Pain analysis
  const maxPainDistance = Math.abs(maxPain - currentPrice) / currentPrice * 100
  if (maxPainDistance > 2) {
    if (maxPain > currentPrice) {
      technicalScore += 15
      alerts.push('MAX_PAIN_UPSIDE_TARGET')
    } else {
      technicalScore -= 15
      alerts.push('MAX_PAIN_DOWNSIDE_RISK')
    }
    confidence += 10
  }

  // Support/Resistance proximity
  const nearestSupport = supportLevels.length > 0 ? 
    Math.min(...supportLevels.map(s => Math.abs(s - currentPrice))) : Infinity
  const nearestResistance = resistanceLevels.length > 0 ? 
    Math.min(...resistanceLevels.map(r => Math.abs(r - currentPrice))) : Infinity

  if (nearestSupport < currentPrice * 0.02) { // Within 2%
    technicalScore += 10
    confidence += 8
    alerts.push('NEAR_STRONG_SUPPORT')
  }

  if (nearestResistance < currentPrice * 0.02) { // Within 2%
    technicalScore -= 8
    confidence += 5
    alerts.push('NEAR_RESISTANCE')
  }

  return { score: technicalScore, confidence, alerts }
}

function calculateRiskScore(
  symbol: string,
  _currentPrice: number
) {
  let riskScore = 0
  let confidence = 0
  const alerts: string[] = []

  // Volatility assessment based on symbol
  const highVolatilityStocks = ['SUZLON', 'YESBANK', 'IDEA', 'ADANIENT']
  const lowVolatilityStocks = ['TCS', 'INFY', 'HDFCBANK', 'RELIANCE']

  if (highVolatilityStocks.includes(symbol)) {
    riskScore -= 5
    alerts.push('HIGH_VOLATILITY_STOCK')
  } else if (lowVolatilityStocks.includes(symbol)) {
    riskScore += 5
    confidence += 5
    alerts.push('LOW_VOLATILITY_STOCK')
  }

  // Additional risk factors can be added here

  return { score: riskScore, confidence, alerts }
}

function determineFinalSignal(totalScore: number, confidence: number) {
  let signal_type: 'BUY' | 'SELL' | 'HOLD' | 'AVOID' = 'HOLD'
  let strength: 'STRONG' | 'MODERATE' | 'WEAK' = 'WEAK'
  let timeframe: 'INTRADAY' | 'SWING' | 'POSITIONAL' = 'INTRADAY'

  // Determine signal type and strength
  if (totalScore > 60 && confidence > 80) {
    signal_type = 'BUY'
    strength = 'STRONG'
    timeframe = 'SWING'
  } else if (totalScore > 40 && confidence > 70) {
    signal_type = 'BUY'
    strength = 'MODERATE'
    timeframe = 'INTRADAY'
  } else if (totalScore > 20 && confidence > 60) {
    signal_type = 'BUY'
    strength = 'WEAK'
    timeframe = 'INTRADAY'
  } else if (totalScore < -60 && confidence > 80) {
    signal_type = 'SELL'
    strength = 'STRONG'
    timeframe = 'SWING'
  } else if (totalScore < -40 && confidence > 70) {
    signal_type = 'SELL'
    strength = 'MODERATE'
    timeframe = 'INTRADAY'
  } else if (totalScore < -20 && confidence > 60) {
    signal_type = 'SELL'
    strength = 'WEAK'
    timeframe = 'INTRADAY'
  } else if (confidence < 50) {
    signal_type = 'AVOID'
  }

  return { signal_type, strength, timeframe }
}

function calculateTradeLevels(
  currentPrice: number,
  supportLevels: number[],
  resistanceLevels: number[],
  maxPain: number,
  signalType: string
) {
  let entry = currentPrice
  let target_1 = currentPrice
  let target_2 = currentPrice
  let stop_loss = currentPrice

  if (signalType === 'BUY') {
    // Entry at current price
    entry = currentPrice
    
    // Targets from resistance levels or calculated
    target_1 = resistanceLevels[0] || currentPrice * 1.02
    target_2 = resistanceLevels[1] || maxPain || currentPrice * 1.05
    
    // Stop loss from support levels
    stop_loss = supportLevels[0] || currentPrice * 0.98
    
  } else if (signalType === 'SELL') {
    // Entry at current price
    entry = currentPrice
    
    // Targets from support levels or calculated
    target_1 = supportLevels[0] || currentPrice * 0.98
    target_2 = supportLevels[1] || maxPain || currentPrice * 0.95
    
    // Stop loss from resistance levels
    stop_loss = resistanceLevels[0] || currentPrice * 1.02
  }

  // Calculate risk-reward ratio
  const risk = Math.abs(entry - stop_loss)
  const reward = Math.abs(target_1 - entry)
  const risk_reward_ratio = risk > 0 ? reward / risk : 0

  return {
    entry,
    target_1,
    target_2,
    stop_loss,
    risk_reward_ratio: Math.round(risk_reward_ratio * 100) / 100
  }
}

function generateTradingReasoning(
  signal: { signal_type: string; strength: string },
  factors: { [key: string]: number },
  alerts: string[],
  originalReasoning: string
): string {
  let reasoning = `${signal.signal_type} signal with ${signal.strength} strength. `
  
  // Add factor analysis
  const topFactors = Object.entries(factors)
    .sort(([,a], [,b]) => Math.abs(b as number) - Math.abs(a as number))
    .slice(0, 2)
    .map(([name, score]) => `${name.replace('_', ' ')}: ${(score as number).toFixed(1)}`)
    .join(', ')
  
  reasoning += `Key factors: ${topFactors}. `
  
  // Add top alerts
  if (alerts.length > 0) {
    reasoning += `Signals: ${alerts.slice(0, 3).join(', ')}. `
  }
  
  reasoning += `Original analysis: ${originalReasoning}`
  
  return reasoning
}

function getMarketContext(symbol: string, price: number) {
  // Sector mapping (simplified)
  const sectorMap: { [key: string]: string } = {
    'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking',
    'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'HCLTECH': 'IT',
    'RELIANCE': 'Oil & Gas', 'IOC': 'Oil & Gas', 'BPCL': 'Oil & Gas',
    // Add more as needed
  }

  // Market cap categories (simplified)
  let market_cap_category: 'LARGE' | 'MID' | 'SMALL' = 'MID'
  if (price > 1000) market_cap_category = 'LARGE'
  else if (price < 100) market_cap_category = 'SMALL'

  // Liquidity rating (simplified)
  const highLiquidityStocks = ['RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY']
  const liquidity_rating: 'HIGH' | 'MEDIUM' | 'LOW' = 
    highLiquidityStocks.includes(symbol) ? 'HIGH' : 'MEDIUM'

  return {
    sector: sectorMap[symbol] || 'Others',
    market_cap_category,
    liquidity_rating
  }
}

function generateMarketSummary(signals: TradingSignal[]) {
  const buySignals = signals.filter(s => s.signal_type === 'BUY').length
  const sellSignals = signals.filter(s => s.signal_type === 'SELL').length
  const strongSignals = signals.filter(s => s.signal_strength === 'STRONG').length
  const avgConfidence = signals.length > 0 ? 
    signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length : 0

  return {
    total_signals: signals.length,
    buy_signals: buySignals,
    sell_signals: sellSignals,
    strong_signals: strongSignals,
    average_confidence: Math.round(avgConfidence),
    market_bias: buySignals > sellSignals ? 'BULLISH' : 'BEARISH'
  }
}
