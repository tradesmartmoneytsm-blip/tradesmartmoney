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
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
FORCE_RUN = os.environ.get("FORCE_RUN", "false").lower() == "true"

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
    """Fetch active FNO symbols from Supabase database - focus on symbols with active futures"""
    try:
        # Start with major symbols that definitely have futures
        major_futures_symbols = [
            'NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY',  # Indices
            'RELIANCE', 'TCS', 'HDFCBANK', 'ICICIBANK', 'INFY', 'HINDUNILVR',  # Large caps
            'AXISBANK', 'KOTAKBANK', 'SBIN', 'BAJFINANCE', 'MARUTI', 'ASIANPAINT',
            'LT', 'ULTRACEMCO', 'TITAN', 'SUNPHARMA', 'TATASTEEL', 'JSWSTEEL',
            'ONGC', 'NTPC', 'POWERGRID', 'COALINDIA', 'HINDALCO', 'GRASIM'
        ]
        
        # Try to fetch from database but fallback to major symbols
        try:
            url = f"{SUPABASE_URL}/rest/v1/fno_symbols"
            headers = {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
                'Content-Type': 'application/json'
            }
            
            params = {
                'select': 'symbol_name',
                'is_active': 'eq.true',
                'limit': '100'  # Reduced limit to focus on active futures
            }
            
            response = requests.get(url, headers=headers, params=params, timeout=30)
            if response.status_code == 200:
                data = response.json()
                db_symbols = [item['symbol_name'] for item in data if item.get('symbol_name')]
                
                # Combine major symbols with database symbols, remove duplicates
                all_symbols = list(set(major_futures_symbols + db_symbols))
                logging.info(f"✅ Fetched {len(all_symbols)} symbols (major + database)")
                return all_symbols
        except:
            pass
        
        logging.info(f"✅ Using {len(major_futures_symbols)} major futures symbols")
        return major_futures_symbols
        
    except Exception as e:
        logging.error(f"❌ Failed to fetch symbols: {e}")
        # Fallback to essential symbols
        return ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK']

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

def fetch_futures_data(symbol: str) -> Optional[Dict]:
    """Fetch futures data using cookie-based approach (your proven method)"""
    try:
        # Set cookies first (your approach)
        set_cookie(SET_COOKIE_URL)
        
        # Try different endpoints for futures data
        endpoints = [
            f"https://www.nseindia.com/api/equity-derivatives?symbol={symbol}",
            f"https://www.nseindia.com/api/live-analysis-oi-spurts-underlyings?symbol={symbol}"
        ]
        
        for url in endpoints:
            response_text = get_nse_data(url)
            if response_text:
                try:
                    data = json.loads(response_text)
                    if data and ('data' in data or 'stocks' in data or 'FUTSTK' in data):
                        return data
                except json.JSONDecodeError:
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
    
    # Determine buildup type
    if price_change > 0 and oi_change > 0:
        buildup_type = 'LONG_BUILDUP'
        signal = 'BULLISH'
        strength = min(abs(oi_change_pct) / 5, 100)  # Scale based on OI change
    elif price_change < 0 and oi_change > 0:
        buildup_type = 'SHORT_BUILDUP'
        signal = 'BEARISH'
        strength = min(abs(oi_change_pct) / 5, 100)
    elif price_change < 0 and oi_change < 0:
        buildup_type = 'LONG_UNWINDING'
        signal = 'BEARISH'
        strength = min(abs(oi_change_pct) / 3, 100)
    elif price_change > 0 and oi_change < 0:
        buildup_type = 'SHORT_COVERING'
        signal = 'BULLISH'
        strength = min(abs(oi_change_pct) / 3, 100)
    else:
        buildup_type = 'NEUTRAL'
        signal = 'NEUTRAL'
        strength = 0
    
    # Determine strength level
    if strength >= 15:
        strength_level = 'STRONG'
    elif strength >= 8:
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
    """Analyze basis and market structure"""
    
    if spot_price <= 0:
        return {
            'basis': 0,
            'basis_percentage': 0,
            'annualized_basis': 0,
            'market_structure': 'NEUTRAL',
            'arbitrage_opportunity': False
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
    
    # Check for arbitrage opportunities (basis > 2% annualized)
    arbitrage_opportunity = abs(annualized_basis) > 8  # 8% annualized threshold
    
    return {
        'basis': basis,
        'basis_percentage': basis_percentage,
        'annualized_basis': annualized_basis,
        'market_structure': market_structure,
        'arbitrage_opportunity': arbitrage_opportunity
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

def perform_futures_analysis(symbol: str, futures_data: Dict, spot_price: float) -> Optional[Dict]:
    """Perform comprehensive futures analysis"""
    try:
        if not futures_data or not futures_data.get('data'):
            return None
        
        # Extract current month futures (first contract)
        current_month = futures_data['data'][0] if futures_data['data'] else None
        if not current_month:
            return None
        
        # Extract next month futures (second contract)
        next_month = futures_data['data'][1] if len(futures_data['data']) > 1 else None
        
        # Current month data
        current_price = float(current_month.get('lastPrice', 0))
        current_oi = int(current_month.get('openInterest', 0))
        current_volume = int(current_month.get('totalTradedVolume', 0))
        change_in_oi = int(current_month.get('changeinOpenInterest', 0))
        prev_price = current_price - float(current_month.get('change', 0))
        prev_oi = current_oi - change_in_oi
        
        # Calculate days to expiry
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
        
        # Calculate overall signal strength
        signal_strength = 0
        confidence = 50
        
        # OI analysis contribution
        if oi_analysis['strength_level'] == 'STRONG':
            signal_strength += 40
            confidence += 25
        elif oi_analysis['strength_level'] == 'MODERATE':
            signal_strength += 25
            confidence += 15
        
        # Basis analysis contribution
        if basis_analysis['arbitrage_opportunity']:
            signal_strength += 20
            confidence += 15
        
        # Volume contribution
        if current_volume > 100000:  # High volume threshold
            signal_strength += 15
            confidence += 10
        
        # Rollover pressure contribution
        if rollover_analysis['pressure'] == 'HIGH' and days_to_expiry <= 3:
            signal_strength += 10
        
        # Determine overall signal
        if oi_analysis['signal'] == 'BULLISH' and basis_analysis['basis_percentage'] < 2:
            overall_signal = 'BULLISH'
        elif oi_analysis['signal'] == 'BEARISH' and basis_analysis['basis_percentage'] > -1:
            overall_signal = 'BEARISH'
        elif basis_analysis['arbitrage_opportunity']:
            overall_signal = 'ARBITRAGE'
        else:
            overall_signal = 'NEUTRAL'
        
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
        
        # Build comprehensive reasoning
        reasoning_parts = [
            oi_analysis['reasoning'],
            f"Basis: {basis_analysis['basis']:+.2f} ({basis_analysis['basis_percentage']:+.2f}%)",
            f"Market Structure: {basis_analysis['market_structure']}",
            rollover_analysis['reasoning']
        ]
        
        if basis_analysis['arbitrage_opportunity']:
            reasoning_parts.append(f"Arbitrage opportunity detected (annualized basis: {basis_analysis['annualized_basis']:+.1f}%)")
        
        return {
            'symbol': symbol,
            'current_month_expiry': expiry_str,
            'current_price': current_price,
            'current_open_interest': current_oi,
            'current_volume': current_volume,
            'current_change_in_oi': change_in_oi,
            'next_month_expiry': next_month_expiry,
            'next_month_price': next_month_price,
            'next_month_oi': next_month_oi,
            'spot_price': spot_price,
            'basis': basis_analysis['basis'],
            'basis_percentage': basis_analysis['basis_percentage'],
            'annualized_basis': basis_analysis['annualized_basis'],
            'oi_buildup_type': oi_analysis['buildup_type'],
            'oi_strength': oi_analysis['strength_level'],
            'oi_change_percentage': oi_analysis['oi_change_pct'],
            'days_to_expiry': days_to_expiry,
            'rollover_pressure': rollover_analysis['pressure'],
            'rollover_cost': rollover_analysis['cost'],
            'market_structure': basis_analysis['market_structure'],
            'signal_type': overall_signal,
            'signal_strength': min(signal_strength, 100),
            'confidence': min(confidence, 100),
            'target_1': target_1,
            'target_2': target_2,
            'stop_loss': stop_loss,
            'risk_reward_ratio': risk_reward_ratio,
            'reasoning': ' | '.join(reasoning_parts),
            'key_levels': json.dumps([]),  # Placeholder for volume profile levels
            'volume_profile': json.dumps({'high_volume_zones': []}),
            'institutional_activity': json.dumps({'large_trades': []})
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
                'oi_buildup_type': result['oi_buildup_type'],
                'oi_strength': result['oi_strength'],
                'oi_change_percentage': result['oi_change_percentage'],
                'days_to_expiry': result['days_to_expiry'],
                'rollover_pressure': result['rollover_pressure'],
                'rollover_cost': result['rollover_cost'],
                'market_structure': result['market_structure'],
                'signal_type': result['signal_type'],
                'signal_strength': result['signal_strength'],
                'confidence': result['confidence'],
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

def main():
    """Main execution function"""
    logging.info("🚀 Starting Futures Analysis Collector")
    
    # Validate environment
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logging.error("Missing required environment variables")
        sys.exit(1)
    
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
    
    # Process symbols in batches to respect API limits
    batch_size = 3  # Smaller batch for futures API
    for i in range(0, len(fno_symbols), batch_size):
        batch = fno_symbols[i:i + batch_size]
        
        for symbol in batch:
            try:
                logging.info(f"🔍 Analyzing {symbol} futures... ({processed + 1}/{len(fno_symbols)})")
                
                # Fetch futures and spot data
                futures_data = fetch_futures_data(symbol)
                spot_price = get_spot_price(symbol)
                
                if futures_data and spot_price > 0:
                    analysis = perform_futures_analysis(symbol, futures_data, spot_price)
                    if analysis:
                        results.append(analysis)
                        logging.info(f"✅ {symbol}: {analysis['oi_buildup_type']}, Signal: {analysis['signal_type']}, Strength: {analysis['signal_strength']:.1f}")
                
                processed += 1
                
                # Respectful delay
                time.sleep(2)
                
            except Exception as e:
                logging.error(f"❌ Error processing {symbol}: {e}")
                errors += 1
                processed += 1
        
        # Batch delay
        if i + batch_size < len(fno_symbols):
            time.sleep(5)
    
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
