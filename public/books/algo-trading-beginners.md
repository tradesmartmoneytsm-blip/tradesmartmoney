# Algorithmic Trading for Beginners: Build Your First Trading Bot

## Chapter 1: Introduction to Algorithmic Trading

1.1 What is Algorithmic Trading?

Algorithmic trading (algo trading) is the use of computer programs to execute trades automatically based on predefined rules and strategies.

Key benefits:
	•	Removes emotional decision-making
	•	Executes faster than manual trading
	•	Can monitor multiple markets simultaneously
	•	Backtests strategies on historical data
	•	Operates 24/7 if needed
	•	Consistent execution of rules

Common misconceptions:
	•	"You need to be a programmer" - False. Basic Python is enough
	•	"Algo trading guarantees profits" - False. Strategy still matters
	•	"It's only for institutions" - False. Retail can do it too
	•	"It's too complex" - False. Start simple, grow gradually

1.2 Types of Algorithmic Trading

Trend Following:
	•	Identifies and follows market trends
	•	Uses moving averages, breakouts
	•	Simple to implement
	•	Works in trending markets

Mean Reversion:
	•	Assumes prices return to average
	•	Profits from overbought/oversold
	•	Works in range-bound markets
	•	Higher frequency trading

Arbitrage:
	•	Exploits price differences across markets
	•	Low risk, requires fast execution
	•	Becoming harder with technology
	•	Needs significant capital

Market Making:
	•	Provides liquidity, captures spread
	•	Advanced strategy
	•	Requires exchange connectivity
	•	Not suitable for beginners

1.3 Prerequisites for Starting

What you need:
	•	Basic computer programming knowledge
	•	Understanding of markets and trading
	•	Patience to learn and test
	•	Capital for live trading (₹1-5 lakhs minimum)
	•	Time commitment (10-15 hours weekly for learning)

What you don't need:
	•	PhD in mathematics
	•	Expensive software (free tools available)
	•	Large capital for learning phase
	•	Institutional-grade infrastructure

1.4 Setting Realistic Expectations

Expected returns:
	•	Beginners: 5-15% annually (learning phase)
	•	Intermediate: 15-25% annually
	•	Advanced: 25-40% annually
	•	Professional: 40%+ annually

Reality check:
	•	First 6 months: Likely breakeven or small loss
	•	Next 6 months: Small consistent gains
	•	Year 2+: Scaling up as confidence builds
	•	Most will never get rich quick
	•	Consistency > occasional home runs

---

## Chapter 2: Python Basics for Traders

2.1 Why Python?

Python is ideal for algo trading:
	•	Easy to learn syntax
	•	Extensive libraries for trading
	•	Large community support
	•	Free and open source
	•	Works on all platforms

2.2 Installing Python

Step-by-step:
	•	Download from python.org (version 3.9+)
	•	Install with "Add to PATH" option
	•	Verify: Open terminal, type "python --version"
	•	Install pip (package manager)
	•	You're ready!

Essential libraries to install:
pip install pandas numpy matplotlib yfinance ta-lib python-binance

What each library does:
	•	pandas: Data manipulation
	•	numpy: Numerical calculations
	•	matplotlib: Plotting charts
	•	yfinance: Download stock data
	•	ta-lib: Technical indicators
	•	python-binance: API connectivity (example)

2.3 Basic Python Concepts

Variables and data types:
```python
price = 100.50  # float
quantity = 100  # integer
stock_name = "RELIANCE"  # string
is_profitable = True  # boolean
```

Lists and loops:
```python
stocks = ["TCS", "INFY", "WIPRO"]
for stock in stocks:
    print(stock)
```

Conditional statements:
```python
if price > 100:
    print("Price above 100")
elif price == 100:
    print("Price at 100")
else:
    print("Price below 100")
```

Functions:
```python
def calculate_profit(entry, exit, quantity):
    return (exit - entry) * quantity

profit = calculate_profit(100, 105, 100)
print(f"Profit: ₹{profit}")
```

2.4 Working with Pandas

Pandas is essential for trading data:

Loading data:
```python
import pandas as pd
df = pd.read_csv('stock_data.csv')
print(df.head())  # Show first 5 rows
```

Basic operations:
```python
df['SMA_20'] = df['Close'].rolling(20).mean()
df['Returns'] = df['Close'].pct_change()
```

Filtering data:
```python
bullish_days = df[df['Close'] > df['Open']]
high_volume = df[df['Volume'] > df['Volume'].mean()]
```

---

## Chapter 3: Getting Market Data

3.1 Free Data Sources

Yahoo Finance (via yfinance):
```python
import yfinance as yf

# Download data
stock = yf.download('RELIANCE.NS', start='2023-01-01', end='2024-01-01')
print(stock.head())
```

NSE India website:
	•	Historical data available free
	•	Bhav copy (daily) download
	•	Requires parsing

3.2 Data Structure

Standard OHLCV format:
	•	Open: Opening price
	•	High: Highest price of period
	•	Low: Lowest price
	•	Close: Closing price
	•	Volume: Number of shares traded

Example data:
```
Date       Open   High   Low    Close  Volume
2024-01-01 2850   2880   2840   2875   5000000
2024-01-02 2870   2900   2865   2895   6000000
```

3.3 Data Cleaning

Common issues to fix:
	•	Missing data (holidays, halts)
	•	Corporate actions (splits, bonuses)
	•	Outliers (data errors)
	•	Timezone issues

Cleaning example:
```python
# Remove missing values
df = df.dropna()

# Forward fill gaps
df = df.fillna(method='ffill')

# Adjust for splits
df['Adjusted_Close'] = df['Close'] * adjustment_factor
```

3.4 Real-Time Data

For live trading you need:
	•	Broker API (Zerodha Kite, Upstox)
	•	Websocket connection
	•	Handle tick data
	•	Process in real-time

Example broker connection:
```python
from kiteconnect import KiteConnect

kite = KiteConnect(api_key="your_key")
# Authentication flow
# Subscribe to ticks
# Process data
```

---

## Chapter 4: Building Your First Strategy

4.1 Simple Moving Average Crossover

One of the easiest strategies:

Rules:
	•	Buy when 20 SMA crosses above 50 SMA
	•	Sell when 20 SMA crosses below 50 SMA
	•	Hold until opposite signal

Code implementation:
```python
import pandas as pd
import yfinance as yf

# Get data
df = yf.download('TCS.NS', start='2023-01-01', end='2024-01-01')

# Calculate SMAs
df['SMA_20'] = df['Close'].rolling(20).mean()
df['SMA_50'] = df['Close'].rolling(50).mean()

# Generate signals
df['Signal'] = 0
df.loc[df['SMA_20'] > df['SMA_50'], 'Signal'] = 1  # Buy
df.loc[df['SMA_20'] < df['SMA_50'], 'Signal'] = -1  # Sell

# Find crossovers
df['Position'] = df['Signal'].diff()

# Display buy/sell signals
buys = df[df['Position'] == 2]  # Changed from -1 to 1
sells = df[df['Position'] == -2]  # Changed from 1 to -1

print(f"Buy signals: {len(buys)}")
print(f"Sell signals: {len(sells)}")
```

4.2 Adding Entry and Exit Logic

Improve the basic strategy:
```python
def generate_signals(df):
    df['SMA_20'] = df['Close'].rolling(20).mean()
    df['SMA_50'] = df['Close'].rolling(50).mean()
    
    position = 0
    signals = []
    
    for i in range(len(df)):
        # Buy signal
        if df['SMA_20'].iloc[i] > df['SMA_50'].iloc[i] and position == 0:
            signals.append({'Date': df.index[i], 'Type': 'BUY', 'Price': df['Close'].iloc[i]})
            position = 1
        
        # Sell signal
        elif df['SMA_20'].iloc[i] < df['SMA_50'].iloc[i] and position == 1:
            signals.append({'Date': df.index[i], 'Type': 'SELL', 'Price': df['Close'].iloc[i]})
            position = 0
    
    return signals
```

4.3 Calculating Returns

Track strategy performance:
```python
def calculate_returns(signals):
    capital = 100000  # Starting capital
    shares = 0
    cash = capital
    
    for signal in signals:
        if signal['Type'] == 'BUY':
            shares = cash // signal['Price']
            cash = cash - (shares * signal['Price'])
            print(f"Bought {shares} shares at ₹{signal['Price']}")
        
        elif signal['Type'] == 'SELL':
            cash = cash + (shares * signal['Price'])
            print(f"Sold {shares} shares at ₹{signal['Price']}")
            shares = 0
    
    final_value = cash + (shares * df['Close'].iloc[-1])
    total_return = ((final_value - capital) / capital) * 100
    
    print(f"Starting: ₹{capital}")
    print(f"Ending: ₹{final_value}")
    print(f"Return: {total_return:.2f}%")
```

4.4 Visualizing Results

Plot your strategy:
```python
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 6))
plt.plot(df.index, df['Close'], label='Close Price', alpha=0.7)
plt.plot(df.index, df['SMA_20'], label='SMA 20', alpha=0.7)
plt.plot(df.index, df['SMA_50'], label='SMA 50', alpha=0.7)

# Mark buy signals
buys = [s for s in signals if s['Type'] == 'BUY']
for buy in buys:
    plt.scatter(buy['Date'], buy['Price'], color='green', marker='^', s=100)

# Mark sell signals
sells = [s for s in signals if s['Type'] == 'SELL']
for sell in sells:
    plt.scatter(sell['Date'], sell['Price'], color='red', marker='v', s=100)

plt.legend()
plt.title('Moving Average Crossover Strategy')
plt.show()
```

---

## Chapter 5: Backtesting Your Strategy

5.1 What is Backtesting?

Backtesting runs your strategy on historical data to see how it would have performed.

Why backtest:
	•	Validates strategy before risking real money
	•	Reveals weaknesses
	•	Calculates metrics (win rate, profit factor)
	•	Builds confidence
	•	Saves costly losses

Important: Past performance doesn't guarantee future results, but it's essential validation.

5.2 Backtesting Framework

Complete backtest structure:
```python
class Backtest:
    def __init__(self, data, initial_capital=100000):
        self.data = data
        self.capital = initial_capital
        self.position = 0
        self.trades = []
        self.equity_curve = []
    
    def run_strategy(self):
        # Loop through data
        # Generate signals
        # Execute trades
        # Track equity
        pass
    
    def calculate_metrics(self):
        # Win rate
        # Profit factor
        # Sharpe ratio
        # Max drawdown
        pass
```

5.3 Key Performance Metrics

Win rate:
```python
win_rate = (number_of_wins / total_trades) * 100
```
Acceptable: > 45%

Profit factor:
```python
profit_factor = gross_profits / gross_losses
```
Good: > 1.5, Excellent: > 2.0

Maximum drawdown:
```python
max_drawdown = (Peak - Trough) / Peak * 100
```
Acceptable: < 20%

Sharpe ratio:
```python
sharpe = (average_return - risk_free_rate) / std_deviation
```
Good: > 1.0, Excellent: > 2.0

5.4 Avoiding Curve Fitting

Overfitting dangers:
	•	Strategy works perfectly on historical data
	•	Fails completely in live trading
	•	Too many parameters optimized

How to avoid:
	•	Keep strategies simple (< 5 parameters)
	•	Test on out-of-sample data
	•	Use walk-forward analysis
	•	Don't over-optimize
	•	Verify logic makes sense

---

## Chapter 6: Technical Indicators in Code

6.1 Moving Averages

Simple Moving Average (SMA):
```python
df['SMA_20'] = df['Close'].rolling(window=20).mean()
```

Exponential Moving Average (EMA):
```python
df['EMA_20'] = df['Close'].ewm(span=20, adjust=False).mean()
```

6.2 RSI (Relative Strength Index)

Calculate RSI:
```python
def calculate_rsi(data, period=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
    
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

df['RSI'] = calculate_rsi(df['Close'])
```

Trading with RSI:
	•	RSI > 70 = Overbought (consider selling)
	•	RSI < 30 = Oversold (consider buying)
	•	RSI divergence = reversal signal

6.3 MACD (Moving Average Convergence Divergence)

Calculate MACD:
```python
# Fast EMA (12), Slow EMA (26), Signal (9)
df['EMA_12'] = df['Close'].ewm(span=12).mean()
df['EMA_26'] = df['Close'].ewm(span=26).mean()
df['MACD'] = df['EMA_12'] - df['EMA_26']
df['Signal_Line'] = df['MACD'].ewm(span=9).mean()
df['MACD_Histogram'] = df['MACD'] - df['Signal_Line']
```

Trading signals:
	•	MACD crosses above signal = Buy
	•	MACD crosses below signal = Sell
	•	Histogram expansion = trend strengthening

6.4 Bollinger Bands

Calculate bands:
```python
period = 20
std_dev = 2

df['BB_Middle'] = df['Close'].rolling(period).mean()
df['BB_Std'] = df['Close'].rolling(period).std()
df['BB_Upper'] = df['BB_Middle'] + (std_dev * df['BB_Std'])
df['BB_Lower'] = df['BB_Middle'] - (std_dev * df['BB_Std'])
```

Trading strategy:
	•	Price touches lower band = oversold (buy)
	•	Price touches upper band = overbought (sell)
	•	Breakout above upper band = strong trend
	•	Squeeze (bands narrow) = big move coming

---

## Chapter 7: Building a Complete Trading Bot

7.1 Strategy Design Document

Before coding, plan your strategy:

Strategy name: RSI Mean Reversion

Rules:
	•	Entry: RSI below 30 and closing above today's low
	•	Exit: RSI above 70 or 3% profit or 1.5% loss
	•	Timeframe: Daily
	•	Markets: NSE large caps
	•	Position size: 2% risk per trade

Hypothesis:
Oversold stocks in uptrend tend to bounce. We capture the bounce and exit on overbought.

7.2 Complete Bot Code Example

```python
import pandas as pd
import yfinance as yf
from datetime import datetime

class TradingBot:
    def __init__(self, symbol, capital=100000):
        self.symbol = symbol
        self.capital = capital
        self.position = 0
        self.trades = []
        
    def fetch_data(self, start, end):
        """Download historical data"""
        df = yf.download(self.symbol, start=start, end=end)
        return df
    
    def calculate_indicators(self, df):
        """Calculate RSI"""
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        return df
    
    def generate_signals(self, df):
        """Entry and exit logic"""
        signals = []
        position = 0
        entry_price = 0
        
        for i in range(50, len(df)):  # Start after indicators ready
            current_price = df['Close'].iloc[i]
            current_rsi = df['RSI'].iloc[i]
            
            # Entry condition
            if position == 0 and current_rsi < 30:
                entry_price = current_price
                position = 1
                signals.append({
                    'Date': df.index[i],
                    'Type': 'BUY',
                    'Price': current_price,
                    'RSI': current_rsi
                })
            
            # Exit conditions
            elif position == 1:
                profit_pct = ((current_price - entry_price) / entry_price) * 100
                
                # Take profit
                if current_rsi > 70 or profit_pct > 3:
                    position = 0
                    signals.append({
                        'Date': df.index[i],
                        'Type': 'SELL',
                        'Price': current_price,
                        'RSI': current_rsi,
                        'Profit%': profit_pct
                    })
                
                # Stop loss
                elif profit_pct < -1.5:
                    position = 0
                    signals.append({
                        'Date': df.index[i],
                        'Type': 'SELL (SL)',
                        'Price': current_price,
                        'RSI': current_rsi,
                        'Profit%': profit_pct
                    })
        
        return signals
    
    def backtest(self, start_date, end_date):
        """Run complete backtest"""
        print(f"Backtesting {self.symbol}")
        print(f"Period: {start_date} to {end_date}")
        print("-" * 50)
        
        # Get and prepare data
        df = self.fetch_data(start_date, end_date)
        df = self.calculate_indicators(df)
        
        # Generate signals
        signals = self.generate_signals(df)
        
        # Calculate returns
        capital = self.capital
        for i in range(0, len(signals), 2):
            if i+1 < len(signals):
                buy = signals[i]
                sell = signals[i+1]
                
                shares = capital // buy['Price']
                cost = shares * buy['Price']
                proceeds = shares * sell['Price']
                profit = proceeds - cost
                capital += profit
                
                print(f"{buy['Date'].date()}: Buy ₹{buy['Price']:.2f}")
                print(f"{sell['Date'].date()}: Sell ₹{sell['Price']:.2f} | Profit: ₹{profit:.2f}")
                print()
        
        total_return = ((capital - self.capital) / self.capital) * 100
        print(f"Final Capital: ₹{capital:.2f}")
        print(f"Total Return: {total_return:.2f}%")
        print(f"Total Trades: {len(signals)//2}")
        
        return signals

# Run backtest
bot = TradingBot('RELIANCE.NS', capital=100000)
bot.backtest('2023-01-01', '2024-01-01')
```

7.3 Testing Your Bot

Run tests on:
	•	Multiple stocks (does it work generally?)
	•	Different time periods (different market conditions)
	•	Various parameter values (sensitivity)
	•	Paper trading (real-time without money)

7.4 Improving Performance

Optimization areas:
	•	Better entry timing (add filters)
	•	Tighter risk management
	•	Market regime filter (only trade in trends)
	•	Position sizing (vary based on confidence)
	•	Multiple timeframe confirmation

---

## Chapter 8: Risk Management in Algo Trading

8.1 Position Sizing Algorithm

Kelly Criterion (simplified):
```python
def kelly_position_size(win_rate, avg_win, avg_loss):
    win_prob = win_rate / 100
    loss_prob = 1 - win_prob
    win_loss_ratio = avg_win / avg_loss
    
    kelly_pct = (win_prob * win_loss_ratio - loss_prob) / win_loss_ratio
    
    # Use half Kelly (conservative)
    return kelly_pct * 0.5

# Example: 55% win rate, avg win ₹1000, avg loss ₹500
position_size = kelly_position_size(55, 1000, 500)
print(f"Bet {position_size*100:.1f}% of capital per trade")
```

Fixed percentage (simpler):
```python
capital = 100000
risk_per_trade = 0.02  # 2%
entry = 500
stop = 475
risk_per_share = entry - stop

shares = (capital * risk_per_trade) / risk_per_share
print(f"Buy {int(shares)} shares")
```

8.2 Stop Loss Implementation

Code for stop loss:
```python
def check_stop_loss(entry_price, current_price, position_type, stop_pct=2):
    if position_type == 'LONG':
        loss_pct = ((current_price - entry_price) / entry_price) * 100
        if loss_pct <= -stop_pct:
            return True
    elif position_type == 'SHORT':
        loss_pct = ((entry_price - current_price) / entry_price) * 100
        if loss_pct <= -stop_pct:
            return True
    return False
```

8.3 Take Profit Logic

Trailing stop implementation:
```python
def trailing_stop(entry_price, current_price, highest_price, trail_pct=3):
    # Calculate profit
    profit_pct = ((current_price - entry_price) / entry_price) * 100
    
    # Only trail if in profit
    if profit_pct > 0:
        stop_price = highest_price * (1 - trail_pct/100)
        if current_price < stop_price:
            return True  # Exit
    
    return False  # Hold
```

8.4 Portfolio Risk Limits

Maximum exposure rules:
```python
class RiskManager:
    def __init__(self, total_capital):
        self.total_capital = total_capital
        self.max_risk_per_trade = 0.02  # 2%
        self.max_portfolio_risk = 0.08  # 8%
        self.current_positions = []
    
    def can_take_trade(self, risk_amount):
        current_risk = sum([p['risk'] for p in self.current_positions])
        total_risk = (current_risk + risk_amount) / self.total_capital
        
        if total_risk <= self.max_portfolio_risk:
            return True
        return False
```

---

## Chapter 9: Connecting to Broker APIs

9.1 Popular Broker APIs in India

Zerodha Kite Connect:
	•	Most popular
	•	Good documentation
	•	₹2000/month subscription
	•	Python library available

Upstox API:
	•	Free for clients
	•	WebSocket support
	•	Good execution speed

AliceBlue API:
	•	Lower cost
	•	Suitable for beginners

5Paisa API:
	•	Free API access
	•	Good for testing

9.2 Authentication Setup

Example Kite Connect flow:
```python
from kiteconnect import KiteConnect

# Initialize
api_key = "your_api_key"
api_secret = "your_secret"
kite = KiteConnect(api_key=api_key)

# Login URL
print(kite.login_url())
# User logs in via browser, gets request token

# Generate session
request_token = "from_browser_redirect"
data = kite.generate_session(request_token, api_secret=api_secret)
access_token = data["access_token"]

# Set token
kite.set_access_token(access_token)

# You're connected!
```

9.3 Placing Orders via API

Market order:
```python
order_id = kite.place_order(
    variety=kite.VARIETY_REGULAR,
    exchange=kite.EXCHANGE_NSE,
    tradingsymbol="RELIANCE",
    transaction_type=kite.TRANSACTION_TYPE_BUY,
    quantity=10,
    order_type=kite.ORDER_TYPE_MARKET,
    product=kite.PRODUCT_MIS  # Intraday
)
```

Limit order:
```python
order_id = kite.place_order(
    variety=kite.VARIETY_REGULAR,
    exchange=kite.EXCHANGE_NSE,
    tradingsymbol="TCS",
    transaction_type=kite.TRANSACTION_TYPE_BUY,
    quantity=50,
    price=3500,  # Limit price
    order_type=kite.ORDER_TYPE_LIMIT,
    product=kite.PRODUCT_CNC  # Delivery
)
```

Stop loss order:
```python
order_id = kite.place_order(
    variety=kite.VARIETY_REGULAR,
    exchange=kite.EXCHANGE_NSE,
    tradingsymbol="INFY",
    transaction_type=kite.TRANSACTION_TYPE_SELL,
    quantity=100,
    trigger_price=1450,
    price=1445,
    order_type=kite.ORDER_TYPE_SL,
    product=kite.PRODUCT_MIS
)
```

9.4 Getting Live Market Data

Subscribe to ticker:
```python
from kiteconnect import KiteTicker

kws = KiteTicker(api_key, access_token)

def on_ticks(ws, ticks):
    # Ticks is list of tick data
    for tick in ticks:
        print(f"Stock: {tick['instrument_token']}")
        print(f"Price: {tick['last_price']}")
        print(f"Volume: {tick['volume']}")

def on_connect(ws, response):
    # Subscribe to instruments
    ws.subscribe([738561])  # Reliance token
    ws.set_mode(ws.MODE_FULL, [738561])

kws.on_ticks = on_ticks
kws.on_connect = on_connect
kws.connect()
```

---

## Chapter 10: Paper Trading and Testing

10.1 Setting Up Paper Trading

Paper trading tests strategies with fake money:

Simple paper trading class:
```python
class PaperTradingAccount:
    def __init__(self, starting_capital=100000):
        self.capital = starting_capital
        self.positions = {}
        self.trade_history = []
    
    def buy(self, symbol, quantity, price):
        cost = quantity * price
        if cost <= self.capital:
            self.capital -= cost
            self.positions[symbol] = {
                'quantity': quantity,
                'avg_price': price,
                'current_price': price
            }
            self.trade_history.append({
                'type': 'BUY',
                'symbol': symbol,
                'qty': quantity,
                'price': price
            })
            return True
        return False
    
    def sell(self, symbol, quantity, price):
        if symbol in self.positions:
            proceeds = quantity * price
            self.capital += proceeds
            
            # Calculate profit
            profit = (price - self.positions[symbol]['avg_price']) * quantity
            
            del self.positions[symbol]
            self.trade_history.append({
                'type': 'SELL',
                'symbol': symbol,
                'qty': quantity,
                'price': price,
                'profit': profit
            })
            return True
        return False
    
    def get_portfolio_value(self):
        position_value = sum([
            pos['quantity'] * pos['current_price'] 
            for pos in self.positions.values()
        ])
        return self.capital + position_value
```

10.2 Live Data Testing

Run your bot with real data, simulated trading:
```python
# Initialize paper account
account = PaperTradingAccount(100000)

# Get live data (or recent data)
df = yf.download('TCS.NS', period='1mo', interval='1d')

# Run strategy
# ... your strategy logic ...

# Check performance
print(f"Final value: ₹{account.get_portfolio_value()}")
```

10.3 Monitoring Performance

Real-time metrics to track:
```python
def get_metrics(account):
    total_trades = len(account.trade_history)
    profitable_trades = len([t for t in account.trade_history if t.get('profit', 0) > 0])
    
    win_rate = (profitable_trades / total_trades) * 100 if total_trades > 0 else 0
    total_profit = sum([t.get('profit', 0) for t in account.trade_history])
    
    print(f"Total Trades: {total_trades}")
    print(f"Win Rate: {win_rate:.1f}%")
    print(f"Total Profit: ₹{total_profit:.2f}")
```

10.4 Transitioning to Live Trading

Checklist before going live:
	•	Paper traded profitably for 3+ months
	•	Understand every line of code
	•	Tested on multiple market conditions
	•	Risk management working correctly
	•	Broker API fully tested
	•	Start with 10-20% of intended capital
	•	Monitor first week closely

---

## Chapter 11: Advanced Strategies

11.1 Multi-Indicator Strategy

Combining indicators reduces false signals:
```python
def advanced_signal(df, i):
    # Check multiple conditions
    rsi = df['RSI'].iloc[i]
    macd = df['MACD'].iloc[i]
    signal = df['Signal_Line'].iloc[i]
    sma_20 = df['SMA_20'].iloc[i]
    sma_50 = df['SMA_50'].iloc[i]
    close = df['Close'].iloc[i]
    
    # Bull signal: All align
    if (rsi > 40 and rsi < 70 and 
        macd > signal and 
        sma_20 > sma_50 and 
        close > sma_20):
        return 'BUY'
    
    # Bear signal: All align
    elif (rsi > 30 and rsi < 60 and 
          macd < signal and 
          sma_20 < sma_50 and 
          close < sma_20):
        return 'SELL'
    
    return 'HOLD'
```

11.2 Pair Trading Strategy

Trade correlated stocks:

Concept:
	•	Find two correlated stocks (e.g., HDFC Bank & ICICI Bank)
	•	When spread widens, trade mean reversion
	•	Long underperformer, short outperformer
	•	Exit when spread normalizes

Implementation:
```python
def calculate_spread(stock1_price, stock2_price):
    return stock1_price - stock2_price

def z_score(spread, period=20):
    mean = spread.rolling(period).mean()
    std = spread.rolling(period).std()
    return (spread - mean) / std

# Entry when z-score > 2 or < -2
# Exit when z-score returns to 0
```

11.3 Breakout Trading Bot

Capture strong momentum:
```python
def breakout_strategy(df, lookback=20):
    signals = []
    
    for i in range(lookback, len(df)):
        current_close = df['Close'].iloc[i]
        recent_high = df['High'].iloc[i-lookback:i].max()
        recent_low = df['Low'].iloc[i-lookback:i].min()
        volume_avg = df['Volume'].iloc[i-lookback:i].mean()
        current_volume = df['Volume'].iloc[i]
        
        # Bullish breakout
        if (current_close > recent_high and 
            current_volume > volume_avg * 1.5):
            signals.append({'Type': 'BUY', 'Price': current_close})
        
        # Bearish breakdown
        elif (current_close < recent_low and 
              current_volume > volume_avg * 1.5):
            signals.append({'Type': 'SELL', 'Price': current_close})
    
    return signals
```

11.4 Mean Reversion Bot

Buy dips, sell rips:
```python
def mean_reversion(df, period=20, std_dev=2):
    df['Mean'] = df['Close'].rolling(period).mean()
    df['Std'] = df['Close'].rolling(period).std()
    df['Upper'] = df['Mean'] + (std_dev * df['Std'])
    df['Lower'] = df['Mean'] - (std_dev * df['Std'])
    
    signals = []
    for i in range(period, len(df)):
        close = df['Close'].iloc[i]
        upper = df['Upper'].iloc[i]
        lower = df['Lower'].iloc[i]
        mean = df['Mean'].iloc[i]
        
        # Oversold - Buy
        if close < lower:
            signals.append({'Type': 'BUY', 'Price': close, 'Target': mean})
        
        # Overbought - Sell
        elif close > upper:
            signals.append({'Type': 'SELL', 'Price': close, 'Target': mean})
    
    return signals
```

---

## Chapter 12: Deployment and Monitoring

12.1 Running Your Bot 24/7

Options for continuous operation:

Cloud hosting:
	•	AWS EC2: Reliable, scalable
	•	Google Cloud: Easy setup
	•	DigitalOcean: Affordable
	•	PythonAnywhere: Beginner friendly

Local computer:
	•	Dedicated PC/laptop
	•	Keep running during trading hours
	•	Backup power recommended
	•	Internet stability critical

12.2 Error Handling

Robust error handling:
```python
import time

def safe_trade_execution():
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            # Place order
            order_id = kite.place_order(...)
            print(f"Order placed: {order_id}")
            break
        
        except Exception as e:
            print(f"Error: {e}")
            retry_count += 1
            time.sleep(5)  # Wait before retry
            
            if retry_count == max_retries:
                # Send alert
                send_telegram_alert(f"Failed to place order after {max_retries} attempts")
```

12.3 Logging and Alerts

Set up logging:
```python
import logging

logging.basicConfig(
    filename='trading_bot.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Log trades
logging.info(f"BUY {symbol} at ₹{price}")

# Log errors
logging.error(f"Connection failed: {error}")
```

Telegram alerts:
```python
import requests

def send_telegram(message):
    bot_token = "your_telegram_bot_token"
    chat_id = "your_chat_id"
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    requests.post(url, json={
        'chat_id': chat_id,
        'text': message
    })

# Usage
send_telegram("🚀 Buy signal: TCS at ₹3500")
```

12.4 Performance Monitoring

Daily reports:
```python
def generate_daily_report(account):
    report = f"""
    📊 Daily Trading Report
    Date: {datetime.now().date()}
    
    💰 Account Value: ₹{account.get_portfolio_value():,.2f}
    📈 Today's P&L: ₹{account.daily_pnl:,.2f}
    📊 Open Positions: {len(account.positions)}
    ✅ Trades Today: {account.trades_today}
    
    Win Rate: {account.win_rate:.1f}%
    Sharpe Ratio: {account.sharpe:.2f}
    """
    
    send_telegram(report)
    logging.info(report)
```

---

## Conclusion: Your Algorithmic Trading Journey

You've learned:
	•	Python programming basics
	•	Data acquisition and processing
	•	Strategy development and backtesting
	•	Risk management implementation
	•	Broker API integration
	•	Live trading deployment

Next steps:
	•	Start with simple strategies
	•	Paper trade for 2-3 months
	•	Keep learning and improving
	•	Join algo trading communities
	•	Scale gradually as you prove consistency

Remember:
	•	Simple strategies often work best
	•	Risk management is non-negotiable
	•	Technology is tool, strategy is king
	•	Continuous learning required
	•	Patience and discipline win

Resources:
	•	QuantInsti: Algo trading courses
	•	GitHub: Open source strategies
	•	QuantConnect: Cloud backtesting
	•	Your broker's API documentation
	•	TradeSmart Money: Market data and analysis

The journey from beginner to profitable algo trader takes 1-2 years of dedicated effort. But the rewards—passive income, scalability, and freedom—are worth it.

Start coding today! 💻📈

## Appendix: Quick Reference Code Snippets

Simple strategy template:
```python
import yfinance as yf
import pandas as pd

def simple_strategy(symbol, start, end):
    # Download data
    df = yf.download(symbol, start=start, end=end)
    
    # Add indicators
    df['SMA_20'] = df['Close'].rolling(20).mean()
    df['SMA_50'] = df['Close'].rolling(50).mean()
    
    # Generate signals
    df['Signal'] = 0
    df.loc[df['SMA_20'] > df['SMA_50'], 'Signal'] = 1
    df.loc[df['SMA_20'] < df['SMA_50'], 'Signal'] = -1
    
    return df

# Run
result = simple_strategy('RELIANCE.NS', '2023-01-01', '2024-01-01')
print(result[['Close', 'SMA_20', 'SMA_50', 'Signal']].tail())
```

Happy algorithmic trading! 🤖

