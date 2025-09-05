import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { FiiDiiData } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 API: Fetching FII/DII data...');
    
    // Try multiple sources for FII/DII data
    const fiiDiiData = await scrapeFiiDiiData();
    
    if (fiiDiiData.length === 0) {
      throw new Error('No FII/DII data found from any source');
    }
    
    // Store data in Supabase
    await storeFiiDiiData(fiiDiiData);
    
    // Clean up old data (keep only 30 days)
    await cleanupOldData();
    
    console.log(`✅ API: Successfully stored ${fiiDiiData.length} FII/DII records`);
    
    return NextResponse.json({
      success: true,
      message: 'FII/DII data collected successfully',
      data: fiiDiiData,
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

async function scrapeFiiDiiData(): Promise<FiiDiiData[]> {
  console.log('📊 Fetching FII/DII data from Groww API...');
  const growwData = await fetchGrowwFiiDii();
  
  if (growwData.length === 0) {
    throw new Error('No FII/DII data found from Groww API');
  }
  
  console.log(`✅ Groww: Found ${growwData.length} records`);
  return growwData;
}

async function fetchGrowwFiiDii(): Promise<FiiDiiData[]> {
  try {
    const response = await fetch('https://groww.in/v1/api/search/v3/query/fii_dii/st_fii_dii?period=daily&segment=Cash%20Market', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://groww.in/',
        'Origin': 'https://groww.in'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Groww API failed: ${response.status} ${response.statusText}`);
    }
    
    const apiResponse = await response.json();
    console.log('📊 Groww API response received');
    
    return parseGrowwData(apiResponse);
    
  } catch (error) {
    console.error('❌ Groww API failed:', error);
    throw error;
  }
}

function parseGrowwData(apiResponse: any): FiiDiiData[] {
  const results: FiiDiiData[] = [];
  
  try {
    if (!apiResponse?.data?.data || !Array.isArray(apiResponse.data.data)) {
      throw new Error('Invalid Groww API response format');
    }
    
    // Get the latest data (first entry in the array)
    const latestData = apiResponse.data.data[0];
    if (!latestData) {
      throw new Error('No FII/DII data in Groww response');
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
    console.error('❌ Failed to parse Groww data:', error);
    throw new Error('Failed to parse FII/DII data from Groww API');
  }
}

async function scrapeNseFiiDii(): Promise<FiiDiiData[]> {
  // Direct call to Groww - no fallbacks, no sample data
  return await fetchGrowwFiiDii();
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
    console.log('🧹 Cleaned up FII/DII data older than 30 days');
  }
} 