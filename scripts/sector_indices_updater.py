#!/usr/bin/env python3
"""
Sector Indices Updater
Downloads and updates sector index constituents from Nifty Indices
Runs weekly via GitHub Action to keep sector mappings current
"""

import os
import sys
import logging
import requests
import csv
import io
from typing import List, Dict, Optional
from datetime import datetime, timezone

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)

# Environment variables
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"

# Nifty Indices Configuration
NIFTY_BASE_URL = "https://www.niftyindices.com"
SET_COOKIE_URL = "https://www.niftyindices.com/indices/equity/broad-based-indices/nifty-50"

# Headers for Nifty API (similar to NSE approach)
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
}

# Create session for cookie management
session = requests.Session()
cookies = dict()

# Sector indices configuration with their CSV URLs (mixed formats based on actual Nifty URLs)
SECTOR_INDICES = {
    'Nifty Auto': 'https://www.niftyindices.com/IndexConstituent/ind_niftyautolist.csv',
    'Nifty Bank': 'https://www.niftyindices.com/IndexConstituent/ind_niftybanklist.csv',
    'Nifty Chemicals': 'https://www.niftyindices.com/IndexConstituent/ind_niftyChemicals_list.csv',
    'Nifty Financial Services': 'https://www.niftyindices.com/IndexConstituent/ind_niftyfinancelist.csv',
    'Nifty Financial Services 25/50': 'https://www.niftyindices.com/IndexConstituent/ind_niftyfinancialservices25-50list.csv',
    'Nifty Financial Services Ex Bank': 'https://www.niftyindices.com/IndexConstituent/ind_niftyFinancialServicesExBank_list.csv',
    'Nifty FMCG': 'https://www.niftyindices.com/IndexConstituent/ind_niftyfmcglist.csv',
    'Nifty Healthcare': 'https://www.niftyindices.com/IndexConstituent/ind_niftyhealthcarelist.csv',
    'Nifty IT': 'https://www.niftyindices.com/IndexConstituent/ind_niftyitlist.csv',
    'Nifty Media': 'https://www.niftyindices.com/IndexConstituent/ind_niftymedialist.csv',
    'Nifty Metal': 'https://www.niftyindices.com/IndexConstituent/ind_niftymetallist.csv',
    'Nifty Pharma': 'https://www.niftyindices.com/IndexConstituent/ind_niftypharmalist.csv',
    'Nifty Private Bank': 'https://www.niftyindices.com/IndexConstituent/ind_nifty_privatebanklist.csv',
    'Nifty PSU Bank': 'https://www.niftyindices.com/IndexConstituent/ind_niftypsubanklist.csv',
    'Nifty Realty': 'https://www.niftyindices.com/IndexConstituent/ind_niftyrealtylist.csv',
    'Nifty Consumer Durables': 'https://www.niftyindices.com/IndexConstituent/ind_niftyconsumerdurableslist.csv',
    'Nifty Oil and Gas': 'https://www.niftyindices.com/IndexConstituent/ind_niftyoilgaslist.csv',
    'Nifty500 Healthcare': 'https://www.niftyindices.com/IndexConstituent/ind_nifty500Healthcare_list.csv',
    'Nifty MidSmall Financial Services': 'https://www.niftyindices.com/IndexConstituent/ind_niftymidsmallfinancialserviceslist.csv',
    'Nifty MidSmall Healthcare': 'https://www.niftyindices.com/IndexConstituent/ind_niftymidsmallhealthcarelist.csv',
    'Nifty MidSmall IT & Telecom': 'https://www.niftyindices.com/IndexConstituent/ind_niftymidsmallitandtelecomlist.csv'
}

def set_nifty_cookie(url: str = SET_COOKIE_URL):
    """Set cookies for Nifty Indices API access"""
    try:
        request = session.get(url, headers=HEADERS, timeout=10)
        global cookies
        cookies = dict(request.cookies)
        logging.info(f"🍪 Nifty cookies set from {url}")
    except Exception as e:
        logging.warning(f"⚠️ Failed to set Nifty cookies: {e}")

def download_csv_data(url: str) -> Optional[str]:
    """Download CSV data from Nifty Indices using cookie-based session"""
    try:
        logging.debug(f"📡 Downloading CSV: {url}")
        response = session.get(url, headers=HEADERS, timeout=30, cookies=cookies)
        
        # Handle 401/403 errors by refreshing cookies
        if response.status_code in [401, 403]:
            logging.info("🔄 Access denied, refreshing cookies...")
            set_nifty_cookie()
            response = session.get(url, headers=HEADERS, timeout=30, cookies=cookies)
        
        if response.status_code == 200:
            logging.info(f"✅ Successfully downloaded CSV from {url}")
            return response.text
        else:
            logging.warning(f"⚠️ CSV download failed: {response.status_code} for {url}")
            return None
            
    except requests.exceptions.Timeout:
        logging.warning(f"⏰ Timeout downloading CSV: {url}")
    except requests.exceptions.ConnectionError:
        logging.warning(f"🌐 Connection error downloading CSV: {url}")
    except Exception as e:
        logging.warning(f"❌ Error downloading CSV {url}: {e}")
    
    return None

def parse_csv_data(csv_content: str, index_name: str) -> List[Dict]:
    """Parse CSV content and extract relevant fields with flexible column name handling"""
    try:
        # Parse CSV content
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        
        # Get the actual column names from the CSV
        fieldnames = csv_reader.fieldnames or []
        logging.debug(f"📋 CSV columns for {index_name}: {fieldnames}")
        
        parsed_data = []
        for row in csv_reader:
            # Handle different possible column name variations
            symbol = (
                row.get('Symbol', '') or 
                row.get('SYMBOL', '') or 
                row.get('symbol', '')
            ).strip()
            
            company_name = (
                row.get('Company Name', '') or 
                row.get('COMPANY NAME', '') or 
                row.get('Company', '') or
                row.get('Name', '')
            ).strip()
            
            industry = (
                row.get('Industry', '') or 
                row.get('INDUSTRY', '') or 
                row.get('Sector', '') or
                row.get('SECTOR', '')
            ).strip()
            
            isin_code = (
                row.get('ISIN Code', '') or 
                row.get('ISIN CODE', '') or 
                row.get('ISIN', '') or
                row.get('isin_code', '')
            ).strip()
            
            series = (
                row.get('Series', '') or 
                row.get('SERIES', '') or 
                'EQ'
            ).strip()
            
            if symbol:  # Only add if symbol exists
                parsed_data.append({
                    'symbol': symbol,
                    'company_name': company_name,
                    'industry': industry,
                    'isin_code': isin_code,
                    'index_name': index_name,
                    'series': series
                })
            else:
                # Log the row that failed to help debug
                logging.debug(f"⚠️ Skipped row with no symbol: {dict(row)}")
        
        logging.info(f"📊 Parsed {len(parsed_data)} stocks from {index_name}")
        
        # If no data parsed, log the first few rows for debugging
        if len(parsed_data) == 0 and csv_content:
            lines = csv_content.split('\n')[:3]
            logging.warning(f"🔍 Debug {index_name} - First 3 lines: {lines}")
        
        return parsed_data
        
    except Exception as e:
        logging.error(f"❌ Error parsing CSV for {index_name}: {e}")
        # Log first few lines of CSV for debugging
        if csv_content:
            lines = csv_content.split('\n')[:3]
            logging.error(f"🔍 Debug CSV content: {lines}")
        return []

def store_sector_data(sector_data: List[Dict]) -> bool:
    """Store sector index data in Supabase database"""
    try:
        if not sector_data:
            logging.warning("⚠️ No sector data to store")
            return False
        
        # Prepare data for batch insert
        url = f"{SUPABASE_URL}/rest/v1/sector_indices"
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        # Insert data in batches of 100
        batch_size = 100
        total_inserted = 0
        
        for i in range(0, len(sector_data), batch_size):
            batch = sector_data[i:i + batch_size]
            
            response = requests.post(url, headers=headers, json=batch, timeout=30)
            
            if response.status_code in [200, 201]:
                total_inserted += len(batch)
                logging.info(f"✅ Inserted batch {i//batch_size + 1}: {len(batch)} records")
            else:
                logging.error(f"❌ Failed to insert batch {i//batch_size + 1}: {response.status_code} - {response.text}")
                return False
        
        logging.info(f"🎯 Successfully stored {total_inserted} sector index records")
        return True
        
    except Exception as e:
        logging.error(f"❌ Error storing sector data: {e}")
        return False

def clear_existing_data():
    """Clear existing sector indices data before updating"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/sector_indices"
        headers = {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': f'Bearer {SUPABASE_SERVICE_ROLE_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Delete all existing records
        response = requests.delete(f"{url}?id=gte.0", headers=headers, timeout=30)
        
        if response.status_code in [200, 204]:
            logging.info("🗑️ Cleared existing sector indices data")
            return True
        else:
            logging.error(f"❌ Failed to clear existing data: {response.status_code}")
            return False
            
    except Exception as e:
        logging.error(f"❌ Error clearing existing data: {e}")
        return False

def main():
    """Main function to update all sector indices"""
    logging.info("🚀 Starting Sector Indices Updater")
    
    # Initialize cookies
    logging.info("🔐 Setting up Nifty Indices session...")
    set_nifty_cookie()
    
    # Clear existing data
    if not clear_existing_data():
        logging.error("❌ Failed to clear existing data, aborting")
        sys.exit(1)
    
    all_sector_data = []
    successful_downloads = 0
    failed_downloads = 0
    
    # Download and parse each sector index
    for index_name, csv_url in SECTOR_INDICES.items():
        logging.info(f"📊 Processing {index_name}...")
        
        # Download CSV
        csv_content = download_csv_data(csv_url)
        if not csv_content:
            logging.error(f"❌ Failed to download {index_name}")
            failed_downloads += 1
            continue
        
        # Parse CSV
        parsed_data = parse_csv_data(csv_content, index_name)
        if not parsed_data:
            logging.error(f"❌ Failed to parse {index_name}")
            failed_downloads += 1
            continue
        
        all_sector_data.extend(parsed_data)
        successful_downloads += 1
        
        logging.info(f"✅ {index_name}: {len(parsed_data)} stocks processed")
    
    # Store all data
    if all_sector_data:
        if store_sector_data(all_sector_data):
            logging.info(f"🎯 Update Complete: {successful_downloads} indices processed, {len(all_sector_data)} total mappings stored")
            
            # Log summary statistics
            unique_stocks = len(set(item['symbol'] for item in all_sector_data))
            avg_indices_per_stock = len(all_sector_data) / unique_stocks if unique_stocks > 0 else 0
            
            logging.info(f"📊 Summary: {unique_stocks} unique stocks, avg {avg_indices_per_stock:.1f} indices per stock")
            
            if failed_downloads > 0:
                logging.warning(f"⚠️ {failed_downloads} indices failed to download")
                sys.exit(1)
        else:
            logging.error("❌ Failed to store sector data")
            sys.exit(1)
    else:
        logging.error("❌ No sector data collected")
        sys.exit(1)

if __name__ == "__main__":
    main()
