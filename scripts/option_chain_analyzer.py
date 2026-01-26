#!/usr/bin/env python3

"""
Option Chain Analysis Collector for TradeSmart Money

This script replicates the advanced option chain analysis from the web interface
and stores results in Supabase for fast retrieval.

Runs every 5 minutes during market hours and analyzes:
- Call/Put buildup patterns (Buying, Writing, Covering)
- PCR (Put-Call Ratio) analysis
- Max Pain calculations
- Institutional vs Retail flow
- Support/Resistance levels from options data

Environment variables required:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- FORCE_RUN (optional: 'true' to override market hours)
"""

import os
import sys
import time
import json
import logging
import requests
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

# Market Data API Configuration
NIFTY_TRADER_BASE = 'https://webapi.niftytrader.in/webapi'
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://niftytrader.in/',
    'Origin': 'https://niftytrader.in'
}

# Environment variables
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"
FORCE_RUN = os.environ.get("FORCE_RUN", "false").lower() == "true"  # Keep this as env var for flexibility

# FNO Symbols will be fetched from Supabase table

def get_env(name: str, required: bool = True) -> str:
    """Get environment variable with validation"""
    value = os.environ.get(name)
    if required and not value:
        logging.error(f"Missing required environment variable: {name}")
        sys.exit(1)
    return value or ""

def ist_now() -> datetime:
    """Get current IST time"""
    return datetime.utcnow().replace(tzinfo=timezone.utc) + timedelta(hours=5, minutes=30)

def is_market_hours() -> bool:
    """Check if current time is within market hours"""
    if FORCE_RUN:
        logging.info("Force run enabled - skipping market hours check")
        return True

    now = ist_now()
    is_weekday = now.weekday() <= 4  # Monday=0, Friday=4
    minutes = now.hour * 60 + now.minute
    # Market hours: 9:15 AM to 3:30 PM IST
    start = 9 * 60 + 15  # 9:15 AM
    end = 15 * 60 + 30   # 3:30 PM
    within = start <= minutes <= end
    
    logging.info(f"IST now: {now.isoformat()} | Weekday: {is_weekday} | Within market hours: {within}")
    return is_weekday and within

def fetch_fno_symbols() -> List[str]:
    """Fetch active FNO symbols from Supabase database"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/fno_symbols"
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Query active symbols
        params = {
            'select': 'symbol_name',
            'is_active': 'eq.true',
            'limit': '500'
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=30)
        
        if response.status_code != 200:
            logging.error(f"Failed to fetch FNO symbols: HTTP {response.status_code}")
            logging.error(f"Response: {response.text[:300]}")
            raise Exception(f"Database query failed: {response.status_code}")
        
        data = response.json()
        
        if not data:
            logging.warning("No FNO symbols found in database")
            return []
        
        symbols = [item['symbol_name'] for item in data if item.get('symbol_name')]
        logging.info(f"✅ Fetched {len(symbols)} FNO symbols from database")
        
        return symbols
        
    except Exception as e:
        logging.error(f"Error fetching FNO symbols: {e}")
        # Return empty list instead of hardcoded fallback
        return []

# NSE API Configuration (Using proven cookie approach from futures_analyzer)
NSE_BASE = 'https://www.nseindia.com/api'
SET_COOKIE_URL = "https://www.nseindia.com/market-data/oi-spurts"
NSE_HEADERS = {
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
}

# Create session for cookie management (proven approach)
nse_session = requests.Session()
nse_cookies = dict()

def set_nse_cookie(url: str = SET_COOKIE_URL):
    """Set cookies for NSE API access (proven method from futures_analyzer)"""
    try:
        request = nse_session.get(url, headers=NSE_HEADERS, timeout=10)
        global nse_cookies
        nse_cookies = dict(request.cookies)
        logging.debug(f"🍪 NSE cookies set from {url}")
    except Exception as e:
        logging.warning(f"⚠️ Failed to set NSE cookies: {e}")

def get_nse_data(url: str) -> Optional[str]:
    """Get data from NSE using cookie-based session (proven method)"""
    try:
        logging.debug(f"📡 NSE API Call: {url}")
        response = nse_session.get(url, headers=NSE_HEADERS, timeout=15, cookies=nse_cookies)
        
        # Handle 401 errors by refreshing cookies (proven method)
        if response.status_code == 401:
            logging.info("🔄 401 error, refreshing NSE cookies...")
            set_nse_cookie(SET_COOKIE_URL)
            response = nse_session.get(url, headers=NSE_HEADERS, timeout=15, cookies=nse_cookies)
        
        if response.status_code == 200:
            logging.debug("✅ NSE Response OK")
            return response.text
        else:
            logging.debug(f"⚠️ NSE Response status: {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        logging.warning("⏰ NSE Request timed out")
    except requests.exceptions.ConnectionError:
        logging.warning("🌐 NSE Connection error")
    except requests.exceptions.HTTPError as e:
        logging.warning(f"🚫 NSE HTTP error: {e.response.status_code}")
    except Exception as e:
        logging.warning(f"❌ NSE Request error: {e}")
    
    return None

def fetch_option_chain_expiry_dates(symbol: str) -> Optional[List[str]]:
    """Fetch available expiry dates for a symbol using NEW NSE API"""
    try:
        # Initialize cookies if not set
        if not nse_cookies:
            logging.info("🔐 Setting initial NSE cookies...")
            set_nse_cookie()
        
        # NEW NSE API endpoint for expiry dates
        url = f"https://www.nseindia.com/api/NextApi/apiClient/GetQuoteApi?functionName=getOptionChainDropdown&symbol={symbol}"
        
        # Get data using proven cookie method
        response_text = get_nse_data(url)
        
        if not response_text:
            logging.warning(f"⚠️ No expiry data response for {symbol}")
            return None
            
        # Try to parse JSON
        try:
            data = json.loads(response_text)
        except ValueError as e:
            logging.error(f"❌ Invalid JSON response for expiry dates {symbol}: {e}")
            return None
        
        # Extract expiry dates from new API response
        expiry_dates = data.get('expiryDates', [])
        
        if not expiry_dates:
            logging.warning(f"⚠️ No expiry dates found for {symbol}")
            return None
            
        logging.info(f"✅ Found {len(expiry_dates)} expiry dates for {symbol}")
        return expiry_dates
        
    except Exception as e:
        logging.error(f"❌ Error fetching expiry dates for {symbol}: {e}")
        return None

def fetch_option_chain_data(symbol: str) -> Optional[Dict]:
    """Fetch option chain data from NEW NSE API"""
    try:
        # Initialize cookies if not set
        if not nse_cookies:
            logging.info("🔐 Setting initial NSE cookies...")
            set_nse_cookie()
        
        # Step 1: Get available expiry dates
        expiry_dates = fetch_option_chain_expiry_dates(symbol)
        
        if not expiry_dates:
            logging.warning(f"⚠️ No expiry dates available for {symbol}")
            return None
        
        # Step 2: Use the nearest expiry date (first one)
        nearest_expiry = expiry_dates[0]
        logging.info(f"📅 Using expiry date: {nearest_expiry} for {symbol}")
        
        # Step 3: Fetch option chain data with NEW NSE API
        url = f"https://www.nseindia.com/api/NextApi/apiClient/GetQuoteApi?functionName=getOptionChainData&symbol={symbol}&params=expiryDate={nearest_expiry}"
        
        # Get data using proven cookie method
        response_text = get_nse_data(url)
        
        if not response_text:
            logging.warning(f"⚠️ No response data for {symbol}")
            return None
            
        # Try to parse JSON
        try:
            data = json.loads(response_text)
        except ValueError as e:
            logging.error(f"❌ Invalid JSON response for {symbol}: {e}")
            logging.error(f"Response preview: {response_text[:500]}")
            return None
        
        # Debug: Log the structure of the response
        if data:
            logging.debug(f"📋 Response keys for {symbol}: {list(data.keys())}")
        
        # Check for new API structure - may use different keys
        if not data:
            logging.warning(f"⚠️ Empty response for {symbol}")
            return None
        
        # NEW NSE API FORMAT (Jan 2026 onwards)
        if 'data' in data and 'underlyingValue' in data:
            # Transform new format to old format for compatibility with existing analysis
            option_data = data.get('data', [])
            
            # Transform each option entry to match old format
            transformed_data = []
            for item in option_data:
                # Extract strike price from CE or PE object
                strike_price = item.get('CE', {}).get('strikePrice') or item.get('PE', {}).get('strikePrice', 0)
                
                transformed_item = {
                    'strikePrice': strike_price,
                    'expiryDate': item.get('expiryDates', nearest_expiry),
                    'CE': item.get('CE', {}),
                    'PE': item.get('PE', {})
                }
                transformed_data.append(transformed_item)
            
            # Wrap in old structure for compatibility
            result = {
                'records': {
                    'data': transformed_data,
                    'underlyingValue': data.get('underlyingValue', 0),
                    'timestamp': data.get('timestamp', '')
                }
            }
            
            logging.info(f"✅ Successfully fetched option chain for {symbol} (Expiry: {nearest_expiry}) [Strikes: {len(transformed_data)}]")
            return result
        
        # OLD API FORMAT (fallback for compatibility)
        elif 'records' in data:
            logging.info(f"✅ Successfully fetched option chain for {symbol} (Expiry: {nearest_expiry}) [OLD FORMAT]")
            return data
        
        else:
            logging.warning(f"⚠️ Unknown response structure for {symbol}")
            logging.warning(f"Available keys: {list(data.keys())}")
            return None
        
    except Exception as e:
        logging.error(f"❌ Unexpected error fetching NSE option chain for {symbol}: {e}")
        return None

def get_price_momentum_score(symbol: str, current_price: float) -> Dict:
    """Get price momentum and volume analysis for enhanced scoring"""
    try:
        import yfinance as yf
        
        # Get 5 days of data for trend analysis
        ticker = yf.Ticker(f"{symbol}.NS")
        hist = ticker.history(period="5d", interval="1d")
        
        if len(hist) < 2:
            return {'score': 0, 'reasoning': '', 'signals': [], 'volume_score': 0}
        
        # Calculate price momentum
        today_close = hist['Close'].iloc[-1]
        yesterday_close = hist['Close'].iloc[-2]
        day_change_pct = ((today_close - yesterday_close) / yesterday_close) * 100
        
        # Calculate 5-day trend
        week_start = hist['Close'].iloc[0]
        week_trend_pct = ((today_close - week_start) / week_start) * 100
        
        # Volume analysis
        today_volume = hist['Volume'].iloc[-1]
        avg_volume = hist['Volume'].mean()
        volume_ratio = today_volume / avg_volume if avg_volume > 0 else 1
        
        # Price momentum scoring
        momentum_score = 0
        volume_score = 0
        reasoning = ""
        signals = []
        
        # STRONG PRICE MOMENTUM
        if day_change_pct > 5:
            momentum_score += 60
            reasoning += f"🚀 EXPLOSIVE: +{day_change_pct:.1f}% today! "
            signals.append('EXPLOSIVE_BULLISH_MOMENTUM')
        elif day_change_pct > 3:
            momentum_score += 40
            reasoning += f"🚀 Strong bullish: +{day_change_pct:.1f}% today. "
            signals.append('STRONG_BULLISH_MOMENTUM')
        elif day_change_pct > 1.5:
            momentum_score += 20
            reasoning += f"📈 Moderate bullish: +{day_change_pct:.1f}%. "
            signals.append('MODERATE_BULLISH_MOMENTUM')
        elif day_change_pct < -5:
            momentum_score -= 60
            reasoning += f"📉 CRASH: {day_change_pct:.1f}% today! "
            signals.append('EXPLOSIVE_BEARISH_MOMENTUM')
        elif day_change_pct < -3:
            momentum_score -= 40
            reasoning += f"📉 Strong bearish: {day_change_pct:.1f}% today. "
            signals.append('STRONG_BEARISH_MOMENTUM')
        
        # VOLUME SURGE ANALYSIS
        if volume_ratio > 3:
            volume_score += 50
            reasoning += f"📊 MASSIVE volume surge: {volume_ratio:.1f}x avg! "
            signals.append('MASSIVE_VOLUME_SURGE')
        elif volume_ratio > 2:
            volume_score += 30
            reasoning += f"📊 High volume: {volume_ratio:.1f}x avg. "
            signals.append('HIGH_VOLUME_SURGE')
        elif volume_ratio > 1.5:
            volume_score += 15
            reasoning += f"📊 Above avg volume: {volume_ratio:.1f}x. "
            signals.append('ABOVE_AVERAGE_VOLUME')
        
        # TREND CONFIRMATION
        if week_trend_pct > 10 and day_change_pct > 0:
            momentum_score += 25
            reasoning += f"📈 Strong weekly uptrend: +{week_trend_pct:.1f}%. "
            signals.append('STRONG_WEEKLY_UPTREND')
        elif week_trend_pct < -10 and day_change_pct < 0:
            momentum_score -= 25
            reasoning += f"📉 Strong weekly downtrend: {week_trend_pct:.1f}%. "
            signals.append('STRONG_WEEKLY_DOWNTREND')
        
        return {
            'score': momentum_score + volume_score,
            'reasoning': reasoning,
            'signals': signals,
            'volume_score': volume_score,
            'day_change_pct': day_change_pct,
            'week_trend_pct': week_trend_pct,
            'volume_ratio': volume_ratio
        }
        
    except Exception as e:
        logging.debug(f"Price momentum error for {symbol}: {e}")
        return {'score': 0, 'reasoning': '', 'signals': [], 'volume_score': 0}

def get_sector_strength_score(symbol: str) -> Dict:
    """Get sector strength multiplier"""
    # Sector mapping with current strength (you can make this dynamic)
    sector_strength = {
        # IT Sector (Strong)
        'TCS': 1.3, 'INFY': 1.3, 'HCLTECH': 1.3, 'TECHM': 1.3, 'WIPRO': 1.2,
        'LTTS': 1.2, 'LTIM': 1.2, 'COFORGE': 1.2, 'MPHASIS': 1.2,
        
        # Banking (Moderate)
        'HDFCBANK': 1.1, 'ICICIBANK': 1.1, 'KOTAKBANK': 1.1, 'AXISBANK': 1.0,
        'SBIN': 1.0, 'BANKBARODA': 1.0, 'PNB': 1.0,
        
        # Auto (Strong)
        'MARUTI': 1.2, 'TATAMOTORS': 1.2, 'M&M': 1.2, 'BAJAJ-AUTO': 1.2,
        'HEROMOTOCO': 1.1, 'EICHERMOT': 1.1, 'TVSMOTOR': 1.1, 'SONACOMS': 1.3,
        
        # Metals (Very Strong)
        'TATASTEEL': 1.4, 'JSWSTEEL': 1.4, 'HINDALCO': 1.3, 'VEDL': 1.3,
        'HINDZINC': 1.3, 'NATIONALUM': 1.2, 'NMDC': 1.2, 'SAIL': 1.2,
        
        # Pharma (Moderate)
        'SUNPHARMA': 1.1, 'DRREDDY': 1.1, 'CIPLA': 1.1, 'LUPIN': 1.0,
        
        # Infrastructure (Strong)
        'LT': 1.3, 'GMRINFRA': 1.2, 'DLF': 1.2, 'OBEROIRLTY': 1.2,
        
        # Default for others
        'DEFAULT': 1.0
    }
    
    multiplier = sector_strength.get(symbol, sector_strength['DEFAULT'])
    
    if multiplier > 1.2:
        return {'multiplier': multiplier, 'reasoning': f"🔥 Hot sector (x{multiplier}). ", 'signals': ['HOT_SECTOR']}
    elif multiplier > 1.1:
        return {'multiplier': multiplier, 'reasoning': f"📈 Strong sector (x{multiplier}). ", 'signals': ['STRONG_SECTOR']}
    else:
        return {'multiplier': multiplier, 'reasoning': '', 'signals': []}

def analyze_nse_option_buildup(option_data: List[Dict], current_price: float, symbol: str = "") -> Dict:
    """
    REFINED NSE option chain analysis - Clear Cut Analysis
    
    KEY IMPROVEMENTS:
    1. Institutional flow gets 80% weight (primary signal)
    2. PCR gets 20% weight (secondary support/resistance)
    3. Better call writing vs call buying detection
    4. Conflict detection between signals
    5. Clear reasoning with signal priority
    
    Fixes TATAMOTORS-type false positives where PCR overrode institutional bearish flow
    """
    
    institutional_bullish_flow = 0
    institutional_bearish_flow = 0
    max_pain = current_price
    max_oi = 0
    support_levels = []
    resistance_levels = []
    unusual_activity = []
    detailed_analysis = []
    
    # Track total call and put activity
    total_call_oi = 0
    total_put_oi = 0
    
    # REFINED: Get price momentum only (removed hardcoded sector strength)
    price_momentum = get_price_momentum_score(symbol, current_price)
    
    for option_row in option_data:
        strike = option_row.get('strikePrice', 0)
        
        # Extract call data
        ce_data = option_row.get('CE', {})
        call_oi = ce_data.get('openInterest', 0) or 0
        call_oi_change = ce_data.get('changeinOpenInterest', 0) or 0
        call_volume = ce_data.get('totalTradedVolume', 0) or 0
        call_ltp = ce_data.get('lastPrice', 0) or 0
        call_change = ce_data.get('change', 0) or 0
        
        # Extract put data  
        pe_data = option_row.get('PE', {})
        put_oi = pe_data.get('openInterest', 0) or 0
        put_oi_change = pe_data.get('changeinOpenInterest', 0) or 0
        put_volume = pe_data.get('totalTradedVolume', 0) or 0
        put_ltp = pe_data.get('lastPrice', 0) or 0
        put_change = pe_data.get('change', 0) or 0
        
        # Calculate total OI for max pain
        total_oi = call_oi + put_oi
        if total_oi > max_oi:
            max_oi = total_oi
            max_pain = strike
            
        # Track totals for PCR calculation
        total_call_oi += call_oi
        total_put_oi += put_oi
        
        # Distance-based weighting (closer to spot = more important)
        distance_from_spot = abs(strike - current_price) / current_price
        proximity_weight = 3 if distance_from_spot < 0.05 else (2 if distance_from_spot < 0.1 else 1)
        
        # DYNAMIC CALL ANALYSIS (no hardcoded thresholds)
        if call_oi_change > 0 and call_volume > 0:  # Any fresh call positions
            # CALCULATE DYNAMIC THRESHOLDS based on this stock's actual data
            all_call_volumes = [row.get('CE', {}).get('totalTradedVolume', 0) or 0 for row in option_data if (row.get('CE', {}).get('totalTradedVolume', 0) or 0) > 0]
            all_call_oi_changes = [row.get('CE', {}).get('changeinOpenInterest', 0) or 0 for row in option_data if (row.get('CE', {}).get('changeinOpenInterest', 0) or 0) > 0]
            
            if all_call_volumes and all_call_oi_changes:
                avg_call_volume = sum(all_call_volumes) / len(all_call_volumes)
                avg_call_oi_change = sum(all_call_oi_changes) / len(all_call_oi_changes)
                
                # Dynamic thresholds based on this stock's activity
                volume_threshold = avg_call_volume * 1.5  # 50% above average
                massive_threshold = avg_call_volume * 3.0  # 3x above average
                oi_threshold = avg_call_oi_change * 1.5   # 50% above average
            else:
                # Fallback minimal thresholds
                volume_threshold = 100
                massive_threshold = 500
                oi_threshold = 50
            
            if call_volume > volume_threshold:  # High volume = institutional
                # REFINED: Better determination of CALL BUYING vs CALL WRITING
                if call_change > 0.5:  # Call prices rising significantly = call buying (bullish)
                    base_weight = proximity_weight * 3
                    
                    # VOLUME SURGE BONUS
                    if call_volume > massive_threshold:
                        base_weight *= 1.5
                    
                    # PRICE MOMENTUM ALIGNMENT BONUS
                    if price_momentum.get('day_change_pct', 0) > 2:
                        base_weight *= 1.3
                    
                    institutional_bullish_flow += base_weight
                    detailed_analysis.append(f"{strike}CE: INSTITUTIONAL Call Buying (+{base_weight:.1f}) [OI: +{call_oi_change:,}, Vol: {call_volume:,}]")
                    
                    if call_volume > massive_threshold:
                        unusual_activity.append(f"🚀 EXPLOSIVE Call Buying at {strike} (Vol: {call_volume:,})")
                    elif call_volume > volume_threshold:
                        unusual_activity.append(f"📈 MASSIVE Call Buying at {strike} (Vol: {call_volume:,})")
                        
                elif call_change <= 0:  # Call prices stable/falling with high OI = call writing (bearish)
                    base_weight = proximity_weight * 3
                    
                    # VOLUME SURGE PENALTY (more bearish with higher volume)
                    if call_volume > massive_threshold:
                        base_weight *= 1.5
                    
                    institutional_bearish_flow += base_weight
                    detailed_analysis.append(f"{strike}CE: INSTITUTIONAL Call Writing (-{base_weight:.1f}) [OI: +{call_oi_change:,}, Vol: {call_volume:,}, Price: {call_change:.2f}]")
                    
                    if call_volume > massive_threshold:
                        unusual_activity.append(f"📉 MASSIVE Call Writing at {strike} (Vol: {call_volume:,}, Price: {call_change:.2f})")
                    elif call_volume > volume_threshold:
                        unusual_activity.append(f"🔻 HEAVY Call Writing at {strike} (Vol: {call_volume:,}, Price: {call_change:.2f})")
                
                else:  # Small price changes (0 < call_change <= 0.5) - mixed signals
                    base_weight = proximity_weight * 1.5  # Lower weight for unclear signals
                    detailed_analysis.append(f"{strike}CE: Mixed Call Activity (~{base_weight:.1f}) [OI: +{call_oi_change:,}, Vol: {call_volume:,}, Price: +{call_change:.2f}]")
            
            # MEDIUM VOLUME ACTIVITY
            elif call_volume > 1000:
                if call_change > 0.3:  # REFINED: Call buying (higher threshold)
                    weight = proximity_weight * 1.5
                    institutional_bullish_flow += weight
                    detailed_analysis.append(f"{strike}CE: Call Buying (+{weight:.1f}) [OI: +{call_oi_change:,}, Vol: {call_volume:,}, Price: +{call_change:.2f}]")
                elif call_change <= 0:  # REFINED: Call writing (clearer threshold)
                    weight = proximity_weight * 1.5
                    institutional_bearish_flow += weight
                    detailed_analysis.append(f"{strike}CE: Call Writing (-{weight:.1f}) [OI: +{call_oi_change:,}, Vol: {call_volume:,}, Price: {call_change:.2f}]")
                    
        elif call_oi_change < 0 and call_volume > 1000:  # Call unwinding/profit booking
            if abs(call_oi_change) > 50:
                weight = proximity_weight * 0.5
                detailed_analysis.append(f"{strike}CE: Call Unwinding/Profit Booking [OI: {call_oi_change:,}, Vol: {call_volume:,}]")
                
        # DYNAMIC PUT ANALYSIS (no hardcoded thresholds)
        if put_oi_change > 0 and put_volume > 0:  # Any fresh put positions
            # CALCULATE DYNAMIC THRESHOLDS based on this stock's actual put data
            all_put_volumes = [row.get('PE', {}).get('totalTradedVolume', 0) or 0 for row in option_data if (row.get('PE', {}).get('totalTradedVolume', 0) or 0) > 0]
            all_put_oi_changes = [row.get('PE', {}).get('changeinOpenInterest', 0) or 0 for row in option_data if (row.get('PE', {}).get('changeinOpenInterest', 0) or 0) > 0]
            
            if all_put_volumes and all_put_oi_changes:
                avg_put_volume = sum(all_put_volumes) / len(all_put_volumes)
                avg_put_oi_change = sum(all_put_oi_changes) / len(all_put_oi_changes)
                
                # Dynamic thresholds based on this stock's put activity
                volume_threshold = avg_put_volume * 1.5  # 50% above average
                massive_threshold = avg_put_volume * 3.0  # 3x above average
                put_oi_threshold = avg_put_oi_change * 1.5   # 50% above average
            else:
                # Fallback minimal thresholds
                volume_threshold = 100
                massive_threshold = 500
                put_oi_threshold = 50
            
            if put_volume > volume_threshold:  # High volume = institutional
                # ENHANCED BEARISH DETECTION: Put buying vs put writing
                if put_change > 0.5:  # Put prices rising significantly = put buying (BEARISH)
                    base_weight = proximity_weight * 3
                    
                    # VOLUME SURGE AMPLIFICATION for bearish signals
                    if put_volume > massive_threshold:
                        base_weight *= 1.5
                    
                    # PRICE CONFLICT AMPLIFICATION (put buying while price rising = extra bearish)
                    if price_momentum.get('day_change_pct', 0) > 1:
                        base_weight *= 1.4  # 40% amplification for conflicting signals
                    
                    institutional_bearish_flow += base_weight
                    detailed_analysis.append(f"{strike}PE: INSTITUTIONAL Put Buying (-{base_weight:.1f}) [OI: +{put_oi_change:,}, Vol: {put_volume:,}, Price: +{put_change:.2f}]")
                    
                    if put_volume > massive_threshold:
                        unusual_activity.append(f"📉 MASSIVE Put Buying at {strike} (Vol: {put_volume:,}, Price: +{put_change:.2f})")
                    elif put_volume > volume_threshold:
                        unusual_activity.append(f"🔻 HEAVY Put Buying at {strike} (Vol: {put_volume:,}, Price: +{put_change:.2f})")
                        
                elif put_change <= 0:  # Put prices stable/falling with high OI = put writing (bullish)
                    base_weight = proximity_weight * 3
                    
                    if put_volume > massive_threshold:
                        base_weight *= 1.5
                    
                    if price_momentum.get('day_change_pct', 0) > 2:
                        base_weight *= 1.3
                    
                    institutional_bullish_flow += base_weight
                    detailed_analysis.append(f"{strike}PE: INSTITUTIONAL Put Writing (+{base_weight:.1f}) [OI: +{put_oi_change:,}, Vol: {put_volume:,}]")
                    
                    if put_volume > massive_threshold:
                        unusual_activity.append(f"🛡️ MASSIVE Put Writing at {strike} (Vol: {put_volume:,})")
                    elif put_volume > volume_threshold:
                        unusual_activity.append(f"💪 HEAVY Put Writing at {strike} (Vol: {put_volume:,})")
            
            # MEDIUM VOLUME ACTIVITY
            elif put_volume > 1000:
                if put_change > 0.5:  # Put buying (bearish)
                    weight = proximity_weight * 2
                    institutional_bearish_flow += weight
                    detailed_analysis.append(f"{strike}PE: Put Buying (-{weight}) [OI: +{put_oi_change:,}, Vol: {put_volume:,}]")
                else:  # Put writing (bullish)
                    weight = proximity_weight * 1.5
                    institutional_bullish_flow += weight
                    detailed_analysis.append(f"{strike}PE: Put Writing (+{weight}) [OI: +{put_oi_change:,}, Vol: {put_volume:,}]")
                        
        elif put_oi_change < 0 and put_volume > 1000:  # Put unwinding
            if abs(put_oi_change) > 50:
                detailed_analysis.append(f"{strike}PE: Put Unwinding [OI: {put_oi_change:,}, Vol: {put_volume:,}]")
        
        # ENHANCED SUPPORT AND RESISTANCE LEVEL DETECTION (Human-like analysis)
        
        # DYNAMIC RESISTANCE LEVELS: Based on actual data distribution
        if strike > current_price:
            # Calculate dynamic thresholds for resistance detection
            all_call_ois = [row.get('CE', {}).get('openInterest', 0) or 0 for row in option_data]
            all_call_oi_changes = [abs(row.get('CE', {}).get('changeinOpenInterest', 0) or 0) for row in option_data]
            all_call_volumes = [row.get('CE', {}).get('totalTradedVolume', 0) or 0 for row in option_data]
            
            if all_call_ois and all_call_oi_changes and all_call_volumes:
                high_oi_threshold = sorted(all_call_ois)[-int(len(all_call_ois) * 0.2)] if len(all_call_ois) > 5 else 10000  # Top 20%
                high_oi_change_threshold = sorted(all_call_oi_changes)[-int(len(all_call_oi_changes) * 0.3)] if len(all_call_oi_changes) > 3 else 1000  # Top 30%
                high_volume_threshold = sorted(all_call_volumes)[-int(len(all_call_volumes) * 0.3)] if len(all_call_volumes) > 3 else 500  # Top 30%
                
                # Strong resistance: High OI + Fresh writing + High volume (all dynamic)
                if call_oi > high_oi_threshold and call_oi_change > high_oi_change_threshold and call_volume > high_volume_threshold:
                    resistance_strength = (call_oi + call_oi_change * 2) / 100000  # Weight fresh activity more
                    resistance_levels.append({
                        'level': strike,
                        'strength': resistance_strength,
                        'type': 'CALL_WRITING_RESISTANCE',
                        'oi': call_oi,
                        'oi_change': call_oi_change,
                        'volume': call_volume
                    })
                # Moderate resistance: High OI only (dynamic)
                elif call_oi > high_oi_threshold * 1.5:
                    resistance_strength = call_oi / 100000
                    resistance_levels.append({
                        'level': strike,
                        'strength': resistance_strength,
                        'type': 'CALL_OI_RESISTANCE',
                        'oi': call_oi,
                        'oi_change': call_oi_change,
                        'volume': call_volume
                    })
        
        # DYNAMIC SUPPORT LEVELS: Based on actual data distribution
        if strike < current_price:
            # Calculate dynamic thresholds for support detection
            all_put_ois = [row.get('PE', {}).get('openInterest', 0) or 0 for row in option_data]
            all_put_oi_changes = [abs(row.get('PE', {}).get('changeinOpenInterest', 0) or 0) for row in option_data]
            all_put_volumes = [row.get('PE', {}).get('totalTradedVolume', 0) or 0 for row in option_data]
            
            if all_put_ois and all_put_oi_changes and all_put_volumes:
                high_put_oi_threshold = sorted(all_put_ois)[-int(len(all_put_ois) * 0.2)] if len(all_put_ois) > 5 else 10000  # Top 20%
                high_put_oi_change_threshold = sorted(all_put_oi_changes)[-int(len(all_put_oi_changes) * 0.3)] if len(all_put_oi_changes) > 3 else 1000  # Top 30%
                high_put_volume_threshold = sorted(all_put_volumes)[-int(len(all_put_volumes) * 0.3)] if len(all_put_volumes) > 3 else 500  # Top 30%
                
                # Strong support: High OI + Fresh writing + High volume (all dynamic)
                if put_oi > high_put_oi_threshold and put_oi_change > high_put_oi_change_threshold and put_volume > high_put_volume_threshold:
                    support_strength = (put_oi + put_oi_change * 2) / 100000
                    support_levels.append({
                        'level': strike,
                        'strength': support_strength,
                        'type': 'PUT_WRITING_SUPPORT',
                        'oi': put_oi,
                        'oi_change': put_oi_change,
                        'volume': put_volume
                    })
                # Moderate support: High OI only (dynamic)
                elif put_oi > high_put_oi_threshold * 1.5:
                    support_strength = put_oi / 100000
                    support_levels.append({
                        'level': strike,
                        'strength': support_strength,
                        'type': 'PUT_OI_SUPPORT',
                        'oi': put_oi,
                        'oi_change': put_oi_change,
                        'volume': put_volume
                    })
    
    # HUMAN-LIKE ZONE ANALYSIS: Where is the stock positioned?
    def analyze_current_zone(current_price, resistance_levels, support_levels):
        """Determine current position relative to key levels like a human trader"""
        
        # Sort levels by strength
        resistance_levels.sort(key=lambda x: x['strength'], reverse=True)
        support_levels.sort(key=lambda x: x['strength'], reverse=True)
        
        # Find nearest levels
        nearest_resistance = None
        nearest_support = None
        
        for resistance in resistance_levels:
            if resistance['level'] > current_price:
                if not nearest_resistance or resistance['level'] < nearest_resistance['level']:
                    nearest_resistance = resistance
        
        for support in support_levels:
            if support['level'] < current_price:
                if not nearest_support or support['level'] > nearest_support['level']:
                    nearest_support = support
        
        # Calculate distances
        resistance_distance_pct = 999  # Default high value
        support_distance_pct = 999
        
        if nearest_resistance:
            resistance_distance_pct = (nearest_resistance['level'] - current_price) / current_price * 100
        
        if nearest_support:
            support_distance_pct = (current_price - nearest_support['level']) / current_price * 100
        
        # Determine zone
        zone_analysis = {
            'nearest_resistance': nearest_resistance,
            'nearest_support': nearest_support,
            'resistance_distance_pct': resistance_distance_pct,
            'support_distance_pct': support_distance_pct,
            'risk_reward_ratio': resistance_distance_pct / support_distance_pct if support_distance_pct > 0 else 0
        }
        
        # Zone classification (like a human trader would think)
        if resistance_distance_pct < 1.5:  # Within 1.5% of resistance
            zone_analysis['current_zone'] = 'AT_RESISTANCE'
            zone_analysis['zone_bias'] = 'BEARISH'
            zone_analysis['zone_reasoning'] = f"🚧 At resistance ({nearest_resistance['level']}) - expect rejection"
        elif support_distance_pct < 1.5:  # Within 1.5% of support
            zone_analysis['current_zone'] = 'AT_SUPPORT'
            zone_analysis['zone_bias'] = 'BULLISH'
            zone_analysis['zone_reasoning'] = f"🎯 At support ({nearest_support['level']}) - expect bounce"
        elif resistance_distance_pct < 3 and resistance_distance_pct < support_distance_pct:
            zone_analysis['current_zone'] = 'NEAR_RESISTANCE'
            zone_analysis['zone_bias'] = 'BEARISH'
            zone_analysis['zone_reasoning'] = f"⚠️ Approaching resistance ({nearest_resistance['level']}) - caution"
        elif support_distance_pct < 3 and support_distance_pct < resistance_distance_pct:
            zone_analysis['current_zone'] = 'NEAR_SUPPORT'
            zone_analysis['zone_bias'] = 'BULLISH'
            zone_analysis['zone_reasoning'] = f"📈 Near support ({nearest_support['level']}) - potential bounce"
        else:
            zone_analysis['current_zone'] = 'MIDDLE_RANGE'
            zone_analysis['zone_bias'] = 'NEUTRAL'
            zone_analysis['zone_reasoning'] = "⚖️ In middle of range - no clear bias from levels"
        
        return zone_analysis
    
    # Perform zone analysis
    zone_analysis = analyze_current_zone(current_price, resistance_levels, support_levels)
    
    # DYNAMIC INSTITUTIONAL ACTIVITY CLASSIFICATION (No hardcoded thresholds)
    def classify_institutional_activities(option_data, current_price):
        """Classify institutional activities using dynamic thresholds based on actual data"""
        
        activities = []
        
        # STEP 1: Calculate dynamic thresholds based on actual data
        all_call_oi_changes = []
        all_put_oi_changes = []
        all_call_volumes = []
        all_put_volumes = []
        all_call_price_changes = []
        all_put_price_changes = []
        
        for option_row in option_data:
            call_oi_change = option_row.get('CE', {}).get('changeinOpenInterest', 0) or 0
            put_oi_change = option_row.get('PE', {}).get('changeinOpenInterest', 0) or 0
            call_volume = option_row.get('CE', {}).get('totalTradedVolume', 0) or 0
            put_volume = option_row.get('PE', {}).get('totalTradedVolume', 0) or 0
            call_change = option_row.get('CE', {}).get('change', 0) or 0
            put_change = option_row.get('PE', {}).get('change', 0) or 0
            
            if call_oi_change != 0: all_call_oi_changes.append(abs(call_oi_change))
            if put_oi_change != 0: all_put_oi_changes.append(abs(put_oi_change))
            if call_volume > 0: all_call_volumes.append(call_volume)
            if put_volume > 0: all_put_volumes.append(put_volume)
            if call_change != 0: all_call_price_changes.append(abs(call_change))
            if put_change != 0: all_put_price_changes.append(abs(put_change))
        
        # Calculate dynamic thresholds (top 20% of activity)
        def get_percentile(data_list, percentile=80):
            if not data_list: return 0
            sorted_data = sorted(data_list)
            index = int(len(sorted_data) * percentile / 100)
            return sorted_data[min(index, len(sorted_data) - 1)]
        
        # DYNAMIC THRESHOLDS (no hardcoding!)
        significant_call_oi_threshold = get_percentile(all_call_oi_changes, 75)  # Top 25%
        significant_put_oi_threshold = get_percentile(all_put_oi_changes, 75)
        significant_call_volume_threshold = get_percentile(all_call_volumes, 70)  # Top 30%
        significant_put_volume_threshold = get_percentile(all_put_volumes, 70)
        significant_call_price_threshold = get_percentile(all_call_price_changes, 60)  # Top 40%
        significant_put_price_threshold = get_percentile(all_put_price_changes, 60)
        
        # STEP 2: Classify activities using dynamic thresholds
        for option_row in option_data:
            strike = option_row.get('strikePrice', 0)
            
            # Extract data
            call_oi = option_row.get('CE', {}).get('openInterest', 0) or 0
            call_oi_change = option_row.get('CE', {}).get('changeinOpenInterest', 0) or 0
            call_volume = option_row.get('CE', {}).get('totalTradedVolume', 0) or 0
            call_change = option_row.get('CE', {}).get('change', 0) or 0
            
            put_oi = option_row.get('PE', {}).get('openInterest', 0) or 0
            put_oi_change = option_row.get('PE', {}).get('changeinOpenInterest', 0) or 0
            put_volume = option_row.get('PE', {}).get('totalTradedVolume', 0) or 0
            put_change = option_row.get('PE', {}).get('change', 0) or 0
            
            distance_pct = abs(strike - current_price) / current_price * 100
            
            # 1. COVERED CALL WRITING (Dynamic thresholds)
            if (strike > current_price and distance_pct < 10 and 
                call_oi_change > significant_call_oi_threshold and 
                call_volume > significant_call_volume_threshold and 
                call_change <= 0):
                activities.append({
                    'type': 'COVERED_CALL_WRITING',
                    'strike': strike,
                    'sentiment': 'BEARISH_NEUTRAL',
                    'strength': call_oi_change / 1000,
                    'explanation': f'Heavy call writing at {strike} - institutions capping upside'
                })
            
            # 2. PROTECTIVE PUT BUYING (Dynamic thresholds)
            if (strike < current_price and distance_pct < 15 and 
                put_oi_change > significant_put_oi_threshold and 
                put_volume > significant_put_volume_threshold and 
                put_change > significant_put_price_threshold):
                activities.append({
                    'type': 'PROTECTIVE_PUT_BUYING',
                    'strike': strike,
                    'sentiment': 'HEDGING',
                    'strength': put_oi_change / 1000,
                    'explanation': f'Put buying at {strike} - institutions hedging long positions'
                })
            
            # 3. CASH SECURED PUT WRITING (Dynamic thresholds)
            if (strike < current_price and distance_pct < 10 and 
                put_oi_change > significant_put_oi_threshold and 
                put_volume > significant_put_volume_threshold and 
                put_change <= 0):
                activities.append({
                    'type': 'CASH_SECURED_PUT_WRITING',
                    'strike': strike,
                    'sentiment': 'BULLISH',
                    'strength': put_oi_change / 1000,
                    'explanation': f'Put writing at {strike} - institutions willing to buy stock'
                })
            
            # 4. LONG CALL BUYING (Dynamic thresholds)
            if (strike > current_price and distance_pct < 15 and 
                call_oi_change > significant_call_oi_threshold and 
                call_volume > significant_call_volume_threshold and 
                call_change > significant_call_price_threshold):
                activities.append({
                    'type': 'LONG_CALL_BUYING',
                    'strike': strike,
                    'sentiment': 'BULLISH',
                    'strength': call_oi_change / 1000,
                    'explanation': f'Call buying at {strike} - institutions betting on upside'
                })
            
            # 5. STRADDLE/STRANGLE (Dynamic thresholds)
            if (call_oi_change > significant_call_oi_threshold * 0.5 and 
                put_oi_change > significant_put_oi_threshold * 0.5 and 
                call_volume > significant_call_volume_threshold * 0.5 and 
                put_volume > significant_put_volume_threshold * 0.5):
                activities.append({
                    'type': 'VOLATILITY_PLAY',
                    'strike': strike,
                    'sentiment': 'NEUTRAL_VOLATILE',
                    'strength': (call_oi_change + put_oi_change) / 2000,
                    'explanation': f'High call & put activity at {strike} - volatility play'
                })
        
        # Classify dominant activity
        activity_summary = {
            'hedging_activities': [a for a in activities if a['sentiment'] == 'HEDGING'],
            'bullish_activities': [a for a in activities if a['sentiment'] == 'BULLISH'],
            'bearish_activities': [a for a in activities if a['sentiment'] in ['BEARISH_NEUTRAL', 'BEARISH']],
            'volatility_activities': [a for a in activities if a['sentiment'] == 'NEUTRAL_VOLATILE'],
            'all_activities': activities
        }
        
        # Calculate ratios
        total_strength = sum([a['strength'] for a in activities]) or 1
        activity_summary['hedging_ratio'] = sum([a['strength'] for a in activity_summary['hedging_activities']]) / total_strength
        activity_summary['speculation_ratio'] = 1 - activity_summary['hedging_ratio']
        
        return activity_summary
    
    # Perform institutional activity analysis
    institutional_activities = classify_institutional_activities(option_data, current_price)
    
    # Calculate net institutional flow
    net_institutional_flow = institutional_bullish_flow - institutional_bearish_flow
    
    # Calculate PCR first (needed for bearish detection)
    pcr = total_put_oi / total_call_oi if total_call_oi > 0 else 1.0
    
    # REFINED: Apply price momentum with higher institutional flow weight (NO SECTOR MULTIPLIER)
    base_score = net_institutional_flow * 3.0  # Increased from 2 to 3 for better institutional flow priority
    
    # ADD PRICE MOMENTUM SCORE
    momentum_score = price_momentum.get('score', 0)
    final_score = base_score + momentum_score  # No sector multiplier - pure signals only
    
    # Combine all reasoning
    combined_reasoning = ""
    combined_signals = []
    
    # HUMAN-LIKE DECISION SYNTHESIS
    def synthesize_human_decision(net_flow, zone_analysis, institutional_activities, pcr):
        """Synthesize all factors like an experienced human trader"""
        
        decision = {
            'primary_bias': 'NEUTRAL',
            'confidence': 0.5,
            'reasoning_components': [],
            'risk_factors': [],
            'opportunity_factors': [],
            'human_score': 0
        }
        
        # 1. ZONE ANALYSIS (Most Important - where is price?)
        zone_bias = zone_analysis.get('zone_bias', 'NEUTRAL')
        zone_reasoning = zone_analysis.get('zone_reasoning', '')
        
        if zone_bias == 'BEARISH':
            decision['primary_bias'] = 'BEARISH'
            decision['confidence'] += 0.2
            decision['reasoning_components'].append(zone_reasoning)
            # REMOVED: Hardcoded -30 score
        elif zone_bias == 'BULLISH':
            decision['primary_bias'] = 'BULLISH'
            decision['confidence'] += 0.2
            decision['reasoning_components'].append(zone_reasoning)
            # REMOVED: Hardcoded +30 score
        
        # 2. INSTITUTIONAL FLOW ANALYSIS (Second Most Important) - PURE DATA DRIVEN
        if net_flow >= 15:
            decision['reasoning_components'].append('💰 MASSIVE institutional bullish flow dominates')
            if decision['primary_bias'] == 'BULLISH':
                decision['confidence'] += 0.15  # Confirmation
            else:
                decision['risk_factors'].append('Conflicting zone vs institutional signals')
        elif net_flow >= 8:
            decision['reasoning_components'].append('💰 Strong institutional bullish flow detected')
            if decision['primary_bias'] == 'BULLISH':
                decision['confidence'] += 0.1
            else:
                decision['risk_factors'].append('Mixed zone vs institutional signals')
        elif net_flow <= -15:
            decision['reasoning_components'].append('💰 MASSIVE institutional bearish flow dominates')
            if decision['primary_bias'] == 'BEARISH':
                decision['confidence'] += 0.15  # Confirmation
            else:
                decision['risk_factors'].append('Conflicting zone vs institutional signals')
        elif net_flow <= -8:
            decision['reasoning_components'].append('💰 Strong institutional bearish flow detected')
            if decision['primary_bias'] == 'BEARISH':
                decision['confidence'] += 0.1
            else:
                decision['risk_factors'].append('Mixed zone vs institutional signals')
        
        # USE INSTITUTIONAL FLOW AS THE SCORE (pure data-driven)
        decision['human_score'] = net_flow * 3.0  # Direct mapping from institutional flow
        
        # 3. INSTITUTIONAL ACTIVITY ANALYSIS
        hedging_ratio = institutional_activities.get('hedging_ratio', 0)
        bearish_activities = institutional_activities.get('bearish_activities', [])
        
        if hedging_ratio > 0.6:
            decision['risk_factors'].append('🛡️ High hedging activity - institutions cautious')
            decision['confidence'] -= 0.05
        
        if bearish_activities:
            strongest_bearish = max(bearish_activities, key=lambda x: x['strength'])
            if strongest_bearish['strength'] > 10:  # Very strong activity
                decision['reasoning_components'].append(f"🔻 {strongest_bearish['explanation']}")
                # REMOVED: Hardcoded score adjustment - already captured in institutional flow
        
        # 4. RISK-REWARD ASSESSMENT
        risk_reward = zone_analysis.get('risk_reward_ratio', 1)
        if risk_reward > 2:
            decision['opportunity_factors'].append(f'📊 Favorable risk-reward: {risk_reward:.1f}')
            decision['confidence'] += 0.1
        elif risk_reward < 0.5:
            decision['risk_factors'].append(f'📊 Poor risk-reward: {risk_reward:.1f}')
            decision['confidence'] -= 0.1
            decision['human_score'] *= 0.7  # Reduce score for poor R:R
        
        # 5. FINAL BIAS DETERMINATION
        if decision['human_score'] > 40:
            decision['primary_bias'] = 'STRONGLY_BULLISH'
        elif decision['human_score'] > 15:
            decision['primary_bias'] = 'BULLISH'
        elif decision['human_score'] < -40:
            decision['primary_bias'] = 'STRONGLY_BEARISH'
        elif decision['human_score'] < -15:
            decision['primary_bias'] = 'BEARISH'
        else:
            decision['primary_bias'] = 'NEUTRAL'
        
        # Cap confidence
        decision['confidence'] = max(0.1, min(0.95, decision['confidence']))
        
        return decision
    
    # Perform human-like decision synthesis (no sector strength)
    human_decision = synthesize_human_decision(
        net_institutional_flow, zone_analysis, institutional_activities, pcr
    )
    
    # ENHANCED REASONING WITH HUMAN-LIKE ANALYSIS
    combined_reasoning = f"🧠 HUMAN-LIKE ANALYSIS:\n"
    
    # Add zone analysis first (most important)
    combined_reasoning += f"📍 POSITION: {zone_analysis.get('zone_reasoning', 'No clear zone bias')}\n"
    
    # Add institutional flow analysis
    for component in human_decision['reasoning_components']:
        combined_reasoning += f"{component}\n"
    
    # Add risk factors
    if human_decision['risk_factors']:
        combined_reasoning += "⚠️ RISKS: " + " | ".join(human_decision['risk_factors']) + "\n"
    
    # Add opportunity factors
    if human_decision['opportunity_factors']:
        combined_reasoning += "✅ OPPORTUNITIES: " + " | ".join(human_decision['opportunity_factors']) + "\n"
    
    # Set signals based on human decision
    combined_signals = [f"HUMAN_{human_decision['primary_bias']}"]
    
    # ADD PRICE MOMENTUM REASONING
    combined_reasoning += price_momentum.get('reasoning', '')
    combined_signals.extend(price_momentum.get('signals', []))
    
    # REMOVED: No more hardcoded sector strength reasoning
    
    # ENHANCED BEARISH DETECTION: High PCR + Negative momentum
    if pcr > 1.2 and price_momentum.get('day_change_pct', 0) < -2:
        # High PCR with falling price = strong bearish signal
        bearish_amplification = 40
        final_score -= bearish_amplification
        combined_signals.append('HIGH_PCR_BEARISH_MOMENTUM')
        combined_reasoning += f'📉 HIGH PCR ({pcr:.3f}) + falling price = strong bearish signal! '
    
    # PATTERN DETECTION (informational only - no score manipulation)
    if (net_institutional_flow > 10 and price_momentum.get('day_change_pct', 0) > 3):
        combined_signals.append('PERFECT_BULLISH_ALIGNMENT')
        combined_reasoning += '⚡ PERFECT alignment: Massive institutional buying + explosive price action! '
        # REMOVED: +50 bonus - let institutional flow data speak
    elif (net_institutional_flow < -10 and price_momentum.get('day_change_pct', 0) < -3):
        combined_signals.append('PERFECT_BEARISH_ALIGNMENT')
        combined_reasoning += '⚡ PERFECT alignment: Massive institutional selling + price crash! '
        # REMOVED: -50 penalty - let institutional flow data speak
    
    # ADDITIONAL PATTERN DETECTION (informational only)
    elif (net_institutional_flow < -5 and pcr > 1.1):
        combined_signals.append('BEARISH_FLOW_HIGH_PCR')
        combined_reasoning += '🔻 Bearish institutional flow + high PCR pattern detected! '
        # REMOVED: -25 penalty
    elif (price_momentum.get('day_change_pct', 0) < -4 and pcr > 0.9):
        combined_signals.append('PRICE_DECLINE_BEARISH')
        combined_reasoning += '📉 Strong price decline + elevated PCR pattern detected! '
        # REMOVED: -30 penalty
    
    # CONFLICT DETECTION (informational only)
    if (net_institutional_flow > 8 and price_momentum.get('day_change_pct', 0) < -2):
        combined_signals.append('OPTION_PRICE_CONFLICT')
        combined_reasoning += '⚠️ CONFLICT: Bullish options but price falling - mixed signals! '
        # REMOVED: 0.7 multiplier
    elif (net_institutional_flow < -8 and price_momentum.get('day_change_pct', 0) > 2):
        combined_signals.append('OPTION_PRICE_CONFLICT')
        combined_reasoning += '⚠️ CONFLICT: Bearish options but price rising - mixed signals! '
        # REMOVED: 0.7 multiplier
    
    return {
        # HUMAN-LIKE ANALYSIS RESULTS
        'score': human_decision['human_score'],  # Human-like score
        'human_bias': human_decision['primary_bias'],  # Human decision
        'human_confidence': human_decision['confidence'],  # Human confidence
        'signals': combined_signals,
        'reasoning': combined_reasoning.strip(),
        'confidence': min(human_decision['confidence'] * 100, 100),
        
        # ZONE ANALYSIS
        'current_zone': zone_analysis.get('current_zone', 'UNKNOWN'),
        'zone_bias': zone_analysis.get('zone_bias', 'NEUTRAL'),
        'nearest_resistance': zone_analysis.get('nearest_resistance'),
        'nearest_support': zone_analysis.get('nearest_support'),
        'resistance_distance_pct': zone_analysis.get('resistance_distance_pct', 999),
        'support_distance_pct': zone_analysis.get('support_distance_pct', 999),
        'risk_reward_ratio': zone_analysis.get('risk_reward_ratio', 1),
        
        # INSTITUTIONAL ACTIVITIES
        'institutional_activities': institutional_activities['all_activities'],
        'hedging_ratio': institutional_activities['hedging_ratio'],
        'speculation_ratio': institutional_activities['speculation_ratio'],
        'dominant_bearish_activity': institutional_activities['bearish_activities'][:3] if institutional_activities['bearish_activities'] else [],
        'dominant_bullish_activity': institutional_activities['bullish_activities'][:3] if institutional_activities['bullish_activities'] else [],
        
        # ENHANCED LEVEL DATA (sorted by proximity to current price)
        'enhanced_resistance_levels': sorted(resistance_levels, key=lambda x: x['level'])[:5],  # Ascending (closest resistance first)
        'enhanced_support_levels': sorted(support_levels, key=lambda x: x['level'], reverse=True)[:5],  # Descending (closest support first)
        
        # LEGACY DATA (for backward compatibility)
        'call_activity': total_call_oi,
        'put_activity': total_put_oi,
        'max_pain': max_pain,
        'pcr': pcr,
        'support_levels': [level['level'] for level in sorted(support_levels, key=lambda x: x['level'], reverse=True)[:3]],  # Sort by price descending (closest first)
        'resistance_levels': [level['level'] for level in sorted(resistance_levels, key=lambda x: x['level'])[:3]],  # Sort by price ascending (closest first)
        'unusual_activity': unusual_activity[:15],
        'summary': f"🧠 PURE ANALYSIS: Zone: {zone_analysis.get('current_zone', 'UNKNOWN')}, Bias: {human_decision['primary_bias']}, Score: {human_decision['human_score']:.1f}, Confidence: {human_decision['confidence']:.0%}",
        'detailed_analysis': detailed_analysis,
        'institutional_bullish_flow': institutional_bullish_flow,
        'institutional_bearish_flow': institutional_bearish_flow,
        'net_institutional_flow': net_institutional_flow,
        'total_call_oi': total_call_oi,
        'total_put_oi': total_put_oi,
        'price_momentum': price_momentum
        # REMOVED: sector_strength (no more hardcoded values)
    }

def perform_option_chain_analysis(symbol: str, nse_data: Dict) -> Optional[Dict]:
    """Perform complete NSE option chain analysis with intelligent flow detection"""
    try:
        records = nse_data.get('records', {})
        option_data = records.get('data', [])
        
        if not option_data:
            logging.warning(f"No option data found for {symbol}")
            return None
        
        # Get current price from NSE data
        current_price = records.get('underlyingValue', 100)
        
        # Get market context
        market_context = get_indian_market_context(symbol)
        
        # Analyze NSE option buildup patterns with REFINED INTELLIGENCE (no hardcoded sector)
        buildup_analysis = analyze_nse_option_buildup(option_data, current_price, symbol)
        
        # Use PCR from buildup analysis (already calculated from NSE data)
        overall_pcr = buildup_analysis['pcr']
        total_calls_oi = buildup_analysis['total_call_oi']
        total_puts_oi = buildup_analysis['total_put_oi']
        
        # Get previous PCR for change calculation
        previous_pcr, pcr_change, pcr_change_percent = get_pcr_change(symbol, overall_pcr)
        
        # Apply Indian market PCR normalization
        normalized_pcr = normalize_indian_pcr(overall_pcr, symbol, market_context)
        
        # Calculate final score
        final_score = buildup_analysis['score']
        confidence = buildup_analysis['confidence']
        reasoning = buildup_analysis['reasoning']
        strength_signals = buildup_analysis['signals'].copy()
        
        # Enhanced Indian Market PCR-based scoring with conflict detection
        pcr_score_result = calculate_indian_pcr_score(normalized_pcr, overall_pcr, symbol, market_context)
        
        # REFINED: Detect conflicts between institutional flow and PCR signals
        net_institutional_flow = buildup_analysis['net_institutional_flow']
        institutional_direction = 1 if net_institutional_flow > 8 else (-1 if net_institutional_flow < -8 else 0)
        pcr_direction = 1 if normalized_pcr < 0.7 else (-1 if normalized_pcr > 1.2 else 0)
        
        conflict_detected = False
        if institutional_direction != 0 and pcr_direction != 0 and institutional_direction != pcr_direction:
            # Conflict detected - reduce PCR impact and add warning
            conflict_detected = True
            pcr_score_result['score'] = pcr_score_result['score'] * 0.5  # Halve PCR impact
            pcr_score_result['reasoning'] += "⚠️ SIGNAL CONFLICT: Institutional flow takes priority. "
            strength_signals.append('SIGNAL_CONFLICT_DETECTED')
        
        final_score += pcr_score_result['score']
        strength_signals.extend(pcr_score_result['signals'])
        reasoning += pcr_score_result['reasoning']
        confidence += pcr_score_result['confidence']
        
        # PCR MOMENTUM SCORING (NEW ENHANCEMENT)
        pcr_momentum_result = calculate_pcr_momentum_score(pcr_change_percent, overall_pcr, symbol)
        final_score += pcr_momentum_result['score']
        strength_signals.extend(pcr_momentum_result['signals'])
        reasoning += pcr_momentum_result['reasoning']
        confidence += pcr_momentum_result['confidence']
        
        # Max pain analysis (informational only - no score manipulation)
        max_pain_distance = abs(buildup_analysis['max_pain'] - current_price) / current_price * 100
        if max_pain_distance > 3:
            if buildup_analysis['max_pain'] > current_price:
                strength_signals.append('MAX_PAIN_BULLISH')
                reasoning += f"Max Pain ({buildup_analysis['max_pain']}) above current price - informational. "
            else:
                strength_signals.append('MAX_PAIN_BEARISH')
                reasoning += f"Max Pain ({buildup_analysis['max_pain']}) below current price - informational. "
        # REMOVED: Hardcoded +10/-10 score adjustments
        
        # Enhanced Indian Market Sentiment Determination
        sentiment = determine_indian_market_sentiment(
            final_score, 
            normalized_pcr, 
            overall_pcr, 
            market_context
        )
        
        # Calculate risk-reward
        target_1 = buildup_analysis['resistance_levels'][0] if final_score > 0 and buildup_analysis['resistance_levels'] else current_price * 1.03
        target_2 = buildup_analysis['resistance_levels'][1] if final_score > 0 and len(buildup_analysis['resistance_levels']) > 1 else current_price * 1.05
        stop_loss = buildup_analysis['support_levels'][0] if final_score > 0 and buildup_analysis['support_levels'] else current_price * 0.97
        
        if final_score < 0:
            target_1 = buildup_analysis['support_levels'][0] if buildup_analysis['support_levels'] else current_price * 0.97
            target_2 = buildup_analysis['support_levels'][1] if len(buildup_analysis['support_levels']) > 1 else current_price * 0.95
            stop_loss = buildup_analysis['resistance_levels'][0] if buildup_analysis['resistance_levels'] else current_price * 1.03
        
        return {
            'symbol': symbol,
            'score': final_score,
            'strength_signals': strength_signals,
            'institutional_sentiment': sentiment,
            'reasoning': reasoning.strip(),
            'confidence': min(confidence, 100),
            'current_price': current_price,
            'overall_pcr': overall_pcr,
            'previous_pcr': previous_pcr,
            'pcr_change': pcr_change,
            'pcr_change_percent': pcr_change_percent,
            'pcr_momentum_score': pcr_momentum_result['score'],
            'max_pain': buildup_analysis['max_pain'],
            'support_levels': buildup_analysis['support_levels'],
            'resistance_levels': buildup_analysis['resistance_levels'],
            'unusual_activity': buildup_analysis['unusual_activity'],
            'net_call_buildup': buildup_analysis['call_activity'],
            'net_put_buildup': buildup_analysis['put_activity'],
            'target_1': target_1,
            'target_2': target_2,
            'stop_loss': stop_loss,
            'risk_reward_ratio': abs((target_1 - current_price) / (current_price - stop_loss)) if stop_loss != current_price else 1.5,
            'institutional_bullish_flow': buildup_analysis['institutional_bullish_flow'],
            'institutional_bearish_flow': buildup_analysis['institutional_bearish_flow'],
            'net_institutional_flow': buildup_analysis['net_institutional_flow'],
            'detailed_analysis': buildup_analysis['detailed_analysis']
        }
        
    except Exception as e:
        logging.error(f"Error analyzing option chain for {symbol}: {e}")
        return None

def store_analysis_results(results: List[Dict]) -> None:
    """Store analysis results in Supabase"""
    if not results:
        logging.warning("No results to store")
        return
    
    try:
        # Prepare data for database
        timestamp = datetime.utcnow().isoformat()
        trading_date = ist_now().strftime('%Y-%m-%d')
        
        db_records = []
        for result in results:
            db_record = {
                'symbol': result['symbol'],
                'analysis_timestamp': timestamp,
                'trading_date': trading_date,
                'score': result['score'],
                'institutional_sentiment': result['institutional_sentiment'],
                'reasoning': result['reasoning'],
                'confidence': result['confidence'],
                'current_price': result['current_price'],
                'overall_pcr': result['overall_pcr'],
                'previous_pcr': result.get('previous_pcr'),
                'pcr_change': result.get('pcr_change'),
                'pcr_change_percent': result.get('pcr_change_percent'),
                'pcr_momentum_score': result.get('pcr_momentum_score'),
                'max_pain': result['max_pain'],
                'support_levels': json.dumps(result['support_levels']),
                'resistance_levels': json.dumps(result['resistance_levels']),
                'unusual_activity': json.dumps(result['unusual_activity']),
                'strength_signals': json.dumps(result['strength_signals']),
                'net_call_buildup': result['net_call_buildup'],
                'net_put_buildup': result['net_put_buildup'],
                'target_1': result['target_1'],
                'target_2': result['target_2'],
                'stop_loss': result['stop_loss'],
                'risk_reward_ratio': result['risk_reward_ratio'],
                'institutional_bullish_flow': result['institutional_bullish_flow'],
                'institutional_bearish_flow': result['institutional_bearish_flow'],
                'net_institutional_flow': result['net_institutional_flow'],
                'detailed_analysis': json.dumps(result['detailed_analysis'])
            }
            db_records.append(db_record)
        
        # Insert into Supabase
        url = f"{SUPABASE_URL}/rest/v1/option_chain_analysis"
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        response = requests.post(url, headers=headers, json=db_records, timeout=30)
        
        if response.status_code >= 300:
            logging.error(f"Supabase insert failed ({response.status_code}): {response.text[:300]}")
            response.raise_for_status()
        
        logging.info(f"✅ Stored {len(db_records)} option analysis results in database")
        
    except Exception as e:
        logging.error(f"Error storing results: {e}")

def main(force_run=False):
    """Main execution function"""
    logging.info("🚀 Starting Option Chain Analysis Collector")
    
    # Environment is now hardcoded - no validation needed
    
    # Check market hours (unless forced)
    if not force_run and not is_market_hours():
        logging.info("⏰ Outside market hours - skipping analysis")
        return
    
    # Fetch FNO symbols from database
    fno_symbols = fetch_fno_symbols()
    if not fno_symbols:
        logging.error("❌ No FNO symbols available - cannot proceed")
        return
    
    results = []
    processed = 0
    errors = 0
    
    logging.info(f"📊 Analyzing {len(fno_symbols)} symbols from database...")
    
    # Process symbols in batches to respect API limits
    batch_size = 5
    for i in range(0, len(fno_symbols), batch_size):
        batch = fno_symbols[i:i + batch_size]
        
        for symbol in batch:
            try:
                logging.info(f"🔍 Analyzing {symbol}... ({processed + 1}/{len(fno_symbols)})")
                
                # Fetch option chain data
                option_chain_data = fetch_option_chain_data(symbol)
                if not option_chain_data:
                    errors += 1
                    continue
                
                # Perform analysis
                analysis = perform_option_chain_analysis(symbol, option_chain_data)
                if analysis and abs(analysis['score']) >= 10:  # Reduced minimum threshold to capture more bearish stocks
                    results.append(analysis)
                    logging.info(f"✅ {symbol}: {analysis['institutional_sentiment']} (Score: {analysis['score']:.1f})")
                else:
                    logging.info(f"⚪ {symbol}: Below threshold or neutral")
                
            except Exception as e:
                logging.error(f"❌ Error analyzing {symbol}: {e}")
                errors += 1
            finally:
                processed += 1
        
        # Respectful delay between batches
        if i + batch_size < len(fno_symbols):
            time.sleep(2)
    
    # Store results
    if results:
        store_analysis_results(results)
    
    # Summary
    success_rate = ((processed - errors) / processed * 100) if processed > 0 else 0
    logging.info(f"🎯 Analysis Complete: {len(results)} qualifying results from {processed} symbols ({errors} errors, {success_rate:.1f}% success rate)")

# ==================== INDIAN MARKET SPECIFIC ENHANCEMENTS ====================

def get_indian_market_context(symbol: str) -> Dict:
    """Get Indian market context for the symbol"""
    stock_classification = get_indian_stock_classification(symbol)
    
    # Check if it's expiry week
    now = datetime.utcnow() + timedelta(hours=5, minutes=30)  # IST
    last_thursday = get_last_thursday_of_month(now)
    expiry_week = abs((now - last_thursday).days) <= 7
    monthly_expiry = abs((now - last_thursday).days) <= 2
    
    # Check if it's results season (typically Jan, Apr, Jul, Oct)
    results_week = now.month in [1, 4, 7, 10] and 10 <= now.day <= 25
    
    return {
        **stock_classification,
        'expiry_week': expiry_week,
        'monthly_expiry': monthly_expiry,
        'results_week': results_week
    }

def get_indian_stock_classification(symbol: str) -> Dict:
    """Classify Indian stocks by various parameters"""
    # Nifty 50 stocks (updated list)
    nifty50_stocks = [
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'KOTAKBANK',
        'SBIN', 'BHARTIARTL', 'ITC', 'ASIANPAINT', 'LT', 'AXISBANK', 'MARUTI', 'SUNPHARMA',
        'ULTRACEMCO', 'TITAN', 'WIPRO', 'NESTLEIND', 'POWERGRID', 'NTPC', 'TECHM', 'HCLTECH',
        'BAJFINANCE', 'ONGC', 'TATASTEEL', 'COALINDIA', 'INDUSINDBK', 'ADANIENT', 'JSWSTEEL',
        'GRASIM', 'HINDALCO', 'BRITANNIA', 'DRREDDY', 'EICHERMOT', 'APOLLOHOSP', 'CIPLA',
        'DIVISLAB', 'BAJAJFINSV', 'HEROMOTOCO', 'TATACONSUM', 'BPCL', 'SBILIFE', 'SHRIRAMFIN',
        'HDFCLIFE', 'TATAMOTORS', 'ADANIPORTS', 'BAJAJ-AUTO', 'LTIM'
    ]
    
    # Bank Nifty stocks
    bank_nifty_stocks = [
        'HDFCBANK', 'ICICIBANK', 'KOTAKBANK', 'SBIN', 'AXISBANK', 'INDUSINDBK',
        'BAJFINANCE', 'BANDHANBNK', 'FEDERALBNK', 'IDFCFIRSTB', 'PNB', 'AUBANK'
    ]
    
    # Comprehensive sector classification for ALL FNO stocks
    sector_map = {
        # Banking & Financial Services
        'HDFCBANK': 'Banking', 'ICICIBANK': 'Banking', 'SBIN': 'Banking', 'KOTAKBANK': 'Banking',
        'AXISBANK': 'Banking', 'INDUSINDBK': 'Banking', 'BANDHANBNK': 'Banking', 'FEDERALBNK': 'Banking',
        'IDFCFIRSTB': 'Banking', 'PNB': 'Banking', 'AUBANK': 'Banking', 'BANKBARODA': 'Banking',
        'BANKINDIA': 'Banking', 'INDIANB': 'Banking', 'UNIONBANK': 'Banking', 'YESBANK': 'Banking',
        'RBLBANK': 'Banking', 'CANBK': 'Banking',
        
        # NBFC & Financial Services
        'BAJFINANCE': 'NBFC', 'BAJAJFINSV': 'NBFC', 'SHRIRAMFIN': 'NBFC', 'CHOLAFIN': 'NBFC',
        'LICHSGFIN': 'NBFC', 'MANAPPURAM': 'NBFC', 'MUTHOOTFIN': 'NBFC', 'PNBHOUSING': 'NBFC',
        'PFC': 'NBFC', 'RECLTD': 'NBFC', 'HUDCO': 'NBFC', 'IRFC': 'NBFC',
        
        # Insurance & Asset Management
        'SBILIFE': 'Insurance', 'HDFCLIFE': 'Insurance', 'ICICIGI': 'Insurance', 'ICICIPRULI': 'Insurance',
        'LICI': 'Insurance', 'HDFCAMC': 'Asset Management', 'MFSL': 'Asset Management', 'NUVAMA': 'Asset Management',
        '360ONE': 'Asset Management',
        
        # Fintech & Financial Technology
        'PAYTM': 'Fintech', 'ANGELONE': 'Fintech', 'BSE': 'Fintech', 'MCX': 'Fintech', 'CDSL': 'Fintech',
        'KFINTECH': 'Fintech', 'CAMS': 'Fintech', 'IIFL': 'Fintech', 'POLICYBZR': 'Fintech',
        'JIOFIN': 'Fintech', 'SBICARD': 'Fintech',
        
        # Information Technology
        'TCS': 'IT', 'INFY': 'IT', 'WIPRO': 'IT', 'HCLTECH': 'IT', 'TECHM': 'IT', 'LTIM': 'IT',
        'COFORGE': 'IT', 'PERSISTENT': 'IT', 'MPHASIS': 'IT', 'OFSS': 'IT', 'CYIENT': 'IT',
        'KPITTECH': 'IT', 'NAUKRI': 'IT',
        
        # Oil & Gas
        'RELIANCE': 'Oil & Gas', 'ONGC': 'Oil & Gas', 'BPCL': 'Oil & Gas', 'IOC': 'Oil & Gas',
        'HINDPETRO': 'Oil & Gas', 'OIL': 'Oil & Gas', 'GAIL': 'Oil & Gas', 'PETRONET': 'Oil & Gas',
        
        # Automobiles & Auto Components
        'MARUTI': 'Auto', 'TATAMOTORS': 'Auto', 'BAJAJ-AUTO': 'Auto', 'HEROMOTOCO': 'Auto', 'EICHERMOT': 'Auto',
        'M&M': 'Auto', 'ASHOKLEY': 'Auto', 'TVSMOTOR': 'Auto', 'MOTHERSON': 'Auto Components',
        'BOSCHLTD': 'Auto Components', 'BHARATFORG': 'Auto Components', 'SONACOMS': 'Auto Components',
        'EXIDEIND': 'Auto Components', 'UNOMINDA': 'Auto Components',
        
        # Pharmaceuticals & Healthcare
        'SUNPHARMA': 'Pharma', 'DRREDDY': 'Pharma', 'CIPLA': 'Pharma', 'DIVISLAB': 'Pharma',
        'LUPIN': 'Pharma', 'BIOCON': 'Pharma', 'ALKEM': 'Pharma', 'AUROPHARMA': 'Pharma',
        'TORNTPHARM': 'Pharma', 'GLENMARK': 'Pharma', 'LAURUSLABS': 'Pharma', 'MANKIND': 'Pharma',
        'ZYDUSLIFE': 'Pharma', 'PPLPHARMA': 'Pharma', 'APOLLOHOSP': 'Healthcare', 'FORTIS': 'Healthcare',
        'MAXHEALTH': 'Healthcare',
        
        # FMCG & Consumer Goods
        'HINDUNILVR': 'FMCG', 'ITC': 'FMCG', 'NESTLEIND': 'FMCG', 'BRITANNIA': 'FMCG', 'TATACONSUM': 'FMCG',
        'DABUR': 'FMCG', 'MARICO': 'FMCG', 'GODREJCP': 'FMCG', 'COLPAL': 'FMCG', 'PATANJALI': 'FMCG',
        'JUBLFOOD': 'FMCG', 'VBL': 'FMCG', 'UNITDSPR': 'FMCG',
        
        # Metals & Mining
        'TATASTEEL': 'Metals', 'JSWSTEEL': 'Metals', 'HINDALCO': 'Metals', 'COALINDIA': 'Metals',
        'JINDALSTEL': 'Metals', 'SAIL': 'Metals', 'VEDL': 'Metals', 'NATIONALUM': 'Metals',
        'HINDZINC': 'Metals', 'NMDC': 'Metals',
        
        # Cement
        'ULTRACEMCO': 'Cement', 'GRASIM': 'Cement', 'SHREECEM': 'Cement', 'AMBUJACEM': 'Cement',
        'DALBHARAT': 'Cement',
        
        # Telecommunications
        'BHARTIARTL': 'Telecom', 'IDEA': 'Telecom', 'INDIGO': 'Telecom', 'INDUSTOWER': 'Telecom',
        
        # Power & Utilities
        'NTPC': 'Power', 'POWERGRID': 'Power', 'TATAPOWER': 'Power', 'TORNTPOWER': 'Power',
        'NHPC': 'Power', 'IREDA': 'Power', 'ADANIGREEN': 'Power', 'INOXWIND': 'Power',
        'JSWENERGY': 'Power', 'ADANIENSOL': 'Power', 'SOLARINDS': 'Power',
        
        # Infrastructure & Construction
        'LT': 'Infrastructure', 'ADANIPORTS': 'Infrastructure', 'NCC': 'Infrastructure', 'NBCC': 'Infrastructure',
        'CONCOR': 'Infrastructure', 'GMRAIRPORT': 'Infrastructure', 'RVNL': 'Infrastructure', 'IRCTC': 'Infrastructure',
        'HAL': 'Infrastructure', 'BEL': 'Infrastructure', 'BDL': 'Infrastructure', 'MAZDOCK': 'Infrastructure',
        
        # Real Estate
        'DLF': 'Real Estate', 'GODREJPROP': 'Real Estate', 'OBEROIRLTY': 'Real Estate', 'PRESTIGE': 'Real Estate',
        'LODHA': 'Real Estate', 'PHOENIXLTD': 'Real Estate', 'INDHOTEL': 'Real Estate',
        
        # Retail & E-commerce
        'DMART': 'Retail', 'TRENT': 'Retail', 'NYKAA': 'Retail', 'KALYANKJIL': 'Retail',
        
        # Chemicals & Petrochemicals
        'UPL': 'Chemicals', 'SRF': 'Chemicals', 'PIDILITIND': 'Chemicals',
        
        # Capital Goods & Engineering
        'ABB': 'Capital Goods', 'SIEMENS': 'Capital Goods', 'BHEL': 'Capital Goods', 'CUMMINSIND': 'Capital Goods',
        'VOLTAS': 'Capital Goods', 'HAVELLS': 'Capital Goods', 'CROMPTON': 'Capital Goods', 'KEI': 'Capital Goods',
        'POLYCAB': 'Capital Goods', 'APLAPOLLO': 'Capital Goods', 'ASTRAL': 'Capital Goods', 'DIXON': 'Capital Goods',
        'KAYNES': 'Capital Goods', 'AMBER': 'Capital Goods', 'BLUESTARCO': 'Capital Goods',
        
        # Specialty & Others
        'ASIANPAINT': 'Paints', 'TITAN': 'Jewellery', 'PAGEIND': 'Paper', 'SUPREMEIND': 'Plastics',
        'PIIND': 'Chemicals', 'CGPOWER': 'Power Equipment', 'HFCL': 'Telecom Equipment',
        'IEX': 'Power Trading', 'IGL': 'Gas Distribution', 'DELHIVERY': 'Logistics',
        'SUZLON': 'Renewable Energy', 'SYNGENE': 'Contract Research', 'ETERNAL': 'Materials',
        'TIINDIA': 'Cycles', 'TITAGARH': 'Engineering', 'TATATECH': 'IT Services', 'TATAELXSI': 'IT Services',
        'ABCAPITAL': 'NBFC', 'LTF': 'NBFC', 'PGEL': 'Power'
    }
    
    # Volatility classification based on historical Indian market data
    high_volatility_stocks = [
        'TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'COALINDIA', 'ONGC', 'BPCL', 'ADANIENT',
        'TATAMOTORS', 'BAJFINANCE', 'INDUSINDBK', 'AXISBANK', 'ADANIPORTS'
    ]
    
    low_volatility_stocks = [
        'HINDUNILVR', 'NESTLEIND', 'BRITANNIA', 'ITC', 'POWERGRID', 'NTPC',
        'SBILIFE', 'HDFCLIFE', 'TCS', 'INFY', 'WIPRO'
    ]
    
    # FII holding classification (based on typical FII preferences)
    high_fii_stocks = [
        'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'HINDUNILVR', 'ICICIBANK', 'KOTAKBANK',
        'ASIANPAINT', 'MARUTI', 'SUNPHARMA', 'ULTRACEMCO', 'TITAN', 'NESTLEIND'
    ]
    
    # Retail interest classification (based on trading volumes and retail participation)
    high_retail_stocks = [
        'BAJFINANCE', 'TATAMOTORS', 'AXISBANK', 'INDUSINDBK', 'TATASTEEL', 'JSWSTEEL',
        'ADANIENT', 'ONGC', 'COALINDIA', 'ADANIPORTS'
    ]
    
    return {
        'sector': sector_map.get(symbol, 'Others'),
        'market_cap': 'LARGE_CAP' if symbol in nifty50_stocks else 'MID_CAP',
        'is_nifty50': symbol in nifty50_stocks,
        'is_bank_nifty': symbol in bank_nifty_stocks,
        'volatility_tier': 'HIGH' if symbol in high_volatility_stocks else 
                          'LOW' if symbol in low_volatility_stocks else 'MEDIUM',
        'liquidity_tier': 'HIGH' if symbol in nifty50_stocks else 'MEDIUM',
        'fii_holding': 'HIGH' if symbol in high_fii_stocks else 'MEDIUM',
        'retail_interest': 'HIGH' if symbol in high_retail_stocks else 'MEDIUM'
    }

def normalize_indian_pcr(raw_pcr: float, symbol: str, context: Dict) -> float:
    """Normalize PCR for Indian market characteristics"""
    adjusted_pcr = raw_pcr
    
    # Indian retail traders are more put-heavy, especially in volatile stocks
    if context['retail_interest'] == 'HIGH' and context['volatility_tier'] == 'HIGH':
        adjusted_pcr = raw_pcr * 0.85  # Reduce PCR by 15% for high retail, high volatility stocks
    
    # Banking stocks typically have different PCR patterns due to institutional preference
    if context['is_bank_nifty']:
        adjusted_pcr = raw_pcr * 0.9  # Banks typically have lower PCR baseline
    
    # During expiry week, PCR patterns change significantly
    if context['expiry_week']:
        adjusted_pcr = raw_pcr * 1.1  # PCR tends to be higher during expiry due to hedging
    
    # Results week adjustments - more hedging activity
    if context['results_week']:
        adjusted_pcr = raw_pcr * 1.05  # Slight increase in hedging during results
    
    # FMCG stocks typically have lower PCR due to defensive nature
    if context['sector'] == 'FMCG':
        adjusted_pcr = raw_pcr * 0.95
    
    return adjusted_pcr

def get_pcr_change(symbol: str, current_pcr: float) -> tuple:
    """Get PCR change from previous analysis"""
    try:
        # Query previous PCR from database (last 2 hours)
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Get the most recent PCR value for this symbol
        url = f'{SUPABASE_URL}/rest/v1/option_chain_analysis'
        params = {
            'symbol': f'eq.{symbol}',
            'trading_date': f'eq.{datetime.now().strftime("%Y-%m-%d")}',
            'select': 'overall_pcr,analysis_timestamp',
            'order': 'analysis_timestamp.desc',
            'limit': '1'
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                previous_pcr = float(data[0]['overall_pcr'])
                pcr_change = current_pcr - previous_pcr
                pcr_change_percent = (pcr_change / previous_pcr * 100) if previous_pcr > 0 else 0
                
                logging.info(f"📊 {symbol}: PCR Change: {previous_pcr:.3f} → {current_pcr:.3f} ({pcr_change_percent:+.1f}%)")
                return previous_pcr, pcr_change, pcr_change_percent
        
        # No previous data found
        return current_pcr, 0.0, 0.0
        
    except Exception as e:
        logging.warning(f"⚠️ Could not fetch previous PCR for {symbol}: {e}")
        return current_pcr, 0.0, 0.0

def calculate_pcr_momentum_score(pcr_change_percent: float, current_pcr: float, symbol: str) -> Dict:
    """Calculate PCR momentum score based on rate of change"""
    score = 0
    signals = []
    reasoning = ''
    confidence = 0
    
    # PCR STORM DETECTION (>15% change)
    if abs(pcr_change_percent) > 15:
        if pcr_change_percent < -15:  # PCR dropping fast (bullish storm)
            score += 50
            signals.append('PCR_STORM_BULLISH')
            reasoning += f"PCR Storm: {pcr_change_percent:+.1f}% drop indicates massive bullish shift. "
            confidence += 30
        elif pcr_change_percent > 15:  # PCR rising fast (bearish storm)
            score -= 50
            signals.append('PCR_STORM_BEARISH')
            reasoning += f"PCR Storm: {pcr_change_percent:+.1f}% rise indicates massive bearish shift. "
            confidence += 30
    
    # STRONG PCR MOMENTUM (10-15% change)
    elif abs(pcr_change_percent) > 10:
        if pcr_change_percent < -10:  # PCR dropping (bullish momentum)
            score += 30
            signals.append('STRONG_PCR_MOMENTUM_BULLISH')
            reasoning += f"Strong PCR momentum: {pcr_change_percent:+.1f}% drop shows bullish acceleration. "
            confidence += 20
        elif pcr_change_percent > 10:  # PCR rising (bearish momentum)
            score -= 30
            signals.append('STRONG_PCR_MOMENTUM_BEARISH')
            reasoning += f"Strong PCR momentum: {pcr_change_percent:+.1f}% rise shows bearish acceleration. "
            confidence += 20
    
    # MODERATE PCR MOMENTUM (5-10% change)
    elif abs(pcr_change_percent) > 5:
        if pcr_change_percent < -5:  # PCR dropping (moderate bullish)
            score += 15
            signals.append('PCR_MOMENTUM_BULLISH')
            reasoning += f"PCR momentum: {pcr_change_percent:+.1f}% drop supports bullish trend. "
            confidence += 10
        elif pcr_change_percent > 5:  # PCR rising (moderate bearish)
            score -= 15
            signals.append('PCR_MOMENTUM_BEARISH')
            reasoning += f"PCR momentum: {pcr_change_percent:+.1f}% rise supports bearish trend. "
            confidence += 10
    
    # EXTREME PCR LEVELS WITH MOMENTUM
    if current_pcr < 0.3 and pcr_change_percent < -5:
        score += 20  # Very low PCR getting lower = super bullish
        signals.append('EXTREME_LOW_PCR_MOMENTUM')
        reasoning += "Extreme low PCR with continued momentum - very bullish. "
        confidence += 15
    
    if current_pcr > 2.0 and pcr_change_percent > 5:
        score -= 20  # Very high PCR getting higher = super bearish
        signals.append('EXTREME_HIGH_PCR_MOMENTUM')
        reasoning += "Extreme high PCR with continued momentum - very bearish. "
        confidence += 15
    
    return {
        'score': score,
        'signals': signals,
        'reasoning': reasoning,
        'confidence': confidence
    }

def calculate_indian_pcr_score(normalized_pcr: float, raw_pcr: float, symbol: str, context: Dict) -> Dict:
    """Calculate PCR score with Indian market enhancements"""
    score = 0
    signals = []
    reasoning = ''
    confidence = 0
    
    # Enhanced PCR thresholds for Indian market
    very_low_threshold = 0.5 if context['is_bank_nifty'] else 0.6
    low_threshold = 0.7 if context['is_bank_nifty'] else 0.8
    high_threshold = 1.3 if context['volatility_tier'] == 'HIGH' else 1.2
    very_high_threshold = 1.6 if context['volatility_tier'] == 'HIGH' else 1.5
    
    if normalized_pcr < very_low_threshold:
        score += 15 if context['is_nifty50'] else 12  # REDUCED: Lower PCR impact to prevent false positives
        signals.append('VERY_LOW_PCR_BULLISH')
        reasoning += f"Very low PCR ({raw_pcr:.3f}, adj: {normalized_pcr:.3f}) provides bullish support. "
        confidence += 15  # REDUCED: Lower confidence from PCR alone
        
        if context['expiry_week']:
            score += 5  # Extra bullish during expiry week with low PCR
            reasoning += 'Expiry week amplifies bullish signal. '
    elif normalized_pcr < low_threshold:
        score += 10 if context['is_nifty50'] else 8  # REDUCED: Lower PCR impact
        signals.append('LOW_PCR_BULLISH')
        reasoning += f"Low PCR ({raw_pcr:.3f}, adj: {normalized_pcr:.3f}) provides bullish support. "
        confidence += 10  # REDUCED: Lower confidence from PCR
    elif normalized_pcr > very_high_threshold:
        score -= 15 if context['volatility_tier'] == 'HIGH' else 12  # REDUCED: Lower PCR bearish impact
        signals.append('VERY_HIGH_PCR_BEARISH')
        reasoning += f"Very high PCR ({raw_pcr:.3f}, adj: {normalized_pcr:.3f}) creates bearish pressure. "
        confidence += 15  # REDUCED: Lower confidence from PCR
        
        if context['retail_interest'] == 'HIGH':
            score -= 5  # Extra bearish for high retail interest stocks
            reasoning += 'High retail interest amplifies bearish signal. '
    elif normalized_pcr > high_threshold:
        score -= 10 if context['volatility_tier'] == 'HIGH' else 8  # REDUCED: Lower PCR bearish impact
        signals.append('HIGH_PCR_BEARISH')
        reasoning += f"High PCR ({raw_pcr:.3f}, adj: {normalized_pcr:.3f}) creates bearish pressure. "
        confidence += 10  # REDUCED: Lower confidence from PCR
    
    # REMOVED: All hardcoded sector-specific adjustments - pure signal analysis only
    
    return {
        'score': score,
        'signals': signals,
        'reasoning': reasoning,
        'confidence': confidence
    }

def determine_indian_market_sentiment(final_score: float, normalized_pcr: float, raw_pcr: float, context: Dict) -> str:
    """Determine sentiment with Indian market context"""
    
    # During results week, be more conservative
    if context['results_week'] and abs(final_score) < 30:
        return 'NEUTRAL'
    
    # High volatility stocks need higher conviction
    score_threshold = 1.2 if context['volatility_tier'] == 'HIGH' else 1.0
    adjusted_score = final_score * score_threshold
    
    # PCR override logic with Indian market context
    if raw_pcr > 1.8 and adjusted_score > 0:
        # Very high PCR overrides bullish signals, but consider market cap
        return 'NEUTRAL' if context['is_nifty50'] and adjusted_score > 60 else 'BEARISH'
    
    if raw_pcr > 1.4 and adjusted_score > 25:
        # High PCR reduces bullish sentiment
        return 'NEUTRAL' if context['market_cap'] == 'LARGE_CAP' else 'BEARISH'
    
    # Enhanced thresholds for Indian market (more sensitive to bearish signals)
    if adjusted_score >= 35:
        return 'STRONGLY_BULLISH'
    elif adjusted_score >= 12:
        return 'BULLISH'
    elif adjusted_score <= -35:
        return 'STRONGLY_BEARISH'
    elif adjusted_score <= -10:  # More sensitive bearish threshold
        return 'BEARISH'
    else:
        return 'NEUTRAL'

def get_last_thursday_of_month(date: datetime) -> datetime:
    """Get the last Thursday of the month for expiry calculation"""
    year = date.year
    month = date.month
    
    # Get the last day of the month
    if month == 12:
        last_day = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(year, month + 1, 1) - timedelta(days=1)
    
    # Find the last Thursday
    days_back = (last_day.weekday() - 3) % 7
    last_thursday = last_day - timedelta(days=days_back)
    
    return last_thursday

if __name__ == "__main__":
    try:
        import sys
        # Force run if --force flag is provided
        if '--force' in sys.argv:
            logging.info("🔧 FORCE MODE: Running algorithm outside market hours for testing")
            main(force_run=True)
        else:
            main()
    except KeyboardInterrupt:
        logging.info("🛑 Analysis interrupted by user")
        sys.exit(0)
    except Exception as e:
        logging.exception(f"💥 Fatal error: {e}")
        sys.exit(1)
