import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface FutureSwingTrade {
  id: number;
  stock_symbol: string;
  entry_date: string;
  entry_price: number;
  cmp: number | null;
  stop_loss: number | null;
  target_price: number | null;
  exit_date: string | null;
  exit_price: number | null;
  result: 'SL' | 'Target' | 'Running';
  percentage_change: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'running' or 'closed'

    // Build query parameters
    const params: Record<string, string> = {
      select: '*',
      order: 'entry_date.desc',
    };

    // Filter by status if provided
    if (status === 'running') {
      params['result'] = 'eq.Running';
    } else if (status === 'closed') {
      params['result'] = 'in.(SL,Target)';
    }

    // Fetch data from Supabase
    const queryString = new URLSearchParams(params).toString();
    const url = `${SUPABASE_URL}/rest/v1/future_swings_elite?${queryString}`;

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.statusText}`);
    }

    const data: FutureSwingTrade[] = await response.json();

    // Calculate statistics
    const runningTrades = data.filter(t => t.result === 'Running');
    const closedTrades = data.filter(t => t.result === 'SL' || t.result === 'Target');
    const targetHits = closedTrades.filter(t => t.result === 'Target');
    const stopLossHits = closedTrades.filter(t => t.result === 'SL');

    // Calculate overall performance
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.percentage_change || 0), 0);
    const avgPnL = closedTrades.length > 0 ? totalPnL / closedTrades.length : 0;
    const winRate = closedTrades.length > 0 ? (targetHits.length / closedTrades.length) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: status ? data : {
        all: data,
        running: runningTrades,
        closed: closedTrades,
      },
      statistics: {
        totalTrades: data.length,
        runningCount: runningTrades.length,
        closedCount: closedTrades.length,
        targetHitsCount: targetHits.length,
        stopLossHitsCount: stopLossHits.length,
        winRate: Math.round(winRate * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100,
        avgPnL: Math.round(avgPnL * 100) / 100,
      },
    });

  } catch (error) {
    console.error('Error fetching future swings elite data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
        data: null,
      },
      { status: 500 }
    );
  }
}

