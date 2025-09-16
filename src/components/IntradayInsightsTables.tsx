'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  RefreshCw, TrendingUp, TrendingDown, Activity, BarChart3, 
  Eye, Clock, ArrowUp, ArrowDown, Zap, Target
} from 'lucide-react';
import { brandTokens } from '@/lib/design-tokens';

interface MostActiveStockCall {
  symbol: string;
  percentage_change: number;
  timestamp: string;
  session_id: string;
}

interface TableData {
  title: string;
  data: MostActiveStockCall[];
  loading: boolean;
  lastUpdated: string | null;
  icon: React.ReactNode;
  colorScheme: string;
}

export function IntradayInsightsTables() {
  const [tables, setTables] = useState<TableData[]>([
    {
      title: 'Most Active Stock Calls',
      data: [],
      loading: true,
      lastUpdated: null,
      icon: <TrendingUp className="w-5 h-5" />,
      colorScheme: 'green'
    },
    {
      title: 'Most Active Stock Puts',
      data: [],
      loading: true,
      lastUpdated: null,
      icon: <TrendingDown className="w-5 h-5" />,
      colorScheme: 'red'
    }
  ]);

  const [refreshing, setRefreshing] = useState(false);

  // Fetch Most Active Stock Calls data
  const fetchMostActiveStockCalls = async () => {
    try {
      const response = await fetch('/api/intraday-insights/most-active-calls?type=calls&limit=15');
      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching most active stock calls:', error);
      return [];
    }
  };

  // Fetch Most Active Stock Puts data
  const fetchMostActiveStockPuts = async () => {
    try {
      const response = await fetch('/api/intraday-insights/most-active-calls?type=puts&limit=15');
      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching most active stock puts:', error);
      return [];
    }
  };

  // Mock data for demonstration (fallback)
  const generateMockData = (type: 'calls' | 'puts') => {
    const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICI', 'SBI', 'ITC', 'WIPRO', 'LT', 'ONGC'];
    return symbols.slice(0, 8).map(symbol => ({
      symbol,
      percentage_change: type === 'calls' 
        ? +(Math.random() * 15 + 2).toFixed(2)
        : -(Math.random() * 12 + 1).toFixed(2),
      timestamp: new Date().toISOString(),
      session_id: 'demo'
    })).sort((a, b) => Math.abs(b.percentage_change) - Math.abs(a.percentage_change));
  };

  // Load data
  const loadData = useCallback(async () => {
    setRefreshing(true);
    
    try {
      // Fetch real data from API with fallback to mock data
      const [callsData, putsData] = await Promise.all([
        fetchMostActiveStockCalls().catch(() => {
          console.log('[FALLBACK] Using mock data for calls');
          return generateMockData('calls');
        }),
        fetchMostActiveStockPuts().catch(() => {
          console.log('[FALLBACK] Using mock data for puts');
          return generateMockData('puts');
        })
      ]);

      setTables(prev => [
        {
          ...prev[0],
          data: callsData,
          loading: false,
          lastUpdated: new Date().toLocaleTimeString('en-IN')
        },
        {
          ...prev[1],
          data: putsData,
          loading: false,
          lastUpdated: new Date().toLocaleTimeString('en-IN')
        }
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      // Use fallback mock data on error
      const fallbackCalls = generateMockData('calls');
      const fallbackPuts = generateMockData('puts');
      
      setTables(prev => [
        {
          ...prev[0],
          data: fallbackCalls,
          loading: false,
          lastUpdated: new Date().toLocaleTimeString('en-IN')
        },
        {
          ...prev[1],
          data: fallbackPuts,
          loading: false,
          lastUpdated: new Date().toLocaleTimeString('en-IN')
        }
      ]);
    }
    
    setRefreshing(false);
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds during market hours (for demo)
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours * 60 + minutes;
      const marketStart = 9 * 60 + 15; // 9:15 AM
      const marketEnd = 15 * 60 + 30; // 3:30 PM
      
      if (currentTime >= marketStart && currentTime <= marketEnd) {
        loadData();
      }
    }, 30000); // 30 seconds for demo, will be 5 minutes in production

    return () => clearInterval(interval);
  }, [loadData]);

  const renderTable = (tableData: TableData, index: number) => {
    const getColorClasses = (colorScheme: string) => {
      switch (colorScheme) {
        case 'green':
          return {
            header: 'from-green-600 to-emerald-600',
            accent: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200'
          };
        case 'red':
          return {
            header: 'from-red-600 to-rose-600',
            accent: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200'
          };
        default:
          return {
            header: 'from-blue-600 to-purple-600',
            accent: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200'
          };
      }
    };

    const colors = getColorClasses(tableData.colorScheme);

    return (
      <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className={`bg-gradient-to-r ${colors.header} text-white p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {tableData.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold">{tableData.title}</h3>
                <p className="text-white/80 text-sm">
                  {tableData.lastUpdated ? `Updated: ${tableData.lastUpdated}` : 'Loading...'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Live</span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-4">
          {tableData.loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading data...</span>
            </div>
          ) : tableData.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Symbol</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-700">Change %</th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-700">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.data.slice(0, 10).map((item: MostActiveStockCall, idx: number) => (
                    <tr 
                      key={`${item.symbol}-${idx}`}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className={`w-6 h-6 rounded-full ${colors.bg} ${colors.border} border flex items-center justify-center text-xs font-bold ${colors.accent}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{item.symbol}</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`font-bold ${
                          item.percentage_change > 0 
                            ? 'text-green-600' 
                            : item.percentage_change < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`}>
                          {item.percentage_change > 0 ? '+' : ''}{item.percentage_change}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.percentage_change > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-600 mx-auto" />
                        ) : item.percentage_change < 0 ? (
                          <ArrowDown className="w-4 h-4 text-red-600 mx-auto" />
                        ) : (
                          <div className="w-4 h-4 bg-gray-300 rounded-full mx-auto"></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {tableData.data.length > 0 && `Showing top ${Math.min(10, tableData.data.length)} entries`}
            </span>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Auto-refresh: 5 mins</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${brandTokens.spacing.page.container} ${brandTokens.spacing.page.x} py-8`}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Zap className="w-8 h-8 mr-3 text-blue-600" />
              Smart Money Flow
            </h1>
            <p className="text-gray-600">
              Track institutional money movement and professional options flow in real-time
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Market Hours</span>
            </div>
            
            <button
              onClick={loadData}
              disabled={refreshing}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                refreshing 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Tables Grid */}
      <div className="space-y-8">
        {/* First Row - Two Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {tables.map((table, index) => renderTable(table, index))}
        </div>

        {/* Future Rows - Placeholder for additional tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Volume Gainers</h3>
            <p className="text-gray-500">Coming Soon</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Equities</h3>
            <p className="text-gray-500">Coming Soon</p>
          </div>
        </div>
      </div>

      {/* Market Status */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-center text-blue-700">
          <Eye className="w-5 h-5 mr-2" />
          <span className="font-medium">
            Smart money flow data refreshes automatically every 5 minutes during market hours (9:15 AM - 3:30 PM IST)
          </span>
        </div>
      </div>
    </div>
  );
} 