'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import { 
  Activity, 
  Settings,
  TrendingUp,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { IntradayActivity, IntradayActivityFilters } from '@/types/activities';
import { supabase } from '@/lib/supabase';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ActivityManagerProps {}

export function ActivityManager({}: ActivityManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<IntradayActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [filters] = useState<IntradayActivityFilters>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sound preference from localStorage
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem('activitySoundEnabled');
    if (savedSoundPreference !== null) {
      setIsSoundEnabled(JSON.parse(savedSoundPreference));
    }
  }, []);

  // Create audio element for notification sound
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    audioRef.current = {
      play: () => {
        if (isSoundEnabled) {
          try {
            createNotificationSound();
          } catch (error) {
            console.warn('Could not play notification sound:', error);
          }
        }
      }
    } as HTMLAudioElement;
  }, [isSoundEnabled]);

  // Toggle sound preference
  const toggleSound = () => {
    const newSoundState = !isSoundEnabled;
    setIsSoundEnabled(newSoundState);
    localStorage.setItem('activitySoundEnabled', JSON.stringify(newSoundState));
  };

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.play();
    }
  }, [isSoundEnabled]);

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
            
            // Play notification sound for new activity
            playNotificationSound();
            
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
  }, [filters.stock_names, playNotificationSound]);

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);


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

  return (
    <>
      {/* Floating Button - Left bottom, positioned above AdvanceDeclineWidget */}
      <div className="fixed bottom-6 right-32 z-40 md:right-32 sm:right-28">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group relative"
          title="Live Activities"
        >
          <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {activities.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activities.length > 9 ? '9+' : activities.length}
            </span>
          )}
        </button>
      </div>

      {/* Right Sidebar Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Vertical Sidebar */}
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5" />
                <div>
                  <h2 className="text-lg font-bold">Live Activities</h2>
                  <p className="text-xs text-white/80">Real-time alerts</p>
                </div>
                {isConnected && (
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Connected"></span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSound}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title={isSoundEnabled ? 'Mute notifications' : 'Unmute notifications'}
                >
                  {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-3 border-b bg-gray-50 text-xs">
                <p className="text-gray-600 mb-1">Real-time push updates enabled</p>
                <p className="text-gray-500">
                  Status: {isConnected ? '🟢 Connected' : '🔴 Reconnecting...'}
                </p>
                <p className="text-gray-500 mt-1">
                  Activities: {activities.length} today
                </p>
                <p className="text-gray-500 mt-1">
                  Sound: {isSoundEnabled ? '🔊 Enabled' : '🔇 Muted'}
                </p>
              </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-3 border-b bg-purple-50 text-xs flex-shrink-0">
                <p className="text-gray-600 mb-1 font-medium">Settings</p>
                <p className="text-gray-500">
                  Status: {isConnected ? '🟢 Connected' : '🔴 Reconnecting...'}
                </p>
                <p className="text-gray-500 mt-1">
                  Activities: {activities.length} today
                </p>
                <p className="text-gray-500 mt-1">
                  Sound: {isSoundEnabled ? '🔊 Enabled' : '🔇 Muted'}
                </p>
              </div>
            )}

            {/* Activities List - Scrollable */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Activity className="w-6 h-6 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600 text-sm">Loading activities...</span>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium text-orange-600">Coming Soon</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Live intraday activities will be available soon
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
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
        </>
      )}
    </>
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
        <div className="flex-shrink-0 p-2 rounded-md bg-blue-100">
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openTradingView(activity.stock_name)}
                className="font-semibold text-sm text-blue-600 hover:text-blue-800 hover:underline truncate transition-colors cursor-pointer"
                title={`View ${activity.stock_name} chart on TradingView`}
              >
                {activity.stock_name}
              </button>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {timeAgo}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {activity.activity_name}
          </p>
        </div>
      </div>
    </div>
  );
}