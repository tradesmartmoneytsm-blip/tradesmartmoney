import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface OptionAnalysisFilters {
  analysis_type?: 'BULLISH_SETUPS' | 'BEARISH_SETUPS' | 'UNUSUAL_ACTIVITY' | 'COMPREHENSIVE';
  min_score: number; // Remove optional to fix undefined error
  symbols?: string[];
  limit?: number;
}

// Remove unused interface to fix warning
// interface OptionAnalysisResult {
//   id: number;
//   symbol: string;
//   analysis_timestamp: string;
//   trading_date: string;
//   score: number;
//   institutional_sentiment: string;
//   reasoning: string;
//   confidence: number;
//   current_price: number;
//   overall_pcr: number;
//   max_pain: number;
//   support_levels: number[];
//   resistance_levels: number[];
//   unusual_activity: string[];
//   strength_signals: string[];
//   net_call_buildup: number;
//   net_put_buildup: number;
//   target_1: number;
//   target_2: number;
//   stop_loss: number;
//   risk_reward_ratio: number;
//   institutional_bullish_flow: number;
//   institutional_bearish_flow: number;
//   net_institutional_flow: number;
//   detailed_analysis: string[];
// }

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    
    const filters: OptionAnalysisFilters = {
      analysis_type: (searchParams.get('analysis_type') as 'COMPREHENSIVE' | 'BULLISH_SETUPS' | 'BEARISH_SETUPS' | 'UNUSUAL_ACTIVITY') || 'COMPREHENSIVE',
      min_score: parseInt(searchParams.get('min_score') || '0'), // Default to 0 to include bearish stocks
      symbols: searchParams.get('symbols')?.split(',') || undefined,
      limit: parseInt(searchParams.get('limit') || '1000')
    };

    console.log('🔍 Fetching option analysis with filters:', filters);

    // Simple query - get latest data and sort by score DESC (like your working query)
    const { data: rawData, error } = await supabaseAdmin
      .from('latest_option_analysis')
      .select('*')
      .limit(500); // Reasonable limit for latest analysis per symbol

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    // Process and sort data to match your working database query
    const allData = (rawData || []).map(item => ({
      ...item,
      score: parseFloat(item.score),
      support_levels: JSON.parse(item.support_levels || '[]'),
      resistance_levels: JSON.parse(item.resistance_levels || '[]'),
      unusual_activity: JSON.parse(item.unusual_activity || '[]'),
      strength_signals: JSON.parse(item.strength_signals || '[]'),
      detailed_analysis: JSON.parse(item.detailed_analysis || '[]')
    }));

    // Sort by score DESC (IOC, TITAN, JINDALSTEL first)
    allData.sort((a, b) => b.score - a.score);

    // Apply filters after sorting
    let results = allData;

    // Apply analysis type filter
    if (filters.analysis_type === 'BULLISH_SETUPS') {
      results = results.filter(item => item.score >= filters.min_score);
    } else if (filters.analysis_type === 'BEARISH_SETUPS') {
      results = results.filter(item => item.score <= -filters.min_score);
    } else if (filters.analysis_type === 'UNUSUAL_ACTIVITY') {
      results = results.filter(item => item.unusual_activity.length > 0);
    } else {
      // COMPREHENSIVE - show all above min_score
      results = results.filter(item => Math.abs(item.score) >= filters.min_score);
    }

    // Apply symbol filter
    if (filters.symbols && filters.symbols.length > 0) {
      results = results.filter(item => filters.symbols!.includes(item.symbol));
    }

    // Apply limit
    if (filters.limit) {
      results = results.slice(0, filters.limit);
    }

    console.log(`✅ Retrieved ${results.length} option analysis results`);

    return NextResponse.json({
      success: true,
      data: {
        results,
        analysis_type: filters.analysis_type,
        total_results: results.length,
        min_score: filters.min_score,
        filters: filters,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Option analysis API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch option analysis'
    }, { status: 500 });
  }
}

// POST endpoint for manual refresh/testing
export async function POST(request: NextRequest) {
  try {
    // Remove unused variable warning
    await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Option analysis collection is handled by VPS server',
      note: 'Use the Python script on your VPS to collect and store analysis data',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Option analysis POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'POST method not implemented for option analysis'
    }, { status: 501 });
  }
}
