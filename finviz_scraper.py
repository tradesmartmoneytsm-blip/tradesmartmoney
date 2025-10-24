#!/usr/bin/env python3
"""
Scrape sector performance data directly from Finviz
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time

def scrape_finviz_sectors():
    """Scrape sector performance data from Finviz"""
    
    print('🔍 Scraping Finviz Sector Performance Data')
    print('=' * 60)
    
    # Finviz sector performance URL
    url = 'https://finviz.com/groups.ashx?g=sector&v=140&o=name'
    
    # Headers to mimic a real browser (without compression)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    try:
        print(f'📡 Fetching data from: {url}')
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        print(f'✅ Successfully fetched data (Status: {response.status_code})')
        print(f'📊 Content length: {len(response.content)} bytes')
        print(f'🔤 Content encoding: {response.encoding}')
        
        # Ensure proper encoding
        response.encoding = 'utf-8'
        
        # Parse HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Debug: Print page structure
        print('🔍 Analyzing page structure...')
        
        # Find all tables
        tables = soup.find_all('table')
        print(f'Found {len(tables)} tables on the page')
        
        # Look for the main data table (usually the largest one)
        table = None
        for i, t in enumerate(tables):
            rows = t.find_all('tr')
            print(f'Table {i+1}: {len(rows)} rows')
            if len(rows) > 5:  # Sector table should have multiple rows
                table = t
                print(f'Using table {i+1} as main data table')
                break
        
        if not table:
            print('❌ Could not find sector data table')
            # Debug: Print first 1000 characters of HTML
            print('📝 HTML Preview:')
            print(response.text[:1000])
            return None
        
        print('🔍 Parsing sector data table...')
        
        # Extract table rows
        rows = table.find_all('tr')
        
        sector_data = []
        headers_found = False
        
        for row in rows:
            cells = row.find_all(['td', 'th'])
            
            if len(cells) >= 8:  # Ensure we have enough columns
                # Skip header row
                if not headers_found:
                    headers_found = True
                    continue
                
                try:
                    # Extract data from each cell
                    sector_name = cells[1].get_text(strip=True) if len(cells) > 1 else 'N/A'
                    perf_week = cells[2].get_text(strip=True) if len(cells) > 2 else 'N/A'
                    perf_month = cells[3].get_text(strip=True) if len(cells) > 3 else 'N/A'
                    perf_quarter = cells[4].get_text(strip=True) if len(cells) > 4 else 'N/A'
                    perf_half = cells[5].get_text(strip=True) if len(cells) > 5 else 'N/A'
                    perf_year = cells[6].get_text(strip=True) if len(cells) > 6 else 'N/A'
                    perf_ytd = cells[7].get_text(strip=True) if len(cells) > 7 else 'N/A'
                    
                    # Clean sector name (remove any extra text)
                    if sector_name and sector_name != 'N/A':
                        sector_data.append({
                            'Sector': sector_name,
                            'Week %': perf_week,
                            'Month %': perf_month,
                            'Quarter %': perf_quarter,
                            'Half Year %': perf_half,
                            'Year %': perf_year,
                            'YTD %': perf_ytd
                        })
                        
                except Exception as e:
                    print(f'⚠️ Error parsing row: {e}')
                    continue
        
        if sector_data:
            print(f'✅ Successfully parsed {len(sector_data)} sectors')
            return sector_data
        else:
            print('❌ No sector data found')
            return None
            
    except requests.RequestException as e:
        print(f'❌ Error fetching data: {e}')
        return None
    except Exception as e:
        print(f'❌ Error parsing data: {e}')
        return None

def display_sector_data(sector_data):
    """Display sector data in a formatted table"""
    
    if not sector_data:
        print('❌ No data to display')
        return
    
    print('\n📊 FINVIZ SECTOR PERFORMANCE DATA')
    print('=' * 80)
    
    # Create DataFrame for better formatting
    df = pd.DataFrame(sector_data)
    print(df.to_string(index=False))
    
    print(f'\n📅 Data scraped at: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print('🔗 Source: https://finviz.com/groups.ashx?g=sector&v=140&o=name')

def main():
    """Main function"""
    try:
        # Scrape data
        sector_data = scrape_finviz_sectors()
        
        # Display results
        display_sector_data(sector_data)
        
        # Also save to CSV for future use
        if sector_data:
            df = pd.DataFrame(sector_data)
            filename = f'finviz_sectors_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
            df.to_csv(filename, index=False)
            print(f'\n💾 Data saved to: {filename}')
            
    except Exception as e:
        print(f'❌ Error in main: {e}')

if __name__ == '__main__':
    main()
