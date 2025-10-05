-- Futures Analysis Database Schema for Supabase
-- This table stores the results of futures analysis
-- Updated every 5 minutes during market hours via VPS Python script

-- Drop table if exists (for clean re-creation during development)
DROP TABLE IF EXISTS futures_analysis;

-- Create futures_analysis table
CREATE TABLE futures_analysis (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    analysis_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    trading_date DATE NOT NULL,
    
    -- Current Month Futures Data
    current_month_expiry DATE NOT NULL,
    current_price DECIMAL(12,2) NOT NULL,
    current_open_interest BIGINT NOT NULL,
    current_volume BIGINT NOT NULL,
    current_change_in_oi BIGINT,
    
    -- Next Month Futures Data
    next_month_expiry DATE,
    next_month_price DECIMAL(12,2),
    next_month_oi BIGINT,
    
    -- Spot Data
    spot_price DECIMAL(12,2) NOT NULL,
    
    -- Analysis Results
    basis DECIMAL(8,2) NOT NULL, -- Future - Spot
    basis_percentage DECIMAL(6,3), -- (Future - Spot) / Spot * 100
    annualized_basis DECIMAL(8,2), -- Annualized basis
    
    -- OI Analysis
    oi_buildup_type VARCHAR(20) NOT NULL CHECK (oi_buildup_type IN ('LONG_BUILDUP', 'SHORT_BUILDUP', 'LONG_UNWINDING', 'SHORT_COVERING', 'NEUTRAL')),
    oi_strength VARCHAR(10) NOT NULL CHECK (oi_strength IN ('STRONG', 'MODERATE', 'WEAK')),
    oi_change_percentage DECIMAL(6,2),
    
    -- Rollover Analysis
    days_to_expiry INTEGER NOT NULL,
    rollover_pressure VARCHAR(10) CHECK (rollover_pressure IN ('HIGH', 'MEDIUM', 'LOW')),
    rollover_cost DECIMAL(8,2),
    
    -- Market Structure
    market_structure VARCHAR(15) CHECK (market_structure IN ('CONTANGO', 'BACKWARDATION', 'NEUTRAL')),
    
    -- Trading Signals
    signal_type VARCHAR(20) CHECK (signal_type IN ('BULLISH', 'BEARISH', 'NEUTRAL', 'ARBITRAGE')),
    signal_strength DECIMAL(5,2) NOT NULL,
    confidence DECIMAL(5,2) NOT NULL,
    
    -- Price Targets
    target_1 DECIMAL(12,2),
    target_2 DECIMAL(12,2),
    stop_loss DECIMAL(12,2),
    risk_reward_ratio DECIMAL(8,2),
    
    -- Analysis Details
    reasoning TEXT,
    key_levels JSONB, -- Support/Resistance from volume profile
    volume_profile JSONB, -- Price-volume distribution
    institutional_activity JSONB, -- Large trade analysis
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_futures_analysis_symbol ON futures_analysis(symbol);
CREATE INDEX idx_futures_analysis_trading_date ON futures_analysis(trading_date);
CREATE INDEX idx_futures_analysis_timestamp ON futures_analysis(analysis_timestamp);
CREATE INDEX idx_futures_analysis_signal ON futures_analysis(signal_type);
CREATE INDEX idx_futures_analysis_buildup ON futures_analysis(oi_buildup_type);
CREATE INDEX idx_futures_analysis_symbol_date ON futures_analysis(symbol, trading_date);
CREATE INDEX idx_futures_analysis_expiry ON futures_analysis(current_month_expiry);

-- Enable Row Level Security (RLS)
ALTER TABLE futures_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access for the application
CREATE POLICY "Allow public read access" ON futures_analysis
    FOR SELECT USING (true);

-- Allow service role to insert/update/delete (for VPS script)
CREATE POLICY "Allow service role full access" ON futures_analysis
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_futures_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_futures_analysis_updated_at
    BEFORE UPDATE ON futures_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_futures_analysis_updated_at();

-- Create view for latest analysis per symbol
CREATE OR REPLACE VIEW latest_futures_analysis AS
SELECT DISTINCT ON (symbol) 
    symbol,
    analysis_timestamp,
    trading_date,
    current_month_expiry,
    current_price,
    current_open_interest,
    current_volume,
    current_change_in_oi,
    next_month_expiry,
    next_month_price,
    next_month_oi,
    spot_price,
    basis,
    basis_percentage,
    annualized_basis,
    oi_buildup_type,
    oi_strength,
    oi_change_percentage,
    days_to_expiry,
    rollover_pressure,
    rollover_cost,
    market_structure,
    signal_type,
    signal_strength,
    confidence,
    target_1,
    target_2,
    stop_loss,
    risk_reward_ratio,
    reasoning,
    key_levels,
    volume_profile,
    institutional_activity
FROM futures_analysis
ORDER BY symbol, analysis_timestamp DESC;

COMMENT ON TABLE futures_analysis IS 'Stores futures analysis results collected every 5 minutes during market hours';
COMMENT ON COLUMN futures_analysis.symbol IS 'Stock symbol (e.g., NIFTY, BANKNIFTY, RELIANCE)';
COMMENT ON COLUMN futures_analysis.basis IS 'Futures premium/discount vs spot (Future - Spot)';
COMMENT ON COLUMN futures_analysis.oi_buildup_type IS 'Type of OI buildup pattern detected';
COMMENT ON COLUMN futures_analysis.signal_strength IS 'Signal strength score (0-100)';
COMMENT ON COLUMN futures_analysis.market_structure IS 'Overall market structure based on basis';
