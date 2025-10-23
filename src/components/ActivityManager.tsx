'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import { 
  Activity, 
  Settings,
  TrendingUp,
  Minimize2
} from 'lucide-react';
import { IntradayActivity, IntradayActivityFilters } from '@/types/activities';
import { supabase } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ActivityManagerProps {}

export function ActivityManager({}: ActivityManagerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activities, setActivities] = useState<IntradayActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [filters] = useState<IntradayActivityFilters>({});
  const [isConnected, setIsConnected] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch initial activities
  const fetchInitialData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.stock_names?.length) params.set('stock_names', filters.stock_names.join(','));
      params.set('limit', '100');

      const response = await fetch(`/api/activities?${params}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setActivities(result.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.stock_names]);

  // Set up Supabase Realtime subscription for push updates
  useEffect(() => {
    const channel = supabase
      .channel('intraday_activities_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'intraday_activities',
          filter: `trading_date=in.(${new Date().toISOString().split('T')[0]},${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]})`
        },
        (payload) => {
          const newActivity = payload.new as IntradayActivity;
          
          // Apply filters before adding to the list
          const shouldShow = !filters.stock_names?.length || 
                           filters.stock_names.includes(newActivity.stock_name);
          
          if (shouldShow) {
            setActivities(prev => [newActivity, ...prev.slice(0, 99)]); // Keep max 100
            
            // Auto-scroll to top when new activity arrives
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'intraday_activities',
          filter: `trading_date=in.(${new Date().toISOString().split('T')[0]},${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]})`
        },
        (payload) => {
          const updatedActivity = payload.new as IntradayActivity;
          
          setActivities(prev => 
            prev.map(activity => 
              activity.id === updatedActivity.id ? updatedActivity : activity
            )
          );
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters.stock_names]);

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const formatTimeAgo = (timestamp: string) => {
    const activityTime = new Date(timestamp);
    
    // Format date and time
    const dateStr = activityTime.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
    const timeStr = activityTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return `${dateStr} ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="fixed bottom-24 left-6 bg-white shadow-lg rounded-lg border p-4 w-80">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 animate-spin" />
          <span className="text-sm text-gray-600">Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-6 z-50">
      {/* Collapsed State - Floating Button */}
      {isCollapsed && (
        <button
          onClick={toggleCollapsed}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors relative"
          title="Activity Manager"
        >
          <Activity className="w-5 h-5" />
          {activities.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activities.length > 9 ? '9+' : activities.length}
            </span>
          )}
          {isConnected && (
            <span className="absolute bottom-0 right-0 bg-green-500 w-2 h-2 rounded-full"></span>
          )}
        </button>
      )}

      {/* Expanded State - Activity Panel */}
      {!isCollapsed && (
        <div className="bg-white shadow-xl rounded-lg border w-80 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-sm">Live Activities</h3>
              {isConnected ? (
                <span className="w-2 h-2 bg-green-500 rounded-full" title="Connected"></span>
              ) : (
                <span className="w-2 h-2 bg-red-500 rounded-full" title="Disconnected"></span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 hover:bg-gray-200 rounded"
                title="Settings"
              >
                <Settings className="w-3 h-3" />
              </button>
              <button
                onClick={toggleCollapsed}
                className="p-1 hover:bg-gray-200 rounded"
                title="Minimize"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-3 border-b bg-gray-50 text-xs">
              <p className="text-gray-600 mb-2">Real-time push updates enabled</p>
              <p className="text-gray-500">
                Status: {isConnected ? '🟢 Connected' : '🔴 Reconnecting...'}
              </p>
              <p className="text-gray-500 mt-1">
                Activities: {activities.length} today
              </p>
            </div>
          )}

          {/* Activities List */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto min-h-0"
          >
            {activities.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium text-orange-600">Coming Soon</p>
                <p className="text-xs text-gray-400 mt-1">
                  Live intraday activities will be available soon
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {activities.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    activity={activity}
                    timeAgo={formatTimeAgo(activity.activity_timestamp)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Activity Item Component
interface ActivityItemProps {
  activity: IntradayActivity;
  timeAgo: string;
}

function ActivityItem({ activity, timeAgo }: ActivityItemProps) {
  const openTradingView = (stockName: string) => {
    // Format stock name for TradingView (NSE format)
    const tradingViewSymbol = `NSE:${stockName}`;
    // Set 5-minute timeframe for intraday analysis
    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=${tradingViewSymbol}&interval=5`;
    
    // Open in new tab
    window.open(tradingViewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="p-3 rounded-lg border transition-colors hover:bg-gray-50 bg-white border-gray-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 p-1.5 rounded-md bg-blue-100">
          <TrendingUp className="w-3 h-3 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openTradingView(activity.stock_name)}
                className="font-medium text-sm text-blue-600 hover:text-blue-800 hover:underline truncate transition-colors cursor-pointer"
                title={`View ${activity.stock_name} chart on TradingView`}
              >
                {activity.stock_name}
              </button>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {timeAgo}
            </span>
          </div>
          <p className="text-sm text-gray-700">
            {activity.activity_name}
          </p>
        </div>
      </div>
    </div>
  );
}