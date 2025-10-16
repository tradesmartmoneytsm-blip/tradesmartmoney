-- Supabase Schema for Intraday Insights
-- Created for TradeSmart Money platform

-- Table for Most Active Stock Calls
CREATE TABLE IF NOT EXISTS most_active_stock_calls (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    percentage_change DECIMAL(10, 4) NOT NULL,
    session_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Most Active Stock Puts  
CREATE TABLE IF NOT EXISTS most_active_stock_puts (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    percentage_change DECIMAL(10, 4) NOT NULL,
    session_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for Volume Gainers (for future use)
CREATE TABLE IF NOT EXISTS volume_gainers (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    ltp DECIMAL(12, 4) NOT NULL,
    volume BIGINT NOT NULL,
    volume_change_percent DECIMAL(10, 4),
    session_id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_most_active_calls_timestamp ON most_active_stock_calls(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_most_active_calls_session ON most_active_stock_calls(session_id);
CREATE INDEX IF NOT EXISTS idx_most_active_calls_symbol ON most_active_stock_calls(symbol);

CREATE INDEX IF NOT EXISTS idx_most_active_puts_timestamp ON most_active_stock_puts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_most_active_puts_session ON most_active_stock_puts(session_id);
CREATE INDEX IF NOT EXISTS idx_most_active_puts_symbol ON most_active_stock_puts(symbol);

CREATE INDEX IF NOT EXISTS idx_volume_gainers_timestamp ON volume_gainers(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_volume_gainers_session ON volume_gainers(session_id);


-- RLS (Row Level Security) Policies
ALTER TABLE most_active_stock_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE most_active_stock_puts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volume_gainers ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access
CREATE POLICY "Allow public read access on most_active_stock_calls" ON most_active_stock_calls FOR SELECT USING (true);
CREATE POLICY "Allow public read access on most_active_stock_puts" ON most_active_stock_puts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on volume_gainers" ON volume_gainers FOR SELECT USING (true);

-- Policy to allow service role to insert/update/delete (for GitHub Actions)
CREATE POLICY "Allow service role full access on most_active_stock_calls" ON most_active_stock_calls FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on most_active_stock_puts" ON most_active_stock_puts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on volume_gainers" ON volume_gainers FOR ALL USING (auth.role() = 'service_role');

-- Function to clean old data (keep only last 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_intraday_data()
RETURNS void AS $$
BEGIN
    DELETE FROM most_active_stock_calls WHERE created_at < NOW() - INTERVAL '7 days';
    DELETE FROM most_active_stock_puts WHERE created_at < NOW() - INTERVAL '7 days';
    DELETE FROM volume_gainers WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily at midnight (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-intraday-data', '0 0 * * *', 'SELECT cleanup_old_intraday_data();'); 