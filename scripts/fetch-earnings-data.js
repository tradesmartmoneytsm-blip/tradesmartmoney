#!/usr/bin/env node

/**
 * MoneyControl Comprehensive Earnings Data Fetcher
 * 
 * Fetches ALL earnings data from MoneyControl API:
 * - Both "beats" and "missed" expectations
 * - All pages (full pagination)
 * - Sector extraction from URLs
 * - Stores in Supabase earnings_estimates table
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// MoneyControl API endpoints
const API_BASE = 'https://api.moneycontrol.com/mcapi/v1/earnings/actual-estimate';
const API_ENDPOINTS = [
  { type: 'beats', url: `${API_BASE}?sortBy=beats&search=&indexId=N&sector=&type=all` },
  { type: 'missed', url: `${API_BASE}?sortBy=missed&search=&indexId=N&sector=&type=all` },
  { type: 'all', url: `${API_BASE}?sortBy=all&search=&indexId=N&sector=&type=all` }
];

/**
 * Extract sector from MoneyControl stock URL
 * @param {string} stockUrl - e.g., "/telecommunication-service-provider/vodafoneidea/IC8"
 * @returns {string} - Cleaned sector name
 */
function extractSectorFromUrl(stockUrl) {
  if (!stockUrl || typeof stockUrl !== 'string') return 'Others';
  
  const pathParts = stockUrl.split('/').filter(part => part.length > 0);
  if (pathParts.length < 2) return 'Others';
  
  const sectorSlug = pathParts[0];
  
  // Convert URL slug to readable sector name
  const sectorMapping = {
    // Finance & Banking
    'banks-private-sector': 'Banking',
    'banks-public-sector': 'Banking', 
    'finance-investments': 'Financial Services',
    'finance-housing': 'Housing Finance',
    'finance-others': 'Financial Services',
    'nbfc': 'NBFC',
    
    // IT & Technology
    'computers-software': 'IT Services',
    'computers-software-medium-small': 'IT Services',
    'telecom-equipment': 'Telecommunications',
    'telecommunication-service-provider': 'Telecommunications',
    
    // Oil, Gas & Energy
    'refineries': 'Oil & Gas',
    'oil-drilling-exploration': 'Oil & Gas',
    'power-generation-distribution': 'Power',
    'coal': 'Power',
    
    // Healthcare & Pharma
    'pharmaceuticals': 'Pharmaceuticals',
    'pharmaceuticals-drugs': 'Pharmaceuticals',
    'hospitals-medical-services': 'Healthcare',
    'healthcare-others': 'Healthcare',
    
    // Manufacturing & Industrial
    'automobile-2-3-wheelers': 'Automobile',
    'automobile-4-wheelers': 'Automobile',
    'auto-components': 'Auto Components',
    'tyres': 'Auto Components',
    'engineering-heavy': 'Engineering',
    'aerospace-defence': 'Defence',
    
    // Materials & Chemicals
    'iron-steel': 'Metals & Mining',
    'aluminium': 'Metals & Mining',
    'mining-minerals': 'Metals & Mining',
    'cement-major': 'Cement',
    'cement-mini': 'Cement',
    'chemicals': 'Chemicals',
    'speciality-chemicals': 'Chemicals',
    'fertilisers': 'Fertilizers',
    'paints': 'Paints',
    
    // Consumer & Retail
    'fmcg': 'FMCG',
    'breweries-distilleries': 'Beverages',
    'food-processing': 'Food Processing',
    'textiles-readymade-apparels': 'Textiles',
    'retail': 'Retail',
    
    // Infrastructure & Real Estate
    'construction-contracting-real-estate': 'Real Estate',
    'power-transmission-equipment': 'Infrastructure',
    'transport-logistics': 'Logistics',
    
    // Media & Entertainment
    'media-entertainment': 'Media & Entertainment',
    
    // Others
    'miscellaneous': 'Others',
    'diversified': 'Diversified'
  };
  
  const sector = sectorMapping[sectorSlug];
  if (sector) return sector;
  
  // Fallback: clean up slug to readable name
  return sectorSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse numeric value from string (handles "1,234.56" format)
 */
function parseNumeric(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '' || value === '--') {
    return defaultValue;
  }
  
  const stringValue = String(value).replace(/,/g, '');
  const numericValue = parseFloat(stringValue);
  
  return isNaN(numericValue) ? defaultValue : numericValue;
}

/**
 * Parse MoneyControl date format
 */
function parseMoneyControlDate(dateString) {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  } catch (error) {
    console.error('Date parsing error:', dateString, error);
    return null;
  }
}

/**
 * Get overall performance and percentage from expectations text
 */
function parsePerformance(expectations, expectationsPer) {
  const expectationsLower = (expectations || '').toLowerCase();
  let performance = 'Met';
  
  if (expectationsLower.includes('beat')) {
    performance = 'Beat';
  } else if (expectationsLower.includes('missed')) {
    performance = 'Missed';
  }
  
  const percentage = parseNumeric(expectationsPer, 0);
  
  return { performance, percentage };
}

/**
 * Extract quarter information from table header
 */
function extractQuarterInfo(tableHeader) {
  if (!tableHeader || !Array.isArray(tableHeader) || tableHeader.length === 0) {
    return 'Latest';
  }
  return tableHeader[0] || 'Latest';
}

/**
 * Fetch single page of earnings data
 */
async function fetchEarningsPage(url, page = 1) {
  try {
    const pageUrl = `${url}&page=${page}`;
    
    const response = await fetch(pageUrl);
    if (!response.ok) {
      console.error(`❌ HTTP ${response.status}: ${pageUrl}`);
      return { success: false, data: [], hasMore: false };
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data || !result.data.list) {
      console.warn(`⚠️ No data found on page ${page}`);
      return { success: false, data: [], hasMore: false };
    }
    
    const companies = result.data.list;
    const hasMore = companies.length > 0; // Assume more pages if current page has data
    
    console.log(`✅ Found ${companies.length} companies on page ${page}`);
    return { success: true, data: companies, hasMore, tableHeader: result.data.tableHeader };
    
  } catch (error) {
    console.error(`❌ Error fetching page ${page}:`, error.message);
    return { success: false, data: [], hasMore: false };
  }
}

/**
 * Fetch all pages from a specific endpoint
 */
async function fetchAllPagesFromEndpoint(endpoint) {
  console.log(`\n🔄 Fetching ALL data from: ${endpoint.type.toUpperCase()} endpoint`);
  
  let allCompanies = [];
  let page = 1;
  let tableHeader = null;
  
  while (true) {
    const result = await fetchEarningsPage(endpoint.url, page);
    
    if (!result.success) {
      console.log(`❌ Failed to fetch page ${page}, stopping pagination`);
      break;
    }
    
    if (result.data.length === 0) {
      break;
    }
    
    allCompanies = allCompanies.concat(result.data);
    if (result.tableHeader) tableHeader = result.tableHeader;
    
    
    page++;
    
    // Add small delay to be respectful to MoneyControl's servers
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Safety limit to prevent infinite loops
    if (page > 50) {
      console.warn(`⚠️ Reached page limit (${page}), stopping`);
      break;
    }
  }
  
  console.log(`✅ Completed ${endpoint.type} endpoint: ${allCompanies.length} total companies`);
  return { companies: allCompanies, tableHeader };
}

/**
 * Fetch comprehensive earnings data from all endpoints
 */
async function fetchComprehensiveEarningsData() {
  
  let allEarningsData = [];
  let seenCompanies = new Set(); // Track unique companies by symbol
  
  // Fetch from all endpoints
  for (const endpoint of API_ENDPOINTS) {
    const result = await fetchAllPagesFromEndpoint(endpoint);
    
    // Process and transform the data
    for (const companyData of result.companies) {
      try {
        const [
          sc_id,
          stockName,
          stockUrl,
          currentPrice,
          perChange,
          mtgdate,
          curr_mktcap,
          expectations,
          expectationsPer,
          quarterData,
          exchange,
          financialType
        ] = companyData;
        
        // Skip if we've already seen this company (avoid duplicates across endpoints)
        if (seenCompanies.has(sc_id)) {
          continue;
        }
        seenCompanies.add(sc_id);
        
        // Extract sector from URL
        const sector = extractSectorFromUrl(stockUrl);
        
        // Parse performance
        const { performance, percentage } = parsePerformance(expectations, expectationsPer);
        
        // Parse quarter data (Revenue, Net Profit, EPS)
        let actualRevenue = 0, estimatedRevenue = 0;
        let actualNetProfit = 0, estimatedNetProfit = 0;
        let actualEPS = 0, estimatedEPS = 0;
        
        if (Array.isArray(quarterData)) {
          for (const [metric, actual, estimated] of quarterData) {
            if (metric === 'Revenue') {
              actualRevenue = parseNumeric(actual);
              estimatedRevenue = parseNumeric(estimated);
            } else if (metric === 'Net Profit') {
              actualNetProfit = parseNumeric(actual);
              estimatedNetProfit = parseNumeric(estimated);
            } else if (metric === 'EPS') {
              actualEPS = parseNumeric(actual);
              estimatedEPS = parseNumeric(estimated);
            }
          }
        }
        
        // Calculate variances
        const revenueVariance = estimatedRevenue !== 0 ? 
          ((actualRevenue - estimatedRevenue) / estimatedRevenue * 100) : 0;
        const profitVariance = estimatedNetProfit !== 0 ? 
          ((actualNetProfit - estimatedNetProfit) / estimatedNetProfit * 100) : 0;
        const epsVariance = estimatedEPS !== 0 ? 
          ((actualEPS - estimatedEPS) / estimatedEPS * 100) : 0;
        
        // Build earnings record
        const earningsRecord = {
          symbol: sc_id,
          company_name: stockName,
          stock_url: stockUrl,
          exchange: exchange || 'NSE',
          current_price: parseNumeric(currentPrice),
          price_change: parseNumeric(perChange),
          price_change_percent: parseNumeric(perChange),
          market_cap: parseNumeric(curr_mktcap),
          quarter: extractQuarterInfo(result.tableHeader),
          report_date: parseMoneyControlDate(mtgdate),
          financial_type: financialType || 'Consolidated',
          expectations: expectations,
          expectations_percent: parseNumeric(expectationsPer),
          actual_revenue: actualRevenue,
          estimated_revenue: estimatedRevenue,
          revenue_variance: revenueVariance,
          actual_net_profit: actualNetProfit,
          estimated_net_profit: estimatedNetProfit,
          profit_variance: profitVariance,
          actual_eps: actualEPS,
          estimated_eps: estimatedEPS,
          eps_variance: epsVariance,
          overall_performance: performance,
          performance_percent: percentage,
          sector: sector,
          data_source: 'MoneyControl',
          api_fetch_date: new Date().toISOString()
        };
        
        allEarningsData.push(earningsRecord);
        
      } catch (error) {
        console.error('❌ Error processing company data:', error, companyData);
      }
    }
  }
  
  console.log(`🏢 Sectors covered: ${[...new Set(allEarningsData.map(d => d.sector))].length}`);
  console.log(`📈 Beat expectations: ${allEarningsData.filter(d => d.overall_performance === 'Beat').length}`);
  console.log(`📉 Missed expectations: ${allEarningsData.filter(d => d.overall_performance === 'Missed').length}`);
  console.log(`➖ Met expectations: ${allEarningsData.filter(d => d.overall_performance === 'Met').length}`);
  
  return allEarningsData;
}

/**
 * Store earnings data in Supabase
 */
async function storeEarningsData(earningsData) {
  if (!earningsData || earningsData.length === 0) {
    console.log('⚠️ No earnings data to store');
    return { success: false, error: 'No data provided' };
  }
  
  
  try {
    const forceUpdate = process.env.FORCE_UPDATE === 'true';
    
    if (forceUpdate) {
      console.log('🔄 FORCE_UPDATE enabled - will overwrite existing records');
    }
    
    // Use upsert to handle duplicates gracefully
    const { data, error } = await supabase
      .from('earnings_estimates')
      .upsert(earningsData, { 
        onConflict: 'symbol,quarter,report_date',
        ignoreDuplicates: !forceUpdate
      })
      .select('symbol');
    
    if (error) {
      console.error('❌ Supabase upsert error:', error);
      return { success: false, error: error.message };
    }
    
    const insertedCount = data ? data.length : earningsData.length;
    console.log(`✅ Successfully stored ${insertedCount} records`);
    
    // Summary by sector
    const sectorCounts = {};
    earningsData.forEach(record => {
      sectorCounts[record.sector] = (sectorCounts[record.sector] || 0) + 1;
    });
    
    Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([sector, count]) => {
      });
    
    return { success: true, recordsStored: insertedCount, sectorBreakdown: sectorCounts };
    
  } catch (error) {
    console.error('❌ Error storing data:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main execution function
 */
async function main() {
  const startTime = Date.now();
  
  try {
    // Step 1: Fetch comprehensive data
    const earningsData = await fetchComprehensiveEarningsData();
    
    if (earningsData.length === 0) {
      console.error('❌ No earnings data fetched. Exiting.');
      process.exit(1);
    }
    
    // Step 2: Store in Supabase
    const storeResult = await storeEarningsData(earningsData);
    
    if (!storeResult.success) {
      console.error('❌ Failed to store data:', storeResult.error);
      process.exit(1);
    }
    
    // Step 3: Success summary
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log(`📊 Companies processed: ${earningsData.length}`);
    console.log(`🏢 Sectors covered: ${Object.keys(storeResult.sectorBreakdown).length}`);
    console.log(`🔄 Next run: Scheduled every 3 days via GitHub Actions`);
    console.log(`📈 Your earnings data is now LIVE and comprehensive!\n`);
    
  } catch (error) {
    console.error('❌ Pipeline failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main, fetchComprehensiveEarningsData, storeEarningsData }; 