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

// Fallback data if API fails
const getFallbackData = (): SectorData[] => [
  { name: 'Nifty Consumer Durables', change: 0.35, value: '₹37,200', lastUpdated: new Date() },
  { name: 'CONSUMER GOODS', change: 0.08, value: '₹54,918', lastUpdated: new Date() },
  { name: 'Consumption', change: 0.02, value: '₹12,209', lastUpdated: new Date() },
  { name: 'AUTOMOBILE', change: -0.01, value: '₹27,538', lastUpdated: new Date() },
  { name: 'MEDIA & ENTERTAINMENT', change: -0.22, value: '₹1,432', lastUpdated: new Date() },
  { name: 'Nifty Healthcare Index', change: -0.42, value: '₹14,662', lastUpdated: new Date() },
  { name: 'PHARMA', change: -0.47, value: '₹22,618', lastUpdated: new Date() },
  { name: 'Bank Nifty', change: -0.66, value: '₹59,052', lastUpdated: new Date() },
  { name: 'Nifty Financial Services', change: -0.66, value: '₹25,888', lastUpdated: new Date() },
  { name: 'Nifty Financial Services 25/50', change: -0.71, value: '₹27,415', lastUpdated: new Date() },
  { name: 'Energy', change: -0.82, value: '₹34,738', lastUpdated: new Date() },
  { name: 'Nifty Oil & Gas', change: -0.88, value: '₹35,746', lastUpdated: new Date() },
  { name: 'PSU Bank', change: -0.95, value: '₹55,459', lastUpdated: new Date() },
  { name: 'IT', change: -0.98, value: '₹38,024', lastUpdated: new Date() },
  { name: 'PVT Bank', change: -1.15, value: '₹56,273', lastUpdated: new Date() },
  { name: 'CONSTRUCTION', change: -1.21, value: '₹9,510', lastUpdated: new Date() },
  { name: 'METALS', change: -1.27, value: '₹10,406', lastUpdated: new Date() }
];

export function SectorDataProvider({ children }: { children: ReactNode }) {
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState('1D');

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(STORAGE_KEY);
      const cachedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
      
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setSectorData(parsedData);
        setIsLoading(false);
        
        if (cachedTimestamp) {
          setLastUpdated(new Date(cachedTimestamp));
        }
        
        console.log('✅ Loaded sector data from cache');
      } else {
        // No cache, use fallback
        const fallback = getFallbackData();
        setSectorData(fallback);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error loading cached sector data:', error);
      const fallback = getFallbackData();
      setSectorData(fallback);
      setIsLoading(false);
    }
  }, []);

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

