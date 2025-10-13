#!/usr/bin/env python3
"""
NSE Sector Data Collector
Fetches sector index data from NSE APIs and stores in database
"""

import requests
import json
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%dT%H:%M:%SZ'
)

# Hardcoded Supabase credentials
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"

# NSE Sector Indices Configuration
SECTOR_INDICES = {
    'NIFTY CONSUMER DURABLES': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20CONSUMER%20DURABLES',
    'NIFTY FINANCIAL SERVICES 25/50': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20FINANCIAL%20SERVICES%2025%2F50',
    'NIFTY MEDIA': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MEDIA',
    'NIFTY IT': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20IT',
    'NIFTY PRIVATE BANK': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20PRIVATE%20BANK',
    'NIFTY AUTO': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20AUTO',
    'NIFTY FMCG': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20FMCG',
    'NIFTY PHARMA': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20PHARMA',
    'NIFTY PSU BANK': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20PSU%20BANK',
    'NIFTY REALTY': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20REALTY',
    'NIFTY HEALTHCARE INDEX': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20HEALTHCARE%20INDEX',
    'NIFTY OIL & GAS': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20OIL%20%26%20GAS',
    'NIFTY FINANCIAL SERVICES EX-BANK': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20FINANCIAL%20SERVICES%20EX-BANK',
    'NIFTY MIDSMALL HEALTHCARE': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDSMALL%20HEALTHC',
    'NIFTY MIDSMALL IT & TELECOM': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDSMALL%20IT%20%26%20TELECOM',
    'NIFTY BANK': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20BANK',
    'NIFTY METAL': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20METAL',
    'NIFTY MIDCAP 50': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDCAP%2050',
    'NIFTY SMALLCAP 50': 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20SMALLCAP%2050'
}

class NSESectorDataCollector:
    def __init__(self):
        self.session = requests.Session()
        self.setup_session()
        self.sector_indices = self.load_indices_config()
        
    def setup_session(self):
        """Setup session using your proven OIStrategy.py approach"""
        # Reset session
        self.session = requests.Session()
        self.cookies = dict()
        
        # Use exact headers from your working OIStrategy.py
        headers = {
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
        }
        self.session.headers.update(headers)
        
        # Set cookies using your proven method
        try:
            logging.info("🍪 Setting cookies using OIStrategy method...")
            set_cookie_url = "https://www.nseindia.com/market-data/oi-spurts"
            request = self.session.get(set_cookie_url, headers=headers, timeout=10)
            self.cookies = dict(request.cookies)
            logging.info(f"✅ Cookies set: {len(self.cookies)} cookies obtained")
            
        except Exception as e:
            logging.warning(f"⚠️ Cookie setup issue: {e}")
            self.cookies = dict()

    def get_nse_data(self, url: str) -> Optional[Dict[str, Any]]:
        """Get data using your proven OIStrategy.py method"""
        try:
            logging.info(f"[INFO] API Call URL: {url}")
            response = self.session.get(url, headers=self.session.headers, timeout=15, cookies=self.cookies)
            
            if response.status_code == 200:
                return response.json()
            else:
                logging.error(f"❌ API returned {response.status_code}")
                return None
                
        except requests.exceptions.Timeout:
            logging.error("❌ Request timed out")
            return None
        except requests.exceptions.ConnectionError:
            logging.error("❌ Connection error")
            return None
        except requests.exceptions.HTTPError as e:
            logging.error(f"❌ HTTP error: {e.response.status_code}")
            return None
        except Exception as e:
            logging.error(f"❌ Unexpected error: {e}")
            return None

    def load_indices_config(self) -> Dict[str, str]:
        """Load active sector indices configuration from database"""
        try:
            url = f"{SUPABASE_URL}/rest/v1/nse_sector_indices_config?is_active=eq.true&select=index_name,api_url"
            headers = {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                config_data = response.json()
                indices = {item['index_name']: item['api_url'] for item in config_data}
                logging.info(f"✅ Loaded {len(indices)} active sector indices from database")
                return indices
            else:
                logging.warning(f"⚠️ Failed to load config from database, using fallback: {response.status_code}")
                return SECTOR_INDICES
                
        except Exception as e:
            logging.error(f"❌ Error loading indices config: {e}, using fallback")
            return SECTOR_INDICES

    def fetch_sector_data(self, index_name: str, api_url: str, max_retries: int = 2) -> Optional[Dict[str, Any]]:
        """Fetch sector data using proven OIStrategy.py method"""
        for attempt in range(max_retries):
            try:
                logging.info(f"🔍 Fetching {index_name} data... (attempt {attempt + 1}/{max_retries})")
                
                # Re-establish session on retry
                if attempt > 0:
                    time.sleep(5)
                    self.setup_session()
                
                # Use the proven get_nse_data method
                data = self.get_nse_data(api_url)
                
                if data and 'data' in data:
                    logging.info(f"✅ Successfully fetched {index_name} data ({len(data.get('data', []))} items)")
                    return data
                else:
                    logging.warning(f"⚠️ No valid data for {index_name} (attempt {attempt + 1})")
                    continue
                        
            except Exception as e:
                logging.error(f"❌ Error fetching {index_name} (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    continue
        
        logging.error(f"💥 Failed to fetch {index_name} after {max_retries} attempts")
        return None

    def process_sector_data(self, index_name: str, sector_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process sector data into database format"""
        processed_records = []
        
        try:
            # Extract metadata
            metadata = sector_data.get('metadata', {})
            advance_decline = sector_data.get('advance', {})
            timestamp = sector_data.get('timestamp', '')
            
            # Process index-level data
            index_record = {
                'data_type': 'INDEX',
                'index_name': index_name,
                'symbol': index_name,
                'company_name': index_name,
                'industry': 'INDEX',
                'current_price': metadata.get('last', 0),
                'previous_close': metadata.get('previousClose', 0),
                'day_change': metadata.get('change', 0),
                'day_change_percent': metadata.get('percChange', 0),
                'day_high': metadata.get('high', 0),
                'day_low': metadata.get('low', 0),
                'year_high': metadata.get('yearHigh', 0),
                'year_low': metadata.get('yearLow', 0),
                'total_traded_volume': metadata.get('totalTradedVolume', 0),
                'total_traded_value': metadata.get('totalTradedValue', 0),
                'advances': int(advance_decline.get('advances', 0)),
                'declines': int(advance_decline.get('declines', 0)),
                'unchanged': int(advance_decline.get('unchanged', 0)),
                'timestamp': timestamp,
                'is_fno_sec': False,
                'near_week_high': 0,
                'near_week_low': 0,
                'perf_30d': metadata.get('perChange30d', 0),
                'perf_365d': metadata.get('perChange365d', 0)
            }
            processed_records.append(index_record)
            
            # Process constituent stocks
            stocks_data = sector_data.get('data', [])
            for stock in stocks_data:
                if stock.get('priority', 1) == 0:  # Only process stock data, not index data
                    stock_record = {
                        'data_type': 'STOCK',
                        'index_name': index_name,
                        'symbol': stock.get('symbol', ''),
                        'company_name': stock.get('meta', {}).get('companyName', ''),
                        'industry': stock.get('meta', {}).get('industry', ''),
                        'current_price': stock.get('lastPrice', 0),
                        'previous_close': stock.get('previousClose', 0),
                        'day_change': stock.get('change', 0),
                        'day_change_percent': stock.get('pChange', 0),
                        'day_high': stock.get('dayHigh', 0),
                        'day_low': stock.get('dayLow', 0),
                        'year_high': stock.get('yearHigh', 0),
                        'year_low': stock.get('yearLow', 0),
                        'total_traded_volume': stock.get('totalTradedVolume', 0),
                        'total_traded_value': stock.get('totalTradedValue', 0),
                        'advances': 0,  # Not applicable for individual stocks
                        'declines': 0,
                        'unchanged': 0,
                        'timestamp': timestamp,
                        'is_fno_sec': stock.get('meta', {}).get('isFNOSec', False),
                        'near_week_high': stock.get('nearWKH', 0),
                        'near_week_low': stock.get('nearWKL', 0),
                        'perf_30d': stock.get('perChange30d', 0),
                        'perf_365d': stock.get('perChange365d', 0)
                    }
                    processed_records.append(stock_record)
            
            logging.info(f"📊 Processed {len(processed_records)} records for {index_name}")
            return processed_records
            
        except Exception as e:
            logging.error(f"❌ Error processing {index_name} data: {e}")
            return []

    def store_sector_data(self, records: List[Dict[str, Any]]) -> bool:
        """Store processed sector data in Supabase"""
        if not records:
            return False
            
        try:
            # Prepare data for database with analysis_timestamp like option analysis
            timestamp = datetime.utcnow().isoformat()
            trading_date = datetime.utcnow().strftime('%Y-%m-%d')
            
            # Add analysis_timestamp to all records
            for record in records:
                record['analysis_timestamp'] = timestamp
                record['trading_date'] = trading_date
            
            url = f"{SUPABASE_URL}/rest/v1/nse_sector_data"
            headers = {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            }
            
            # Insert records in batches of 100
            batch_size = 100
            total_inserted = 0
            
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                
                response = requests.post(url, headers=headers, json=batch, timeout=30)
                
                if response.status_code in [200, 201]:
                    total_inserted += len(batch)
                    logging.info(f"✅ Inserted batch {i//batch_size + 1}: {len(batch)} records")
                else:
                    logging.error(f"❌ Failed to insert batch {i//batch_size + 1}: {response.status_code} - {response.text}")
                    return False
                    
                time.sleep(0.5)  # Rate limiting
            
            logging.info(f"🎯 Successfully stored {total_inserted} sector data records")
            return True
            
        except Exception as e:
            logging.error(f"❌ Error storing sector data: {e}")
            return False

    def collect_all_sector_data(self):
        """Main function to collect data from all configured sector indices"""
        logging.info("🚀 Starting NSE Sector Data Collection")
        
        all_records = []
        successful_indices = 0
        failed_indices = 0
        
        for index_name, api_url in self.sector_indices.items():
            try:
                # Fetch data
                sector_data = self.fetch_sector_data(index_name, api_url)
                
                if sector_data:
                    # Process data
                    processed_records = self.process_sector_data(index_name, sector_data)
                    
                    if processed_records:
                        all_records.extend(processed_records)
                        successful_indices += 1
                        logging.info(f"✅ {index_name}: {len(processed_records)} records processed")
                    else:
                        failed_indices += 1
                        logging.error(f"❌ {index_name}: No records processed")
                else:
                    failed_indices += 1
                    logging.error(f"❌ {index_name}: Failed to fetch data")
                
                # Rate limiting between API calls
                time.sleep(2)
                
            except Exception as e:
                failed_indices += 1
                logging.error(f"❌ Error processing {index_name}: {e}")
        
        # Store all collected data
        if all_records:
            logging.info(f"📊 Total records collected: {len(all_records)}")
            
            if self.store_sector_data(all_records):
                logging.info(f"🎯 Sector Data Collection Complete!")
                logging.info(f"✅ Successful indices: {successful_indices}")
                logging.info(f"❌ Failed indices: {failed_indices}")
                logging.info(f"📈 Total records stored: {len(all_records)}")
            else:
                logging.error("❌ Failed to store sector data in database")
        else:
            logging.error("❌ No sector data collected")

def main():
    """Main execution function"""
    try:
        collector = NSESectorDataCollector()
        collector.collect_all_sector_data()
        
    except KeyboardInterrupt:
        logging.info("⏹️ Collection stopped by user")
    except Exception as e:
        logging.error(f"💥 Fatal error: {e}")

if __name__ == "__main__":
    main()
