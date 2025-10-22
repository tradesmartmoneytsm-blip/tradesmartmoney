#!/usr/bin/env python3
"""
Momentum Stocks Data Collector
Fetches high-momentum stocks from Dhan API daily at 3:00 PM IST
Filters by market cap > 10,000 CR and price > ₹200
"""

import requests
import json
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Optional
import os

# Configuration - Environment variables
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', 'https://ejnuocizpsfcobhyxgrd.supabase.co')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY')

# Dhan API configuration
DHAN_API_URL = 'https://ow-scanx-analytics.dhan.co/customscan/fetchdt'
DHAN_HEADERS = {
    'accept': '*/*',
    'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7,mr;q=0.6',
    'content-type': 'application/json; charset=UTF-8',
    'origin': 'https://dhan.co',
    'referer': 'https://dhan.co/',
    'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
}

# API payload for momentum stocks (stocks at new highs)
DHAN_PAYLOAD = {
    "data": {
        "sort": "Mcap",
        "sorder": "desc",
        "count": 250,
        "params": [
            {"field": "High", "field2": "High1Yr", "op": "gt"},
            {"field": "OgInst", "op": "", "val": "ES"},
            {"field": "Exch", "op": "", "val": "NSE"}
        ],
        "fields": [
            "Isin", "DispSym", "Mcap", "Pe", "DivYeild", "Revenue",
            "Year1RevenueGrowth", "NetProfitMargin", "YoYLastQtrlyProfitGrowth",
            "EBIDTAMargin", "volume", "PricePerchng1year", "PricePerchng3year",
            "PricePerchng5year", "Ind_Pe", "Pb", "DivYeild", "Eps",
            "DaySMA50CurrentCandle", "DaySMA200CurrentCandle", "DayRSI14CurrentCandle",
            "ROCE", "Ltp", "Roe", "RtAwayFrom5YearHigh", "RtAwayFrom1MonthHigh",
            "High5yr", "High3Yr", "High1Yr", "High1Wk", "Sym",
            "PricePerchng1mon", "PricePerchng1week", "PricePerchng3mon",
            "YearlyEarningPerShare", "OCFGrowthOnYr", "Year1CAGREPSGrowth",
            "NetChangeInCash", "FreeCashFlow", "PricePerchng2week",
            "DayBbUpper_Sub_BbLower", "DayATR14CurrentCandleMul_2",
            "Min5HighCurrentCandle", "Min15HighCurrentCandle",
            "Min5EMA50CurrentCandle", "Min15EMA50CurrentCandle",
            "Min15SMA100CurrentCandle", "Open", "BcClose", "Rmp", "PledgeBenefit"
        ],
        "pgno": 1
    }
}

# Filters
MIN_MARKET_CAP = 10000  # 10,000 crores
MIN_PRICE = 200  # ₹200

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%dT%H:%M:%SZ'
)

class MomentumStocksCollector:
    """Collects momentum stocks data from Dhan API and stores in Supabase"""
    
    def __init__(self):
        if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
            raise ValueError("Missing Supabase credentials in environment variables")
        
        logging.info(f"🔗 Supabase URL: {SUPABASE_URL}")
        logging.info(f"🔑 Service Key: {'*' * 20}...{SUPABASE_SERVICE_KEY[-10:]}")
    
    def get_ist_time(self) -> datetime:
        """Get current IST time"""
        return datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)
    
    def is_market_day(self) -> bool:
        """Check if today is a market day (Monday to Friday)"""
        ist_now = self.get_ist_time()
        return ist_now.weekday() < 5  # 0-4 = Monday to Friday
    
    def fetch_dhan_data(self) -> Optional[List[Dict]]:
        """Fetch momentum stocks data from Dhan API"""
        try:
            logging.info("🔍 Fetching momentum stocks from Dhan API...")
            
            response = requests.post(
                DHAN_API_URL,
                headers=DHAN_HEADERS,
                json=DHAN_PAYLOAD,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if 'data' in data and isinstance(data['data'], list):
                    stocks = data['data']
                    logging.info(f"✅ Successfully fetched {len(stocks)} stocks from Dhan API")
                    return stocks
                else:
                    logging.error(f"❌ Unexpected API response structure: {list(data.keys())}")
                    return None
            else:
                logging.error(f"❌ Dhan API request failed: {response.status_code}")
                logging.error(f"Response: {response.text[:500]}")
                return None
                
        except Exception as e:
            logging.error(f"❌ Error fetching Dhan data: {e}")
            return None
    
    def filter_stocks(self, stocks: List[Dict]) -> List[Dict]:
        """Filter stocks by market cap and price criteria"""
        filtered_stocks = []
        
        for stock in stocks:
            try:
                # Extract values with safe defaults
                market_cap = float(stock.get('Mcap', 0))
                current_price = float(stock.get('Ltp', 0))
                symbol = stock.get('Sym', '').strip()
                
                # Apply filters
                if (market_cap >= MIN_MARKET_CAP and 
                    current_price >= MIN_PRICE and 
                    symbol):
                    filtered_stocks.append(stock)
                    
            except (ValueError, TypeError) as e:
                logging.warning(f"⚠️ Skipping stock due to data error: {e}")
                continue
        
        logging.info(f"📊 Filtered to {len(filtered_stocks)} stocks (MCap ≥ {MIN_MARKET_CAP} CR, Price ≥ ₹{MIN_PRICE})")
        return filtered_stocks
    
    def transform_stock_data(self, stock: Dict) -> Dict:
        """Transform Dhan API data to our database format"""
        try:
            return {
                'symbol': stock.get('Sym', '').strip(),
                'isin': stock.get('Isin', ''),
                'display_symbol': stock.get('DispSym', ''),
                'current_price': float(stock.get('Ltp', 0)),
                'market_cap': float(stock.get('Mcap', 0)),
                'price_change_1week': float(stock.get('PricePerchng1week', 0)),
                'price_change_2week': float(stock.get('PricePerchng2week', 0)),
                'price_change_1month': float(stock.get('PricePerchng1mon', 0)),
                'price_change_3month': float(stock.get('PricePerchng3mon', 0)),
                'price_change_1year': float(stock.get('PricePerchng1year', 0)),
                'pe_ratio': float(stock.get('Pe', 0)) if stock.get('Pe') else None,
                'industry_pe': float(stock.get('Ind_Pe', 0)) if stock.get('Ind_Pe') else None,
                'roce': float(stock.get('ROCE', 0)) if stock.get('ROCE') else None,
                'roe': float(stock.get('Roe', 0)) if stock.get('Roe') else None,
                'distance_from_1month_high': float(stock.get('RtAwayFrom1MonthHigh', 0)),
                'eps_growth_1year': float(stock.get('Year1CAGREPSGrowth', 0)) if stock.get('Year1CAGREPSGrowth') else None,
                'revenue_growth_1year': float(stock.get('Year1RevenueGrowth', 0)) if stock.get('Year1RevenueGrowth') else None,
                'yearly_earning_per_share': float(stock.get('YearlyEarningPerShare', 0)) if stock.get('YearlyEarningPerShare') else None,
                'quarterly_profit_growth_yoy': float(stock.get('YoYLastQtrlyProfitGrowth', 0)) if stock.get('YoYLastQtrlyProfitGrowth') else None,
                'analysis_date': datetime.now().strftime('%Y-%m-%d')
            }
        except (ValueError, TypeError) as e:
            logging.error(f"❌ Error transforming stock data for {stock.get('Sym', 'Unknown')}: {e}")
            return None
    
    def get_existing_symbols(self) -> set:
        """Get symbols that already exist in the database"""
        try:
            url = f"{SUPABASE_URL}/rest/v1/momentum_stocks?select=symbol"
            
            response = requests.get(
                url,
                headers={
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
                },
                timeout=30
            )
            
            if response.status_code == 200:
                existing_data = response.json()
                existing_symbols = {record['symbol'] for record in existing_data}
                logging.info(f"📊 Found {len(existing_symbols)} existing symbols in database")
                return existing_symbols
            elif response.status_code == 404:
                logging.info("📊 Table 'momentum_stocks' doesn't exist yet - treating as empty database")
                return set()
            else:
                logging.warning(f"⚠️ Could not fetch existing symbols: {response.status_code}")
                return set()
                
        except Exception as e:
            logging.error(f"❌ Error fetching existing symbols: {e}")
            return set()
    
    def filter_new_stocks_only(self, stocks_data: List[Dict], existing_symbols: set) -> List[Dict]:
        """Filter out stocks that already exist in database"""
        new_stocks = []
        skipped_count = 0
        
        for stock in stocks_data:
            symbol = stock.get('symbol', '')
            if symbol not in existing_symbols:
                new_stocks.append(stock)
            else:
                skipped_count += 1
                logging.info(f"⏭️ Skipping {symbol} - already exists in database")
        
        logging.info(f"📈 New stocks to add: {len(new_stocks)}")
        logging.info(f"⏭️ Existing stocks skipped: {skipped_count}")
        
        return new_stocks
    
    def store_in_database(self, stocks_data: List[Dict]) -> bool:
        """Store only NEW momentum stocks in database (skip existing symbols)"""
        if not stocks_data:
            logging.warning("⚠️ No data to store")
            return False
        
        try:
            # Step 1: Get existing symbols from database
            existing_symbols = self.get_existing_symbols()
            
            # Step 2: Filter out stocks that already exist
            new_stocks_only = self.filter_new_stocks_only(stocks_data, existing_symbols)
            
            if not new_stocks_only:
                logging.info("✅ No new stocks to add - all stocks already exist in database")
                return True
            
            # Step 3: Insert only new stocks
            insert_url = f"{SUPABASE_URL}/rest/v1/momentum_stocks"
            
            response = requests.post(
                insert_url,
                headers={
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                json=new_stocks_only,
                timeout=60
            )
            
            if response.status_code in [200, 201]:
                logging.info(f"✅ Successfully added {len(new_stocks_only)} NEW momentum stocks to database")
                logging.info("📊 Existing stocks preserved with original entry dates")
                return True
            elif response.status_code == 404:
                logging.error("❌ Table 'momentum_stocks' doesn't exist!")
                logging.error("🔧 Please create the table first using: database/schemas/momentum-stocks-schema.sql")
                logging.error("💡 Or run: create_momentum_table.sql in Supabase SQL Editor")
                return False
            else:
                logging.error(f"❌ Failed to insert new stocks: {response.status_code}")
                logging.error(f"Response: {response.text}")
                return False
                
        except Exception as e:
            logging.error(f"❌ Error storing data in database: {e}")
            return False
    
    def run_collection(self) -> bool:
        """Main collection process"""
        try:
            logging.info("🚀 Starting Momentum Stocks Collection")
            
            # Check if it's a market day
            if not self.is_market_day():
                logging.info("📅 Today is not a market day - skipping collection")
                return True
            
            # Fetch data from Dhan API
            raw_stocks = self.fetch_dhan_data()
            if not raw_stocks:
                return False
            
            # Apply filters
            filtered_stocks = self.filter_stocks(raw_stocks)
            if not filtered_stocks:
                logging.warning("⚠️ No stocks passed the filtering criteria")
                return False
            
            # Transform data
            transformed_stocks = []
            for stock in filtered_stocks:
                transformed = self.transform_stock_data(stock)
                if transformed:
                    transformed_stocks.append(transformed)
            
            if not transformed_stocks:
                logging.warning("⚠️ No stocks could be transformed")
                return False
            
            # Store in database
            success = self.store_in_database(transformed_stocks)
            
            if success:
                logging.info(f"🎯 Collection Complete: {len(transformed_stocks)} momentum stocks stored")
                
                # Log top 10 stocks by market cap
                top_stocks = sorted(transformed_stocks, key=lambda x: x['market_cap'], reverse=True)[:10]
                logging.info("📈 Top 10 Momentum Stocks by Market Cap:")
                for i, stock in enumerate(top_stocks, 1):
                    logging.info(f"   {i:2d}. {stock['symbol']:12s} | ₹{stock['current_price']:8.2f} | {stock['market_cap']:8.0f} CR | 1M: {stock['price_change_1month']:+5.1f}%")
                
                return True
            else:
                return False
                
        except Exception as e:
            logging.error(f"💥 Fatal error in collection process: {e}")
            return False

def main():
    """Main execution function"""
    try:
        collector = MomentumStocksCollector()
        success = collector.run_collection()
        
        if success:
            logging.info("✅ Momentum stocks collection completed successfully")
        else:
            logging.error("❌ Momentum stocks collection failed")
            exit(1)
            
    except Exception as e:
        logging.error(f"💥 Fatal error: {e}")
        exit(1)

if __name__ == "__main__":
    main()
