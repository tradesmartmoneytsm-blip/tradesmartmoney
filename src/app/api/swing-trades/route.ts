import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import crypto from 'crypto';

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

// Authentication helper
function verifyAuthToken(token: string, password: string): boolean {
  try {
    const [timestamp, hash] = token.split('_');
    
    if (!timestamp || !hash) {
      return false;
    }

    // Check if token is not too old (24 hours)
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (currentTime - tokenTime > maxAge) {
      return false;
    }

    // Verify hash
    const expectedHash = crypto.createHash('sha256').update(password + timestamp).digest('hex');
    return hash === expectedHash;

  } catch {
    return false;
  }
}

// Middleware to check authentication for protected operations
async function checkAuth(request: Request): Promise<{ isAuthenticated: boolean; error?: string }> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuthenticated: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  const adminPassword = process.env.SWING_ADMIN_PASSWORD;
  if (!adminPassword) {
    return { isAuthenticated: false, error: 'Admin authentication not configured' };
  }

  const isValid = verifyAuthToken(token, adminPassword);
  
  if (!isValid) {
    return { isAuthenticated: false, error: 'Invalid or expired token' };
  }

  return { isAuthenticated: true };
}

// GET - Fetch all swing trades or filter by strategy (no auth required for reading)
export async function GET(request: Request) {
  try {
    console.log('🔄 API: Fetching swing trades...');
    
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase not configured, returning sample data');
      return NextResponse.json({
        success: true,
        message: 'Sample swing trades data (Supabase not configured)',
        data: [],
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
      data: []
    }, { status: 500 });
  }
}

// POST - Create new swing trade (AUTH REQUIRED)
export async function POST(request: Request) {
  try {
    console.log('🔄 API: Creating new swing trade...');
    
    // Check authentication
    const authResult = await checkAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: authResult.error || 'Authentication required'
      }, { status: 401 });
    }

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

    // Parse potential return to number if it exists
    let parsedPotentialReturn = null;
    if (potential_return) {
      const numValue = parseFloat(potential_return);
      if (!isNaN(numValue)) {
        parsedPotentialReturn = Math.round(numValue * 100) / 100; // Round to 2 decimal places
      }
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
      entry_date: (body.entry_date && body.entry_date.trim() !== '') ? body.entry_date : new Date().toISOString().split('T')[0],
      exit_date: (body.exit_date && body.exit_date.trim() !== '') ? body.exit_date : null,
      chart_image_url: body.chart_image_url || null,
      notes: body.notes || null,
      potential_return: parsedPotentialReturn
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

// PUT - Update existing swing trade (AUTH REQUIRED)
export async function PUT(request: Request) {
  try {
    console.log('🔄 API: Updating swing trade...');
    
    // Check authentication
    const authResult = await checkAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: authResult.error || 'Authentication required'
      }, { status: 401 });
    }

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
    const updateData: Partial<Omit<SwingTrade, 'id' | 'created_at' | 'updated_at'>> & Record<string, unknown> = {};
    
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
        } else if (field.includes('date')) {
          // Handle date fields: convert empty strings to null
          updateData[field] = body[field] && body[field].trim() !== '' ? body[field] : null;
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

// DELETE - Remove swing trade (AUTH REQUIRED)
export async function DELETE(request: Request) {
  try {
    console.log('🔄 API: Deleting swing trade...');
    
    // Check authentication
    const authResult = await checkAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({
        success: false,
        error: authResult.error || 'Authentication required'
      }, { status: 401 });
    }

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
