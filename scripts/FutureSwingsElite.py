import yfinance as yf
import requests
import pandas as pd
from ChartInkScanner import GetDataFromChartinkWidget
from datetime import datetime
from typing import Dict

#telegram constants
telegram_token = "6252256939:AAE6OMAprmUCeVaXl1b-1NYt8G3Z1KeCIo4"
telegram_chat_id = "-5197201652"
telegram_url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"

# Hardcoded Supabase credentials
SUPABASE_URL = "https://ejnuocizpsfcobhyxgrd.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbnVvY2l6cHNmY29iaHl4Z3JkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAxMjAyMCwiZXhwIjoyMDcyNTg4MDIwfQ.VvnrQCXDcya-pHhKn7Jp9bUgzj61eLFrdO8r-0fZhmY"


chartink_payload = {
    'query': 'select Daily Close as \'LTP\' WHERE( {cash} ( daily volume > daily sma( volume,3 ) and daily close > 1 day ago close * 1.00 and daily slow stochastic %k( 14,3 ) > daily slow stochastic %d( 14,3 ) and daily macd line( 26,12,9 ) > daily macd signal( 26,12,9 ) and 1 day ago  macd line( 26,12,9 ) <= 1 day ago  macd signal( 26,12,9 ) and daily close > daily sma( close,200 ) and daily ema( close,50 ) > daily ema( close,100 ) and daily rsi( 14 ) > 60 and 1 day ago  rsi( 14 ) <= 60 and daily "close - 1 candle ago close / 1 candle ago close * 100" < 5 ) ) GROUP BY symbol ORDER BY 1 desc',
    'use_live': '1',
    'limit': '3000',
    'size': '1',
}   


def insert_swing_trade(trade_data: Dict) -> bool:
    """
    Insert a single swing trade into the future_swings_elite table
    
    Args:
        trade_data: Dictionary containing trade information
        
    Returns:
        True if successful, False otherwise
    """
    url = f"{SUPABASE_URL}/rest/v1/future_swings_elite"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        # Upsert behavior: merge duplicates based on on_conflict columns
        "Prefer": "resolution=merge-duplicates,return=minimal"
    }
    # Ensure a unique constraint exists on (stock_symbol, entry_date)
    params = {
        "on_conflict": "stock_symbol,entry_date"
    }
    
    try:
        response = requests.post(url, json=trade_data, headers=headers, params=params)
        response.raise_for_status()
        print(f"✅ Upserted trade for {trade_data['stock_symbol']}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Upsert failed for {trade_data.get('stock_symbol', 'Unknown')}: {e}")
        return False

def update_existing_trades():
    """
    Update the existing running trades in the future_swings_elite table
    Get all the trades with result "Running"
    Fetch today candle data for the stock
    if the close price is greater equal to target price, update the result to "Target"
    if the close price is less than the stop loss, update the result to "SL"
    """
    url = f"{SUPABASE_URL}/rest/v1/future_swings_elite"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    try:
        # 1) Fetch only running trades
        resp = requests.get(f"{url}?select=*&result=eq.Running", headers=headers)
        resp.raise_for_status()
        running_trades = resp.json() or []

        for trade in running_trades:
            symbol = str(trade.get("stock_symbol", "")).strip()
            if not symbol:
                continue
            
            df = yf.download(symbol + '.NS', period="1d", interval="1d", progress=False)
            # Ensure flat columns
            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.droplevel(1)

            if df.empty:
                print(f"No data for {symbol}, skipping")
                telegram_message = "Elite Futures Swing Strategy: No data found for " + symbol
                telegram_payload = {'chat_id': telegram_chat_id, 'text': telegram_message}
                requests.post(telegram_url, json=telegram_payload)
                continue

            cmp = df['Close'].iloc[0]
            if (cmp > trade.get("target_price")):
                new_result = "Target"
            elif (cmp < trade.get("stop_loss")):
                new_result = "SL"
            else:
                new_result = "Running"
           
            update_payload = {
                "cmp": cmp,
                "result": new_result,
            }

            params = {"id": f"eq.{trade['id']}"}
            upd = requests.patch(
                url,
                headers={**headers, "Prefer": "return=representation"},
                params=params,
                json=update_payload,
            )
            upd.raise_for_status()
            print(f"✅ Updated {symbol}: {update_payload}")

        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Error updating trades: {e}")
        return False

elite_futures = {}
def main():
    json_response = GetDataFromChartinkWidget(chartink_payload)
    print(json_response)
    group_data = json_response['groupData']
    for d in group_data:
        symbol = d['name']
        ltp = d['results'][0]['ltp'][0]
        elite_futures[symbol] = ltp
    print(elite_futures)
    
    for symbol in elite_futures:
        df = yf.download(symbol + '.NS', period='12d', interval='1d')

        # Ensure flat columns
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.droplevel(1)

        if df.empty:
            print("No data found for", symbol)
            # Implement an alert system to notify the user
            telegram_message = "Elite Futures Swing Strategy: No data found for " + symbol
            telegram_payload = {'chat_id': telegram_chat_id, 'text': telegram_message}
            requests.post(telegram_url, json=telegram_payload)
            continue

        #find the 
        close = df['Close'].iloc[-1]
        open1dayago = df['Open'].iloc[0]
        close1dayago = df['Close'].iloc[0]
        if (open1dayago > close1dayago):
            low = close1dayago
        else:
            low = open1dayago

        #sl_percentage = round((close - low) / low * 100, 2)
        #if (sl_percentage > 5):
            #telegram_message = "Elite Futures Swing Strategy: " + symbol + " SL is more than 5% " + str(sl_percentage)
            #telegram_payload = {'chat_id': telegram_chat_id, 'text': telegram_message}
            #requests.post(telegram_url, json=telegram_payload)
            #return;

        # maek database entry for the symbol
        new_trade = {
        "stock_symbol": symbol,
        "entry_date": datetime.now().strftime('%Y-%m-%d'),
        "entry_price": close,
        "stop_loss": low,
        "target_price": close + (close - low) * 5,
        "result": "Running",
        "cmp": close,
        "notes": "Elite Futures Swing Strategy"
        }

        insert_swing_trade(new_trade)

        update_existing_trades()


if __name__ == "__main__":
    main()