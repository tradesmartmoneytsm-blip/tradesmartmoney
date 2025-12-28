#!/usr/bin/env python3
"""
Future Swings Elite - Insert Data
Inserts swing trade records into the future_swings_elite table

Usage:
    python3 insert_future_swings_elite.py
"""

import requests
from datetime import datetime
from typing import Dict, List, Optional

# Hardcoded Supabase credentials
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"


def validate_trade_data(trade_data: Dict) -> tuple[bool, str]:
    """
    Validate trade data before inserting
    
    Args:
        trade_data: Dictionary containing trade information
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check required fields
    if 'stock_symbol' not in trade_data:
        return False, "Missing required field: stock_symbol"
    
    if 'entry_date' not in trade_data:
        return False, "Missing required field: entry_date"
    
    if 'result' not in trade_data:
        return False, "Missing required field: result"
    
    # Validate result value
    valid_results = ['SL', 'Target', 'Running']
    if trade_data['result'] not in valid_results:
        return False, f"Invalid result value. Must be one of: {valid_results}"
    
    # Validate date format (basic check)
    entry_date = trade_data['entry_date']
    if not isinstance(entry_date, str) or len(entry_date) != 10:
        return False, "Invalid entry_date format. Must be YYYY-MM-DD"
    
    return True, ""


def insert_swing_trade(trade_data: Dict) -> bool:
    """
    Insert a single swing trade into the future_swings_elite table
    
    Args:
        trade_data: Dictionary containing trade information
        
    Returns:
        True if successful, False otherwise
    """
    # Validate data first
    is_valid, error_msg = validate_trade_data(trade_data)
    if not is_valid:
        print(f"❌ Validation error for {trade_data.get('stock_symbol', 'Unknown')}: {error_msg}")
        return False
    
    url = f"{SUPABASE_URL}/rest/v1/future_swings_elite"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    try:
        response = requests.post(url, json=trade_data, headers=headers)
        response.raise_for_status()
        print(f"✅ Successfully inserted trade for {trade_data['stock_symbol']}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Error inserting trade for {trade_data.get('stock_symbol', 'Unknown')}: {e}")
        # Print the response body for more details
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_detail = e.response.json()
                print(f"   Error details: {error_detail}")
            except:
                print(f"   Response text: {e.response.text}")
        return False


def insert_multiple_trades(trades: List[Dict]) -> int:
    """
    Insert multiple swing trades into the future_swings_elite table
    
    Args:
        trades: List of dictionaries containing trade information
        
    Returns:
        Number of successfully inserted trades
    """
    url = f"{SUPABASE_URL}/rest/v1/future_swings_elite"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    try:
        response = requests.post(url, json=trades, headers=headers)
        response.raise_for_status()
        print(f"✅ Successfully inserted {len(trades)} trades")
        return len(trades)
    except requests.exceptions.RequestException as e:
        print(f"❌ Error inserting trades: {e}")
        return 0


def update_trade_exit(stock_symbol: str, entry_date: str, exit_data: Dict) -> bool:
    """
    Update an existing trade with exit information
    
    Args:
        stock_symbol: The stock symbol to update
        entry_date: The entry date of the trade to update
        exit_data: Dictionary containing exit information (exit_date, exit_price, result, percentage_change)
        
    Returns:
        True if successful, False otherwise
    """
    url = f"{SUPABASE_URL}/rest/v1/future_swings_elite"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    # Filter by stock_symbol and entry_date
    params = {
        "stock_symbol": f"eq.{stock_symbol}",
        "entry_date": f"eq.{entry_date}"
    }
    
    try:
        response = requests.patch(url, json=exit_data, headers=headers, params=params)
        response.raise_for_status()
        print(f"✅ Successfully updated trade exit for {stock_symbol}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Error updating trade for {stock_symbol}: {e}")
        return False


def get_running_trades() -> List[Dict]:
    """
    Fetch all running trades from the future_swings_elite table
    
    Returns:
        List of running trades
    """
    url = f"{SUPABASE_URL}/rest/v1/future_swings_elite"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    }
    
    params = {
        "result": "eq.Running",
        "select": "*"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        trades = response.json()
        print(f"✅ Fetched {len(trades)} running trades")
        return trades
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching running trades: {e}")
        return []


# Example usage
if __name__ == "__main__":
    print("=" * 60)
    print("Future Swings Elite - Insert Data Examples")
    print("=" * 60)
    
    # Example 1: Insert a single new entry trade (Running)
    print("\n📊 Example 1: Insert new entry trade (Running)")
    new_trade = {
        "stock_symbol": "RELIANCE",
        "entry_date": "2025-12-27",
        "entry_price": 1285.50,
        "stop_loss": 1250.00,
        "target_price": 1350.00,
        "result": "Running",
        "notes": "Bullish breakout above resistance"
    }
    insert_swing_trade(new_trade)
    
    # Example 2: Insert a completed trade (Target hit)
    print("\n📊 Example 2: Insert completed trade (Target)")
    completed_trade = {
        "stock_symbol": "TCS",
        "entry_date": "2025-12-20",
        "entry_price": 4100.00,
        "stop_loss": 4000.00,
        "target_price": 4250.00,
        "exit_date": "2025-12-27",
        "exit_price": 4250.00,
        "result": "Target",
        "percentage_change": 3.66,
        "notes": "Target achieved in 7 days"
    }
    insert_swing_trade(completed_trade)
    
    # Example 3: Insert a stop loss trade
    print("\n📊 Example 3: Insert stop loss trade")
    sl_trade = {
        "stock_symbol": "HDFC",
        "entry_date": "2025-12-22",
        "entry_price": 1650.00,
        "stop_loss": 1620.00,
        "target_price": 1720.00,
        "exit_date": "2025-12-26",
        "exit_price": 1620.00,
        "result": "SL",
        "percentage_change": -1.82,
        "notes": "Stop loss triggered"
    }
    insert_swing_trade(sl_trade)
    
    # Example 4: Insert multiple trades at once
    print("\n📊 Example 4: Insert multiple trades")
    multiple_trades = [
        {
            "stock_symbol": "INFY",
            "entry_date": "2025-12-27",
            "entry_price": 1850.00,
            "stop_loss": 1820.00,
            "target_price": 1920.00,
            "result": "Running"
        },
        {
            "stock_symbol": "WIPRO",
            "entry_date": "2025-12-27",
            "entry_price": 580.00,
            "stop_loss": 565.00,
            "target_price": 610.00,
            "result": "Running"
        }
    ]
    insert_multiple_trades(multiple_trades)
    
    # Example 5: Update a running trade to Target/SL
    print("\n📊 Example 5: Update running trade with exit")
    exit_data = {
        "exit_date": "2025-12-28",
        "exit_price": 1300.00,
        "result": "Target",
        "percentage_change": 1.13
    }
    update_trade_exit("RELIANCE", "2025-12-27", exit_data)
    
    # Example 6: Get all running trades
    print("\n📊 Example 6: Fetch all running trades")
    running_trades = get_running_trades()
    if running_trades:
        print(f"\nRunning Trades:")
        for trade in running_trades:
            print(f"  - {trade['stock_symbol']}: Entry ${trade['entry_price']} → Target ${trade['target_price']}")
    
    print("\n" + "=" * 60)
    print("✅ All examples completed!")
    print("=" * 60)

