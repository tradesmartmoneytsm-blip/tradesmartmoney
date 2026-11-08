'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { SectorData } from '@/services/marketDataService';

interface SectorDataContextType {
  sectorData: SectorData[];
  isLoading: boolean;
  lastUpdated: Date | null;
  timeRange: string;
  setTimeRange: (range: string) => void;
  refetch: () => Promise<void>;
}

const SectorDataContext = createContext<SectorDataContextType | undefined>(undefined);

const STORAGE_KEY = 'sector_performance_data';
const STORAGE_TIMESTAMP_KEY = 'sector_performance_timestamp';
const REFRESH_INTERVAL = 60 * 1000; // 1 minute

function cacheKeyForRange(timeRange: string) {
  return `${STORAGE_KEY}_${timeRange}`;
}

export function SectorDataProvider({ children }: { children: ReactNode }) {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState('1D');

  // Load cached data for current time range
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(cacheKeyForRange(timeRange));
      const cachedTimestamp = localStorage.getItem(`${STORAGE_TIMESTAMP_KEY}_${timeRange}`);

      if (cachedData) {
        setSectorData(JSON.parse(cachedData));
        if (cachedTimestamp) {
          setLastUpdated(new Date(cachedTimestamp));
        }
        console.log(`✅ Loaded sector cache (${timeRange})`);
      }
    } catch (error) {
      console.error('Error loading cached sector data:', error);
    }
  }, [timeRange]);

  // Fetch sector data from API
  const fetchSectorData = useCallback(async () => {
    try {
      const url = `/api/sector-data?timeRange=${timeRange}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data)) {
        // Handle empty data (e.g., when scraping fails but returns 200)
        if (result.data.length === 0) {
          console.warn(`⚠️ No sector data available for ${timeRange}:`, result.message || 'Unknown reason');
          // Keep existing data, don't clear it
          setIsLoading(false);
          return;
        }
        
        // Sort from most positive to most negative
        const sortedData = [...result.data].sort((a, b) => {
          const aChange = typeof a.change === 'string' ? parseFloat(a.change) : a.change;
          const bChange = typeof b.change === 'string' ? parseFloat(b.change) : b.change;
          return bChange - aChange;
        });
        
        // Update state
        setSectorData(sortedData);
        const now = new Date();
        setLastUpdated(now);
        
        // Save to localStorage (keyed by time range)
        localStorage.setItem(`${STORAGE_KEY}_${timeRange}`, JSON.stringify(sortedData));
        localStorage.setItem(`${STORAGE_TIMESTAMP_KEY}_${timeRange}`, now.toISOString());
        
        console.log(`✅ Sector data updated at ${now.toLocaleTimeString()} (${timeRange})`);
      } else {
        console.warn('⚠️ API returned unsuccessful response');
      }
    } catch (error) {
      console.error('❌ Failed to fetch sector data:', error);
      // Keep existing data, don't overwrite with fallback
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  // Refetch data when time range changes
  useEffect(() => {
    setIsLoading(true);
    fetchSectorData();
  }, [timeRange, fetchSectorData]);

  // Set up 1-minute auto-refresh timer (only for 1D)
  useEffect(() => {
    if (timeRange !== '1D') {
      return; // Don't auto-refresh for historical data
    }
    
    const interval = setInterval(() => {
      fetchSectorData();
    }, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchSectorData, timeRange]);

  const value: SectorDataContextType = {
    sectorData,
    isLoading,
    lastUpdated,
    timeRange,
    setTimeRange,
    refetch: fetchSectorData
  };

  return (
    <SectorDataContext.Provider value={value}>
      {children}
    </SectorDataContext.Provider>
  );
}

export function useSectorData() {
  const context = useContext(SectorDataContext);
  if (context === undefined) {
    throw new Error('useSectorData must be used within a SectorDataProvider');
  }
  return context;
}

