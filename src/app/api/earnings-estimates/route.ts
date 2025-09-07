import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Interfaces for earnings data
interface EarningsEstimate {
  id: string;
  companyName: string;
  symbol: string;
  sector: string;
  quarter: string;
  reportDate: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number; // in crores
  
  // Financial metrics (in Rs. Crores)
  actualRevenue: number;
  estimatedRevenue: number;
  actualNetProfit: number;
  estimatedNetProfit: number;
  actualEPS: number;
  estimatedEPS: number;
  
  // Performance analysis
  revenueVariance: number; // percentage
  profitVariance: number; // percentage
  epsVariance: number; // percentage
  overallPerformance: 'Beat' | 'Missed' | 'Met';
  performancePercent: number; // overall performance percentage
  resultType: 'Consolidated' | 'Standalone';
}

interface FilterOptions {
  sector?: string;
  index?: string;
  performance?: 'all' | 'beat' | 'missed' | 'met';
  sortBy?: 'date' | 'performance' | 'marketCap' | 'variance';
}

// Database record interface (data comes as strings from Supabase)
interface SupabaseEarningsRecord {
  symbol: string;
  company_name: string;
  sector: string;
  quarter: string;
  report_date: string;
  current_price: string | number;
  price_change: string | number;
  price_change_percent: string | number;
  market_cap: string | number;
  actual_revenue: string | number;
  estimated_revenue: string | number;
  actual_net_profit: string | number;
  estimated_net_profit: string | number;
  actual_eps: string | number;
  estimated_eps: string | number;
  revenue_variance: string | number;
  profit_variance: string | number;
  eps_variance: string | number;
  overall_performance: 'Beat' | 'Missed' | 'Met';
  performance_percent: string | number;
  financial_type: string;
}

// Transform Supabase data to our EarningsEstimate format
function transformSupabaseData(dbRecord: SupabaseEarningsRecord): EarningsEstimate {
  return {
    id: `${dbRecord.symbol}-${dbRecord.quarter}`,
    companyName: dbRecord.company_name,
    symbol: dbRecord.symbol,
    sector: dbRecord.sector || 'Unknown',
    quarter: dbRecord.quarter,
    reportDate: dbRecord.report_date,
    currentPrice: parseFloat(String(dbRecord.current_price || 0)),
    priceChange: parseFloat(String(dbRecord.price_change || 0)),
    priceChangePercent: parseFloat(String(dbRecord.price_change_percent || 0)),
    marketCap: parseFloat(String(dbRecord.market_cap || 0)),
    
    actualRevenue: parseFloat(String(dbRecord.actual_revenue || 0)),
    estimatedRevenue: parseFloat(String(dbRecord.estimated_revenue || 0)),
    actualNetProfit: parseFloat(String(dbRecord.actual_net_profit || 0)),
    estimatedNetProfit: parseFloat(String(dbRecord.estimated_net_profit || 0)),
    actualEPS: parseFloat(String(dbRecord.actual_eps || 0)),
    estimatedEPS: parseFloat(String(dbRecord.estimated_eps || 0)),
    
    revenueVariance: parseFloat(String(dbRecord.revenue_variance || 0)),
    profitVariance: parseFloat(String(dbRecord.profit_variance || 0)),
    epsVariance: parseFloat(String(dbRecord.eps_variance || 0)),
    overallPerformance: dbRecord.overall_performance || 'Met',
    performancePercent: parseFloat(String(dbRecord.performance_percent || 0)),
    resultType: (dbRecord.financial_type === 'Standalone' ? 'Standalone' : 'Consolidated') as 'Consolidated' | 'Standalone',
  };
}

// Fetch earnings data from Supabase
async function fetchEarningsFromSupabase(filters: FilterOptions): Promise<{data: EarningsEstimate[], error: string | null}> {
  if (!supabase) {
    console.warn('Supabase not initialized - missing environment variables');
    return { data: [], error: 'Database not configured' };
  }

  try {
    console.log('🔄 Fetching earnings data from Supabase...');
    
    let query = supabase
      .from('earnings_estimates')
      .select('*')
      .order('report_date', { ascending: false });

    // Apply filters
    if (filters.sector && filters.sector !== 'all') {
      query = query.eq('sector', filters.sector);
    }

    if (filters.performance && filters.performance !== 'all') {
      const performanceMap = {
        'beat': 'Beat',
        'missed': 'Missed', 
        'met': 'Met'
      };
      query = query.eq('overall_performance', performanceMap[filters.performance]);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'performance':
        query = query.order('performance_percent', { ascending: false });
        break;
      case 'marketCap':
        query = query.order('market_cap', { ascending: false });
        break;
      case 'variance':
        // Order by absolute performance percentage
        query = query.order('performance_percent', { ascending: false });
        break;
      default:
        // Default to date ordering (already applied above)
        break;
    }

    const { data: dbData, error } = await query.limit(50); // Limit results for performance

    if (error) {
      console.error('Supabase query error:', error);
      return { data: [], error: error.message };
    }

    if (!dbData || dbData.length === 0) {
      console.log('⚠️ No earnings data found in Supabase');
      return { data: [], error: null };
    }

    const transformedData = dbData.map(transformSupabaseData);
    console.log(`✅ Retrieved ${transformedData.length} earnings records from Supabase`);
    
    return { data: transformedData, error: null };

  } catch (error) {
    console.error('Failed to fetch from Supabase:', error);
    return { data: [], error: 'Database query failed' };
  }
}

// Sample earnings estimates data (fallback only)
const SAMPLE_EARNINGS_DATA: EarningsEstimate[] = [
  {
    id: 'RELIANCE-Q2FY25',
    companyName: 'Reliance Industries',
    symbol: 'RELIANCE',
    sector: 'Oil & Gas',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-18',
    currentPrice: 2847.50,
    priceChange: 23.75,
    priceChangePercent: 0.84,
    marketCap: 1925000,
    actualRevenue: 254891,
    estimatedRevenue: 248500,
    actualNetProfit: 18540,
    estimatedNetProfit: 17200,
    actualEPS: 27.50,
    estimatedEPS: 25.80,
    revenueVariance: 2.57,
    profitVariance: 7.79,
    epsVariance: 6.59,
    overallPerformance: 'Beat',
    performancePercent: 5.65,
    resultType: 'Consolidated'
  },
  {
    id: 'TCS-Q2FY25',
    companyName: 'Tata Consultancy Services',
    symbol: 'TCS',
    sector: 'IT Services',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-12',
    currentPrice: 4156.90,
    priceChange: -47.30,
    priceChangePercent: -1.13,
    marketCap: 1505000,
    actualRevenue: 64988,
    estimatedRevenue: 66200,
    actualNetProfit: 12040,
    estimatedNetProfit: 12500,
    actualEPS: 33.40,
    estimatedEPS: 34.60,
    revenueVariance: -1.83,
    profitVariance: -3.68,
    epsVariance: -3.47,
    overallPerformance: 'Missed',
    performancePercent: -2.99,
    resultType: 'Consolidated'
  },
  {
    id: 'HDFCBANK-Q2FY25',
    companyName: 'HDFC Bank',
    symbol: 'HDFCBANK',
    sector: 'Banking',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-19',
    currentPrice: 1789.45,
    priceChange: 15.20,
    priceChangePercent: 0.86,
    marketCap: 1355000,
    actualRevenue: 85840,
    estimatedRevenue: 84200,
    actualNetProfit: 16821,
    estimatedNetProfit: 16500,
    actualEPS: 22.10,
    estimatedEPS: 21.70,
    revenueVariance: 1.95,
    profitVariance: 1.95,
    epsVariance: 1.84,
    overallPerformance: 'Beat',
    performancePercent: 1.91,
    resultType: 'Consolidated'
  }
];

// Helper functions are available in the frontend component where they're used

const applyFilters = (data: EarningsEstimate[], filters: FilterOptions): EarningsEstimate[] => {
  let filteredData = [...data];

  // Filter by sector
  if (filters.sector && filters.sector !== 'all') {
    filteredData = filteredData.filter(item => item.sector === filters.sector);
  }

  // Filter by performance
  if (filters.performance && filters.performance !== 'all') {
    filteredData = filteredData.filter(item => {
      switch (filters.performance) {
        case 'beat': return item.overallPerformance === 'Beat';
        case 'missed': return item.overallPerformance === 'Missed';
        case 'met': return item.overallPerformance === 'Met';
        default: return true;
      }
    });
  }

  // Sort data
  switch (filters.sortBy) {
    case 'date':
      filteredData.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
      break;
    case 'performance':
      filteredData.sort((a, b) => b.performancePercent - a.performancePercent);
      break;
    case 'marketCap':
      filteredData.sort((a, b) => b.marketCap - a.marketCap);
      break;
    case 'variance':
      filteredData.sort((a, b) => Math.abs(b.performancePercent) - Math.abs(a.performancePercent));
      break;
    default:
      // Default sort by report date (newest first)
      filteredData.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
  }

  return filteredData;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: FilterOptions = {
      sector: searchParams.get('sector') || undefined,
      index: searchParams.get('index') || undefined,
      performance: (searchParams.get('performance') as FilterOptions['performance']) || 'all',
      sortBy: (searchParams.get('sortBy') as FilterOptions['sortBy']) || 'date'
    };

    let earningsData: EarningsEstimate[] = [];
    let dataSource = 'Sample Data';
    let dbError: string | null = null;

    // Try to fetch from Supabase first
    const { data: supabaseData, error } = await fetchEarningsFromSupabase(filters);
    
    if (error) {
      console.error('🔴 Supabase fetch failed:', error);
      dbError = error;
    }
    
    if (supabaseData && supabaseData.length > 0) {
      earningsData = supabaseData;
      dataSource = 'MoneyControl (Supabase)';
      console.log(`✅ Using live MoneyControl data: ${earningsData.length} records`);
    } else {
      // Fallback to sample data
      console.log('⚠️ Falling back to sample data');
      earningsData = SAMPLE_EARNINGS_DATA;
      dataSource = 'Sample Data (Fallback)';
      
      // Apply filters to sample data since Supabase filtering wasn't used
      earningsData = applyFilters(earningsData, filters);
    }

    // Get available sectors for filtering
    const sectors = [...new Set(earningsData.map(item => item.sector))].sort();
    
    // Performance summary
    const performanceSummary = {
      total: earningsData.length,
      beat: earningsData.filter(item => item.overallPerformance === 'Beat').length,
      missed: earningsData.filter(item => item.overallPerformance === 'Missed').length,
      met: earningsData.filter(item => item.overallPerformance === 'Met').length
    };

    const response = {
      success: true,
      data: earningsData,
      filters: {
        sectors,
        appliedFilters: filters
      },
      summary: performanceSummary,
      dataSource,
      dbError,
      lastUpdated: new Date().toISOString(),
      totalRecords: earningsData.length
    };

    console.log(`📊 API Response: ${dataSource}, ${earningsData.length} records`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to fetch earnings estimates:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch earnings estimates data',
      dataSource: 'Error',
      lastUpdated: new Date().toISOString()
    }, { status: 500 });
  }
} 