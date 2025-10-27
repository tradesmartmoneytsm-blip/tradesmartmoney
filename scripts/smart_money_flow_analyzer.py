#!/usr/bin/env python3
"""
Smart Money Flow Analyzer
Compares today's money flow pacing with yesterday's at same time intervals
Identifies stocks with significantly higher turnover pacing than previous day
"""

import requests
import json
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Tuple
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

# Configuration - All NSE Indices for comprehensive coverage
ALL_NSE_INDICES = [
    'NIFTY 50', 'NIFTY NEXT 50', 'NIFTY MIDCAP 50', 'NIFTY SMALLCAP 50',
    'NIFTY BANK', 'NIFTY IT', 'NIFTY PHARMA', 'NIFTY AUTO', 'NIFTY FMCG',
    'NIFTY ENERGY', 'NIFTY METAL', 'NIFTY REALTY', 'NIFTY HEALTHCARE',
    'NIFTY CONSUMPTION', 'NIFTY CONSUMER DURABLE', 'NIFTY INFRA', 'NIFTY MEDIA',
    'NIFTY OIL & GAS', 'NIFTY COMMODITIES', 'NIFTY PSE', 'NIFTY CPSE',
    'FINNIFTY', 'NIFTY PSU BANK', 'NIFTY PRIVATE BANK'
]
MIN_TURNOVER_THRESHOLD = 50000000  # 5 Cr minimum turnover to consider
SIGNIFICANT_INCREASE_THRESHOLD = 1.5  # 50% increase threshold
MIN_ABSOLUTE_INCREASE = 100000000  # 10 Cr minimum absolute increase

class SmartMoneyFlowAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json'
        }

    def get_current_ist_time(self) -> datetime:
        """Get current IST time"""
        utc_now = datetime.now(timezone.utc)
        ist_now = utc_now + timedelta(hours=5, minutes=30)
        return ist_now

    def format_time_for_query(self, dt: datetime) -> str:
        """Format datetime for NSE timestamp comparison"""
        return dt.strftime('%d-%b-%Y %H:%M:%S')
    
    def get_last_trading_day(self, current_date: datetime) -> datetime:
        """Find the last trading day (skip weekends and holidays)"""
        # Start from yesterday and go back until we find a trading day
        check_date = current_date - timedelta(days=1)
        
        # Go back up to 7 days to handle long weekends/holidays
        for _ in range(7):
            # Skip weekends (Saturday=5, Sunday=6)
            if check_date.weekday() < 5:  # Monday=0 to Friday=4
                # Check if we have data for this date in the database
                date_str = check_date.strftime('%d-%b-%Y')
                
                # Quick check if data exists for this date
                try:
                    url = f"{SUPABASE_URL}/rest/v1/nse_sector_data"
                    params = {
                        'select': 'timestamp',
                        'timestamp': f'like.{date_str}*',
                        'limit': '1'
                    }
                    
                    response = self.session.get(url, headers=self.headers, params=params, timeout=10)
                    if response.status_code == 200 and response.json():
                        logging.info(f"✅ Found last trading day: {date_str}")
                        return check_date
                        
                except Exception as e:
                    logging.warning(f"⚠️ Error checking date {date_str}: {e}")
            
            # Go back one more day
            check_date -= timedelta(days=1)
        
        # Fallback: use 1 day ago if no data found
        logging.warning("⚠️ Could not find last trading day, using yesterday as fallback")
        return current_date - timedelta(days=1)

    def get_stock_turnover_at_time(self, symbol: str, target_date: str, target_time: str) -> Optional[float]:
        """Get stock's latest turnover at or before specific time on specific date"""
        try:
            # Use Supabase REST API to get data for the symbol on target date
            url = f"{SUPABASE_URL}/rest/v1/nse_sector_data"
            params = {
                'select': 'total_traded_value,timestamp',
                'symbol': f'eq.{symbol}',
                'timestamp': f'like.{target_date}*',
                'data_type': 'eq.STOCK',
                'order': 'timestamp.desc',  # Order by timestamp, not analysis_timestamp
                'limit': '100'  # Get more records to find the right time
            }
            
            response = self.session.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code == 200:
                records = response.json()
                
                # Find the latest record at or before target time on target date
                target_datetime_str = f"{target_date} {target_time}"
                best_turnover = None
                best_timestamp = None
                
                for record in records:
                    record_timestamp = record.get('timestamp', '')
                    turnover = record.get('total_traded_value', 0)
                    
                    # Check if this record is at or before target time
                    if record_timestamp and turnover and turnover > 0:
                        if record_timestamp <= target_datetime_str:
                            # Take the latest (highest timestamp) that's still before target time
                            if best_timestamp is None or record_timestamp > best_timestamp:
                                best_turnover = turnover
                                best_timestamp = record_timestamp
                
                if best_turnover:
                    logging.debug(f"✅ {symbol} latest turnover until {target_time} on {target_date}: ₹{best_turnover/10000000:.2f}Cr at {best_timestamp}")
                    return float(best_turnover)
            
            return None
            
        except Exception as e:
            logging.error(f"❌ Error getting turnover for {symbol}: {e}")
            return None

    def check_existing_alert_today(self, symbol: str, trading_date: str) -> bool:
        """Check if stock already has a smart money alert today"""
        try:
            url = f"{SUPABASE_URL}/rest/v1/intraday_activities"
            params = {
                'select': 'id',
                'stock_name': f'eq.{symbol}',
                'trading_date': f'eq.{trading_date}',
                'activity_name': 'like.*Smart Money Alert*',
                'limit': '1'
            }
            
            response = self.session.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                exists = len(data) > 0
                if exists:
                    logging.debug(f"🔄 {symbol} already has smart money alert today - skipping")
                return exists
            else:
                logging.warning(f"⚠️ Could not check existing alerts for {symbol}: {response.status_code}")
                return False
                
        except Exception as e:
            logging.error(f"❌ Error checking existing alert for {symbol}: {e}")
            return False

    def get_all_nse_stocks(self) -> List[str]:
        """Get all NSE stock symbols from all indices"""
        try:
            # Get latest data from all indices
            url = f"{SUPABASE_URL}/rest/v1/nse_sector_data"
            params = {
                'select': 'symbol',
                'index_name': f'in.({",".join(ALL_NSE_INDICES)})',
                'data_type': 'eq.STOCK',
                'order': 'analysis_timestamp.desc',
                'limit': '1000'  # Increased limit for all indices
            }
            
            response = self.session.get(url, headers=self.headers, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                symbols = list(set([item['symbol'] for item in data]))
                logging.info(f"✅ Found {len(symbols)} unique stocks across all NSE indices")
                return symbols
            else:
                logging.error(f"❌ Failed to get stock symbols: {response.status_code}")
                return []
                
        except Exception as e:
            logging.error(f"❌ Error getting stock symbols: {e}")
            return []

    def analyze_money_flow_pacing(self) -> List[Dict]:
        """Main analysis function to compare today vs last trading day money flow pacing"""
        current_time = self.get_current_ist_time()
        
        # Format dates for queries
        today_date = current_time.strftime('%d-%b-%Y')
        
        # Find last trading day (skip weekends and holidays)
        last_trading_date = self.get_last_trading_day(current_time)
        last_trading_date_str = last_trading_date.strftime('%d-%b-%Y')
        current_time_str = current_time.strftime('%H:%M:%S')
        
        logging.info(f"🔍 Analyzing money flow pacing at {today_date} {current_time_str}")
        logging.info(f"📊 Comparing with last trading day: {last_trading_date_str}")
        
        # Get all NSE stocks from all indices
        stocks = self.get_all_nse_stocks()
        
        if not stocks:
            logging.error("❌ No stocks found for analysis")
            return []
        
        significant_flows = []
        processed_count = 0
        
        for symbol in stocks:
            try:
                processed_count += 1
                
                # Get today's latest turnover until current time
                today_turnover = self.get_stock_turnover_at_time(symbol, today_date, current_time_str)
                
                # Get last trading day's latest turnover until same time
                yesterday_turnover = self.get_stock_turnover_at_time(symbol, last_trading_date_str, current_time_str)
                
                if today_turnover is None or yesterday_turnover is None:
                    continue
                
                # Skip if today's turnover is below minimum threshold
                if today_turnover < MIN_TURNOVER_THRESHOLD:
                    continue
                
                # Calculate increase metrics
                absolute_increase = today_turnover - yesterday_turnover
                percentage_increase = (absolute_increase / yesterday_turnover) * 100 if yesterday_turnover > 0 else 0
                
                # Check if this is significant money flow increase
                is_significant = (
                    percentage_increase >= (SIGNIFICANT_INCREASE_THRESHOLD - 1) * 100 and  # 50%+ increase
                    absolute_increase >= MIN_ABSOLUTE_INCREASE  # 10Cr+ absolute increase
                )
                
                if is_significant:
                    # Check if stock already has an alert today (prevent duplicates)
                    if self.check_existing_alert_today(symbol, current_time.strftime('%Y-%m-%d')):
                        logging.info(f"🔄 {symbol} already alerted today - skipping duplicate")
                        continue
                    flow_data = {
                        'symbol': symbol,
                        'today_turnover': today_turnover,
                        'yesterday_turnover': yesterday_turnover,
                        'absolute_increase': absolute_increase,
                        'percentage_increase': percentage_increase,
                        'today_turnover_cr': round(today_turnover / 10000000, 2),
                        'yesterday_turnover_cr': round(yesterday_turnover / 10000000, 2),
                        'increase_cr': round(absolute_increase / 10000000, 2),
                        'analysis_time': f"{today_date} {current_time_str}"
                    }
                    
                    significant_flows.append(flow_data)
                    
                    logging.info(f"🚀 {symbol}: Today ₹{flow_data['today_turnover_cr']}Cr vs Last Trading Day ₹{flow_data['yesterday_turnover_cr']}Cr (+{percentage_increase:.1f}%)")
                
            except Exception as e:
                logging.error(f"❌ Error analyzing {symbol}: {e}")
                continue
        
        # Sort by percentage increase (highest first)
        significant_flows.sort(key=lambda x: x['percentage_increase'], reverse=True)
        
        logging.info(f"🎯 Processed {processed_count} stocks, found {len(significant_flows)} with significant money flow increase")
        
        return significant_flows

    def store_activity_alerts(self, flow_data: List[Dict]) -> bool:
        """Store significant money flow alerts in activities table"""
        if not flow_data:
            logging.info("📊 No significant money flows to store")
            return True
        
        try:
            activities = []
            current_time = datetime.now(timezone.utc).isoformat()
            
            for stock_flow in flow_data[:10]:  # Top 10 stocks
                activity = {
                    'stock_name': stock_flow['symbol'],
                    'activity_name': f"🚀 Smart Money Alert: {stock_flow['symbol']} turnover surged {stock_flow['percentage_increase']:.1f}% to ₹{stock_flow['today_turnover_cr']}Cr (vs ₹{stock_flow['yesterday_turnover_cr']}Cr yesterday)",
                    'activity_timestamp': current_time,
                    'trading_date': datetime.now(timezone.utc).strftime('%Y-%m-%d'),
                    'is_active': True
                }
                activities.append(activity)
            
            # Store in activities table
            url = f"{SUPABASE_URL}/rest/v1/intraday_activities"
            response = self.session.post(url, headers=self.headers, json=activities, timeout=15)
            
            if response.status_code in [200, 201]:
                logging.info(f"✅ Stored {len(activities)} smart money flow activities")
                return True
            else:
                logging.error(f"❌ Failed to store activities: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logging.error(f"❌ Error storing activities: {e}")
            return False

    def run_analysis(self):
        """Main execution function"""
        try:
            logging.info("🚀 Starting Smart Money Flow Analysis")
            
            # Check if it's market hours (9:20 AM - 3:30 PM IST, Mon-Fri)
            current_time = self.get_current_ist_time()
            hour = current_time.hour
            minute = current_time.minute
            weekday = current_time.weekday()  # 0=Monday, 6=Sunday
            
            # Market hours check
            is_market_hours = (
                weekday < 5 and  # Monday to Friday
                ((hour == 9 and minute >= 20) or (10 <= hour <= 14) or (hour == 15 and minute <= 30))
            )
            
            if not is_market_hours:
                logging.info(f"⏰ Outside market hours - Current time: {current_time.strftime('%Y-%m-%d %H:%M:%S')} IST")
                return
            
            # Perform money flow analysis
            significant_flows = self.analyze_money_flow_pacing()
            
            if significant_flows:
                # Store alerts in activities
                self.store_activity_alerts(significant_flows)
                
                # Log summary
                logging.info("📈 Top Smart Money Flow Alerts:")
                for i, flow in enumerate(significant_flows[:5], 1):
                    logging.info(f"   {i}. {flow['symbol']}: +{flow['percentage_increase']:.1f}% (₹{flow['increase_cr']}Cr increase)")
            else:
                logging.info("📊 No significant money flow increases detected")
            
            logging.info("✅ Smart Money Flow Analysis Complete")
            
        except Exception as e:
            logging.error(f"💥 Fatal error in analysis: {e}")

def main():
    """Main execution function"""
    try:
        analyzer = SmartMoneyFlowAnalyzer()
        analyzer.run_analysis()
        
    except KeyboardInterrupt:
        logging.info("⏹️ Analysis stopped by user")
    except Exception as e:
        logging.error(f"💥 Fatal error: {e}")

if __name__ == "__main__":
    main()
