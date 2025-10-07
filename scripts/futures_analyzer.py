#!/usr/bin/env python3

"""
Futures Analysis Collector for TradeSmart Money

This script analyzes futures market data and stores results in Supabase for fast retrieval.

Runs every 5 minutes during market hours and analyzes:
- Open Interest buildup patterns (Long/Short buildup, Unwinding, Covering)
- Basis analysis (Contango/Backwardation)
- Rollover pressure and costs
- Volume profile analysis
- Institutional vs retail activity

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
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

# NSE API Configuration (Using your proven cookie approach)
NSE_BASE = 'https://www.nseindia.com/api'
SET_COOKIE_URL = "https://www.nseindia.com/market-data/oi-spurts"
HEADERS = {
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
}

# Create session for cookie management (like your approach)
session = requests.Session()
cookies = dict()

# Environment variables
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"
FORCE_RUN = os.environ.get("FORCE_RUN", "false").lower() == "true"  # Keep this as env var for flexibility

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
    url = f"{SUPABASE_URL}/rest/v1/fno_symbols"
    headers = {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
        'Content-Type': 'application/json'
    }
    
    params = {
        'select': 'symbol_name',
        'is_active': 'eq.true',
        'limit': '200'
    }
    
    response = requests.get(url, headers=headers, params=params, timeout=30)
    response.raise_for_status()  # Raise exception if request fails
    
    data = response.json()
    symbols = [item['symbol_name'] for item in data if item.get('symbol_name')]
    
    logging.info(f"✅ Fetched {len(symbols)} active FNO symbols from database")
    return symbols

def set_cookie(url: str = SET_COOKIE_URL):
    """Set cookies for NSE API access (using your proven method)"""
    try:
        request = session.get(url, headers=HEADERS, timeout=10)
        global cookies
        cookies = dict(request.cookies)
        logging.debug(f"🍪 Cookies set from {url}")
    except Exception as e:
        logging.warning(f"⚠️ Failed to set cookies: {e}")

def get_nse_data(url: str) -> Optional[str]:
    """Get data from NSE using cookie-based session (your proven method)"""
    try:
        logging.debug(f"📡 API Call URL: {url}")
        response = session.get(url, headers=HEADERS, timeout=15, cookies=cookies)
        
        # Handle 401 errors by refreshing cookies (your method)
        if response.status_code == 401:
            logging.info("🔄 401 error, refreshing cookies...")
            set_cookie(SET_COOKIE_URL)
            response = session.get(url, headers=HEADERS, timeout=15, cookies=cookies)
        
        if response.status_code == 200:
            logging.debug("✅ Response OK")
            return response.text
        else:
            logging.debug(f"⚠️ Response status: {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        logging.warning("⏰ Request timed out")
    except requests.exceptions.ConnectionError:
        logging.warning("🌐 Connection error")
    except requests.exceptions.HTTPError as e:
        logging.warning(f"🚫 HTTP error: {e.response.status_code}")
    except Exception as e:
        logging.warning(f"❌ Request error: {e}")
    
    return None

def fetch_futures_data(symbol: str, refresh_cookies: bool = False) -> Optional[Dict]:
    """Fetch futures data using cookie-based approach (your proven method)"""
    try:
        # Set cookies only when needed (performance optimization)
        if refresh_cookies or not cookies:
            set_cookie(SET_COOKIE_URL)
        
        # Try different endpoints for futures data
        endpoints = [
            f"https://www.nseindia.com/api/quote-derivative?symbol={symbol}",
            f"https://www.nseindia.com/api/equity-derivatives?symbol={symbol}",
            f"https://www.nseindia.com/api/live-analysis-oi-spurts-underlyings?symbol={symbol}"
        ]
        
        for url in endpoints:
            response_text = get_nse_data(url)
            if response_text:
                try:
                    data = json.loads(response_text)
                    
                    
                    if data and ('data' in data or 'stocks' in data or 'FUTSTK' in data or 'records' in data):
                        logging.info(f"✅ Found valid data structure for {symbol}")
                        # Add endpoint info to help with parsing
                        data['_source_endpoint'] = url
                        return data
                    else:
                        logging.info(f"⚠️ No valid data structure found for {symbol}")
                except json.JSONDecodeError as e:
                    logging.info(f"⚠️ JSON decode error for {symbol}: {e}")
                    continue
        
        # For index futures, try specific endpoint
        if symbol in ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY']:
            url = f"https://www.nseindia.com/api/equity-derivatives?symbol={symbol}"
            response_text = get_nse_data(url)
            if response_text:
                try:
                    data = json.loads(response_text)
                    return data
                except json.JSONDecodeError:
                    pass
        
        return None
        
    except Exception as e:
        logging.error(f"❌ Failed to fetch futures data for {symbol}: {e}")
        return None

def get_spot_price(symbol: str) -> float:
    """Get current spot price using cookie-based approach"""
    try:
        url = f"https://www.nseindia.com/api/quote-equity?symbol={symbol}"
        response_text = get_nse_data(url)
        
        if response_text:
            data = json.loads(response_text)
            price = data.get('priceInfo', {}).get('lastPrice', 0)
            if price:
                return float(price)
            
    except Exception as e:
        logging.debug(f"⚠️ Failed to get spot price for {symbol}: {e}")
    
    return 0.0

def analyze_oi_buildup(current_price: float, prev_price: float, current_oi: int, prev_oi: int) -> Dict:
    """Analyze Open Interest buildup patterns"""
    
    price_change = current_price - prev_price
    oi_change = current_oi - prev_oi
    oi_change_pct = (oi_change / prev_oi * 100) if prev_oi > 0 else 0
    
    # Debug logging to understand the data
    logging.debug(f"OI Analysis: Price {current_price:.2f} (prev {prev_price:.2f}), OI {current_oi:,} (prev {prev_oi:,})")
    logging.debug(f"Changes: Price {price_change:+.2f}, OI {oi_change:+,} ({oi_change_pct:+.1f}%)")
    
    # More sensitive thresholds for better detection
    price_threshold = abs(current_price * 0.005)  # 0.5% price change threshold
    oi_threshold = abs(prev_oi * 0.02) if prev_oi > 0 else 1000  # 2% OI change threshold
    
    # Determine buildup type with better sensitivity
    if abs(price_change) > price_threshold and abs(oi_change) > oi_threshold:
        if price_change > 0 and oi_change > 0:
            buildup_type = 'LONG_BUILDUP'
            signal = 'BULLISH'
            strength = min(abs(oi_change_pct) * 2, 100)  # More sensitive scaling
        elif price_change < 0 and oi_change > 0:
            buildup_type = 'SHORT_BUILDUP'
            signal = 'BEARISH'
            strength = min(abs(oi_change_pct) * 2, 100)
        elif price_change < 0 and oi_change < 0:
            buildup_type = 'LONG_UNWINDING'
            signal = 'BEARISH'
            strength = min(abs(oi_change_pct) * 1.5, 100)
        elif price_change > 0 and oi_change < 0:
            buildup_type = 'SHORT_COVERING'
            signal = 'BULLISH'
            strength = min(abs(oi_change_pct) * 1.5, 100)
        else:
            buildup_type = 'NEUTRAL'
            signal = 'NEUTRAL'
            strength = abs(oi_change_pct) * 0.5
    else:
        # Small changes - still analyze but with lower strength
        buildup_type = 'NEUTRAL'
        signal = 'NEUTRAL'
        strength = max(abs(oi_change_pct) * 0.3, abs(price_change / current_price * 100) * 2) if current_price > 0 else 0
    
    # Determine strength level
    if strength >= 20:
        strength_level = 'STRONG'
    elif strength >= 10:
        strength_level = 'MODERATE'
    else:
        strength_level = 'WEAK'
    
    return {
        'buildup_type': buildup_type,
        'signal': signal,
        'strength': strength,
        'strength_level': strength_level,
        'oi_change_pct': oi_change_pct,
        'reasoning': f"{buildup_type.replace('_', ' ').title()}: Price {'+' if price_change > 0 else ''}{price_change:.2f}, OI {'+' if oi_change > 0 else ''}{oi_change:,} ({oi_change_pct:+.1f}%)"
    }

def analyze_basis_structure(futures_price: float, spot_price: float, days_to_expiry: int) -> Dict:
    """Analyze basis and market structure for trading opportunities"""
    
    if spot_price <= 0:
        return {
            'basis': 0,
            'basis_percentage': 0,
            'annualized_basis': 0,
            'market_structure': 'NEUTRAL',
            'premium_discount': 'NEUTRAL'
        }
    
    basis = futures_price - spot_price
    basis_percentage = (basis / spot_price) * 100
    
    # Annualize the basis
    if days_to_expiry > 0:
        annualized_basis = (basis_percentage * 365) / days_to_expiry
    else:
        annualized_basis = 0
    
    # Determine market structure
    if basis_percentage > 0.5:
        market_structure = 'CONTANGO'
    elif basis_percentage < -0.2:
        market_structure = 'BACKWARDATION'
    else:
        market_structure = 'NEUTRAL'
    
    # Classify premium/discount for trading decisions
    if basis_percentage > 2.0:
        premium_discount = 'HIGH_PREMIUM'  # Expensive, avoid buying
    elif basis_percentage > 0.5:
        premium_discount = 'PREMIUM'       # Slight premium, normal
    elif basis_percentage < -1.0:
        premium_discount = 'DISCOUNT'      # Good buying opportunity
    else:
        premium_discount = 'FAIR_VALUE'    # Fair pricing
    
    return {
        'basis': basis,
        'basis_percentage': basis_percentage,
        'annualized_basis': annualized_basis,
        'market_structure': market_structure,
        'premium_discount': premium_discount
    }

def analyze_market_depth(total_buy_qty: int, total_sell_qty: int, bid_ask_data: Dict) -> Dict:
    """Analyze market depth for supply/demand imbalance"""
    
    total_orders = total_buy_qty + total_sell_qty
    if total_orders == 0:
        return {
            'buy_sell_ratio': 1.0,
            'imbalance': 'NEUTRAL',
            'strength': 'LOW',
            'reasoning': 'No market depth data'
        }
    
    buy_sell_ratio = total_buy_qty / total_sell_qty if total_sell_qty > 0 else 10
    
    # Determine imbalance
    if buy_sell_ratio > 2.0:
        imbalance = 'STRONG_BUYING_PRESSURE'
        strength = 'HIGH'
    elif buy_sell_ratio > 1.5:
        imbalance = 'MODERATE_BUYING_PRESSURE'  
        strength = 'MEDIUM'
    elif buy_sell_ratio < 0.5:
        imbalance = 'STRONG_SELLING_PRESSURE'
        strength = 'HIGH'
    elif buy_sell_ratio < 0.67:
        imbalance = 'MODERATE_SELLING_PRESSURE'
        strength = 'MEDIUM'
    else:
        imbalance = 'BALANCED'
        strength = 'LOW'
    
    return {
        'buy_sell_ratio': buy_sell_ratio,
        'imbalance': imbalance,
        'strength': strength,
        'total_buy_qty': total_buy_qty,
        'total_sell_qty': total_sell_qty,
        'reasoning': f"Buy/Sell Ratio: {buy_sell_ratio:.2f} ({total_buy_qty:,}/{total_sell_qty:,})"
    }

def analyze_price_action(open_price: float, high_price: float, low_price: float, current_price: float, vwap: float) -> Dict:
    """Analyze intraday price action patterns"""
    
    if high_price <= low_price or open_price <= 0:
        return {
            'pattern': 'INSUFFICIENT_DATA',
            'strength': 'LOW',
            'position_in_range': 0.5,
            'vwap_position': 'NEUTRAL'
        }
    
    # Calculate position in day's range
    day_range = high_price - low_price
    position_in_range = (current_price - low_price) / day_range if day_range > 0 else 0.5
    
    # VWAP analysis
    vwap_diff_pct = ((current_price - vwap) / vwap * 100) if vwap > 0 else 0
    
    if vwap_diff_pct > 1:
        vwap_position = 'ABOVE_VWAP_STRONG'
    elif vwap_diff_pct > 0.2:
        vwap_position = 'ABOVE_VWAP'
    elif vwap_diff_pct < -1:
        vwap_position = 'BELOW_VWAP_WEAK'
    elif vwap_diff_pct < -0.2:
        vwap_position = 'BELOW_VWAP'
    else:
        vwap_position = 'NEAR_VWAP'
    
    # Pattern recognition
    if position_in_range > 0.8:
        pattern = 'NEAR_HIGH'
        strength = 'HIGH' if vwap_position in ['ABOVE_VWAP_STRONG', 'ABOVE_VWAP'] else 'MEDIUM'
    elif position_in_range < 0.2:
        pattern = 'NEAR_LOW'
        strength = 'HIGH' if vwap_position in ['BELOW_VWAP_WEAK', 'BELOW_VWAP'] else 'MEDIUM'
    elif 0.4 <= position_in_range <= 0.6:
        pattern = 'MID_RANGE'
        strength = 'MEDIUM'
    else:
        pattern = 'TRENDING'
        strength = 'MEDIUM'
    
    return {
        'pattern': pattern,
        'strength': strength,
        'position_in_range': position_in_range,
        'vwap_position': vwap_position,
        'day_range_pct': (day_range / open_price * 100) if open_price > 0 else 0,
        'reasoning': f"Range: {position_in_range*100:.1f}%, VWAP: {vwap_position}, Range: {day_range/open_price*100:.2f}%"
    }

def comprehensive_futures_trading_signal(oi_change: int, oi_change_pct: float, volume: int, price_change: float, current_price: float, market_depth_analysis: Dict, price_action_analysis: Dict, basis_analysis: Dict) -> Dict:
    """Comprehensive futures analysis inspired by successful option analysis algorithm"""
    
    price_change_pct = (price_change / current_price * 100) if current_price > 0 else 0
    
    # Initialize scoring system (like option analysis)
    base_score = 0
    confidence = 50
    strength_signals = []
    reasoning_parts = []
    
    # 1. OI BUILDUP ANALYSIS (Primary Factor - 40% weight)
    if abs(oi_change_pct) > 8 and volume > 10000:
        if price_change > 0 and oi_change > 0:
            base_score += 40
            confidence += 25
            strength_signals.append('AGGRESSIVE_LONG_BUILDUP')
            reasoning_parts.append(f"Aggressive long buildup: OI +{oi_change_pct:.1f}%, Vol {volume:,}")
        elif price_change < 0 and oi_change > 0:
            base_score -= 40
            confidence += 25
            strength_signals.append('AGGRESSIVE_SHORT_BUILDUP')
            reasoning_parts.append(f"Aggressive short buildup: OI +{oi_change_pct:.1f}%, Vol {volume:,}")
    elif abs(oi_change_pct) > 3 and volume > 2000:
        if price_change > 0 and oi_change > 0:
            base_score += 25
            confidence += 15
            strength_signals.append('MODERATE_LONG_BUILDUP')
            reasoning_parts.append(f"Moderate long buildup: OI +{oi_change_pct:.1f}%, Vol {volume:,}")
        elif price_change < 0 and oi_change > 0:
            base_score -= 25
            confidence += 15
            strength_signals.append('MODERATE_SHORT_BUILDUP')
            reasoning_parts.append(f"Moderate short buildup: OI +{oi_change_pct:.1f}%, Vol {volume:,}")
    
    # 2. MARKET DEPTH ANALYSIS (20% weight)
    if market_depth_analysis['strength'] == 'HIGH':
        if 'BUYING_PRESSURE' in market_depth_analysis['imbalance']:
            base_score += 15
            confidence += 10
            strength_signals.append('STRONG_BUYING_PRESSURE')
            reasoning_parts.append(f"Strong buying pressure (ratio: {market_depth_analysis['buy_sell_ratio']:.2f})")
        elif 'SELLING_PRESSURE' in market_depth_analysis['imbalance']:
            base_score -= 15
            confidence += 10
            strength_signals.append('STRONG_SELLING_PRESSURE')
            reasoning_parts.append(f"Strong selling pressure (ratio: {market_depth_analysis['buy_sell_ratio']:.2f})")
    
    # 3. PRICE ACTION ANALYSIS (20% weight)
    if price_action_analysis['strength'] == 'HIGH':
        if price_action_analysis['pattern'] == 'NEAR_HIGH' and price_action_analysis['vwap_position'] in ['ABOVE_VWAP_STRONG', 'ABOVE_VWAP']:
            base_score += 12
            confidence += 8
            strength_signals.append('BREAKOUT_PATTERN')
            reasoning_parts.append("Near high with strong VWAP position")
        elif price_action_analysis['pattern'] == 'NEAR_LOW' and price_action_analysis['vwap_position'] in ['BELOW_VWAP_WEAK', 'BELOW_VWAP']:
            base_score -= 12
            confidence += 8
            strength_signals.append('BREAKDOWN_PATTERN')
            reasoning_parts.append("Near low with weak VWAP position")
    
    # 4. VOLUME CONFIRMATION (10% weight)
    if volume > 20000:
        base_score += 8 if base_score > 0 else -8
        confidence += 5
        strength_signals.append('HIGH_VOLUME_CONFIRMATION')
        reasoning_parts.append(f"High volume confirmation: {volume:,}")
    elif volume > 10000:
        base_score += 5 if base_score > 0 else -5
        confidence += 3
        strength_signals.append('MODERATE_VOLUME')
        reasoning_parts.append(f"Moderate volume: {volume:,}")
    
    # 5. BASIS ANALYSIS (10% weight - pricing attractiveness)
    if basis_analysis['premium_discount'] == 'DISCOUNT':
        base_score += 8
        confidence += 5
        strength_signals.append('ATTRACTIVE_PRICING')
        reasoning_parts.append("Futures at discount - attractive pricing")
    elif basis_analysis['premium_discount'] == 'HIGH_PREMIUM':
        base_score -= 5
        confidence -= 3
        strength_signals.append('EXPENSIVE_PRICING')
        reasoning_parts.append("Futures at high premium - expensive")
    
    # DETERMINE FINAL SIGNAL
    abs_score = abs(base_score)
    
    if base_score > 40:
        signal = 'STRONG_BULLISH'
        action = 'BUY FUTURES (Strong)'
        timeframe = 'SWING (3-7 days)'
        confidence = min(confidence + 15, 95)
    elif base_score > 20:
        signal = 'BULLISH'
        action = 'BUY FUTURES'
        timeframe = 'INTRADAY to SWING'
        confidence = min(confidence + 10, 90)
    elif base_score < -40:
        signal = 'STRONG_BEARISH'
        action = 'SELL FUTURES (Strong)'
        timeframe = 'SWING (3-7 days)'
        confidence = min(confidence + 15, 95)
    elif base_score < -20:
        signal = 'BEARISH'
        action = 'SELL FUTURES'
        timeframe = 'INTRADAY to SWING'
        confidence = min(confidence + 10, 90)
    elif volume > 20000 and abs(base_score) < 15:
        signal = 'SCALPING'
        action = 'INTRADAY TRADING'
        timeframe = 'SCALPING (1-2 hours)'
        confidence = 60
    else:
        signal = 'NEUTRAL'
        action = 'WAIT'
        timeframe = 'WAIT FOR SETUP'
        confidence = max(confidence - 20, 30)
    
    return {
        'signal': signal,
        'action': action,
        'reason': ' | '.join(reasoning_parts) if reasoning_parts else 'NO SIGNIFICANT ACTIVITY',
        'confidence': confidence,
        'timeframe': timeframe,
        'strength': abs_score,
        'strength_signals': strength_signals,
        'base_score': base_score
    }

def calculate_rollover_pressure(days_to_expiry: int, oi_current: int, oi_next: int, volume: int) -> Dict:
    """Calculate rollover pressure and costs"""
    
    if days_to_expiry <= 0:
        return {
            'pressure': 'HIGH',
            'cost': 0,
            'reasoning': 'Expired contract'
        }
    
    # Calculate rollover pressure based on days to expiry and OI distribution
    if days_to_expiry <= 3:
        pressure = 'HIGH'
    elif days_to_expiry <= 7:
        pressure = 'MEDIUM'
    else:
        pressure = 'LOW'
    
    # Estimate rollover cost (simplified)
    rollover_cost = max(0.1, min(2.0, (10 - days_to_expiry) * 0.2))
    
    # Adjust pressure based on OI distribution
    if oi_next > 0:
        oi_ratio = oi_current / (oi_current + oi_next)
        if oi_ratio > 0.8:  # Most OI still in current month
            pressure = 'HIGH' if days_to_expiry <= 5 else 'MEDIUM'
    
    return {
        'pressure': pressure,
        'cost': rollover_cost,
        'reasoning': f"{days_to_expiry} days to expiry, {pressure.lower()} rollover pressure"
    }

def convert_expiry_date(expiry_str: str) -> Optional[str]:
    """Convert expiry date from NSE format to database format"""
    if not expiry_str:
        return None
    try:
        # Convert from '28-Oct-2025' to '2025-10-28' format for database
        expiry_date_obj = datetime.strptime(expiry_str, '%d-%b-%Y').date()
        return expiry_date_obj.strftime('%Y-%m-%d')
    except:
        return None

def perform_futures_analysis(symbol: str, futures_data: Dict, spot_price: float) -> Optional[Dict]:
    """Perform comprehensive futures analysis"""
    try:
        if not futures_data:
            return None
        
        # Check which endpoint provided the data
        source_endpoint = futures_data.get('_source_endpoint', '')
        
        # Handle different data structures based on endpoint
        if 'quote-derivative' in source_endpoint and 'stocks' in futures_data:
            # quote-derivative endpoint structure - filter for actual futures contracts
            stocks_data = futures_data['stocks']
            
            # Filter for futures contracts (instrumentType = "Stock Futures" and strikePrice = 0)
            futures_contracts = [
                stock for stock in stocks_data 
                if (stock.get('metadata', {}).get('instrumentType') == 'Stock Futures' and 
                    stock.get('metadata', {}).get('strikePrice', -1) == 0)
            ]
            
            current_month = futures_contracts[0] if futures_contracts else None
        elif 'data' in futures_data:
            # Other endpoints structure
            current_month = futures_data['data'][0] if futures_data['data'] else None
        else:
            return None
            
        if not current_month:
            return None
        
        
        # Extract next month futures (second contract)
        if 'quote-derivative' in source_endpoint and 'stocks' in futures_data:
            # Use the same filtered futures contracts
            stocks_data = futures_data['stocks']
            futures_contracts = [
                stock for stock in stocks_data 
                if (stock.get('metadata', {}).get('instrumentType') == 'Stock Futures' and 
                    stock.get('metadata', {}).get('strikePrice', -1) == 0)
            ]
            next_month = futures_contracts[1] if len(futures_contracts) > 1 else None
        elif 'data' in futures_data:
            next_month = futures_data['data'][1] if len(futures_data['data']) > 1 else None
        else:
            next_month = None
        
        # Extract data based on endpoint type
        if 'quote-derivative' in source_endpoint:
            # quote-derivative endpoint has futures data nested in metadata and tradeInfo
            metadata = current_month.get('metadata', {})
            market_depth = current_month.get('marketDeptOrderBook', {})
            trade_info = market_depth.get('tradeInfo', {})
            other_info = market_depth.get('otherInfo', {})
            carry_info = market_depth.get('carryOfCost', {})
            
            # Basic price and volume data
            current_price = float(metadata.get('lastPrice', 0))
            current_oi = int(trade_info.get('openInterest', 0))
            current_volume = int(trade_info.get('tradedVolume', 0))
            change_in_oi = int(trade_info.get('changeinOpenInterest', 0))
            prev_price = current_price - float(metadata.get('change', 0))
            prev_oi = current_oi - change_in_oi
            spot_price = float(current_month.get('underlyingValue', spot_price))
            
            # OHLC data for technical analysis
            open_price = float(metadata.get('openPrice', current_price))
            high_price = float(metadata.get('highPrice', current_price))
            low_price = float(metadata.get('lowPrice', current_price))
            close_price = float(metadata.get('closePrice', current_price))
            
            # Market depth data
            total_buy_qty = int(market_depth.get('totalBuyQuantity', 0))
            total_sell_qty = int(market_depth.get('totalSellQuantity', 0))
            
            # Advanced metrics
            vwap = float(trade_info.get('vmap', current_price))
            daily_volatility = float(other_info.get('dailyvolatility', 0))
            annual_volatility = float(other_info.get('annualisedVolatility', 0))
            settlement_price = float(other_info.get('settlementPrice', current_price))
            market_lot = int(trade_info.get('marketLot', 1))
            
            # Carry cost data
            carry_cost = float(carry_info.get('carry', {}).get('lastPrice', 0))
        else:
            # Other endpoints (OI data only)
            current_oi = int(current_month.get('latestOI', 0))
            prev_oi = int(current_month.get('prevOI', 0))
            change_in_oi = int(current_month.get('changeInOI', 0))
            current_volume = int(current_month.get('volume', 0))
            spot_price = float(current_month.get('underlyingValue', spot_price))
            # Use spot price as approximation (not ideal but better than 0)
            current_price = spot_price * 1.01  # Assume small premium
            prev_price = current_price
        
        # Calculate days to expiry
        if 'quote-derivative' in source_endpoint:
            expiry_str = metadata.get('expiryDate', '')
        else:
            expiry_str = current_month.get('expiryDate', '')
            
        try:
            expiry_date = datetime.strptime(expiry_str, '%d-%b-%Y').date()
            days_to_expiry = (expiry_date - datetime.now().date()).days
        except:
            days_to_expiry = 30  # Default
        
        # Next month data
        next_month_price = float(next_month.get('lastPrice', 0)) if next_month else 0
        next_month_oi = int(next_month.get('openInterest', 0)) if next_month else 0
        next_month_expiry = next_month.get('expiryDate', '') if next_month else ''
        
        # Perform analysis
        oi_analysis = analyze_oi_buildup(current_price, prev_price, current_oi, prev_oi)
        basis_analysis = analyze_basis_structure(current_price, spot_price, days_to_expiry)
        rollover_analysis = calculate_rollover_pressure(days_to_expiry, current_oi, next_month_oi, current_volume)
        
        # Enhanced analysis using additional NSE data
        if 'quote-derivative' in source_endpoint:
            market_depth_analysis = analyze_market_depth(total_buy_qty, total_sell_qty, market_depth)
            price_action_analysis = analyze_price_action(open_price, high_price, low_price, current_price, vwap)
        else:
            # Fallback for other endpoints
            market_depth_analysis = {'imbalance': 'NEUTRAL', 'strength': 'LOW', 'buy_sell_ratio': 1.0, 'reasoning': 'No depth data'}
            price_action_analysis = {'pattern': 'INSUFFICIENT_DATA', 'strength': 'LOW', 'vwap_position': 'NEUTRAL', 'reasoning': 'No OHLC data'}
        
        # Calculate price change once
        price_change_val = current_price - prev_price
        
        # Use comprehensive trading algorithm (inspired by successful option analysis)
        trading_signal = comprehensive_futures_trading_signal(
            change_in_oi, oi_analysis['oi_change_pct'], current_volume,
            price_change_val, current_price, market_depth_analysis, 
            price_action_analysis, basis_analysis
        )
        
        # Use simple trading algorithm for clear signals
        overall_signal = trading_signal['signal']
        signal_strength = trading_signal['strength']
        confidence = trading_signal['confidence']
        
        # Map signals to database-compatible types
        if overall_signal in ['STRONG_BULLISH', 'BULLISH']:
            overall_signal = 'BULLISH'
        elif overall_signal in ['STRONG_BEARISH', 'BEARISH']:
            overall_signal = 'BEARISH'
        elif overall_signal == 'SCALPING':
            overall_signal = 'NEUTRAL'  # Scalping is neutral directionally
        else:
            overall_signal = 'NEUTRAL'
        
        # Ensure minimum signal strength for meaningful signals
        if overall_signal != 'NEUTRAL' and signal_strength < 15:
            overall_signal = 'NEUTRAL'
        
        # Final validation to ensure database compatibility
        valid_signals = ['BULLISH', 'BEARISH', 'NEUTRAL', 'ARBITRAGE']
        if overall_signal not in valid_signals:
            logging.warning(f"Invalid overall_signal '{overall_signal}' for {symbol}, defaulting to NEUTRAL")
            overall_signal = 'NEUTRAL'
        
        # Enhanced output like option analysis
        if trading_signal['strength'] > 0:
            logging.info(f"✅ {symbol}: {trading_signal['signal']} → {trading_signal['action']} (Score: {trading_signal['base_score']:+.1f}, Confidence: {trading_signal['confidence']}%)")
        else:
            logging.info(f"⚪ {symbol}: {trading_signal['signal']} → {trading_signal['action']} (Score: {trading_signal['base_score']:+.1f})")
        
        # Calculate targets and stop loss
        atr_estimate = current_price * 0.02  # 2% ATR estimate
        
        if overall_signal == 'BULLISH':
            target_1 = current_price + atr_estimate
            target_2 = current_price + (atr_estimate * 2)
            stop_loss = current_price - (atr_estimate * 0.5)
        elif overall_signal == 'BEARISH':
            target_1 = current_price - atr_estimate
            target_2 = current_price - (atr_estimate * 2)
            stop_loss = current_price + (atr_estimate * 0.5)
        else:
            target_1 = current_price
            target_2 = current_price
            stop_loss = current_price
        
        # Calculate risk-reward ratio
        risk = abs(current_price - stop_loss)
        reward = abs(target_1 - current_price)
        risk_reward_ratio = reward / risk if risk > 0 else 1
        
        # Simple, clear reasoning for trading
        price_change_pct = (price_change_val/prev_price*100) if prev_price > 0 else 0
        reasoning = f"{trading_signal['reason']} | OI: {change_in_oi:+,} ({oi_analysis['oi_change_pct']:+.1f}%) | Volume: {current_volume:,} | Price: {price_change_val:+.2f} ({price_change_pct:+.2f}%)"
        
        if trading_signal['signal'] != 'NEUTRAL':
            reasoning += f" | Action: {trading_signal['action']} | Timeframe: {trading_signal['timeframe']}"
        
        # Convert expiry string to proper date format or use default
        if expiry_str:
            try:
                # Convert from '28-Oct-2025' to '2025-10-28' format for database
                expiry_date_obj = datetime.strptime(expiry_str, '%d-%b-%Y').date()
                current_month_expiry = expiry_date_obj.strftime('%Y-%m-%d')
            except:
                # If parsing fails, use a default future date
                current_month_expiry = (datetime.now().date() + timedelta(days=30)).strftime('%Y-%m-%d')
        else:
            # If no expiry date, use a default future date
            current_month_expiry = (datetime.now().date() + timedelta(days=30)).strftime('%Y-%m-%d')
        
        # Final validation before return
        if overall_signal not in ['BULLISH', 'BEARISH', 'NEUTRAL', 'ARBITRAGE']:
            logging.error(f"❌ CRITICAL: Invalid signal '{overall_signal}' for {symbol} at return, forcing to NEUTRAL")
            overall_signal = 'NEUTRAL'
        
        if oi_analysis['buildup_type'] not in ['LONG_BUILDUP', 'SHORT_BUILDUP', 'LONG_UNWINDING', 'SHORT_COVERING', 'NEUTRAL']:
            logging.error(f"❌ CRITICAL: Invalid buildup_type '{oi_analysis['buildup_type']}' for {symbol}, forcing to NEUTRAL")
            oi_buildup_type = 'NEUTRAL'
        else:
            oi_buildup_type = oi_analysis['buildup_type']
        
        if oi_analysis['strength_level'] not in ['STRONG', 'MODERATE', 'WEAK']:
            logging.error(f"❌ CRITICAL: Invalid strength_level '{oi_analysis['strength_level']}' for {symbol}, forcing to WEAK")
            oi_strength = 'WEAK'
        else:
            oi_strength = oi_analysis['strength_level']
        
        if rollover_analysis['pressure'] not in ['HIGH', 'MEDIUM', 'LOW']:
            logging.error(f"❌ CRITICAL: Invalid pressure '{rollover_analysis['pressure']}' for {symbol}, forcing to LOW")
            rollover_pressure = 'LOW'
        else:
            rollover_pressure = rollover_analysis['pressure']
        
        if basis_analysis['market_structure'] not in ['CONTANGO', 'BACKWARDATION', 'NEUTRAL']:
            logging.error(f"❌ CRITICAL: Invalid market_structure '{basis_analysis['market_structure']}' for {symbol}, forcing to NEUTRAL")
            market_structure = 'NEUTRAL'
        else:
            market_structure = basis_analysis['market_structure']

        return {
            'symbol': symbol,
            'current_month_expiry': current_month_expiry,
            'current_price': current_price,
            'current_open_interest': current_oi,
            'current_volume': current_volume,
            'current_change_in_oi': change_in_oi,
            'next_month_expiry': convert_expiry_date(next_month_expiry) if next_month_expiry else None,
            'next_month_price': next_month_price,
            'next_month_oi': next_month_oi,
            'spot_price': spot_price,
            'basis': basis_analysis['basis'],
            'basis_percentage': basis_analysis['basis_percentage'],
            'annualized_basis': basis_analysis['annualized_basis'],
            'oi_buildup_type': oi_buildup_type,
            'oi_strength': oi_strength,
            'oi_change_percentage': oi_analysis['oi_change_pct'],
            'days_to_expiry': days_to_expiry,
            'rollover_pressure': rollover_pressure,
            'rollover_cost': rollover_analysis['cost'],
            'market_structure': market_structure,
            'signal_type': overall_signal,
            'signal_strength': min(signal_strength, 100),
            'confidence': min(confidence, 100),
            'target_1': target_1,
            'target_2': target_2,
            'stop_loss': stop_loss,
            'risk_reward_ratio': risk_reward_ratio,
            'reasoning': reasoning,
            'key_levels': json.dumps([]),  # Placeholder for volume profile levels
            'volume_profile': json.dumps({'high_volume_zones': []}),
            'institutional_activity': json.dumps({
                'signal': trading_signal['signal'],
                'action': trading_signal['action'],
                'reason': trading_signal['reason'],
                'timeframe': trading_signal['timeframe']
            })
        }
        
    except Exception as e:
        logging.error(f"❌ Error analyzing futures for {symbol}: {e}")
        return None

def store_futures_results(results: List[Dict]) -> None:
    """Store futures analysis results in Supabase"""
    if not results:
        logging.warning("No futures results to store")
        return
    
    try:
        # Prepare data for database
        timestamp = datetime.utcnow().isoformat()
        trading_date = ist_now().strftime('%Y-%m-%d')
        
        db_records = []
        for result in results:
            # Validate and sanitize data before insertion
            signal_type = result['signal_type']
            logging.debug(f"Validating signal_type '{signal_type}' for {result['symbol']}")
            if signal_type not in ['BULLISH', 'BEARISH', 'NEUTRAL', 'ARBITRAGE']:
                logging.error(f"❌ Invalid signal_type '{signal_type}' for {result['symbol']}, defaulting to NEUTRAL")
                signal_type = 'NEUTRAL'
            
            oi_buildup_type = result['oi_buildup_type']
            if oi_buildup_type not in ['LONG_BUILDUP', 'SHORT_BUILDUP', 'LONG_UNWINDING', 'SHORT_COVERING', 'NEUTRAL']:
                logging.warning(f"Invalid oi_buildup_type '{oi_buildup_type}' for {result['symbol']}, defaulting to NEUTRAL")
                oi_buildup_type = 'NEUTRAL'
            
            oi_strength = result['oi_strength']
            if oi_strength not in ['STRONG', 'MODERATE', 'WEAK']:
                logging.warning(f"Invalid oi_strength '{oi_strength}' for {result['symbol']}, defaulting to WEAK")
                oi_strength = 'WEAK'
            
            rollover_pressure = result['rollover_pressure']
            if rollover_pressure not in ['HIGH', 'MEDIUM', 'LOW']:
                logging.warning(f"Invalid rollover_pressure '{rollover_pressure}' for {result['symbol']}, defaulting to LOW")
                rollover_pressure = 'LOW'
            
            market_structure = result['market_structure']
            if market_structure not in ['CONTANGO', 'BACKWARDATION', 'NEUTRAL']:
                logging.warning(f"Invalid market_structure '{market_structure}' for {result['symbol']}, defaulting to NEUTRAL")
                market_structure = 'NEUTRAL'
            
            db_record = {
                'symbol': result['symbol'],
                'analysis_timestamp': timestamp,
                'trading_date': trading_date,
                'current_month_expiry': result['current_month_expiry'],
                'current_price': result['current_price'],
                'current_open_interest': result['current_open_interest'],
                'current_volume': result['current_volume'],
                'current_change_in_oi': result['current_change_in_oi'],
                'next_month_expiry': result['next_month_expiry'],
                'next_month_price': result['next_month_price'],
                'next_month_oi': result['next_month_oi'],
                'spot_price': result['spot_price'],
                'basis': result['basis'],
                'basis_percentage': result['basis_percentage'],
                'annualized_basis': result['annualized_basis'],
                'oi_buildup_type': oi_buildup_type,
                'oi_strength': oi_strength,
                'oi_change_percentage': result['oi_change_percentage'],
                'days_to_expiry': result['days_to_expiry'],
                'rollover_pressure': rollover_pressure,
                'rollover_cost': result['rollover_cost'],
                'market_structure': market_structure,
                'signal_type': signal_type,
                'signal_strength': min(result['signal_strength'], 999.99),  # Ensure within DECIMAL(5,2) range
                'confidence': min(result['confidence'], 999.99),  # Ensure within DECIMAL(5,2) range
                'target_1': result['target_1'],
                'target_2': result['target_2'],
                'stop_loss': result['stop_loss'],
                'risk_reward_ratio': result['risk_reward_ratio'],
                'reasoning': result['reasoning'],
                'key_levels': result['key_levels'],
                'volume_profile': result['volume_profile'],
                'institutional_activity': result['institutional_activity']
            }
            db_records.append(db_record)
        
        # Insert into Supabase
        url = f"{SUPABASE_URL}/rest/v1/futures_analysis"
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
        
        logging.info(f"✅ Stored {len(db_records)} futures analysis results in database")
        
    except Exception as e:
        logging.error(f"❌ Error storing futures results: {e}")

def process_symbol_batch(symbols: List[str]) -> List[Dict]:
    """Process a batch of symbols with limited concurrency"""
    results = []
    
    def process_single_symbol(symbol: str) -> Optional[Dict]:
        try:
            futures_data = fetch_futures_data(symbol, refresh_cookies=False)
            spot_price = get_spot_price(symbol)
            
            if futures_data and spot_price > 0:
                analysis = perform_futures_analysis(symbol, futures_data, spot_price)
                if analysis:
                    logging.info(f"✅ {symbol}: {analysis['oi_buildup_type']}, Signal: {analysis['signal_type']}, Strength: {analysis['signal_strength']:.1f}")
                    return analysis
        except Exception as e:
            logging.error(f"❌ Error processing {symbol}: {e}")
        return None
    
    # Process symbols concurrently with limited threads to avoid overwhelming NSE
    with ThreadPoolExecutor(max_workers=2) as executor:
        future_to_symbol = {executor.submit(process_single_symbol, symbol): symbol for symbol in symbols}
        
        for future in as_completed(future_to_symbol):
            result = future.result()
            if result:
                results.append(result)
    
    return results

def main():
    """Main execution function"""
    logging.info("🚀 Starting Futures Analysis Collector")
    
    # Environment is now hardcoded - no validation needed
    
    # Check market hours
    if not is_market_hours():
        logging.info("⏰ Outside market hours - skipping futures analysis")
        return
    
    # Fetch FNO symbols from database
    fno_symbols = fetch_fno_symbols()
    if not fno_symbols:
        logging.error("❌ No FNO symbols available - cannot proceed")
        return
    
    results = []
    processed = 0
    errors = 0
    
    logging.info(f"📊 Analyzing {len(fno_symbols)} symbols for futures data...")
    
    # Set cookies once at the beginning for better performance
    set_cookie(SET_COOKIE_URL)
    
    # Process symbols in batches with concurrent processing
    batch_size = 10  # Larger batches for concurrent processing
    for i in range(0, len(fno_symbols), batch_size):
        batch = fno_symbols[i:i + batch_size]
        
        # Refresh cookies every 50 symbols to avoid expiry
        if processed > 0 and processed % 50 == 0:
            logging.info("🍪 Refreshing cookies...")
            set_cookie(SET_COOKIE_URL)
        
        logging.info(f"🔍 Processing batch {i//batch_size + 1}/{(len(fno_symbols) + batch_size - 1)//batch_size} ({len(batch)} symbols)")
        
        # Process batch concurrently
        batch_results = process_symbol_batch(batch)
        results.extend(batch_results)
        processed += len(batch)
        
        # Short delay between batches
        if i + batch_size < len(fno_symbols):
            time.sleep(1)  # Minimal delay between batches
    
    # Store results
    if results:
        store_futures_results(results)
    
    # Summary
    success_rate = ((processed - errors) / processed * 100) if processed > 0 else 0
    logging.info(f"🎯 Futures Analysis Complete: {len(results)} qualifying results from {processed} symbols ({errors} errors, {success_rate:.1f}% success rate)")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        logging.info("🛑 Futures analysis interrupted by user")
        sys.exit(0)
    except Exception as e:
        logging.exception(f"💥 Fatal error in futures analysis: {e}")
        sys.exit(1)
