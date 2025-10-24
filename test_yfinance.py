#!/usr/bin/env python3
"""
Test Yahoo Finance API access using yfinance library
"""

try:
    import yfinance as yf
    import pandas as pd
    from datetime import datetime, timedelta
    
    print('🚀 Testing Yahoo Finance API with yfinance library')
    print('=' * 60)
    
    # S&P 500 Sector Indices (GICS sectors) - More accurate than ETFs
    sector_indices = {
        '^SP500-15': 'Basic Materials',
        '^SP500-50': 'Communication Services',
        '^SP500-25': 'Consumer Discretionary', 
        '^SP500-30': 'Consumer Staples',
        '^SP500-10': 'Energy',
        '^SP500-40': 'Financials',
        '^SP500-35': 'Health Care',
        '^SP500-20': 'Industrials',
        '^SP500-60': 'Real Estate',
        '^SP500-45': 'Information Technology',
        '^SP500-55': 'Utilities'
    }
    
    print('📊 SECTOR PERFORMANCE (via Sector Indices):')
    print('-' * 60)
    
    for index_symbol, sector_name in sector_indices.items():
        try:
            # Get 3 months of data to calculate performance
            ticker = yf.Ticker(index_symbol)
            hist = ticker.history(period='3mo')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                
                # Calculate different period performances
                three_month_ago_price = hist['Close'].iloc[0]
                three_month_performance = ((current_price - three_month_ago_price) / three_month_ago_price) * 100
                
                # Get 1 month performance
                month_hist = ticker.history(period='1mo')
                if not month_hist.empty:
                    month_ago_price = month_hist['Close'].iloc[0]
                    month_performance = ((current_price - month_ago_price) / month_ago_price) * 100
                else:
                    month_performance = 0
                
                # Get 1 week performance
                week_hist = ticker.history(period='1wk')
                if not week_hist.empty:
                    week_ago_price = week_hist['Close'].iloc[0]
                    week_performance = ((current_price - week_ago_price) / week_ago_price) * 100
                else:
                    week_performance = 0
                
                print(f'📈 {sector_name:25} ({index_symbol:12}) | Week: {week_performance:+6.2f}% | Month: {month_performance:+6.2f}% | 3Month: {three_month_performance:+6.2f}% | Price: ${current_price:.2f}')
            
        except Exception as e:
            print(f'❌ Error getting {index_symbol} ({sector_name}): {e}')
            
except ImportError:
    print('❌ yfinance library not installed')
    print('💡 Install with: pip install yfinance')
except Exception as e:
    print(f'❌ Error: {e}')
