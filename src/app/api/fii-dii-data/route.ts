import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { FiiDiiData } from '@/lib/supabase';
import { getGrowwHeaders } from '@/lib/api-headers';

export async function GET() {
  try {
    
    // Try multiple sources for FII/DII data
    const marketData = await fetchFiiDiiData();
    
    if (marketData.length === 0) {
      throw new Error('No FII/DII data found');
    }
    
    // Store data in Supabase
    await storeFiiDiiData(marketData);
    
    // Clean up old data (keep only 30 days)
    await cleanupOldData();
    
    console.log(`✅ API: Successfully stored ${marketData.length} FII/DII records`);
    
    return NextResponse.json({
      success: true,
      message: 'FII/DII data collected successfully',
      data: marketData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ API: Failed to fetch/store FII/DII data:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 });
  }
}

async function fetchFiiDiiData(): Promise<FiiDiiData[]> {
  try {
    console.log('🔄 Starting API call...');
    const url = 'https://groww.in/v1/api/search/v3/query/fii_dii/st_fii_dii?period=daily&segment=Cash%20Market';
    
    const response = await fetch(url, {
      headers: getGrowwHeaders(),
      method: 'GET'
    });
    
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      console.log(`❌ API error body: ${errorText}`);
      throw new Error(`API failed: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const apiResponse = await response.json();
    
    return parseFiiDiiData(apiResponse);
    
  } catch (error) {
    console.error('❌ API failed with detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    throw error;
  }
}

interface ApiResponse {
  data?: {
    data?: Array<{
      date?: string;
      fii?: {
        grossBuy?: number;
        grossSell?: number;
        netBuySell?: number;
      };
      dii?: {
        grossBuy?: number;
        grossSell?: number;
        netBuySell?: number;
      };
    }>;
  };
}

function parseFiiDiiData(apiResponse: ApiResponse): FiiDiiData[] {
  const results: FiiDiiData[] = [];
  
  try {
    if (!apiResponse?.data?.data || !Array.isArray(apiResponse.data.data)) {
      throw new Error('Invalid API response format');
    }
    
    // Get the latest data (first entry in the array)
    const latestData = apiResponse.data.data[0];
    if (!latestData) {
      throw new Error('No FII/DII data in API response');
    }
    
    const date = latestData.date || new Date().toISOString().split('T')[0];
    
    // Extract FII data
    if (latestData.fii) {
      results.push({
        date: date,
        category: 'FII',
        buy_value: Number(latestData.fii.grossBuy) || 0,
        sell_value: Number(latestData.fii.grossSell) || 0,
        net_value: Number(latestData.fii.netBuySell) || 0
      });
    }
    
    // Extract DII data
    if (latestData.dii) {
      results.push({
        date: date,
        category: 'DII', 
        buy_value: Number(latestData.dii.grossBuy) || 0,
        sell_value: Number(latestData.dii.grossSell) || 0,
        net_value: Number(latestData.dii.netBuySell) || 0
      });
    }
    
    console.log(`✅ Parsed FII/DII data for ${date}: FII net ₹${latestData.fii?.netBuySell} cr, DII net ₹${latestData.dii?.netBuySell} cr`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Failed to parse API data:', error);
    throw new Error('Failed to parse FII/DII data from API');
  }
}

async function storeFiiDiiData(data: FiiDiiData[]) {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, skipping data storage');
    return;
  }

  const { error } = await supabaseAdmin
    .from('fii_dii_data')
    .upsert(data, { 
      onConflict: 'date,category',
      ignoreDuplicates: false 
    });
    
  if (error) {
    throw new Error(`Failed to store data: ${error.message}`);
  }
}

async function cleanupOldData() {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, skipping cleanup');
    return;
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { error } = await supabaseAdmin
    .from('fii_dii_data')
    .delete()
    .lt('date', thirtyDaysAgo.toISOString().split('T')[0]);
    
  if (error) {
    console.error('Failed to cleanup old data:', error);
  } else {
  }
} 