-- Option Chain Analysis Table Schema for Supabase
-- This table stores the results of option chain analysis
-- Updated every 5 minutes during market hours via VPS Python script

-- Drop table if exists (for clean re-creation during development)
DROP TABLE IF EXISTS option_chain_analysis;

-- Create option_chain_analysis table
CREATE TABLE option_chain_analysis (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    analysis_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    trading_date DATE NOT NULL,
    score DECIMAL(10,2) NOT NULL,
    institutional_sentiment VARCHAR(20) NOT NULL,
    reasoning TEXT,
    confidence DECIMAL(5,2),
    current_price DECIMAL(12,2),
    overall_pcr DECIMAL(10,6),
    previous_pcr DECIMAL(10,6),
    pcr_change DECIMAL(10,6),
    pcr_change_percent DECIMAL(8,3),
    pcr_momentum_score DECIMAL(8,2),
    max_pain DECIMAL(12,2),
    support_levels JSONB,
    resistance_levels JSONB,
    unusual_activity JSONB,
    strength_signals JSONB,
    net_call_buildup DECIMAL(15,2),
    net_put_buildup DECIMAL(15,2),
    target_1 DECIMAL(12,2),
    target_2 DECIMAL(12,2),
    stop_loss DECIMAL(12,2),
    risk_reward_ratio DECIMAL(8,2),
    institutional_bullish_flow DECIMAL(10,2),
    institutional_bearish_flow DECIMAL(10,2),
    net_institutional_flow DECIMAL(10,2),
    detailed_analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_option_analysis_symbol ON option_chain_analysis(symbol);
CREATE INDEX idx_option_analysis_trading_date ON option_chain_analysis(trading_date);
CREATE INDEX idx_option_analysis_timestamp ON option_chain_analysis(analysis_timestamp);
CREATE INDEX idx_option_analysis_sentiment ON option_chain_analysis(institutional_sentiment);
CREATE INDEX idx_option_analysis_score ON option_chain_analysis(score);
CREATE INDEX idx_option_analysis_symbol_date ON option_chain_analysis(symbol, trading_date);

-- Enable Row Level Security (RLS)
ALTER TABLE option_chain_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access for the application
CREATE POLICY "Allow public read access" ON option_chain_analysis
    FOR SELECT USING (true);

-- Allow service role to insert/update/delete (for VPS script)
CREATE POLICY "Allow service role full access" ON option_chain_analysis
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_option_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_option_analysis_updated_at
    BEFORE UPDATE ON option_chain_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_option_analysis_updated_at();

-- Create view for latest analysis per symbol
CREATE OR REPLACE VIEW latest_option_analysis AS
SELECT DISTINCT ON (symbol) 
    symbol,
    analysis_timestamp,
    trading_date,
    score,
    institutional_sentiment,
    reasoning,
    confidence,
    current_price,
    overall_pcr,
    max_pain,
    support_levels,
    resistance_levels,
    unusual_activity,
    strength_signals,
    net_call_buildup,
    net_put_buildup,
    target_1,
    target_2,
    stop_loss,
    risk_reward_ratio,
    institutional_bullish_flow,
    institutional_bearish_flow,
    net_institutional_flow,
    detailed_analysis
FROM option_chain_analysis
ORDER BY symbol, analysis_timestamp DESC;

COMMENT ON TABLE option_chain_analysis IS 'Stores option chain analysis results collected every 5 minutes during market hours';
COMMENT ON COLUMN option_chain_analysis.symbol IS 'Stock symbol (e.g., LT, DIVISLAB)';
COMMENT ON COLUMN option_chain_analysis.score IS 'Final analysis score (positive = bullish, negative = bearish)';
COMMENT ON COLUMN option_chain_analysis.institutional_sentiment IS 'Overall institutional sentiment';
COMMENT ON COLUMN option_chain_analysis.overall_pcr IS 'Put-Call Ratio from option chain totals';
COMMENT ON COLUMN option_chain_analysis.max_pain IS 'Max pain level (strike with highest total OI)';
COMMENT ON COLUMN option_chain_analysis.net_institutional_flow IS 'Net institutional flow (bullish - bearish)';
