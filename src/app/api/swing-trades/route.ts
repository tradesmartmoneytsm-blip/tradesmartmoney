import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export interface SwingTrade {
  id: string;
  strategy: 'BIT' | 'Swing Angle' | 'Bottom Formation';
  stock_name: string;
  stock_symbol: string;
  entry_price: number;
  exit_price?: number;
  stop_loss: number;
  target_price?: number;
  current_price?: number;
  status: 'Running' | 'SL Hit' | 'Trade Successful' | 'Cancelled';
  setup_description?: string;
  risk_reward_ratio?: string;
  timeframe?: string;
  entry_date: string;
  exit_date?: string;
  chart_image_url?: string;
  notes?: string;
  potential_return?: number;
  created_at: string;
  updated_at: string;
}

// GET - Fetch all swing trades or filter by strategy
export async function GET(request: Request) {
  try {
    console.log('🔄 API: Fetching swing trades...');
    
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase not configured, returning sample data');
      return NextResponse.json({
        success: true,
        message: 'Sample swing trades data (Supabase not configured)',
        data: getSampleSwingTrades(),
        source: 'sample_data'
      });
    }

    const { searchParams } = new URL(request.url);
    const strategy = searchParams.get('strategy');
    
    let query = supabase
      .from('swing_trades')
      .select('*')
      .order('entry_date', { ascending: false });

    if (strategy) {
      query = query.eq('strategy', strategy);
    }

    const { data: swingTrades, error } = await query;

    if (error) {
      console.error('❌ Error fetching swing trades:', error);
      throw error;
    }

    console.log(`✅ Successfully fetched ${swingTrades?.length || 0} swing trades`);

    return NextResponse.json({
      success: true,
      message: 'Swing trades fetched successfully',
      data: swingTrades,
      count: swingTrades?.length || 0
    });

  } catch (error) {
    console.error('❌ Swing trades API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: getSampleSwingTrades() // Fallback to sample data
    }, { status: 500 });
  }
}

// POST - Create new swing trade
export async function POST(request: Request) {
  try {
    console.log('🔄 API: Creating new swing trade...');
    
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured - cannot create swing trades'
      }, { status: 503 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['strategy', 'stock_name', 'stock_symbol', 'entry_price', 'stop_loss'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          success: false,
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Validate strategy
    const validStrategies = ['BIT', 'Swing Angle', 'Bottom Formation'];
    if (!validStrategies.includes(body.strategy)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid strategy. Must be one of: BIT, Swing Angle, Bottom Formation'
      }, { status: 400 });
    }

    // Calculate potential return if target_price is provided
    let potential_return = body.potential_return;
    if (!potential_return && body.target_price && body.entry_price) {
      potential_return = ((body.target_price - body.entry_price) / body.entry_price) * 100;
    }

    const swingTradeData = {
      strategy: body.strategy,
      stock_name: body.stock_name,
      stock_symbol: body.stock_symbol.toUpperCase(),
      entry_price: parseFloat(body.entry_price),
      exit_price: body.exit_price ? parseFloat(body.exit_price) : null,
      stop_loss: parseFloat(body.stop_loss),
      target_price: body.target_price ? parseFloat(body.target_price) : null,
      current_price: body.current_price ? parseFloat(body.current_price) : null,
      status: body.status || 'Running',
      setup_description: body.setup_description || null,
      risk_reward_ratio: body.risk_reward_ratio || null,
      timeframe: body.timeframe || null,
      entry_date: body.entry_date || new Date().toISOString().split('T')[0],
      exit_date: body.exit_date || null,
      chart_image_url: body.chart_image_url || null,
      notes: body.notes || null,
      potential_return: potential_return ? parseFloat(potential_return.toFixed(2)) : null
    };

    const { data: newTrade, error } = await supabaseAdmin
      .from('swing_trades')
      .insert([swingTradeData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating swing trade:', error);
      throw error;
    }

    console.log('✅ Successfully created swing trade:', newTrade.id);

    return NextResponse.json({
      success: true,
      message: 'Swing trade created successfully',
      data: newTrade
    });

  } catch (error) {
    console.error('❌ Create swing trade API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update existing swing trade
export async function PUT(request: Request) {
  try {
    console.log('🔄 API: Updating swing trade...');
    
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured - cannot update swing trades'
      }, { status: 503 });
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field: id'
      }, { status: 400 });
    }

    // Prepare update data (only include provided fields)
    const updateData: any = {};
    
    const updateableFields = [
      'strategy', 'stock_name', 'stock_symbol', 'entry_price', 'exit_price',
      'stop_loss', 'target_price', 'current_price', 'status', 'setup_description',
      'risk_reward_ratio', 'timeframe', 'entry_date', 'exit_date', 
      'chart_image_url', 'notes', 'potential_return'
    ];

    updateableFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field.includes('price') || field === 'potential_return') {
          updateData[field] = body[field] ? parseFloat(body[field]) : null;
        } else if (field === 'stock_symbol') {
          updateData[field] = body[field].toUpperCase();
        } else {
          updateData[field] = body[field];
        }
      }
    });

    // Set exit_date if status changed to completed states
    if (updateData.status && ['SL Hit', 'Trade Successful', 'Cancelled'].includes(updateData.status)) {
      updateData.exit_date = updateData.exit_date || new Date().toISOString().split('T')[0];
    }

    const { data: updatedTrade, error } = await supabaseAdmin
      .from('swing_trades')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating swing trade:', error);
      throw error;
    }

    console.log('✅ Successfully updated swing trade:', body.id);

    return NextResponse.json({
      success: true,
      message: 'Swing trade updated successfully',
      data: updatedTrade
    });

  } catch (error) {
    console.error('❌ Update swing trade API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Remove swing trade
export async function DELETE(request: Request) {
  try {
    console.log('🔄 API: Deleting swing trade...');
    
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured - cannot delete swing trades'
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: id'
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('swing_trades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting swing trade:', error);
      throw error;
    }

    console.log('✅ Successfully deleted swing trade:', id);

    return NextResponse.json({
      success: true,
      message: 'Swing trade deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete swing trade API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Sample data for when Supabase is not configured
function getSampleSwingTrades(): SwingTrade[] {
  return [
    {
      id: '1',
      strategy: 'BIT',
      stock_name: 'Reliance Industries',
      stock_symbol: 'RELIANCE',
      entry_price: 2450.00,
      stop_loss: 2320.00,
      target_price: 2650.00,
      current_price: 2485.50,
      status: 'Running',
      setup_description: 'Breakout from resistance with volume confirmation',
      risk_reward_ratio: '1:2.5',
      timeframe: '5-10 days',
      entry_date: '2025-01-06',
      potential_return: 8.16,
      notes: 'Strong volume breakout above 2440 resistance level',
      created_at: '2025-01-06T10:00:00Z',
      updated_at: '2025-01-06T10:00:00Z'
    },
    {
      id: '2',
      strategy: 'Swing Angle',
      stock_name: 'HDFC Bank',
      stock_symbol: 'HDFCBANK',
      entry_price: 1645.00,
      exit_price: 1720.00,
      stop_loss: 1580.00,
      target_price: 1750.00,
      current_price: 1720.00,
      status: 'Trade Successful',
      setup_description: 'Swing angle formation with RSI divergence',
      risk_reward_ratio: '1:2.2',
      timeframe: '7-12 days',
      entry_date: '2024-12-28',
      exit_date: '2025-01-05',
      potential_return: 6.38,
      notes: 'Perfect swing angle setup with bullish divergence',
      created_at: '2024-12-28T10:00:00Z',
      updated_at: '2025-01-05T16:30:00Z'
    },
    {
      id: '3',
      strategy: 'Bottom Formation',
      stock_name: 'TCS',
      stock_symbol: 'TCS',
      entry_price: 3890.00,
      stop_loss: 3750.00,
      target_price: 4200.00,
      current_price: 3825.00,
      status: 'SL Hit',
      setup_description: 'Double bottom formation at key support',
      risk_reward_ratio: '1:2.8',
      timeframe: '10-15 days',
      entry_date: '2024-12-20',
      exit_date: '2024-12-30',
      exit_price: 3750.00,
      potential_return: 7.97,
      notes: 'False breakout from double bottom pattern',
      created_at: '2024-12-20T10:00:00Z',
      updated_at: '2024-12-30T14:20:00Z'
    }
  ];
} 