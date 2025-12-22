-- Table: dhan_sector_indices_config
-- Description: Stores configuration and metadata for all NSE indices from Dhan
-- This table contains comprehensive information about indices including symbols, IDs, and performance metrics

CREATE TABLE IF NOT EXISTS dhan_sector_indices_config (
    id BIGSERIAL PRIMARY KEY,
    
    -- Symbol Information
    symbol TEXT NOT NULL UNIQUE,                    -- Trading symbol (e.g., 'GIFTNIFTY')
    display_symbol TEXT NOT NULL,                   -- Display name (e.g., 'Gift Nifty')
    seo_symbol TEXT,                                -- SEO-friendly symbol (e.g., 'gift-nifty')
    
    -- IDs and Classification
    sec_id INTEGER NOT NULL UNIQUE,                 -- Security ID from Dhan (e.g., 5024)
    exchange TEXT,                                  -- Exchange code (e.g., 'IDX', 'NSE')
    segment TEXT,                                   -- Market segment (e.g., 'I' for Index)
    instrument TEXT,                                -- Instrument type (e.g., 'IDX')
    index_based_on_exch TEXT,                       -- Base exchange (e.g., 'NSE')
    
    -- Price Information
    ltp NUMERIC(12, 2),                            -- Last Traded Price
    high_1yr NUMERIC(12, 2),                       -- 52-week high
    low_1yr NUMERIC(12, 2),                        -- 52-week low
    
    -- Performance Metrics
    price_perchng_1year NUMERIC(10, 4),            -- 1-year price % change
    price_perchng_3year NUMERIC(10, 4),            -- 3-year price % change
    price_perchng_5year NUMERIC(10, 4),            -- 5-year price % change
    
    -- Trading Information
    tick_size NUMERIC(10, 4),                      -- Minimum price movement
    
    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),          -- Last update timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()           -- Record creation timestamp
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dhan_indices_symbol ON dhan_sector_indices_config(symbol);
CREATE INDEX IF NOT EXISTS idx_dhan_indices_sec_id ON dhan_sector_indices_config(sec_id);
CREATE INDEX IF NOT EXISTS idx_dhan_indices_seo_symbol ON dhan_sector_indices_config(seo_symbol);
CREATE INDEX IF NOT EXISTS idx_dhan_indices_exchange ON dhan_sector_indices_config(exchange);
CREATE INDEX IF NOT EXISTS idx_dhan_indices_updated_at ON dhan_sector_indices_config(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE dhan_sector_indices_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON dhan_sector_indices_config
    FOR SELECT
    USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access" ON dhan_sector_indices_config
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE dhan_sector_indices_config IS 'Configuration and metadata for all NSE indices from Dhan';
COMMENT ON COLUMN dhan_sector_indices_config.symbol IS 'Trading symbol';
COMMENT ON COLUMN dhan_sector_indices_config.display_symbol IS 'Human-readable display name';
COMMENT ON COLUMN dhan_sector_indices_config.sec_id IS 'Dhan security ID used for API calls';
COMMENT ON COLUMN dhan_sector_indices_config.ltp IS 'Last Traded Price';
COMMENT ON COLUMN dhan_sector_indices_config.high_1yr IS '52-week high price';
COMMENT ON COLUMN dhan_sector_indices_config.low_1yr IS '52-week low price';

