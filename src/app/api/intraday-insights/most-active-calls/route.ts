import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - only for reading data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET endpoint - Fetch latest data from Supabase
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const dataType = url.searchParams.get('type') || 'calls'; // 'calls' or 'puts'
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const tableName = dataType === 'calls' ? 'most_active_stock_calls' : 'most_active_stock_puts';

    // Fetch latest data from the specified table
    const { data, error } = await supabase
      .from(tableName)
      .select('symbol, percentage_change, timestamp, session_id')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[ERROR] Failed to fetch data from Supabase:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data', details: error.message },
        { status: 500 }
      );
    }

    // Group by session to get the latest session data
    const latestSessionData = data && data.length > 0 
      ? data.filter(item => item.session_id === data[0].session_id)
      : [];

    return NextResponse.json({
      success: true,
      data: latestSessionData || [],
      count: latestSessionData?.length || 0,
      type: dataType,
      lastUpdated: data && data.length > 0 ? data[0].timestamp : null
    });

  } catch (error) {
    console.error('[ERROR] GET request failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 