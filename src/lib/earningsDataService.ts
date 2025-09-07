// MoneyControl Earnings Data Pipeline
// This file documents the data flow and provides types for the earnings data system

// Earnings Estimate interface - matches the data structure from MoneyControl API
export interface EarningsEstimate {
  id: string;
  companyName: string;
  symbol: string;
  sector: string;
  quarter: string;
  reportDate: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  actualRevenue: number;
  estimatedRevenue: number;
  actualNetProfit: number;
  estimatedNetProfit: number;
  actualEPS: number;
  estimatedEPS: number;
  revenueVariance: number;
  profitVariance: number;
  epsVariance: number;
  overallPerformance: 'Beat' | 'Missed' | 'Met';
  performancePercent: number;
  resultType: 'Consolidated' | 'Standalone';
}

/**
 * MoneyControl Earnings Data Pipeline
 * 
 * Data Flow:
 * 1. GitHub Action (every 3 days) fetches from MoneyControl API
 * 2. Data is processed and stored in Supabase earnings_estimates table
 * 3. Frontend API route fetches from Supabase
 * 4. Frontend displays real earnings data
 * 
 * Files involved:
 * - .github/workflows/fetch-earnings-data.yml (scheduled job)
 * - scripts/fetch-earnings-data.js (data fetching script)
 * - database-earnings-schema.sql (Supabase table schema)
 * - src/app/api/earnings-estimates/route.ts (API endpoint)
 * - src/components/EarningsEstimates.tsx (UI component)
 * 
 * Data Source: https://api.moneycontrol.com/mcapi/v1/earnings/actual-estimate
 * 
 * Benefits:
 * ✅ Real Indian market data
 * ✅ Actual vs Estimates comparison
 * ✅ Automated updates every 3 days
 * ✅ Reliable fallback to sample data
 * ✅ No API keys required (MoneyControl is public)
 * ✅ Cost-effective (free GitHub Actions + Supabase)
 */

// Sector mapping used by the data fetching script
export const SECTOR_MAPPING = {
  // Oil & Gas
  'IOC': 'Oil & Gas',
  'BPC': 'Oil & Gas', 
  'RELIANCE': 'Oil & Gas',
  
  // Banking & Finance
  'HDFCBANK': 'Banking',
  'ICICIBANK': 'Banking',
  'SBIN': 'Banking',
  'KOTAKBANK': 'Banking',
  'AXISBANK': 'Banking',
  
  // IT Services
  'TCS': 'IT Services',
  'INFY': 'IT Services',
  'WIPRO': 'IT Services',
  'HCLTECH': 'IT Services',
  'TECHM': 'IT Services',
  
  // Pharmaceuticals
  'GP08': 'Pharmaceuticals', // Glenmark
  'SP42': 'Pharmaceuticals', // Cohance Life
  
  // Automobile & Components
  'MARUTI': 'Automobile',
  'MSS01': 'Auto Components', // Motherson
  'ET04': 'Auto Components', // Endurance Tech
  
  // NBFC
  'BAJFINANCE': 'NBFC',
  'SSF07': 'NBFC', // Spandana Sphoor
  
  // Others
  'IC8': 'Telecommunications', // Vodafone Idea
  'VO01': 'Chemicals', // Vinati Organics
  'AAC': 'Chemicals', // Alkyl Amines
  'MHI': 'Healthcare', // Max Healthcare
  'IID01': 'Infrastructure', // IRB Infra
  'IW': 'Power Generation', // Inox Wind
  'RSI': 'FMCG', // Patanjali Foods
  'A09': 'Textiles', // S P Apparels
  'IRC': 'Transportation', // IRCTC
  'JF04': 'Food Services', // Jubilant Food
  'MC08': 'Beverages', // United Spirits
  'AIE01': 'Engineering', // AIA Engineering
  'LOG': 'Consumer Goods', // La Opala RG
  'KD05': 'Diversified', // KDDL
} as const;

// Helper function to get sector from symbol (used in data processing)
export function getSectorFromSymbol(symbol: string): string {
  return SECTOR_MAPPING[symbol as keyof typeof SECTOR_MAPPING] || 'Others';
}

// Helper function to determine overall performance from expectations text
export function getOverallPerformance(expectations: string): 'Beat' | 'Missed' | 'Met' {
  if (expectations.includes('Beat')) return 'Beat';
  if (expectations.includes('Missed')) return 'Missed';
  return 'Met';
} 