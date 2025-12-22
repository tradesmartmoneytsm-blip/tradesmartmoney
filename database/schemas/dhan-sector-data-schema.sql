-- Create dhan_sector_data table for storing historical price changes
-- This table stores 7D, 30D, 90D, 52W price changes from Dhan API
-- Supports both sectors (indices) and stocks within sectors

CREATE TABLE IF NOT EXISTS dhan_sector_data (
    id BIGSERIAL PRIMARY KEY,
    
    -- Symbol Information
    symbol TEXT NOT NULL,                           -- Index/Stock symbol (e.g., 'NIFTY 50', 'VEDL')
    sec_id INTEGER NOT NULL,                        -- Security ID from Dhan
    
    -- Data Type and Relationship
    data_type TEXT NOT NULL DEFAULT 'SECTOR',       -- 'SECTOR' or 'STOCK'
    parent_sector TEXT,                             -- Parent sector symbol (for stocks only)
    
    -- Historical Price Changes (from Dhan OHLC API)
    price_change_7d DECIMAL(8,3),                  -- 7-day price % change
    price_change_30d DECIMAL(8,3),                 -- 30-day price % change
    price_change_90d DECIMAL(8,3),                 -- 90-day price % change
    price_change_52w DECIMAL(8,3),                 -- 52-week price % change
    
    -- Current Price Info (optional, for reference)
    current_price DECIMAL(12,2),                   -- Latest price
    
    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),          -- Last update timestamp
    created_at TIMESTAMPTZ DEFAULT NOW(),          -- Record creation timestamp
    
    -- Unique constraint: combination of symbol, data_type, and parent_sector
    UNIQUE(symbol, data_type, parent_sector)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_symbol ON dhan_sector_data(symbol);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_sec_id ON dhan_sector_data(sec_id);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_type ON dhan_sector_data(data_type);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_parent ON dhan_sector_data(parent_sector);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_type_parent ON dhan_sector_data(data_type, parent_sector);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_7d ON dhan_sector_data(price_change_7d);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_30d ON dhan_sector_data(price_change_30d);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_90d ON dhan_sector_data(price_change_90d);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_52w ON dhan_sector_data(price_change_52w);
CREATE INDEX IF NOT EXISTS idx_dhan_sector_data_updated_at ON dhan_sector_data(updated_at);

-- Comments
COMMENT ON TABLE dhan_sector_data IS 'Historical price changes for sector indices and stocks from Dhan API';
COMMENT ON COLUMN dhan_sector_data.symbol IS 'Index/Stock symbol (e.g., NIFTY 50, VEDL)';
COMMENT ON COLUMN dhan_sector_data.sec_id IS 'Security ID from Dhan';
COMMENT ON COLUMN dhan_sector_data.data_type IS 'Type of data: SECTOR or STOCK';
COMMENT ON COLUMN dhan_sector_data.parent_sector IS 'Parent sector symbol (only for stocks)';
COMMENT ON COLUMN dhan_sector_data.price_change_7d IS '7-day price percentage change';
COMMENT ON COLUMN dhan_sector_data.price_change_30d IS '30-day price percentage change';
COMMENT ON COLUMN dhan_sector_data.price_change_90d IS '90-day price percentage change';
COMMENT ON COLUMN dhan_sector_data.price_change_52w IS '52-week price percentage change';
COMMENT ON COLUMN dhan_sector_data.current_price IS 'Current/latest price';
COMMENT ON COLUMN dhan_sector_data.updated_at IS 'Last data update timestamp';
COMMENT ON COLUMN dhan_sector_data.created_at IS 'Record creation timestamp';

-- Row Level Security (RLS)
ALTER TABLE dhan_sector_data ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access" ON dhan_sector_data
    FOR SELECT
    USING (true);

-- Policy: Allow service role full access
CREATE POLICY "Allow service role full access" ON dhan_sector_data
    FOR ALL
    USING (auth.role() = 'service_role');

