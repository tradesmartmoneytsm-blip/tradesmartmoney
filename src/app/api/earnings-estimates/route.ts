import { NextRequest, NextResponse } from 'next/server';

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

// Sample earnings estimates data (in a real app, this would come from a database or external API)
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
  },
  {
    id: 'INFY-Q2FY25',
    companyName: 'Infosys Limited',
    symbol: 'INFY',
    sector: 'IT Services',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-17',
    currentPrice: 1845.30,
    priceChange: -12.85,
    priceChangePercent: -0.69,
    marketCap: 765000,
    actualRevenue: 40986,
    estimatedRevenue: 41200,
    actualNetProfit: 6506,
    estimatedNetProfit: 6800,
    actualEPS: 15.65,
    estimatedEPS: 16.30,
    revenueVariance: -0.52,
    profitVariance: -4.32,
    epsVariance: -3.99,
    overallPerformance: 'Missed',
    performancePercent: -2.94,
    resultType: 'Consolidated'
  },
  {
    id: 'ICICIBANK-Q2FY25',
    companyName: 'ICICI Bank',
    symbol: 'ICICIBANK',
    sector: 'Banking',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-26',
    currentPrice: 1289.75,
    priceChange: 8.45,
    priceChangePercent: 0.66,
    marketCap: 905000,
    actualRevenue: 42560,
    estimatedRevenue: 41800,
    actualNetProfit: 11746,
    estimatedNetProfit: 11200,
    actualEPS: 16.80,
    estimatedEPS: 16.00,
    revenueVariance: 1.82,
    profitVariance: 4.88,
    epsVariance: 5.00,
    overallPerformance: 'Beat',
    performancePercent: 3.90,
    resultType: 'Consolidated'
  },
  {
    id: 'WIPRO-Q2FY25',
    companyName: 'Wipro Limited',
    symbol: 'WIPRO',
    sector: 'IT Services',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-16',
    currentPrice: 562.40,
    priceChange: -8.25,
    priceChangePercent: -1.45,
    marketCap: 305000,
    actualRevenue: 22300,
    estimatedRevenue: 22800,
    actualNetProfit: 2835,
    estimatedNetProfit: 3100,
    actualEPS: 5.20,
    estimatedEPS: 5.70,
    revenueVariance: -2.19,
    profitVariance: -8.55,
    epsVariance: -8.77,
    overallPerformance: 'Missed',
    performancePercent: -6.50,
    resultType: 'Consolidated'
  },
  {
    id: 'BAJFINANCE-Q2FY25',
    companyName: 'Bajaj Finance',
    symbol: 'BAJFINANCE',
    sector: 'NBFC',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-21',
    currentPrice: 7145.85,
    priceChange: 89.40,
    priceChangePercent: 1.27,
    marketCap: 442000,
    actualRevenue: 16420,
    estimatedRevenue: 15800,
    actualNetProfit: 4171,
    estimatedNetProfit: 3950,
    actualEPS: 67.50,
    estimatedEPS: 64.00,
    revenueVariance: 3.92,
    profitVariance: 5.59,
    epsVariance: 5.47,
    overallPerformance: 'Beat',
    performancePercent: 4.99,
    resultType: 'Consolidated'
  },
  {
    id: 'MARUTI-Q2FY25',
    companyName: 'Maruti Suzuki India',
    symbol: 'MARUTI',
    sector: 'Automobile',
    quarter: 'Q2 FY25',
    reportDate: '2024-10-25',
    currentPrice: 12845.20,
    priceChange: -125.30,
    priceChangePercent: -0.97,
    marketCap: 388000,
    actualRevenue: 37200,
    estimatedRevenue: 38500,
    actualNetProfit: 3069,
    estimatedNetProfit: 3500,
    actualEPS: 101.50,
    estimatedEPS: 115.80,
    revenueVariance: -3.38,
    profitVariance: -12.31,
    epsVariance: -12.35,
    overallPerformance: 'Missed',
    performancePercent: -9.35,
    resultType: 'Standalone'
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

    // Apply filters and sorting
    const filteredData = applyFilters(SAMPLE_EARNINGS_DATA, filters);

    // Get available sectors for filtering
    const sectors = [...new Set(SAMPLE_EARNINGS_DATA.map(item => item.sector))].sort();
    
    // Performance summary
    const performanceSummary = {
      total: SAMPLE_EARNINGS_DATA.length,
      beat: SAMPLE_EARNINGS_DATA.filter(item => item.overallPerformance === 'Beat').length,
      missed: SAMPLE_EARNINGS_DATA.filter(item => item.overallPerformance === 'Missed').length,
      met: SAMPLE_EARNINGS_DATA.filter(item => item.overallPerformance === 'Met').length
    };

    return NextResponse.json({
      success: true,
      data: filteredData,
      filters: {
        sectors,
        appliedFilters: filters
      },
      summary: performanceSummary,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to fetch earnings estimates:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch earnings estimates data'
    }, { status: 500 });
  }
} 