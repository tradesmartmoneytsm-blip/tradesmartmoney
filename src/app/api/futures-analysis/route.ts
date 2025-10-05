import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface FuturesAnalysisFilters {
  signal_type?: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'ARBITRAGE';
  oi_buildup_type?: 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'LONG_UNWINDING' | 'SHORT_COVERING' | 'NEUTRAL';
  min_strength?: number;
  symbols?: string[];
  limit?: number;
}

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    
    const filters: FuturesAnalysisFilters = {
      signal_type: (searchParams.get('signal_type') as 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'ARBITRAGE') || undefined,
      oi_buildup_type: (searchParams.get('oi_buildup_type') as 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'LONG_UNWINDING' | 'SHORT_COVERING' | 'NEUTRAL') || undefined,
      min_strength: parseInt(searchParams.get('min_strength') || '20'),
      symbols: searchParams.get('symbols')?.split(',') || undefined,
      limit: parseInt(searchParams.get('limit') || '50')
    };

    console.log('🔍 Fetching futures analysis with filters:', filters);

    // Get latest futures analysis data
    const { data: rawData, error } = await supabaseAdmin
      .from('latest_futures_analysis')
      .select('*');

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    // Process and sort data by signal strength
    const allData = (rawData || []).map(item => ({
      ...item,
      signal_strength: parseFloat(item.signal_strength),
      key_levels: JSON.parse(item.key_levels || '[]'),
      volume_profile: JSON.parse(item.volume_profile || '{}'),
      institutional_activity: JSON.parse(item.institutional_activity || '{}')
    }));

    // Sort by signal strength DESC (best opportunities first)
    allData.sort((a, b) => b.signal_strength - a.signal_strength);

    // Apply filters after sorting
    let results = allData;

    // Apply signal type filter
    if (filters.signal_type) {
      results = results.filter(item => item.signal_type === filters.signal_type);
    }

    // Apply OI buildup type filter
    if (filters.oi_buildup_type) {
      results = results.filter(item => item.oi_buildup_type === filters.oi_buildup_type);
    }

    // Apply minimum strength filter
    if (filters.min_strength) {
      results = results.filter(item => item.signal_strength >= filters.min_strength);
    }

    // Apply symbol filter
    if (filters.symbols && filters.symbols.length > 0) {
      results = results.filter(item => filters.symbols!.includes(item.symbol));
    }

    // Apply limit
    if (filters.limit) {
      results = results.slice(0, filters.limit);
    }

    console.log(`✅ Retrieved ${results.length} futures analysis results`);

    return NextResponse.json({
      success: true,
      data: {
        results,
        signal_type: filters.signal_type,
        total_results: results.length,
        min_strength: filters.min_strength,
        filters: filters,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Futures analysis API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch futures analysis'
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
      message: 'Futures analysis collection is handled by VPS server',
      note: 'Use the Python script on your VPS to collect and store futures analysis data',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Futures analysis POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'POST method not implemented for futures analysis'
    }, { status: 501 });
  }
}
