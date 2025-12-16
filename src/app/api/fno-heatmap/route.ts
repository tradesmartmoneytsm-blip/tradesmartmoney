import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * F&O Options Heatmap API
 * Reads data from database (populated by Python script every 5 mins)
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get parameters from query string
    const buildup = searchParams.get('buildup') || 'all';
    const sector = searchParams.get('sector') || 'all';
    const index = searchParams.get('index') || 'all';
    
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Build query
    let query = supabaseAdmin
      .from('fno_heatmap')
      .select('*')
      .eq('trading_date', today)
      .order('timestamp', { ascending: false });
    
    // Apply filters
    if (buildup !== 'all') {
      query = query.eq('buildup_type', buildup);
    }
    
    if (sector !== 'all') {
      query = query.eq('sector', sector);
    }
    
    if (index !== 'all') {
      query = query.eq('index_name', index);
    }
    
    // Execute query
    const { data, error } = await query.limit(500);
    
    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Database query failed'
        },
        { status: 500 }
      );
    }
    
    // Get latest timestamp data (most recent fetch)
    const latestTimestamp = data && data.length > 0 ? data[0].timestamp : null;
    const latestData = data?.filter(item => item.timestamp === latestTimestamp) || [];
    
    return NextResponse.json({
      success: true,
      data: latestData,
      count: latestData.length,
      last_updated: latestTimestamp,
      message: `Fetched ${latestData.length} stocks`
    });
    
  } catch (error) {
    console.error('F&O Heatmap API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch heatmap data'
      },
      { status: 500 }
    );
  }
}


