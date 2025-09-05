import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { FiiDiiData, FiiDiiSummary } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 API: Fetching FII/DII historical data from database...');
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Supabase not configured, using sample data');
      const sampleData = generateSampleHistoricalData();
      return NextResponse.json({
        success: true,
        data: {
          raw: [],
          summary: sampleData,
          stats: {
            total_days: sampleData.length,
            latest_date: sampleData[0]?.date || null,
            total_records: 0,
            note: 'Using sample data - configure Supabase for real historical data'
          }
        }
      });
    }
    
    // Fetch last 30 days of FII/DII data
    const { data: rawData, error } = await supabase
      .from('fii_dii_data')
      .select('*')
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false })
      .order('category', { ascending: true });

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    const fiiDiiData = rawData as FiiDiiData[] || [];
    
    // Transform data into daily summaries
    const summaryMap = new Map<string, FiiDiiSummary>();
    
    fiiDiiData.forEach(record => {
      const existing = summaryMap.get(record.date) || {
        date: record.date,
        fii_buy: 0,
        fii_sell: 0,
        fii_net: 0,
        dii_buy: 0,
        dii_sell: 0,
        dii_net: 0,
        net_combined: 0
      };
      
      if (record.category === 'FII') {
        existing.fii_buy = record.buy_value;
        existing.fii_sell = record.sell_value;
        existing.fii_net = record.net_value;
      } else if (record.category === 'DII') {
        existing.dii_buy = record.buy_value;
        existing.dii_sell = record.sell_value;
        existing.dii_net = record.net_value;
      }
      
      existing.net_combined = existing.fii_net + existing.dii_net;
      summaryMap.set(record.date, existing);
    });
    
    const summaryData = Array.from(summaryMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`✅ API: Retrieved ${fiiDiiData.length} records covering ${summaryData.length} days`);
    
    return NextResponse.json({
      success: true,
      data: {
        raw: fiiDiiData,
        summary: summaryData,
        stats: {
          total_days: summaryData.length,
          latest_date: summaryData[0]?.date || null,
          total_records: fiiDiiData.length
        }
      }
    });
    
  } catch (error) {
    console.error('❌ API: Failed to fetch FII/DII historical data:', error);
    
    // Return sample data if database fails
    const sampleData = generateSampleHistoricalData();
    
    return NextResponse.json({
      success: true,
      data: {
        raw: [],
        summary: sampleData,
        stats: {
          total_days: sampleData.length,
          latest_date: sampleData[0]?.date || null,
          total_records: 0,
          note: 'Using sample data - connect Supabase for real historical data'
        }
      }
    });
  }
}

function generateSampleHistoricalData(): FiiDiiSummary[] {
  const data: FiiDiiSummary[] = [];
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate realistic FII/DII patterns
    const fiiNetVariation = (Math.random() - 0.6) * 3000; // FII tends to sell
    const diiNetVariation = (Math.random() - 0.3) * 2000; // DII tends to buy
    
    const fiiGrossBuy = Math.random() * 15000 + 5000;
    const fiiGrossSell = fiiGrossBuy - fiiNetVariation;
    
    const diiGrossBuy = Math.random() * 12000 + 3000;
    const diiGrossSell = diiGrossBuy - diiNetVariation;
    
    data.push({
      date: dateStr,
      fii_buy: Number(fiiGrossBuy.toFixed(2)),
      fii_sell: Number(fiiGrossSell.toFixed(2)),
      fii_net: Number(fiiNetVariation.toFixed(2)),
      dii_buy: Number(diiGrossBuy.toFixed(2)),
      dii_sell: Number(diiGrossSell.toFixed(2)),
      dii_net: Number(diiNetVariation.toFixed(2)),
      net_combined: Number((fiiNetVariation + diiNetVariation).toFixed(2))
    });
  }
  
  return data;
} 