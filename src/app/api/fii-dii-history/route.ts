import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { FiiDiiData, FiiDiiSummary } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 API: Fetching FII/DII historical data from database...');
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured');
      return NextResponse.json({
        success: false,
        error: 'Database not configured',
        data: { summary: [], stats: { total_days: 0, latest_date: null, total_records: 0 } }
      }, { status: 503 });
    }

    // Fetch last 90 days of FII/DII data
    const { data: rawData, error } = await supabase
      .from('fii_dii_data')
      .select('*')
      .gte('date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    if (!rawData || rawData.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          summary: [],
          stats: {
            total_days: 0,
            latest_date: null,
            total_records: 0
          }
        }
      });
    }

    // Group data by date and calculate daily summary
    const groupedData = rawData.reduce((acc: Record<string, FiiDiiData[]>, item: FiiDiiData) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});

    // Convert to summary format
    const summary: FiiDiiSummary[] = Object.entries(groupedData).map(([date, dayData]) => {
      const dayDataTyped = dayData as FiiDiiData[];
      const fiiData = dayDataTyped.find((d: FiiDiiData) => d.category === 'FII');
      const diiData = dayDataTyped.find((d: FiiDiiData) => d.category === 'DII');

      const fii_buy = fiiData?.buy_value || 0;
      const fii_sell = fiiData?.sell_value || 0;
      const fii_net = fiiData?.net_value || 0;
      
      const dii_buy = diiData?.buy_value || 0;
      const dii_sell = diiData?.sell_value || 0;
      const dii_net = diiData?.net_value || 0;

      return {
        date,
        fii_buy: Number(fii_buy),
        fii_sell: Number(fii_sell),
        fii_net: Number(fii_net),
        dii_buy: Number(dii_buy),
        dii_sell: Number(dii_sell),
        dii_net: Number(dii_net),
        net_combined: Number(fii_net) + Number(dii_net)
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    const stats = {
      total_days: summary.length,
      latest_date: summary[0]?.date || null,
      total_records: rawData.length
    };

    console.log(`✅ API: Retrieved ${summary.length} days of FII/DII historical data`);
    
    return NextResponse.json({
      success: true,
      data: { summary, stats }
    });

  } catch (error) {
    console.error('❌ API: Failed to fetch FII/DII historical data:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch historical data',
      data: { summary: [], stats: { total_days: 0, latest_date: null, total_records: 0 } }
    }, { status: 500 });
  }
}