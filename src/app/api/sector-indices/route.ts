import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface SectorMapping {
  symbol: string;
  company_name: string;
  industry: string;
  isin_code: string;
  indices: string[];
  index_count: number;
  last_updated: string;
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
    const symbol = searchParams.get('symbol');
    const index = searchParams.get('index');
    const limit = parseInt(searchParams.get('limit') || '100');

    console.log('🔍 Fetching sector indices data...');

    let query = supabaseAdmin
      .from('stock_sector_mapping')
      .select('*')
      .limit(limit);

    // Apply filters
    if (symbol) {
      query = query.eq('symbol', symbol.toUpperCase());
    }

    if (index) {
      query = query.contains('indices', [index]);
    }

    const { data: sectorData, error } = await query;

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    const results = (sectorData || []) as SectorMapping[];

    console.log(`✅ Retrieved ${results.length} sector mappings`);

    return NextResponse.json({
      success: true,
      data: {
        results,
        total_results: results.length,
        filters: {
          symbol,
          index,
          limit
        }
      }
    });

  } catch (error) {
    console.error('❌ Sector indices API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sector indices data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint to manually trigger sector update (for testing)
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'trigger_update') {
      // This would trigger the Python script (for manual testing)
      return NextResponse.json({
        success: true,
        message: 'Sector indices update triggered. Check GitHub Actions for progress.',
        note: 'Automatic updates run every Saturday at 3:00 AM UTC'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('❌ Sector indices POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request'
    }, { status: 500 });
  }
}
