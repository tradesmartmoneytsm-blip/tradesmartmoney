#!/usr/bin/env python3
"""
F&O Heatmap Data Fetcher
Scrapes heatmap data from Research360 and stores in database
"""

import os
import sys
import logging
import requests
import re
from datetime import datetime, timezone
from typing import Dict, List, Optional
from bs4 import BeautifulSoup

# Configure logging (stdout only, no log file)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# Load environment from .env file
def load_env():
    """Load environment variables from .env file"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

load_env()

# Supabase credentials
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')

class FNOHeatmapFetcher:
    def __init__(self):
        self.research360_cookies = self.load_cookies()
        self.research360_headers = {
            'accept': '*/*',
            'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7,mr;q=0.6',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': 'https://www.research360.in',
            'referer': 'https://www.research360.in/future-and-options/heatmap',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
        }
        self.available_expiry = None
        logging.info("FNOHeatmapFetcher initialized")
    
    def load_cookies(self) -> Dict[str, str]:
        """Load cookies from research360_cookies.txt"""
        try:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            cookie_file = os.path.join(script_dir, 'research360_cookies.txt')
            
            if not os.path.exists(cookie_file):
                logging.warning("Cookie file not found")
                return {}
            
            cookies = {}
            with open(cookie_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        if '=' in line:
                            key, value = line.split('=', 1)
                            cookies[key.strip()] = value.strip()
            
            if cookies:
                logging.info(f"✅ Loaded {len(cookies)} cookies")
            
            return cookies
        except Exception as e:
            logging.error(f"Error loading cookies: {e}")
            return {}
    
    def calculate_monthly_expiry(self) -> str:
        """Calculate the current/next monthly F&O expiry (last Thursday of the month)"""
        from datetime import timedelta
        
        today = datetime.now()
        
        # Start with the last day of current month
        if today.month == 12:
            last_day = datetime(today.year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = datetime(today.year, today.month + 1, 1) - timedelta(days=1)
        
        # Find last Thursday of the month
        # Thursday is weekday 3 (Monday=0, Sunday=6)
        days_to_subtract = (last_day.weekday() - 3) % 7
        current_expiry = last_day - timedelta(days=days_to_subtract)
        
        # Calculate days until current expiry
        days_until_expiry = (current_expiry - today).days
        
        # If current expiry has passed OR is within 1 day (expiry day or day before),
        # use next month's expiry (market rolls over to next contract)
        if days_until_expiry <= 1:
            if today.month == 11:
                next_month_last_day = datetime(today.year + 1, 1, 1) - timedelta(days=1)
            elif today.month == 12:
                next_month_last_day = datetime(today.year + 1, 2, 1) - timedelta(days=1)
            else:
                next_month_last_day = datetime(today.year, today.month + 2, 1) - timedelta(days=1)
            
            days_to_subtract = (next_month_last_day.weekday() - 3) % 7
            next_expiry = next_month_last_day - timedelta(days=days_to_subtract)
            
            logging.info(f"📆 Current expiry ({current_expiry.strftime('%d-%b-%Y')}) is {days_until_expiry} days away, using next month's expiry")
            return next_expiry.strftime('%d-%b-%Y')
        
        # Use current month's expiry
        return current_expiry.strftime('%d-%b-%Y')
    
    def get_available_expiry(self) -> str:
        """Get the currently available expiry date from Research360"""
        try:
            # Fetch the heatmap page to extract available expiry dates
            response = requests.get(
                'https://www.research360.in/future-and-options/heatmap',
                headers={
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                },
                cookies=self.research360_cookies,
                timeout=30
            )
            
            # Check response content even if status code is not 200
            # Research360 sometimes returns 500 but still has valid HTML
            if response.text and len(response.text) > 1000:
                # Look for expiry dates in the HTML (format: 25-Nov-2025)
                # Research360 typically has 3 expiries: current month, next month, far month
                matches = re.findall(r'\d{2}-[A-Z][a-z]{2}-\d{4}', response.text)
                
                if matches:
                    # Get unique expiry dates and sort them
                    unique_expiries = sorted(set(matches))
                    
                    # Use the first expiry (current/near month)
                    expiry = unique_expiries[0]
                    
                    logging.info(f"📅 Auto-detected expiry: {expiry} (from Research360)")
                    if len(unique_expiries) > 1:
                        logging.info(f"   Other available expiries: {', '.join(unique_expiries[1:])}")
                    
                    return expiry
            
            # Fallback to calculated expiry
            calculated_expiry = self.calculate_monthly_expiry()
            logging.warning(f"Could not auto-detect expiry, using calculated: {calculated_expiry}")
            return calculated_expiry
            
        except Exception as e:
            # Fallback to calculated expiry
            calculated_expiry = self.calculate_monthly_expiry()
            logging.error(f"Error getting expiry: {e}, using calculated: {calculated_expiry}")
            return calculated_expiry
    
    def fetch_from_research360(self, ftype: str, expiry: str, buildup: str = 'all') -> Optional[List[Dict]]:
        """Fetch data from Research360 API"""
        try:
            data = {
                'ftype': ftype,
                'explist': expiry,
                'bulist': buildup,
                'sectorfno': 'all',
                'indexlist': 'all',
                'page': 'heatmap'
            }
            
            response = requests.post(
                'https://www.research360.in/ajax/heatmapAPIHandler.php',
                headers=self.research360_headers,
                cookies=self.research360_cookies,
                data=data,
                timeout=30
            )
            
            if response.status_code == 200:
                html_content = response.text.strip()
                
                if html_content == "No Data" or not html_content:
                    logging.warning(f"No data available for {ftype}")
                    return []
                
                parsed_data = self.parse_html_response(html_content, ftype)
                logging.info(f"✅ Fetched {len(parsed_data)} records for {ftype}")
                return parsed_data
            else:
                logging.error(f"API error: {response.status_code}")
                return None
                
        except Exception as e:
            logging.error(f"Error fetching from Research360: {e}")
            return None
    
    def parse_html_response(self, html_content: str, ftype: str) -> List[Dict]:
        """Parse HTML response from Research360"""
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            stocks = []
            stock_divs = soup.find_all('div', class_='showTooltip')
            
            for div in stock_divs:
                try:
                    symbol = div.get('data-code', '').strip()
                    if not symbol:
                        continue
                    
                    # Extract data from <p> tags
                    p_tags = div.find_all('p')
                    price_change = 0
                    oi_change = 0
                    
                    for p in p_tags:
                        text = p.get_text(strip=True)
                        if text.startswith('P '):
                            match = re.search(r'([-+]?\d+\.?\d*)%', text)
                            if match:
                                price_change = float(match.group(1))
                        elif text.startswith('OI:'):
                            match = re.search(r'([-+]?\d+\.?\d*)%', text)
                            if match:
                                oi_change = float(match.group(1))
                    
                    # Extract from tooltip
                    tooltip = div.find('div', class_='heatMapTooltip')
                    ltp = 0
                    oi = 0
                    volume = 0
                    
                    if tooltip:
                        extra_infos = tooltip.find_all('div', class_='extraInfo')
                        for info in extra_infos:
                            text = info.get_text(strip=True)
                            if text.startswith('Price:'):
                                match = re.search(r'Price:\s*([\d,.]+)', text)
                                if match:
                                    ltp = float(match.group(1).replace(',', ''))
                            elif text.startswith('OI:'):
                                match = re.search(r'OI:\s*([\d,]+)', text)
                                if match:
                                    oi = int(match.group(1).replace(',', ''))
                            elif text.startswith('Volume:'):
                                match = re.search(r'Volume:\s*([\d,]+)', text)
                                if match:
                                    volume = int(match.group(1).replace(',', ''))
                    
                    stock_data = {
                        'symbol': symbol,
                        'ltp': ltp,
                        'price_change_percent': price_change,
                        'oi': oi,
                        'oi_change_percent': oi_change,
                        'volume': volume
                    }
                    
                    stocks.append(stock_data)
                    
                except Exception as e:
                    logging.debug(f"Error parsing stock: {e}")
                    continue
            
            return stocks
            
        except Exception as e:
            logging.error(f"Error parsing HTML: {e}")
            return []
    
    def store_in_database(self, records: List[Dict]) -> bool:
        """Store records in Supabase database"""
        try:
            if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
                logging.error("Missing Supabase credentials")
                return False
            
            url = f"{SUPABASE_URL}/rest/v1/fno_heatmap"
            headers = {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            response = requests.post(url, headers=headers, json=records, timeout=30)
            
            if response.status_code in [200, 201]:
                logging.info(f"✅ Stored {len(records)} records in database")
                return True
            else:
                logging.error(f"Database error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logging.error(f"Error storing in database: {e}")
            return False
    
    def fetch_and_store_all(self):
        """Fetch data for all types and store in database"""
        logging.info("=" * 80)
        logging.info("Starting F&O Heatmap Data Fetch")
        logging.info("=" * 80)
        
        timestamp = datetime.now(timezone.utc)
        trading_date = timestamp.date()
        
        # Auto-detect expiry from Research360
        if not self.available_expiry:
            self.available_expiry = self.get_available_expiry()
        expiry = self.available_expiry
        
        logging.info(f"📅 Trading Date: {trading_date}")
        logging.info(f"⏰ Timestamp: {timestamp}")
        logging.info(f"📊 Expiry: {expiry}")
        
        # Fetch price and OI data
        price_data = self.fetch_from_research360('price', expiry, 'all')
        oi_data = self.fetch_from_research360('oi', expiry, 'all')
        
        if not price_data and not oi_data:
            logging.error("❌ Failed to fetch any data")
            return
        
        # Merge data by symbol
        merged_data = {}
        
        if price_data:
            for item in price_data:
                symbol = item['symbol']
                merged_data[symbol] = item
        
        if oi_data:
            for item in oi_data:
                symbol = item['symbol']
                if symbol in merged_data:
                    merged_data[symbol].update(item)
                else:
                    merged_data[symbol] = item
        
        # Prepare database records
        db_records = []
        
        # Debug: Print first 3 records before storing
        debug_symbols = ['SHREECEM', 'POWERINDIA', 'PAGEIND']
        
        for symbol, data in merged_data.items():
            price_change = data.get('price_change_percent', 0)
            oi_change = data.get('oi_change_percent', 0)
            
            # Determine buildup type
            if price_change > 0.5 and oi_change > 5:
                buildup_type = 'long'
            elif price_change < -0.5 and oi_change > 5:
                buildup_type = 'short'
            elif price_change > 0.5 and oi_change < -5:
                buildup_type = 'short_cover'
            elif price_change < -0.5 and oi_change < -5:
                buildup_type = 'long_unwind'
            else:
                buildup_type = 'neutral'
            
            ltp = data.get('ltp', 0)
            oi_val = data.get('oi', 0)
            
            record = {
                'symbol': symbol,
                'trading_date': str(trading_date),
                'timestamp': timestamp.isoformat(),
                'expiry_date': expiry,
                'buildup_type': buildup_type,
                'sector': None,
                'index_name': 'NIFTY',
                'ltp': ltp,
                'price_change': round(ltp * price_change / 100, 2) if ltp else 0,
                'price_change_percent': round(price_change, 2),
                'oi': oi_val,
                'oi_change': int(oi_val * oi_change / 100) if oi_val else 0,
                'oi_change_percent': round(oi_change, 2),
                'volume': data.get('volume', 0),
                'volume_change': 0
            }
            db_records.append(record)
        
        # Store in database
        if db_records:
            logging.info(f"💾 Storing {len(db_records)} records...")
            success = self.store_in_database(db_records)
            
            if success:
                logging.info("✅ Data fetch and store completed successfully")
            else:
                logging.error("❌ Failed to store data in database")
        else:
            logging.warning("⚠️ No records to store")

def main():
    """Main entry point"""
    fetcher = FNOHeatmapFetcher()
    fetcher.fetch_and_store_all()

if __name__ == "__main__":
    main()
