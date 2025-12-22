#!/usr/bin/env python3
"""
Dhan Indices Data Collector
Fetches all NSE indices information from Dhan and stores in Supabase
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

class DhanIndicesCollector:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.9',
        })
        
    def fetch_dhan_indices(self) -> Optional[List[Dict[str, Any]]]:
        """Fetch all NSE indices data from Dhan"""
        url = 'https://dhan.co/all-nse-indices/'
        
        try:
            logging.info(f"Fetching data from {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the __NEXT_DATA__ script tag
            next_data_script = soup.find('script', {'id': '__NEXT_DATA__'})
            
            if not next_data_script:
                logging.error("Could not find __NEXT_DATA__ script tag")
                return None
            
            # Parse JSON data
            data = json.loads(next_data_script.string)
            
            # Extract indices list
            indices_list = data.get('props', {}).get('pageProps', {}).get('listData', [])
            
            if not indices_list:
                logging.error("No indices data found in response")
                return None
            
            logging.info(f"Successfully fetched {len(indices_list)} indices")
            return indices_list
            
        except requests.exceptions.RequestException as e:
            logging.error(f"Error fetching data from Dhan: {e}")
            return None
        except json.JSONDecodeError as e:
            logging.error(f"Error parsing JSON: {e}")
            return None
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return None
    
    def store_in_supabase(self, indices_data: List[Dict[str, Any]]) -> bool:
        """Store indices data in Supabase"""
        url = f"{SUPABASE_URL}/rest/v1/dhan_sector_indices_config"
        
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        # Add timestamp to each record
        current_time = datetime.now(timezone.utc).isoformat()
        
        records_to_insert = []
        for index_data in indices_data:
            record = {
                'symbol': index_data.get('Sym'),
                'display_symbol': index_data.get('DispSym'),
                'seo_symbol': index_data.get('Seosym'),
                'sec_id': index_data.get('Sid'),
                'exchange': index_data.get('Exch'),
                'segment': index_data.get('Seg'),
                'instrument': index_data.get('Inst'),
                'index_based_on_exch': index_data.get('IndexBasedOnExch'),
                'ltp': index_data.get('Ltp'),
                'high_1yr': index_data.get('High1Yr'),
                'low_1yr': index_data.get('Low1Yr'),
                'price_perchng_1year': index_data.get('PricePerchng1year'),
                'price_perchng_3year': index_data.get('PricePerchng3year'),
                'price_perchng_5year': index_data.get('PricePerchng5year'),
                'tick_size': index_data.get('TickSize'),
                'updated_at': current_time
            }
            records_to_insert.append(record)
        
        try:
            # First, delete all existing records to ensure fresh data
            logging.info("Deleting existing records...")
            delete_response = self.session.delete(
                url,
                headers=headers,
                params={'symbol': 'neq.___DUMMY___'}  # Delete all records (neq = not equal to dummy value)
            )
            
            if delete_response.status_code not in [200, 204]:
                logging.warning(f"Delete operation returned status {delete_response.status_code}")
            
            # Insert new records
            logging.info(f"Inserting {len(records_to_insert)} records...")
            response = self.session.post(
                url,
                headers=headers,
                json=records_to_insert
            )
            
            if response.status_code in [200, 201, 204]:
                logging.info(f"Successfully stored {len(records_to_insert)} indices in Supabase")
                return True
            else:
                logging.error(f"Failed to store data: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            logging.error(f"Error storing data in Supabase: {e}")
            return False
        except Exception as e:
            logging.error(f"Unexpected error while storing data: {e}")
            return False
    
    def run(self):
        """Main execution method"""
        logging.info("Starting Dhan Indices Collector")
        
        # Fetch data from Dhan
        indices_data = self.fetch_dhan_indices()
        
        if not indices_data:
            logging.error("Failed to fetch indices data")
            return False
        
        # Store in Supabase
        success = self.store_in_supabase(indices_data)
        
        if success:
            logging.info("Data collection and storage completed successfully")
        else:
            logging.error("Failed to store data in Supabase")
        
        return success

def main():
    """Main entry point"""
    collector = DhanIndicesCollector()
    success = collector.run()
    
    if success:
        logging.info("✅ Dhan indices data collection completed successfully")
        exit(0)
    else:
        logging.error("❌ Dhan indices data collection failed")
        exit(1)

if __name__ == '__main__':
    main()

