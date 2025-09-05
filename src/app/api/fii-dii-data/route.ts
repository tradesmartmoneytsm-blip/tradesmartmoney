import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import type { FiiDiiData } from '@/lib/supabase';

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
      data: fiiDiiData,
      message: `Successfully stored ${fiiDiiData.length} FII/DII records`,
      scrapedAt: new Date().toISOString()
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
  console.log('📊 Trying to fetch FII/DII data from NSE...');
  const nseData = await scrapeNseFiiDii();
  
  if (nseData.length === 0) {
    throw new Error('No FII/DII data found from NSE API');
  }
  
  console.log(`✅ NSE: Found ${nseData.length} records`);
  return nseData;
}

async function scrapeNseFiiDii(): Promise<FiiDiiData[]> {
  const response = await fetch('https://www.nseindia.com/api/fiidiiTradeReact', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.nseindia.com/',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  
  if (!response.ok) {
    throw new Error(`NSE API failed: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Parse NSE FII/DII response format
  const results: FiiDiiData[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  if (data && Array.isArray(data)) {
    // NSE typically returns recent data, parse the latest entry
    const latestData = data[0];
    if (latestData) {
      // Extract FII data
      if (latestData.fiiGrossP && latestData.fiiGrossS) {
        results.push({
          date: today,
          category: 'FII',
          buy_value: parseFloat(latestData.fiiGrossP) || 0,
          sell_value: parseFloat(latestData.fiiGrossS) || 0,
          net_value: (parseFloat(latestData.fiiGrossP) || 0) - (parseFloat(latestData.fiiGrossS) || 0)
        });
      }
      
      // Extract DII data
      if (latestData.diiGrossP && latestData.diiGrossS) {
        results.push({
          date: today,
          category: 'DII',
          buy_value: parseFloat(latestData.diiGrossP) || 0,
          sell_value: parseFloat(latestData.diiGrossS) || 0,
          net_value: (parseFloat(latestData.diiGrossP) || 0) - (parseFloat(latestData.diiGrossS) || 0)
        });
      }
    }
  }
  
  return results;
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
    throw new Error(`Failed to store FII/DII data: ${error.message}`);
  }
}

async function cleanupOldData() {
  if (!isSupabaseConfigured()) {
    console.log('⚠️ Supabase not configured, skipping data cleanup');
    return;
  }

  const { error } = await supabaseAdmin
    .rpc('cleanup_old_fii_dii_data');
    
  if (error) {
    console.warn('⚠️ Failed to cleanup old FII/DII data:', error.message);
  } else {
    console.log('🧹 Cleaned up FII/DII data older than 30 days');
  }
} 