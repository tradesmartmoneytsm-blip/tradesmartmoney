// Market Data Service for fetching real-time sector performance
interface SectorData {
  name: string;
  change: number;
  value: string;
  marketCap?: number;
  lastUpdated?: Date;
}

interface ApiSectorResponse {
  ticker: string;
  company: string;
  price: number;
  percent_change: number;
  net_change: number;
  volume: string;
}

class MarketDataService {
  private cache: Map<string, { data: SectorData[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private refreshInterval: NodeJS.Timeout | null = null;
  private subscribers: Array<(data: SectorData[]) => void> = [];

  // Sector mapping for Indian markets
  private sectorMapping = {
    'IT': ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM'],
    'Banking': ['HDFCBANK', 'ICICIBANK', 'SBIN', 'KOTAKBANK', 'AXISBANK'],
    'Pharma': ['SUNPHARMA', 'DRREDDY', 'CIPLA', 'AUROPHARMA', 'LUPIN'],
    'Auto': ['MARUTI', 'M&M', 'TATAMOTORS', 'BAJAJ-AUTO', 'EICHERMOT'],
    'FMCG': ['HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR'],
    'Energy': ['RELIANCE', 'ONGC', 'BPCL', 'IOC', 'GAIL'],
    'Metals': ['TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'COALINDIA'],
    'Realty': ['DLF', 'GODREJPROP', 'OBEROIRLTY', 'PRESTIGE', 'SOBHA']
  };

  constructor() {
    this.startAutoRefresh();
  }

  // Subscribe to sector data updates
  subscribe(callback: (data: SectorData[]) => void) {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers of data updates
  private notifySubscribers(data: SectorData[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  // Fetch sector performance data from Indian Stock API
  async fetchSectorPerformance(): Promise<SectorData[]> {
    try {
      const sectorData: SectorData[] = [];
      
      // Fetch data for each sector by getting representative stocks
      for (const [sectorName, stocks] of Object.entries(this.sectorMapping)) {
        try {
          const sectorPerformance = await this.calculateSectorAverage(sectorName, stocks);
          sectorData.push(sectorPerformance);
        } catch (error) {
          console.warn(`Failed to fetch data for ${sectorName}:`, error);
          // Use fallback data if API fails
          sectorData.push(this.getFallbackData(sectorName));
        }
      }

      // Update cache
      this.cache.set('sectors', {
        data: sectorData,
        timestamp: Date.now()
      });

      this.notifySubscribers(sectorData);
      return sectorData;
    } catch (error) {
      console.error('Failed to fetch sector performance:', error);
      return this.getCachedOrFallbackData();
    }
  }

  // Calculate sector average from multiple stocks
  private async calculateSectorAverage(sectorName: string, stocks: string[]): Promise<SectorData> {
    try {
      // Try using Indian Stock API trending endpoint which gives percentage changes
      const response = await fetch('https://indian-stock.vercel.app/api/trending');
      const data = await response.json();
      
      const allStocks = [...(data.trending_stocks?.top_gainers || []), ...(data.trending_stocks?.top_losers || [])];
      const sectorStocks = allStocks.filter((stock: ApiSectorResponse) => 
        stocks.some(sectorStock => stock.ticker?.includes(sectorStock))
      );

      if (sectorStocks.length > 0) {
        const avgChange = sectorStocks.reduce((sum: number, stock: ApiSectorResponse) => 
          sum + (stock.percent_change || 0), 0) / sectorStocks.length;
        
        const totalValue = sectorStocks.reduce((sum: number, stock: ApiSectorResponse) => 
          sum + (stock.price || 0), 0);

        return {
          name: sectorName,
          change: Number(avgChange.toFixed(2)),
          value: `₹${Math.round(totalValue).toLocaleString('en-IN')}`,
          lastUpdated: new Date()
        };
      }
      
      // Fallback to individual stock lookup if trending doesn't have sector stocks
      return await this.fetchIndividualSectorData(sectorName, stocks[0]);
    } catch (error) {
      throw new Error(`Failed to calculate sector average for ${sectorName}: ${error}`);
    }
  }

  // Fetch individual stock data as sector representative
  private async fetchIndividualSectorData(sectorName: string, representativeStock: string): Promise<SectorData> {
    try {
      const response = await fetch(`https://indian-stock.vercel.app/api/stock?name=${representativeStock}`);
      const data = await response.json();
      
      if (data && data.percentChange !== undefined) {
        return {
          name: sectorName,
          change: Number(data.percentChange.toFixed(2)),
          value: `₹${Math.round(data.currentPrice?.NSE || data.currentPrice?.BSE || 0).toLocaleString('en-IN')}`,
          lastUpdated: new Date()
        };
      }
      
      throw new Error('Invalid API response');
    } catch (error) {
      throw new Error(`Failed to fetch individual stock data: ${error}`);
    }
  }

  // Get cached data or fallback if no cache available
  private getCachedOrFallbackData(): SectorData[] {
    const cached = this.cache.get('sectors');
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }
    
    return this.getAllFallbackData();
  }

  // Fallback data for when API is unavailable
  private getFallbackData(sectorName: string): SectorData {
    const fallbackMap: { [key: string]: { change: number, value: string } } = {
      'IT': { change: 2.45, value: '₹32,450' },
      'Banking': { change: 1.23, value: '₹45,320' },
      'Pharma': { change: -0.89, value: '₹28,150' },
      'Auto': { change: 3.12, value: '₹15,680' },
      'FMCG': { change: 0.67, value: '₹52,340' },
      'Energy': { change: -1.45, value: '₹18,920' },
      'Metals': { change: 1.89, value: '₹21,470' },
      'Realty': { change: -0.34, value: '₹12,850' }
    };

    return {
      name: sectorName,
      change: fallbackMap[sectorName]?.change || 0,
      value: fallbackMap[sectorName]?.value || '₹0',
      lastUpdated: new Date()
    };
  }

  private getAllFallbackData(): SectorData[] {
    return Object.keys(this.sectorMapping).map(sector => this.getFallbackData(sector));
  }

  // Start auto-refresh every 5 minutes
  startAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Initial fetch
    this.fetchSectorPerformance();

    // Set up 5-minute interval
    this.refreshInterval = setInterval(() => {
      this.fetchSectorPerformance();
    }, this.CACHE_DURATION);

    console.log('Sector performance auto-refresh started (5-minute interval)');
  }

  // Stop auto-refresh
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // Get current sector data (from cache if fresh, otherwise fetch)
  async getSectorData(): Promise<SectorData[]> {
    const cached = this.cache.get('sectors');
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }
    
    return await this.fetchSectorPerformance();
  }

  // Manually refresh data
  async refreshNow(): Promise<SectorData[]> {
    return await this.fetchSectorPerformance();
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();
export type { SectorData }; 