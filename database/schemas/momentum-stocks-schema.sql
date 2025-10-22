-- Momentum Stocks Database Schema
-- Stores daily momentum stock data from Dhan API
-- Updated daily at 3:00 PM IST

CREATE TABLE IF NOT EXISTS momentum_stocks (
    id BIGSERIAL PRIMARY KEY,
    
    -- Stock identification
    symbol VARCHAR(50) NOT NULL,
    isin VARCHAR(20),
    display_symbol VARCHAR(50),
    
    -- Price data
    current_price DECIMAL(12,2) NOT NULL,
    market_cap DECIMAL(15,2) NOT NULL, -- Market cap in crores
    
    -- Performance metrics
    price_change_1week DECIMAL(8,2),
    price_change_2week DECIMAL(8,2),
    price_change_1month DECIMAL(8,2),
    price_change_3month DECIMAL(8,2),
    price_change_1year DECIMAL(8,2),
    
    -- Financial ratios
    pe_ratio DECIMAL(10,2),
    industry_pe DECIMAL(10,2),
    roce DECIMAL(8,2),
    roe DECIMAL(8,2),
    
    -- Distance from highs
    distance_from_1month_high DECIMAL(8,2),
    
    -- Growth metrics
    eps_growth_1year DECIMAL(10,2),
    revenue_growth_1year DECIMAL(10,2),
    yearly_earning_per_share DECIMAL(10,2),
    quarterly_profit_growth_yoy DECIMAL(10,2),
    
    -- Timestamps
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_symbol ON momentum_stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_date ON momentum_stocks(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_mcap ON momentum_stocks(market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_performance ON momentum_stocks(price_change_1month DESC);

-- Create unique constraint to prevent duplicate symbols (one entry per stock ever)
CREATE UNIQUE INDEX IF NOT EXISTS idx_momentum_stocks_symbol_unique 
ON momentum_stocks(symbol);

-- Enable Row Level Security (RLS)
ALTER TABLE momentum_stocks ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access
CREATE POLICY "Allow public read access on momentum_stocks" ON momentum_stocks
    FOR SELECT USING (true);

-- Allow service role to insert/update/delete (for Python script)
CREATE POLICY "Allow service role full access on momentum_stocks" ON momentum_stocks
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_momentum_stocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_momentum_stocks_updated_at
    BEFORE UPDATE ON momentum_stocks
    FOR EACH ROW
    EXECUTE FUNCTION update_momentum_stocks_updated_at();

-- Create view for latest momentum stocks
CREATE OR REPLACE VIEW latest_momentum_stocks AS
SELECT 
    symbol,
    current_price,
    market_cap,
    price_change_1week,
    price_change_2week,
    price_change_1month,
    price_change_3month,
    price_change_1year,
    pe_ratio,
    industry_pe,
    roce,
    roe,
    distance_from_1month_high,
    eps_growth_1year,
    revenue_growth_1year,
    quarterly_profit_growth_yoy,
    analysis_date,
    created_at
FROM momentum_stocks
WHERE analysis_date = CURRENT_DATE
ORDER BY market_cap DESC;

-- Comments
COMMENT ON TABLE momentum_stocks IS 'Daily momentum stock data from Dhan API - updated at 3:00 PM IST';
COMMENT ON COLUMN momentum_stocks.symbol IS 'Stock symbol (e.g., RELIANCE, TCS)';
COMMENT ON COLUMN momentum_stocks.market_cap IS 'Market capitalization in crores';
COMMENT ON COLUMN momentum_stocks.current_price IS 'Current market price';
COMMENT ON COLUMN momentum_stocks.price_change_1month IS 'Price change percentage over 1 month';
COMMENT ON COLUMN momentum_stocks.roce IS 'Return on Capital Employed';
COMMENT ON COLUMN momentum_stocks.roe IS 'Return on Equity';
