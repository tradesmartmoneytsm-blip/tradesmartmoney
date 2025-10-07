#!/usr/bin/env node

/**
 * FNO Symbols Fetcher
 * Fetches F&O symbol list from market data API and stores in Supabase
 * Runs daily at 9:00 AM via GitHub Action
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration
const NIFTY_TRADER_API_URL = 'https://webapi.niftytrader.in/webapi/symbol/psymbol-list';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_KEY);
  process.exit(1);
}

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Fetch all FNO symbols from market data API
 */
async function fetchFnoSymbols() {
  console.log('🔄 Fetching FNO symbols from market data API...');
  
  try {
    const response = await fetch(NIFTY_TRADER_API_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.resultData || !Array.isArray(data.resultData)) {
      throw new Error('Invalid API response format');
    }

    const symbols = data.resultData.map(item => item.symbol_name).filter(Boolean);
    console.log(`✅ Fetched ${symbols.length} FNO symbols`);
    
    return symbols;

  } catch (error) {
    console.error('❌ Error fetching FNO symbols:', error.message);
    throw error;
  }
}

/**
 * Store FNO symbols in Supabase
 */
async function storeFnoSymbols(symbols) {
  console.log(`🔄 Storing ${symbols.length} symbols in Supabase...`);

  try {
    // First, mark all existing symbols as inactive
    console.log('🔄 Marking existing symbols as inactive...');
    const { error: deactivateError } = await supabase
      .from('fno_symbols')
      .update({ is_active: false })
      .neq('id', 0); // Update all records

    if (deactivateError) {
      console.warn('⚠️ Warning: Could not deactivate existing symbols:', deactivateError.message);
    }

    // Prepare symbol data for upsert
    const symbolData = symbols.map(symbol => ({
      symbol_name: symbol,
      is_active: true,
      updated_at: new Date().toISOString()
    }));

    // Split into batches of 100 for better performance
    const batchSize = 100;
    let totalUpserted = 0;
    let totalErrors = 0;

    for (let i = 0; i < symbolData.length; i += batchSize) {
      const batch = symbolData.slice(i, i + batchSize);
      
      console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1} (${batch.length} symbols)...`);

      const { data, error } = await supabase
        .from('fno_symbols')
        .upsert(batch, { 
          onConflict: 'symbol_name',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`❌ Error in batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        totalErrors += batch.length;
      } else {
        totalUpserted += batch.length;
        console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} completed successfully`);
      }

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`   ✅ Successfully stored: ${totalUpserted} symbols`);
    console.log(`   ❌ Errors: ${totalErrors} symbols`);

    return { upserted: totalUpserted, errors: totalErrors };

  } catch (error) {
    console.error('❌ Error storing FNO symbols:', error.message);
    throw error;
  }
}

/**
 * Clean up inactive symbols (optional - keep for historical reference)
 */
async function cleanupInactiveSymbols() {
  
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('fno_symbols')
      .delete()
      .eq('is_active', false)
      .lt('updated_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.warn('⚠️ Warning: Could not clean up inactive symbols:', error.message);
    } else {
    }

  } catch (error) {
    console.warn('⚠️ Warning: Error during cleanup:', error.message);
  }
}

/**
 * Main execution function
 */
async function main() {
  const startTime = new Date();
  console.log(`🚀 Starting FNO symbols collection at ${startTime.toISOString()}`);
  console.log('=' .repeat(60));

  try {
    // Fetch symbols from API
    const symbols = await fetchFnoSymbols();

    if (symbols.length === 0) {
      throw new Error('No symbols fetched from API');
    }

    // Store symbols in database
    const result = await storeFnoSymbols(symbols);

    // Clean up old inactive symbols
    await cleanupInactiveSymbols();

    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('=' .repeat(60));
    console.log(`✅ FNO symbols collection completed successfully!`);
    console.log(`📊 Final Summary:`);
    console.log(`   ✅ Successfully stored: ${result.upserted}`);
    console.log(`   ❌ Errors: ${result.errors}`);
    console.log(`   🕐 Completed at: ${endTime.toISOString()}`);

    // Exit with success
    process.exit(0);

  } catch (error) {
    const endTime = new Date();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log('=' .repeat(60));
    console.error(`❌ FNO symbols collection failed after ${duration} seconds`);
    console.error(`🚨 Error: ${error.message}`);
    console.error(`🕐 Failed at: ${endTime.toISOString()}`);

    // Exit with error
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
main(); 