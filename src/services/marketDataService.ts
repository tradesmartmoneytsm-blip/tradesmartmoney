// Market Data Service for fetching real-time sector performance
// Scraping real NSE sector indices data

interface SectorData {
  name: string;
  change: number;
  value: string;
  marketCap?: number;
  lastUpdated?: Date;
}

class MarketDataService {
  private cache: Map<string, { data: SectorData[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
  private refreshInterval: NodeJS.Timeout | null = null;
  private subscribers: Array<(data: SectorData[]) => void> = [];

  constructor() {
    this.startAutoRefresh();
  }

  // Subscribe to sector data updates
  subscribe(callback: (data: SectorData[]) => void) {
    console.log(`➕ Adding subscriber (total: ${this.subscribers.length + 1})`);
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      console.log(`➖ Removing subscriber (remaining: ${this.subscribers.length - 1})`);
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers of data updates
  private notifySubscribers(data: SectorData[]) {
    this.subscribers.forEach(callback => callback(data));
  }

  // Main method to fetch sector performance data
  async fetchSectorPerformance(): Promise<SectorData[]> {
    try {
      // Scrape all sector data
      const scrapedData = await this.scrapeAllSectorData();
      
      if (scrapedData.length > 0) {
        console.log('✅ Successfully scraped real NSE sector data');
        
        // Update cache
        this.cache.set('sectors', {
          data: scrapedData,
          timestamp: Date.now()
        });

        this.notifySubscribers(scrapedData);
        return scrapedData;
      }

      throw new Error('No sector data found');
    } catch (error) {
      console.error('Failed to fetch sector performance:', error);
      
      // Return cached data if available
      const cached = this.cache.get('sectors');
      if (cached) {
        return cached.data;
      }
      
      // If no cache available, return empty array
      return [];
    }
  }

  // Fetch sector data from our API route (server-side scraping)
  private async scrapeAllSectorData(): Promise<SectorData[]> {
    
    const response = await fetch('/api/sector-data', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(`API error: ${result.error}`);
    }

    console.log(`✅ Received ${result.data?.length || 0} sectors from API`);
    
    // Convert lastUpdated strings back to Date objects
    const sectors = result.data.map((sector: SectorData) => ({
      ...sector,
      lastUpdated: new Date(sector.lastUpdated || new Date())
    }));

    return sectors;
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

    console.log('🔄 Sector performance auto-refresh started (5-minute interval)');
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