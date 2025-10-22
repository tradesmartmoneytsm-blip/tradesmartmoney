#!/usr/bin/env python3
"""
Smart Money Flow Analyzer
Compares today's money flow pacing with yesterday's at same time intervals
Identifies stocks with significantly higher turnover pacing than previous day
"""

import requests
import json
from datetime import datetime, timedelta
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

# Configuration
MIDCAP_SMALLCAP_INDICES = ['NIFTY MIDCAP 50', 'NIFTY SMALLCAP 50']
MIN_TURNOVER_THRESHOLD = 50000000  # 5 Cr minimum turnover to consider
SIGNIFICANT_INCREASE_THRESHOLD = 1.5  # 50% increase threshold
MIN_ABSOLUTE_INCREASE = 250000000  # 25 Cr minimum absolute increase

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
        utc_now = datetime.utcnow()
        ist_now = utc_now + timedelta(hours=5, minutes=30)
        return ist_now

    def format_time_for_query(self, dt: datetime) -> str:
        """Format datetime for NSE timestamp comparison"""
        return dt.strftime('%d-%b-%Y %H:%M:%S')

    def get_stock_turnover_at_time(self, symbol: str, target_date: str, target_time: str) -> Optional[float]:
        """Get stock's latest turnover at or before specific time on specific date"""
        try:
            # Use Supabase REST API to get data for the symbol on target date
            url = f"{SUPABASE_URL}/rest/v1/nse_sector_data"
            params = {
                'select': 'total_traded_value,timestamp',
                'symbol': f'eq.{symbol}',
                'data_type': 'eq.STOCK',
                'order': 'analysis_timestamp.desc',
                'limit': '50'  # Get recent records to find the right time
            }
            
            response = self.session.get(url, headers=self.headers, params=params, timeout=10)
            
            if response.status_code == 200:
                records = response.json()
                
                # Find the latest record at or before target time on target date
                target_datetime_str = f"{target_date} {target_time}"
                
                for record in records:
                    record_timestamp = record.get('timestamp', '')
                    
                    # Check if this record is from target date and at/before target time
                    if target_date in record_timestamp:
                        # Simple string comparison for time (works for same date)
                        if record_timestamp <= target_datetime_str:
                            turnover = record.get('total_traded_value', 0)
                            if turnover and turnover > 0:
                                logging.debug(f"✅ {symbol} turnover at {record_timestamp}: ₹{turnover/10000000:.2f}Cr")
                                return float(turnover)
                
                # If no exact match, try to get latest from that date
                for record in records:
                    if target_date in record.get('timestamp', ''):
                        turnover = record.get('total_traded_value', 0)
                        if turnover and turnover > 0:
                            return float(turnover)
            
            return None
            
        except Exception as e:
            logging.error(f"❌ Error getting turnover for {symbol}: {e}")
            return None

    def get_midcap_smallcap_stocks(self) -> List[str]:
        """Get all MIDCAP 50 and SMALLCAP 50 stock symbols"""
        try:
            # Get latest data from both indices
            url = f"{SUPABASE_URL}/rest/v1/nse_sector_data"
            params = {
                'select': 'symbol',
                'index_name': f'in.({",".join(MIDCAP_SMALLCAP_INDICES)})',
                'data_type': 'eq.STOCK',
                'order': 'analysis_timestamp.desc',
                'limit': '200'
            }
            
            response = self.session.get(url, headers=self.headers, params=params, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                symbols = list(set([item['symbol'] for item in data]))
                logging.info(f"✅ Found {len(symbols)} unique MIDCAP/SMALLCAP stocks")
                return symbols
            else:
                logging.error(f"❌ Failed to get stock symbols: {response.status_code}")
                return []
                
        except Exception as e:
            logging.error(f"❌ Error getting stock symbols: {e}")
            return []

    def analyze_money_flow_pacing(self) -> List[Dict]:
        """Main analysis function to compare today vs yesterday money flow pacing"""
        current_time = self.get_current_ist_time()
        
        # Format dates for queries
        today_date = current_time.strftime('%d-%b-%Y')
        yesterday_date = (current_time - timedelta(days=1)).strftime('%d-%b-%Y')
        current_time_str = current_time.strftime('%H:%M:%S')
        
        logging.info(f"🔍 Analyzing money flow pacing at {today_date} {current_time_str}")
        logging.info(f"📊 Comparing with yesterday: {yesterday_date}")
        
        # Get all MIDCAP/SMALLCAP stocks
        stocks = self.get_midcap_smallcap_stocks()
        
        if not stocks:
            logging.error("❌ No stocks found for analysis")
            return []
        
        significant_flows = []
        
        for symbol in stocks:
            try:
                # Get today's turnover at current time
                today_turnover = self.get_stock_turnover_at_time(symbol, today_date, current_time_str)
                
                # Get yesterday's turnover at same time
                yesterday_turnover = self.get_stock_turnover_at_time(symbol, yesterday_date, current_time_str)
                
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
                    absolute_increase >= MIN_ABSOLUTE_INCREASE  # 25Cr+ absolute increase
                )
                
                if is_significant:
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
                    
                    logging.info(f"🚀 {symbol}: Today ₹{flow_data['today_turnover_cr']}Cr vs Yesterday ₹{flow_data['yesterday_turnover_cr']}Cr (+{percentage_increase:.1f}%)")
                
            except Exception as e:
                logging.error(f"❌ Error analyzing {symbol}: {e}")
                continue
        
        # Sort by percentage increase (highest first)
        significant_flows.sort(key=lambda x: x['percentage_increase'], reverse=True)
        
        logging.info(f"🎯 Found {len(significant_flows)} stocks with significant money flow increase")
        
        return significant_flows

    def store_activity_alerts(self, flow_data: List[Dict]) -> bool:
        """Store significant money flow alerts in activities table"""
        if not flow_data:
            logging.info("📊 No significant money flows to store")
            return True
        
        try:
            activities = []
            current_time = datetime.utcnow().isoformat()
            
            for stock_flow in flow_data[:10]:  # Top 10 stocks
                activity = {
                    'stock_name': stock_flow['symbol'],
                    'activity_name': f"🚀 Smart Money Alert: {stock_flow['symbol']} turnover surged {stock_flow['percentage_increase']:.1f}% to ₹{stock_flow['today_turnover_cr']}Cr (vs ₹{stock_flow['yesterday_turnover_cr']}Cr yesterday)",
                    'activity_timestamp': current_time,
                    'trading_date': datetime.utcnow().strftime('%Y-%m-%d'),
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
