-- F&O Heatmap Data Table
-- Stores heatmap data fetched from Research360 every 5 minutes during market hours

CREATE TABLE IF NOT EXISTS fno_heatmap (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    trading_date DATE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Price data
    ltp DECIMAL(12,2),
    price_change DECIMAL(10,2),
    price_change_percent DECIMAL(8,2),
    
    -- Open Interest data
    oi BIGINT,
    oi_change BIGINT,
    oi_change_percent DECIMAL(8,2),
    
    -- Volume data
    volume BIGINT,
    volume_change BIGINT,
    value DECIMAL(15,2),
    
    -- Classification
    buildup_type VARCHAR(20), -- 'long', 'short', 'long_unwind', 'short_cover', 'neutral'
    sector VARCHAR(50),
    index_name VARCHAR(50),
    
    -- Expiry
    expiry_date DATE,
    expiry_type VARCHAR(20), -- 'weekly', 'monthly'
    
    -- Additional metadata
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for fast querying
    CONSTRAINT unique_symbol_timestamp UNIQUE (symbol, timestamp)
);

-- Indexes for performance
CREATE INDEX idx_fno_heatmap_trading_date ON fno_heatmap(trading_date);
CREATE INDEX idx_fno_heatmap_symbol ON fno_heatmap(symbol);
CREATE INDEX idx_fno_heatmap_timestamp ON fno_heatmap(timestamp);
CREATE INDEX idx_fno_heatmap_buildup ON fno_heatmap(buildup_type);
CREATE INDEX idx_fno_heatmap_sector ON fno_heatmap(sector);
CREATE INDEX idx_fno_heatmap_expiry ON fno_heatmap(expiry_date);

-- Composite index for common queries
CREATE INDEX idx_fno_heatmap_date_time ON fno_heatmap(trading_date, timestamp DESC);

-- Cleanup old data automatically (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_heatmap_data()
RETURNS void AS $$
BEGIN
    DELETE FROM fno_heatmap
    WHERE trading_date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE fno_heatmap IS 'Stores F&O heatmap data updated every 5 minutes during market hours';
COMMENT ON COLUMN fno_heatmap.buildup_type IS 'Type of option buildup: long, short, long_unwind, short_cover, neutral';
COMMENT ON COLUMN fno_heatmap.expiry_type IS 'Weekly or monthly expiry';

