import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { IntradayActivity, IntradayActivityFilters } from '@/types/activities';

// GET /api/activities - Fetch activities with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: IntradayActivityFilters = {
      stock_names: searchParams.get('stock_names')?.split(',') || undefined,
      limit: parseInt(searchParams.get('limit') || '100'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const activities = await fetchActivities(filters);
    
    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length,
      filters: filters,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Activities API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/activities - Create new activity (for external systems)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const activity = await createActivity(body);
    
    return NextResponse.json({
      success: true,
      data: activity,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Create activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}

async function fetchActivities(filters: IntradayActivityFilters): Promise<IntradayActivity[]> {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  let query = supabaseAdmin
    .from('intraday_activities')
    .select('*')
    .eq('is_active', true)
    .in('trading_date', [today, yesterday]) // Show today and yesterday's activities
    .order('activity_timestamp', { ascending: false });

  // Apply stock name filter
  if (filters.stock_names && filters.stock_names.length > 0) {
    query = query.in('stock_name', filters.stock_names);
  }

  // Apply pagination
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 100) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase query error:', error);
    throw new Error('Database query failed');
  }

  return data || [];
}

async function createActivity(activityData: Partial<IntradayActivity>): Promise<IntradayActivity> {
  const { data, error } = await supabaseAdmin
    .from('intraday_activities')
    .insert([{
      stock_name: activityData.stock_name,
      activity_name: activityData.activity_name,
      activity_timestamp: activityData.activity_timestamp || new Date().toISOString(),
      trading_date: new Date().toISOString().split('T')[0]
    }])
    .select()
    .single();

  if (error) {
    console.error('Create activity error:', error);
    throw new Error('Failed to create activity');
  }

  return data;
}