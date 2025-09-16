#!/usr/bin/env node

/**
 * NSE Data Collector for TradeSmart Money
 * Fetches Most Active Stock Calls and Puts data from NSE India APIs
 * Stores data in Supabase for the Smart Money Flow feature
 * 
 * Based on successful Python implementation with proper session management
 */

const https = require('https');
const zlib = require('zlib');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FORCE_RUN = process.env.FORCE_RUN === 'true';

// NSE API Configuration (Based on working Python code)
const NSE_BASE_URL = 'https://www.nseindia.com';
const COOKIE_SET_URL = `${NSE_BASE_URL}/market-data/oi-spurts`;
const CALLS_API_URL = `${NSE_BASE_URL}/api/snapshot-derivatives-equity?index=calls-stocks-val`;
const PUTS_API_URL = `${NSE_BASE_URL}/api/snapshot-derivatives-equity?index=puts-stocks-val`;

// Enhanced request headers (matching successful Python implementation)
const DEFAULT_HEADERS = {
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0'
};

// Session management
let sessionCookies = '';

// Initialize Supabase client
let supabase;
try {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Missing Supabase credentials');
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

/**
 * Make HTTP request with proper error handling and cookie management
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      ...options,
      headers: { 
        ...DEFAULT_HEADERS, 
        ...options.headers,
        ...(sessionCookies && { 'Cookie': sessionCookies })
      }
    };

    const req = https.get(url, requestOptions, (res) => {
      let data = Buffer.alloc(0);
      
      // Store cookies for session management
      if (res.headers['set-cookie']) {
        sessionCookies = res.headers['set-cookie'].join('; ');
      }
      
      // Handle compressed responses
      let responseStream = res;
      const encoding = res.headers['content-encoding'];
      
      if (encoding === 'gzip') {
        responseStream = zlib.createGunzip();
        res.pipe(responseStream);
      } else if (encoding === 'deflate') {
        responseStream = zlib.createInflate();
        res.pipe(responseStream);
      } else if (encoding === 'br') {
        responseStream = zlib.createBrotliDecompress();
        res.pipe(responseStream);
      }
      
      responseStream.on('data', chunk => {
        data = Buffer.concat([data, chunk]);
      });
      
      responseStream.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const textData = data.toString('utf8');
            
            // Try to parse as JSON, fallback to text
            try {
              const jsonData = JSON.parse(textData);
              resolve({ data: jsonData, statusCode: res.statusCode, cookies: sessionCookies });
            } catch (parseError) {
              resolve({ data: textData, statusCode: res.statusCode, cookies: sessionCookies });
            }
          } else {
            const errorText = data.toString('utf8');
            reject(new Error(`HTTP ${res.statusCode}: ${errorText.substring(0, 200)}...`));
          }
        } catch (error) {
          reject(new Error(`Response processing error: ${error.message}`));
        }
      });
      
      responseStream.on('error', (error) => {
        reject(new Error(`Decompression error: ${error.message}`));
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Set session cookies by visiting NSE page (matching Python approach)
 */
async function setSessionCookies() {
  console.log('🔗 Setting NSE session cookies...');
  
  try {
    const response = await makeRequest(COOKIE_SET_URL);
    console.log('✅ NSE session cookies established');
    console.log(`🍪 Cookie length: ${sessionCookies.length} chars`);
    return true;
  } catch (error) {
    console.error('❌ Failed to establish NSE session:', error.message);
    return false;
  }
}

/**
 * Fetch Most Active Stock Calls from NSE API
 */
async function fetchMostActiveStockCalls() {
  console.log('📡 Fetching most active stock calls...');
  
  try {
    const response = await makeRequest(CALLS_API_URL);
    
    if (!response.data || !response.data.OPTSTK || !response.data.OPTSTK.data) {
      throw new Error('Invalid calls data structure from NSE API');
    }

    const callsData = [];
    const data = response.data.OPTSTK.data;
    
    console.log(`📊 Processing ${data.length} call option records...`);
    
    // Group by underlying symbol and sum percentage changes
    const symbolMap = {};
    for (const item of data) {
      const symbol = item.underlying;
      const pChange = parseFloat(item.pChange || 0);
      
      if (symbolMap[symbol]) {
        symbolMap[symbol] += pChange;
      } else {
        symbolMap[symbol] = pChange;
      }
    }
    
    // Convert to array and sort by percentage change
    for (const [symbol, totalPChange] of Object.entries(symbolMap)) {
      callsData.push({
        symbol: symbol,
        percentage_change: parseFloat(totalPChange.toFixed(2))
      });
    }
    
    // Sort by percentage change descending and take top 10
    callsData.sort((a, b) => b.percentage_change - a.percentage_change);
    const topCalls = callsData.slice(0, 10);
    
    console.log(`✅ Fetched ${topCalls.length} most active calls`);
    console.log('📊 Top 3 calls:', topCalls.slice(0, 3).map(item => 
      `${item.symbol}: ${item.percentage_change}%`).join(', '));
    
    return topCalls;
  } catch (error) {
    console.error('❌ Failed to fetch calls:', error.message);
    
    // Retry once with fresh cookies (matching Python retry logic)
    console.log('🔄 Retrying with fresh session cookies...');
    await setSessionCookies();
    
    try {
      const retryResponse = await makeRequest(CALLS_API_URL);
      if (retryResponse.data && retryResponse.data.OPTSTK) {
        console.log('✅ Retry successful for calls data');
        return await fetchMostActiveStockCalls(); // Recursive call to process data
      }
    } catch (retryError) {
      console.error('❌ Retry failed for calls:', retryError.message);
    }
    
    return [];
  }
}

/**
 * Fetch Most Active Stock Puts from NSE API
 */
async function fetchMostActiveStockPuts() {
  console.log('📡 Fetching most active stock puts...');
  
  try {
    const response = await makeRequest(PUTS_API_URL);
    
    if (!response.data || !response.data.OPTSTK || !response.data.OPTSTK.data) {
      throw new Error('Invalid puts data structure from NSE API');
    }

    const putsData = [];
    const data = response.data.OPTSTK.data;
    
    console.log(`📊 Processing ${data.length} put option records...`);
    
    // Group by underlying symbol and sum percentage changes
    const symbolMap = {};
    for (const item of data) {
      const symbol = item.underlying;
      const pChange = parseFloat(item.pChange || 0);
      
      if (symbolMap[symbol]) {
        symbolMap[symbol] += pChange;
      } else {
        symbolMap[symbol] = pChange;
      }
    }
    
    // Convert to array and sort by percentage change
    for (const [symbol, totalPChange] of Object.entries(symbolMap)) {
      putsData.push({
        symbol: symbol,
        percentage_change: parseFloat(totalPChange.toFixed(2))
      });
    }
    
    // Sort by percentage change descending and take top 10
    putsData.sort((a, b) => b.percentage_change - a.percentage_change);
    const topPuts = putsData.slice(0, 10);
    
    console.log(`✅ Fetched ${topPuts.length} most active puts`);
    console.log('📊 Top 3 puts:', topPuts.slice(0, 3).map(item => 
      `${item.symbol}: ${item.percentage_change}%`).join(', '));
    
    return topPuts;
  } catch (error) {
    console.error('❌ Failed to fetch puts:', error.message);
    
    // Retry once with fresh cookies (matching Python retry logic)
    console.log('🔄 Retrying with fresh session cookies...');
    await setSessionCookies();
    
    try {
      const retryResponse = await makeRequest(PUTS_API_URL);
      if (retryResponse.data && retryResponse.data.OPTSTK) {
        console.log('✅ Retry successful for puts data');
        return await fetchMostActiveStockPuts(); // Recursive call to process data
      }
    } catch (retryError) {
      console.error('❌ Retry failed for puts:', retryError.message);
    }
    
    return [];
  }
}

/**
 * Generate unique session ID
 */
function generateSessionId() {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8);
  return `NSE_${timestamp}_${random}`;
}

/**
 * Store data in Supabase
 */
async function storeDataInSupabase(data, tableName, sessionId) {
  if (!data || data.length === 0) {
    console.log(`⚠️  No data to store in ${tableName}`);
    return false;
  }

  console.log(`💾 Storing ${data.length} records in ${tableName}...`);

  try {
    // Prepare data for insertion
    const insertData = data.map(item => ({
      symbol: item.symbol,
      percentage_change: item.percentage_change,
      session_id: sessionId,
      timestamp: new Date().toISOString()
    }));

    // Insert data into Supabase
    const { data: insertResult, error } = await supabase
      .from(tableName)
      .insert(insertData);

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully stored ${insertData.length} records in ${tableName}`);
    
    // Log sample data
    console.log('📊 Sample data stored:');
    insertData.slice(0, 3).forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.symbol}: ${item.percentage_change}%`);
    });
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to store data in ${tableName}:`, error.message);
    return false;
  }
}

/**
 * Clean up old data (keep only last 24 hours)
 */
async function cleanupOldData() {
  console.log('🧹 Cleaning up old data...');
  
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    
    const tables = ['most_active_stock_calls', 'most_active_stock_puts'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .lt('created_at', cutoffTime.toISOString());
        
      if (error) {
        console.error(`❌ Failed to cleanup ${table}:`, error.message);
      }
    }
    
    console.log('✅ Old data cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

/**
 * Check if it's market hours (9:20 AM to 3:30 PM IST, Mon-Fri)
 */
function isMarketHours() {
  if (FORCE_RUN) {
    console.log('🔄 Force run enabled - skipping market hours check');
    return true;
  }

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istTime = new Date(now.getTime() + istOffset);
  
  const day = istTime.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const hours = istTime.getUTCHours();
  const minutes = istTime.getUTCMinutes();
  const timeInMinutes = hours * 60 + minutes;
  
  // Market hours: 9:20 AM (560 minutes) to 3:30 PM (930 minutes) IST
  const marketStart = 9 * 60 + 20; // 9:20 AM
  const marketEnd = 15 * 60 + 30;  // 3:30 PM
  
  const isWeekday = day >= 1 && day <= 5; // Monday to Friday
  const isDuringHours = timeInMinutes >= marketStart && timeInMinutes <= marketEnd;
  
  console.log(`⏰ Current IST time: ${istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log(`📅 Is weekday: ${isWeekday}, Is during market hours: ${isDuringHours}`);
  
  return isWeekday && isDuringHours;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting NSE Data Collection (Enhanced Version)...');
  console.log('📅 Timestamp:', new Date().toISOString());
  
  try {
    // Check market hours
    if (!isMarketHours()) {
      console.log('⏰ Outside market hours - data collection skipped');
      process.exit(0);
    }

    // Generate session ID for this run
    const sessionId = generateSessionId();
    console.log(`🔑 Session ID: ${sessionId}`);

    // Set session cookies (critical for NSE API access)
    const cookiesSet = await setSessionCookies();
    if (!cookiesSet) {
      console.log('⚠️  Failed to set cookies - attempting API calls anyway');
    }

    // Collect data from NSE APIs
    console.log('📊 Starting data collection...');
    
    const [callsData, putsData] = await Promise.all([
      fetchMostActiveStockCalls(),
      fetchMostActiveStockPuts()
    ]);

    // Store data in parallel
    const [callsStored, putsStored] = await Promise.all([
      storeDataInSupabase(callsData, 'most_active_stock_calls', sessionId),
      storeDataInSupabase(putsData, 'most_active_stock_puts', sessionId)
    ]);

    // Cleanup old data
    await cleanupOldData();

    // Final status
    const totalRecords = (callsData?.length || 0) + (putsData?.length || 0);
    console.log(`\n🎯 Data Collection Summary:`);
    console.log(`   📞 Calls: ${callsData?.length || 0} records ${callsStored ? '✅' : '❌'}`);
    console.log(`   📈 Puts: ${putsData?.length || 0} records ${putsStored ? '✅' : '❌'}`);
    console.log(`   💾 Total: ${totalRecords} records`);
    console.log(`   🔑 Session: ${sessionId}`);
    
    if (totalRecords === 0) {
      console.log('⚠️  No real data collected - NSE APIs may still be blocking requests');
      console.log('💡 Consider implementing additional anti-detection measures');
    } else {
      console.log('✅ NSE data collection completed successfully!');
    }

  } catch (error) {
    console.error('💥 Fatal error during data collection:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM - gracefully shutting down');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT - gracefully shutting down');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unhandled error:', error);
    process.exit(1);
  });
} 