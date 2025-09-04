export interface Stock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  peRatio: number;
  marketCap: number; // in crores
  dividendYield: number;
  netProfitQtr: number; // in crores
  qtrProfitVariation: number; // percentage
  salesQtr: number; // in crores
  qtrSalesVariation: number; // percentage
  roce: number; // percentage
  volume: number;
  return1Day: number; // percentage
  return1Week: number; // percentage
  return1Month: number; // percentage
  eps: number;
  industryPE: number;
  piotroskiScore: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  lastUpdated: Date;
}

export interface ScreenerFilters {
  priceMin?: number;
  priceMax?: number;
  volumeMin?: number;
  return1DayMin?: number;
  return1WeekMin?: number;
  return1MonthMin?: number;
  epsMin?: number;
  peRatioMax?: number;
  marketCapMin?: number;
  roceMin?: number;
  dividendYieldMin?: number;
  piotroskiMin?: number;
  sectors?: string[];
  customQuery?: string;
}

export interface ScreenerResult {
  stocks: Stock[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface TechnicalIndicator {
  macd: number;
  signal: number;
  histogram: number;
  rsi: number;
  sma20: number;
  sma50: number;
  sma200: number;
  support: number;
  resistance: number;
  goldenCross: boolean;
  deadCross: boolean;
} 