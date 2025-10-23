'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowUpDown, Building2, Globe, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { FiiDiiSummary } from '@/lib/supabase';

interface FiiDiiActivityProps {
  className?: string;
}

export function FiiDiiActivity({ className }: FiiDiiActivityProps) {
  const [data, setData] = useState<FiiDiiSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiiDiiData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch('/api/fii-dii-history');
      const result = await response.json();
      
      if (result.success && result.data?.summary) {
        setData(result.data.summary);
        setLastUpdated(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch FII/DII data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch FII/DII data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFiiDiiData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading FII/DII activity data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <Building2 className="w-8 h-8 mx-auto mb-2" />
          <p className="font-medium">Failed to load FII/DII data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
        <button
          onClick={fetchFiiDiiData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const latestData = data[0];
  const chartData = data.slice(0, 15).reverse(); // Last 15 days for chart

  // Calculate trends
  const fiiTrend = calculateTrend(data.map(d => d.fii_net));
  const diiTrend = calculateTrend(data.map(d => d.dii_net));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 font-serif">FII/DII Activity</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated {formatTimeAgo(lastUpdated)}
            </span>
          )}
          <button
            onClick={fetchFiiDiiData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {latestData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="FII Activity"
            icon={<Globe className="w-5 h-5" />}
            netValue={latestData.fii_net}
            buyValue={latestData.fii_buy}
            sellValue={latestData.fii_sell}
            trend={fiiTrend}
          />
          <SummaryCard
            title="DII Activity"
            icon={<Building2 className="w-5 h-5" />}
            netValue={latestData.dii_net}
            buyValue={latestData.dii_buy}
            sellValue={latestData.dii_sell}
            trend={diiTrend}
          />
          <SummaryCard
            title="Combined Flow"
            icon={<ArrowUpDown className="w-5 h-5" />}
            netValue={latestData.net_combined}
            buyValue={latestData.fii_buy + latestData.dii_buy}
            sellValue={latestData.fii_sell + latestData.dii_sell}
            trend={calculateTrend(data.map(d => d.net_combined))}
          />
        </div>
      )}

      {/* Historical Chart */}
      <div className="modern-card p-6">
        <h3 className="text-h4 mb-4">
          15-Day Net Flow Trend (₹ Crores)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('en-IN')}
              formatter={(value: number, name: string) => [
                `₹${value.toLocaleString('en-IN')} Cr`,
                name
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="line"
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="fii_net" 
              stroke="#ef4444" 
              strokeWidth={3} 
              name="FII Net Flow"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="dii_net" 
              stroke="#22c55e" 
              strokeWidth={3} 
              name="DII Net Flow"
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="net_combined" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              name="Combined Net Flow"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Color Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span className="text-gray-700 font-medium">FII Net Flow (Foreign Institutional Investors)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span className="text-gray-700 font-medium">DII Net Flow (Domestic Institutional Investors)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-gray-700 font-medium">Combined Net Flow (FII + DII)</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="modern-card p-6">
        <h3 className="text-h4 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">FII Buy</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">FII Sell</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">FII Net</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">DII Buy</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">DII Sell</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">DII Net</th>
                <th className="text-right py-3 px-2 font-medium text-gray-600">Combined</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 7).map((record) => (
                <tr key={record.date} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </td>
                  <td className="text-right py-3 px-2 text-gray-600">₹{record.fii_buy.toLocaleString('en-IN')}</td>
                  <td className="text-right py-3 px-2 text-gray-600">₹{record.fii_sell.toLocaleString('en-IN')}</td>
                  <td className={`text-right py-3 px-2 font-medium ${getNetColor(record.fii_net)}`}>
                    ₹{record.fii_net.toLocaleString('en-IN')}
                  </td>
                  <td className="text-right py-3 px-2 text-gray-600">₹{record.dii_buy.toLocaleString('en-IN')}</td>
                  <td className="text-right py-3 px-2 text-gray-600">₹{record.dii_sell.toLocaleString('en-IN')}</td>
                  <td className={`text-right py-3 px-2 font-medium ${getNetColor(record.dii_net)}`}>
                    ₹{record.dii_net.toLocaleString('en-IN')}
                  </td>
                  <td className={`text-right py-3 px-2 font-bold ${getNetColor(record.net_combined)}`}>
                    ₹{record.net_combined.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  netValue: number;
  buyValue: number;
  sellValue: number;
  trend: 'up' | 'down' | 'neutral';
}

function SummaryCard({ title, icon, netValue, buyValue, sellValue, trend }: SummaryCardProps) {
  const isPositive = netValue > 0;
  const isNegative = netValue < 0;
  
  return (
    <div className="modern-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">{icon}</div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Buy:</span>
          <span className="font-medium">₹{buyValue.toLocaleString('en-IN')} Cr</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sell:</span>
          <span className="font-medium">₹{sellValue.toLocaleString('en-IN')} Cr</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Net:</span>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${getNetColor(netValue)}`}>
                ₹{netValue.toLocaleString('en-IN')} Cr
              </span>
              {isPositive && <TrendingUp className="w-3 h-3 text-green-600" />}
              {isNegative && <TrendingDown className="w-3 h-3 text-red-600" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNetColor(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}

function calculateTrend(values: number[]): 'up' | 'down' | 'neutral' {
  if (values.length < 3) return 'neutral';
  
  const recent = values.slice(0, 3);
  const older = values.slice(3, 6);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 500) return 'up';
  if (diff < -500) return 'down';
  return 'neutral';
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
} 