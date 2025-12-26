#!/usr/bin/env python3
"""
Dhan Historical Data Collector
Fetches OHLC data for indices and stocks to calculate 7D, 30D, 90D, 52W price changes
Stores in dhan_sector_data table

Only processes indices that are displayed in the Sector Performance UI

Usage:
    python3 dhan_historical_data_collector.py                     # Default: Both sectors AND stocks
    python3 dhan_historical_data_collector.py --sectors-only      # Sectors only (skip stocks)
    python3 dhan_historical_data_collector.py --limit 2           # Limit to 2 sectors (includes stocks)
"""

import requests
import json
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import logging
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%dT%H:%M:%SZ'
)

# Hardcoded Supabase credentials
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"

# Dhan API endpoint
DHAN_OHLC_API = "https://openweb-ticks.dhan.co/getDataH"

# Only process these indices (displayed in Sector Performance)
# Using display_symbol names from dhan_sector_indices_config table
SECTOR_INDICES = [
    'Nifty 50',                    # Main index
    'Nifty Bank',                  # Banking sector
    'Nifty IT',                    # IT sector
    'NIFTY Pharma',                # Pharma sector
    'NIFTY Auto',                  # Auto sector
    'NIFTY FMCG',                  # FMCG sector
    'NIFTY Metal',                 # Metals sector
    'NIFTY Realty',                # Real estate sector
    'NIFTY Energy',                # Energy sector
    'NIFTY Media',                 # Media sector
    'NIFTY PSU Bank',              # PSU Banking
    'Nifty Oil and Gas',           # Oil & Gas sector
    'NIFTY Private Bank',          # Private Banking
    'NIFTY Infra',                 # Infrastructure
    'Nifty Healthcare',            # Healthcare sector
    'Nifty Consumer Durable',      # Consumer Durables
    'NIFTY Consumption',           # Consumption
    'Finnifty'                     # Financial Services
]

class DhanHistoricalDataCollector:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': '*/*',
            'Accept-Language': 'en-GB,en;q=0.9',
            'Connection': 'keep-alive',
            'Origin': 'https://dhan.co',
            'Referer': 'https://dhan.co/',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            'Content-Type': 'application/json; charset=UTF-8',
            'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
        })
        
    def fetch_ohlc_data(self, sec_id: int, symbol: str, exch: str, seg: str, inst: str, days: int) -> Optional[Dict]:
        """
        Fetch OHLC data from Dhan API using historical timestamps
        
        Args:
            sec_id: Security ID from dhan_sector_indices_config
            symbol: Symbol name (e.g., 'NIFTY 50')
            exch: Exchange (IDX for indices, NSE for stocks)
            seg: Segment (I for index, E for equity)
            inst: Instrument (IDX for index, EQUITY for stocks)
            days: Number of days to look back (7, 30, 90, 365)
        
        Returns:
            Dict with OHLC data: {'o': [], 'h': [], 'l': [], 'c': [], 'v': [], 't': []}
        """
        from datetime import datetime, timedelta, timezone
        
        # Calculate timestamps
        end_time = datetime.now(timezone.utc)
        start_time = end_time - timedelta(days=days)
        
        # Convert to Unix timestamps
        start_timestamp = int(start_time.timestamp())
        end_timestamp = int(end_time.timestamp())
        
        # Format datetime strings
        start_time_str = start_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
        end_time_str = end_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
        
        payload = {
            "EXCH": exch,
            "SYM": symbol,
            "SEG": seg,
            "INST": inst,
            "EXPCODE": 0,
            "SEC_ID": sec_id,
            "START": start_timestamp,
            "END": end_timestamp,
            "START_TIME": start_time_str,
            "END_TIME": end_time_str,
            "INTERVAL": "D"  # Daily interval
        }
        
        try:
            response = self.session.post(DHAN_OHLC_API, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if not data.get('success'):
                logging.warning(f"API returned success=false for SEC_ID={sec_id}")
                return None
            
            return data.get('data', {})
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching data for SEC_ID={sec_id}: {e}")
            return None
        except json.JSONDecodeError as e:
            logging.error(f"Error parsing JSON for SEC_ID={sec_id}: {e}")
            return None
        except Exception as e:
            logging.error(f"Unexpected error for SEC_ID={sec_id}: {e}")
            return None
    
    def calculate_price_change(self, ohlc_data: Dict) -> Optional[float]:
        """
        Calculate percentage price change from OHLC data
        
        Formula: ((last_close - first_close) / first_close) * 100
        
        Args:
            ohlc_data: Dict with 'c' key containing array of closing prices
            
        Returns:
            Percentage change rounded to 2 decimals, or None if calculation fails
        """
        try:
            closes = ohlc_data.get('c', [])
            
            if not closes or len(closes) < 2:
                return None
            
            first_close = closes[0]
            last_close = closes[-1]
            
            if first_close == 0:
                return None
            
            price_change = ((last_close - first_close) / first_close) * 100
            return round(price_change, 2)
            
        except Exception as e:
            logging.error(f"Error calculating price change: {e}")
            return None
    
    def get_indices_from_supabase(self) -> List[Dict]:
        """Fetch sector indices from dhan_sector_indices_config that are in our SECTOR_INDICES list"""
        url = f"{SUPABASE_URL}/rest/v1/dhan_sector_indices_config"
        
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
        }
        
        params = {
            'select': 'sec_id,symbol,display_symbol'
        }
        
        try:
            response = self.session.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            all_indices = response.json()
            
            # Filter to only include indices we display in Sector Performance
            filtered_indices = [
                idx for idx in all_indices 
                if idx.get('display_symbol') in SECTOR_INDICES or idx.get('symbol') in SECTOR_INDICES
            ]
            
            return filtered_indices
            
        except Exception as e:
            logging.error(f"Error fetching indices from Supabase: {e}")
            return []
    
    def store_historical_data(self, symbol: str, sec_id: int, price_changes: Dict[str, float], current_price: Optional[float] = None, data_type: str = 'SECTOR', parent_sector: Optional[str] = None) -> bool:
        """
        Store or update historical price changes in dhan_sector_data table
        Uses Supabase upsert with on_conflict resolution
        
        Args:
            symbol: Index/Stock symbol
            sec_id: Security ID from Dhan
            price_changes: Dict with keys '7d', '30d', '90d', '52w'
            current_price: Current price (optional)
            data_type: 'SECTOR' or 'STOCK'
            parent_sector: Parent sector symbol (for stocks only)
        """
        url = f"{SUPABASE_URL}/rest/v1/dhan_sector_data"
        
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal, resolution=merge-duplicates'
        }
        
        current_time = datetime.now(timezone.utc).isoformat()
        
        record = {
            'symbol': symbol,
            'sec_id': sec_id,
            'data_type': data_type,
            'parent_sector': parent_sector,
            'price_change_7d': price_changes.get('7d'),
            'price_change_30d': price_changes.get('30d'),
            'price_change_90d': price_changes.get('90d'),
            'price_change_52w': price_changes.get('52w'),
            'current_price': current_price,
            'updated_at': current_time
        }
        
        try:
            # Try INSERT first, if it fails due to conflict, do UPDATE
            response = self.session.post(url, headers=headers, json=record)
            
            if response.status_code in [200, 201, 204]:
                logging.info(f"✅ Stored data for {symbol}")
                return True
            elif response.status_code == 409:
                # Record exists, do UPDATE instead
                # Build filter for composite unique key
                parent_filter = f"parent_sector=eq.{parent_sector}" if parent_sector else "parent_sector=is.null"
                update_url = f"{url}?symbol=eq.{symbol}&data_type=eq.{data_type}&{parent_filter}"
                
                # Remove unique constraint fields from update payload
                update_record = {
                    'price_change_7d': price_changes.get('7d'),
                    'price_change_30d': price_changes.get('30d'),
                    'price_change_90d': price_changes.get('90d'),
                    'price_change_52w': price_changes.get('52w'),
                    'current_price': current_price,
                    'updated_at': current_time
                }
                
                update_response = self.session.patch(update_url, headers=headers, json=update_record)
                
                if update_response.status_code in [200, 204]:
                    logging.info(f"✅ Updated data for {symbol}")
                    return True
                else:
                    logging.error(f"Failed to update {symbol}: {update_response.status_code} - {update_response.text}")
                    return False
            else:
                logging.error(f"Failed to store {symbol}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logging.error(f"Error storing data for {symbol}: {e}")
            return False
    
    def fetch_sector_stocks(self, sector_symbol: str) -> List[Dict]:
        """
        Fetch list of stocks for a given sector from Dhan website
        
        Args:
            sector_symbol: Sector name (e.g., 'Nifty 50', 'NIFTY Bank')
            
        Returns:
            List of dicts with stock info: [{'symbol': 'RELIANCE', 'sec_id': 11536, ...}, ...]
        """
        # Map sector symbols to their Dhan URLs
        sector_url_mapping = {
            'nifty 50': 'https://dhan.co/indices/nifty-50-companies/',
            'nifty bank': 'https://dhan.co/indices/nifty-bank-companies/',
            'nifty auto': 'https://dhan.co/indices/nifty-auto-companies/',
            'nifty it': 'https://dhan.co/indices/nifty-it-companies/',
            'nifty pharma': 'https://dhan.co/indices/nifty-pharma-companies/',
            'nifty fmcg': 'https://dhan.co/indices/nifty-fmcg-companies/',
            'nifty metal': 'https://dhan.co/indices/nifty-metal-companies/',
            'nifty realty': 'https://dhan.co/indices/nifty-realty-companies/',
            'nifty energy': 'https://dhan.co/indices/nifty-energy-companies/',
            'nifty media': 'https://dhan.co/indices/nifty-media-companies/',
            'nifty psu bank': 'https://dhan.co/indices/nifty-psu-bank-companies/',
            'nifty oil and gas': 'https://dhan.co/indices/nifty-oil-and-gas-companies/',
            'nifty private bank': 'https://dhan.co/indices/nifty-private-bank-companies/',
            'nifty infra': 'https://dhan.co/indices/nifty-infrastructure-companies/',
            'nifty healthcare': 'https://dhan.co/indices/nifty-healthcare-companies/',
            'nifty consumer durable': 'https://dhan.co/indices/nifty-consumer-durable-companies/',
            'nifty consumption': 'https://dhan.co/indices/nifty-india-consumption-companies/',
            'finnifty': 'https://dhan.co/indices/nifty-financial-services-companies/'
        }
        
        # Case-insensitive lookup
        url = sector_url_mapping.get(sector_symbol.lower())
        if not url:
            logging.warning(f"No URL mapping found for sector: {sector_symbol}")
            return []
        
        try:
            # Update headers for web scraping
            scrape_headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-GB,en;q=0.9',
            }
            
            response = self.session.get(url, headers=scrape_headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            next_data_script = soup.find('script', {'id': '__NEXT_DATA__'})
            
            if not next_data_script:
                logging.error(f"Could not find __NEXT_DATA__ for {sector_symbol}")
                return []
            
            data = json.loads(next_data_script.string)
            
            # Extract stock data - try multiple possible locations
            props = data.get('props', {})
            page_props = props.get('pageProps', {})
            
            # Try different possible data sources
            stocks_data = None
            
            # 1. Try sniData first (this is where the actual stock list is!)
            if 'sniData' in page_props:
                sni_data = page_props['sniData']
                if isinstance(sni_data, list) and len(sni_data) > 0:
                    stocks_data = sni_data
            
            # 2. Try secCompData
            if not stocks_data and 'secCompData' in page_props:
                sec_comp_data = page_props['secCompData']
                if isinstance(sec_comp_data, list) and len(sec_comp_data) > 0:
                    stocks_data = sec_comp_data
            
            # 3. Try listData
            if not stocks_data and 'listData' in page_props:
                list_data = page_props['listData']
                if isinstance(list_data, list) and len(list_data) > 0:
                    stocks_data = list_data
            
            # 4. Try scripData.listData
            if not stocks_data and 'scripData' in page_props:
                scrip_data = page_props['scripData']
                if isinstance(scrip_data, dict) and 'listData' in scrip_data:
                    scrip_list = scrip_data['listData']
                    if isinstance(scrip_list, list) and len(scrip_list) > 0:
                        stocks_data = scrip_list
            
            if not stocks_data:
                logging.warning(f"No valid stocks data found for {sector_symbol}")
                return []
            
            # Transform to our format
            stocks = []
            for stock in stocks_data:
                # sniData format: Sym, DispSym, Sid (no SCRIP_CODE)
                # Alternative formats: SYMBOL, SCRIP_CODE
                symbol = stock.get('Sym') or stock.get('SYMBOL') or stock.get('DispSym') or stock.get('Symbol')
                sec_id = stock.get('Sid') or stock.get('SCRIP_CODE') or stock.get('security_id')
                
                if not symbol or not sec_id:
                    continue
                
                # Skip if this is the index itself (not a stock)
                if 'NIFTY' in symbol.upper() or 'FINNIFTY' in symbol.upper() or 'SENSEX' in symbol.upper():
                    continue
                
                stocks.append({
                    'symbol': symbol,
                    'api_symbol': stock.get('Sym', symbol),  # Use Sym for API calls
                    'sec_id': sec_id,
                    'exchange': 'NSE',  # All NSE stocks
                    'segment': 'E',
                    'instrument': 'EQUITY'
                })
            
            return stocks
            
        except Exception as e:
            logging.error(f"Error fetching stocks for {sector_symbol}: {e}")
            return []
    
    def process_index(self, index: Dict) -> bool:
        """
        Process a single index: fetch all durations and calculate price changes
        
        Args:
            index: Dict with 'sec_id', 'symbol', 'display_symbol'
            
        Returns:
            True if successfully stored data, False otherwise
        """
        sec_id = index['sec_id']
        symbol = index.get('display_symbol', index.get('symbol'))
        api_symbol = index.get('symbol')  # Use symbol for API call
        
        # Duration mapping: our key -> days to look back
        durations = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '52w': 365  # Approximate 52 weeks = 365 days
        }
        
        price_changes = {}
        current_price = None
        
        for period, days in durations.items():
            # Add delay between requests to avoid rate limiting
            time.sleep(1)
            
            ohlc_data = self.fetch_ohlc_data(
                sec_id=sec_id,
                symbol=api_symbol,
                exch="IDX",
                seg="I",
                inst="IDX",
                days=days
            )
            
            if ohlc_data:
                price_change = self.calculate_price_change(ohlc_data)
                if price_change is not None:
                    price_changes[period] = price_change
                    
                    # Get current price from the last close of any duration
                    if current_price is None and ohlc_data.get('c'):
                        current_price = ohlc_data['c'][-1]
        
        if price_changes:
            return self.store_historical_data(
                symbol=symbol,
                sec_id=sec_id,
                price_changes=price_changes,
                current_price=current_price,
                data_type='SECTOR',
                parent_sector=None
            )
        else:
            logging.warning(f"No price changes calculated for {symbol}")
            return False
    
    def process_stock(self, stock: Dict, parent_sector: str) -> bool:
        """
        Process a single stock: fetch all durations and calculate price changes
        
        Args:
            stock: Dict with 'sec_id', 'symbol', 'api_symbol', 'exchange', 'segment', 'instrument'
            parent_sector: Parent sector symbol (e.g., 'Nifty 50')
            
        Returns:
            True if successfully stored data, False otherwise
        """
        sec_id = stock['sec_id']
        symbol = stock['symbol']
        api_symbol = stock.get('api_symbol', symbol)
        exchange = stock.get('exchange', 'NSE')
        segment = stock.get('segment', 'E')
        instrument = stock.get('instrument', 'EQUITY')
        
        # Duration mapping: our key -> days to look back
        durations = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '52w': 365
        }
        
        price_changes = {}
        current_price = None
        
        for period, days in durations.items():
            # Add delay between requests to avoid rate limiting
            time.sleep(0.5)  # Shorter delay for stocks
            
            ohlc_data = self.fetch_ohlc_data(
                sec_id=sec_id,
                symbol=api_symbol,
                exch=exchange,
                seg=segment,
                inst=instrument,
                days=days
            )
            
            if ohlc_data:
                price_change = self.calculate_price_change(ohlc_data)
                if price_change is not None:
                    price_changes[period] = price_change
                    
                    # Get current price from the last close
                    if current_price is None and ohlc_data.get('c'):
                        current_price = ohlc_data['c'][-1]
        
        if price_changes:
            return self.store_historical_data(
                symbol=symbol,
                sec_id=sec_id,
                price_changes=price_changes,
                current_price=current_price,
                data_type='STOCK',
                parent_sector=parent_sector
            )
        else:
            logging.warning(f"    No price changes calculated for stock {symbol}")
            return False
    
    def run(self, limit: Optional[int] = None, include_stocks: bool = True):
        """
        Main execution method - processes in two phases:
        Phase 1: All sector indices
        Phase 2: All stocks within those sectors (if include_stocks=True)
        
        Args:
            limit: Optional limit on number of indices to process (for testing)
            include_stocks: Whether to also fetch historical data for stocks within each sector
        """
        logging.info("🚀 Starting Dhan Historical Data Collector\n")
        
        # Fetch all indices
        indices = self.get_indices_from_supabase()
        
        if not indices:
            logging.error("❌ No indices found in database")
            return False
        
        # Apply limit if specified (for testing)
        if limit:
            indices = indices[:limit]
        
        # ============================================================
        # PHASE 1: Process all sector indices
        # ============================================================
        logging.info("="*60)
        logging.info("📊 PHASE 1: PROCESSING SECTOR INDICES")
        logging.info("="*60 + "\n")
        
        sectors_successful = 0
        sectors_failed = 0
        successful_sectors = []  # Track successful sectors for Phase 2
        
        for i, index in enumerate(indices, 1):
            sector_symbol = index.get('display_symbol', index.get('symbol'))
            
            try:
                logging.info(f"Sector {i}/{len(indices)}: {sector_symbol}")
                
                if self.process_index(index):
                    sectors_successful += 1
                    successful_sectors.append(index)
                else:
                    sectors_failed += 1
                    
            except Exception as e:
                logging.error(f"❌ Error processing sector {sector_symbol}: {e}")
                sectors_failed += 1
        
        # Phase 1 Summary
        logging.info(f"\n{'='*60}")
        logging.info("📊 PHASE 1 COMPLETE - SECTOR INDICES")
        logging.info(f"{'='*60}")
        logging.info(f"✅ Successful: {sectors_successful}")
        logging.info(f"❌ Failed: {sectors_failed}")
        logging.info(f"📊 Total: {len(indices)}")
        logging.info(f"{'='*60}\n")
        
        # ============================================================
        # PHASE 2: Process all stocks (if enabled)
        # ============================================================
        stocks_successful = 0
        stocks_failed = 0
        
        if include_stocks and successful_sectors:
            logging.info("="*60)
            logging.info("📈 PHASE 2: PROCESSING STOCKS")
            logging.info("="*60 + "\n")
            
            for i, index in enumerate(successful_sectors, 1):
                sector_symbol = index.get('display_symbol', index.get('symbol'))
                
                try:
                    logging.info(f"Sector {i}/{len(successful_sectors)}: {sector_symbol}")
                    
                    stocks = self.fetch_sector_stocks(sector_symbol)
                    
                    if stocks:
                        for stock in stocks:
                            try:
                                if self.process_stock(stock, sector_symbol):
                                    stocks_successful += 1
                                else:
                                    stocks_failed += 1
                            except Exception as e:
                                logging.error(f"Error processing stock {stock.get('symbol')}: {e}")
                                stocks_failed += 1
                        
                except Exception as e:
                    logging.error(f"❌ Error fetching stocks for {sector_symbol}: {e}")
            
            # Phase 2 Summary
            logging.info(f"\n{'='*60}")
            logging.info("📈 PHASE 2 COMPLETE - STOCKS")
            logging.info(f"{'='*60}")
            logging.info(f"✅ Successful: {stocks_successful}")
            logging.info(f"❌ Failed: {stocks_failed}")
            logging.info(f"📊 Total: {stocks_successful + stocks_failed}")
            logging.info(f"{'='*60}\n")
        
        # ============================================================
        # FINAL SUMMARY
        # ============================================================
        logging.info("="*60)
        logging.info("🎉 FINAL SUMMARY")
        logging.info("="*60)
        logging.info(f"Sectors: {sectors_successful} successful, {sectors_failed} failed")
        if include_stocks:
            logging.info(f"Stocks: {stocks_successful} successful, {stocks_failed} failed")
            logging.info(f"Total Records: {sectors_successful + stocks_successful}")
        logging.info("="*60 + "\n")
        
        return sectors_successful > 0

def main():
    """Main entry point"""
    import sys
    
    # Parse command line arguments
    # Example: python3 dhan_historical_data_collector.py                    # Both phases (default)
    # Example: python3 dhan_historical_data_collector.py --sectors-only     # Phase 1 only
    # Example: python3 dhan_historical_data_collector.py --limit 2          # Limit to 2 sectors
    limit = None
    include_stocks = True  # Default: run both phases
    
    for i, arg in enumerate(sys.argv[1:]):
        if arg == '--stocks':
            include_stocks = True
        elif arg == '--sectors-only':
            include_stocks = False
        elif arg == '--limit' and i + 1 < len(sys.argv) - 1:
            try:
                limit = int(sys.argv[i + 2])
            except (ValueError, IndexError):
                pass
    
    collector = DhanHistoricalDataCollector()
    success = collector.run(limit=limit, include_stocks=include_stocks)
    
    if success:
        logging.info("✅ Historical data collection completed successfully")
        exit(0)
    else:
        logging.error("❌ Historical data collection failed")
        exit(1)

if __name__ == '__main__':
    main()

