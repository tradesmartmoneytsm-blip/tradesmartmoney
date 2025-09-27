/**
 * Advanced Options Scanner Cache System
 * Caches analysis results for 5 minutes to match data refresh intervals
 */

interface AnalysisData {
  symbol: string;
  score: number;
  strength_signals: string[];
  options_flow: {
    net_call_buildup: number;
    net_put_buildup: number;
    pcr_trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    unusual_activity: string[];
    max_pain: number;
    support_levels: number[];
    resistance_levels: number[];
  };
  risk_reward: {
    entry_price: number;
    target_1: number;
    target_2: number;
    stop_loss: number;
    risk_reward_ratio: number;
    probability: number;
  };
  institutional_sentiment: 'STRONGLY_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONGLY_BEARISH';
  reasoning: string;
  timeframe: string;
  confidence: number;
}

interface CacheEntry {
  data: AnalysisData;
  timestamp: number;
  expiresAt: number;
  analysisType: string;
  timeWindow: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  lastCleanup: number;
}

class AdvancedScannerCache {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    lastCleanup: Date.now()
  };
  
  // Cache TTL aligned with data refresh interval
  private getCacheTTL(): number {
    // 5 minutes cache to match data update frequency
    return 5 * 60 * 1000;
  }
  
  // Generate cache key
  private getCacheKey(symbol: string, analysisType: string, startTime: string, endTime: string): string {
    const timeWindow = `${startTime}-${endTime}`;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${symbol}_${analysisType}_${timeWindow}_${today}`;
  }
  
  // Get cached result
  get(symbol: string, analysisType: string, startTime: string, endTime: string): AnalysisData | null {
    this.stats.totalRequests++;
    
    const key = this.getCacheKey(symbol, analysisType, startTime, endTime);
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    console.log(`🎯 Cache HIT for ${symbol} (${analysisType})`);
    return entry.data;
  }
  
  // Set cache entry
  set(symbol: string, analysisType: string, startTime: string, endTime: string, data: AnalysisData): void {
    const key = this.getCacheKey(symbol, analysisType, startTime, endTime);
    const ttl = this.getCacheTTL();
    const now = Date.now();
    
    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      analysisType,
      timeWindow: `${startTime}-${endTime}`
    };
    
    this.cache.set(key, entry);
    console.log(`💾 Cached ${symbol} (${analysisType}) for ${Math.round(ttl/60000)}min`);
    
    // Cleanup old entries periodically
    this.cleanupIfNeeded();
  }
  
  // Batch get for multiple symbols
  getBatch(symbols: string[], analysisType: string, startTime: string, endTime: string): {
    cached: Map<string, AnalysisData>;
    missing: string[];
  } {
    const cached = new Map<string, AnalysisData>();
    const missing: string[] = [];
    
    for (const symbol of symbols) {
      const result = this.get(symbol, analysisType, startTime, endTime);
      if (result) {
        cached.set(symbol, result);
      } else {
        missing.push(symbol);
      }
    }
    
    console.log(`📊 Cache batch: ${cached.size} hits, ${missing.length} misses (${symbols.length} total)`);
    return { cached, missing };
  }
  
  // Batch set for multiple symbols
  setBatch(results: Array<{symbol: string; data: AnalysisData}>, analysisType: string, startTime: string, endTime: string): void {
    for (const result of results) {
      this.set(result.symbol, analysisType, startTime, endTime, result.data);
    }
  }
  
  // Cleanup expired entries
  private cleanupIfNeeded(): void {
    const now = Date.now();
    const timeSinceLastCleanup = now - this.stats.lastCleanup;
    
    // Cleanup every 30 minutes
    if (timeSinceLastCleanup > 30 * 60 * 1000) {
      this.cleanup();
    }
  }
  
  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    
    this.stats.lastCleanup = now;
    if (removedCount > 0) {
    }
  }
  
  // Force invalidate cache for a symbol
  invalidate(symbol: string, analysisType?: string): void {
    const keysToRemove: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(symbol + '_')) {
        if (!analysisType || key.includes(`_${analysisType}_`)) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => this.cache.delete(key));
  }
  
  // Get cache statistics
  getStats(): CacheStats & { 
    cacheSize: number; 
    hitRate: number; 
    avgAge: number;
  } {
    const now = Date.now();
    let totalAge = 0;
    let validEntries = 0;
    
    for (const entry of this.cache.values()) {
      if (now <= entry.expiresAt) {
        totalAge += (now - entry.timestamp);
        validEntries++;
      }
    }
    
    const hitRate = this.stats.totalRequests > 0 ? 
      (this.stats.hits / this.stats.totalRequests) * 100 : 0;
    
    const avgAge = validEntries > 0 ? totalAge / validEntries / 1000 : 0; // seconds
    
    return {
      ...this.stats,
      cacheSize: validEntries,
      hitRate: Math.round(hitRate * 100) / 100,
      avgAge: Math.round(avgAge)
    };
  }
  
  // Clear all cache
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      lastCleanup: Date.now()
    };
    console.log(`🧽 Cleared entire cache (${size} entries)`);
  }
}

// Singleton instance
const advancedScannerCache = new AdvancedScannerCache();

export default advancedScannerCache;
export type { CacheEntry, CacheStats }; 