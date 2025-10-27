import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Internal API route for option chain analysis data
 * Used by internal tools like stock progression charts
 * Replaces direct client-side Supabase access
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database not configured',
          data: [] 
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tradingDate = searchParams.get('trading_date');
    const symbol = searchParams.get('symbol');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('option_chain_analysis')
      .select('*')
      .order('analysis_timestamp', { ascending: true });

    // Apply filters
    if (tradingDate) {
      query = query.eq('trading_date', tradingDate);
    }

    if (symbol) {
      query = query.eq('symbol', symbol);
    }

    // Apply pagination
    if (limit > 0) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database query failed',
          data: [] 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: count || data?.length || 0,
      hasMore: data && data.length === limit
    });

  } catch (error) {
    console.error('Internal API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        data: [] 
      },
      { status: 500 }
    );
  }
}

