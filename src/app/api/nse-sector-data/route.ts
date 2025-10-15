import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const dataType = searchParams.get('data_type') || 'STOCK'; // 'INDEX' or 'STOCK'
    const indexName = searchParams.get('index_name');
    const symbol = searchParams.get('symbol');
    const tradingDate = searchParams.get('trading_date') || new Date().toISOString().split('T')[0];
    const limit = parseInt(searchParams.get('limit') || '1000');
    
    // Build query
    let query = supabaseAdmin
      .from('nse_sector_data')
      .select('*')
      .eq('data_type', dataType)
      .eq('trading_date', tradingDate)
      .order('day_change_percent', { ascending: false })
      .limit(limit);
    
    // Apply filters
    if (indexName) {
      query = query.eq('index_name', indexName);
    }
    
    if (symbol) {
      query = query.eq('symbol', symbol);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Database query failed' },
        { status: 500 }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          results: [],
          count: 0,
          message: `No ${dataType.toLowerCase()} data found for ${tradingDate}`
        }
      });
    }
    
    // Group data by index for better organization
    const groupedData: Record<string, unknown[]> = {};
    data.forEach(item => {
      if (!groupedData[item.index_name]) {
        groupedData[item.index_name] = [];
      }
      groupedData[item.index_name].push(item);
    });
    
    return NextResponse.json({
      success: true,
      data: {
        results: data,
        grouped: groupedData,
        count: data.length,
        trading_date: tradingDate,
        data_type: dataType
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET sector indices configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'get_config') {
      const { data, error } = await supabaseAdmin
        .from('nse_sector_indices_config')
        .select('*')
        .eq('is_active', true)
        .order('index_name');
      
      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to fetch configuration' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: {
          indices: data,
          count: data?.length || 0
        }
      });
    }
    
    if (action === 'add_index') {
      const { index_name, api_url, category, description } = body;
      
      const { data, error } = await supabaseAdmin
        .from('nse_sector_indices_config')
        .insert([{
          index_name,
          api_url,
          category: category || 'SECTORAL',
          description: description || '',
          is_active: true
        }])
        .select();
      
      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to add index configuration' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: data[0],
        message: `Successfully added ${index_name} to configuration`
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
