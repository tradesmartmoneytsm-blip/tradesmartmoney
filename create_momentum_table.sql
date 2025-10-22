-- Create momentum_stocks table
CREATE TABLE IF NOT EXISTS momentum_stocks (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    isin VARCHAR(20),
    display_symbol VARCHAR(50),
    current_price DECIMAL(12,2) NOT NULL,
    market_cap DECIMAL(15,2) NOT NULL,
    price_change_1week DECIMAL(8,2),
    price_change_2week DECIMAL(8,2),
    price_change_1month DECIMAL(8,2),
    price_change_3month DECIMAL(8,2),
    price_change_1year DECIMAL(8,2),
    pe_ratio DECIMAL(10,2),
    industry_pe DECIMAL(10,2),
    roce DECIMAL(8,2),
    roe DECIMAL(8,2),
    distance_from_1month_high DECIMAL(8,2),
    eps_growth_1year DECIMAL(10,2),
    revenue_growth_1year DECIMAL(10,2),
    yearly_earning_per_share DECIMAL(10,2),
    quarterly_profit_growth_yoy DECIMAL(10,2),
    analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_symbol ON momentum_stocks(symbol);
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_date ON momentum_stocks(analysis_date DESC);
CREATE INDEX IF NOT EXISTS idx_momentum_stocks_mcap ON momentum_stocks(market_cap DESC);

-- Create unique constraint (one entry per stock ever)
CREATE UNIQUE INDEX IF NOT EXISTS idx_momentum_stocks_symbol_unique ON momentum_stocks(symbol);

-- Enable RLS
ALTER TABLE momentum_stocks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access on momentum_stocks" ON momentum_stocks FOR SELECT USING (true);
CREATE POLICY "Allow service role full access on momentum_stocks" ON momentum_stocks FOR ALL USING (auth.role() = 'service_role');
