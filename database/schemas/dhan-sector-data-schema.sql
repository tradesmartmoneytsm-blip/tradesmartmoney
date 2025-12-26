-- ============================================
-- DROP AND RECREATE dhan_sector_data table
-- ============================================
-- This script completely recreates the dhan_sector_data table
-- with proper unique constraints that prevent duplicates

-- Step 1: Drop existing table (including all data)
DROP TABLE IF EXISTS dhan_sector_data CASCADE;

-- Step 2: Create fresh table
CREATE TABLE dhan_sector_data (
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
    created_at TIMESTAMPTZ DEFAULT NOW()           -- Record creation timestamp
);

-- Step 3: Create proper unique indexes that handle NULLs correctly
-- Issue: Standard UNIQUE constraint doesn't work with NULLs (NULL != NULL in SQL)
-- Solution: Use partial unique indexes

-- For SECTORS (where parent_sector IS NULL)
-- This ensures each sector appears only once
CREATE UNIQUE INDEX idx_dhan_sector_unique_sectors 
ON dhan_sector_data(symbol, data_type) 
WHERE parent_sector IS NULL;

-- For STOCKS (where parent_sector IS NOT NULL)
-- This ensures each stock appears only once per sector
CREATE UNIQUE INDEX idx_dhan_sector_unique_stocks
ON dhan_sector_data(symbol, data_type, parent_sector)
WHERE parent_sector IS NOT NULL;

-- Step 4: Create performance indexes
CREATE INDEX idx_dhan_sector_data_symbol ON dhan_sector_data(symbol);
CREATE INDEX idx_dhan_sector_data_sec_id ON dhan_sector_data(sec_id);
CREATE INDEX idx_dhan_sector_data_type ON dhan_sector_data(data_type);
CREATE INDEX idx_dhan_sector_data_parent ON dhan_sector_data(parent_sector);
CREATE INDEX idx_dhan_sector_data_type_parent ON dhan_sector_data(data_type, parent_sector);
CREATE INDEX idx_dhan_sector_data_7d ON dhan_sector_data(price_change_7d DESC NULLS LAST);
CREATE INDEX idx_dhan_sector_data_30d ON dhan_sector_data(price_change_30d DESC NULLS LAST);
CREATE INDEX idx_dhan_sector_data_90d ON dhan_sector_data(price_change_90d DESC NULLS LAST);
CREATE INDEX idx_dhan_sector_data_52w ON dhan_sector_data(price_change_52w DESC NULLS LAST);
CREATE INDEX idx_dhan_sector_data_updated_at ON dhan_sector_data(updated_at DESC);

-- Step 5: Add table and column comments
COMMENT ON TABLE dhan_sector_data IS 'Historical price changes for sector indices and stocks from Dhan API. Uses partial unique indexes to prevent duplicates.';
COMMENT ON COLUMN dhan_sector_data.symbol IS 'Index/Stock symbol (e.g., NIFTY 50, VEDL)';
COMMENT ON COLUMN dhan_sector_data.sec_id IS 'Security ID from Dhan';
COMMENT ON COLUMN dhan_sector_data.data_type IS 'Type of data: SECTOR or STOCK';
COMMENT ON COLUMN dhan_sector_data.parent_sector IS 'Parent sector symbol (only for stocks, NULL for sectors)';
COMMENT ON COLUMN dhan_sector_data.price_change_7d IS '7-day price percentage change';
COMMENT ON COLUMN dhan_sector_data.price_change_30d IS '30-day price percentage change';
COMMENT ON COLUMN dhan_sector_data.price_change_90d IS '90-day price percentage change';
COMMENT ON COLUMN dhan_sector_data.price_change_52w IS '52-week price percentage change';
COMMENT ON COLUMN dhan_sector_data.current_price IS 'Current/latest price';
COMMENT ON COLUMN dhan_sector_data.updated_at IS 'Last data update timestamp';
COMMENT ON COLUMN dhan_sector_data.created_at IS 'Record creation timestamp';

-- Step 6: Enable Row Level Security (RLS)
ALTER TABLE dhan_sector_data ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS Policies
-- Policy: Allow public read access
CREATE POLICY "Allow public read access" ON dhan_sector_data
    FOR SELECT
    USING (true);

-- Policy: Allow service role full access (for Python script)
CREATE POLICY "Allow service role full access" ON dhan_sector_data
    FOR ALL
    USING (auth.role() = 'service_role');

-- Step 8: Grant necessary permissions
GRANT SELECT ON dhan_sector_data TO anon;
GRANT SELECT ON dhan_sector_data TO authenticated;
GRANT ALL ON dhan_sector_data TO service_role;

-- ============================================
-- VERIFICATION QUERIES (run after setup)
-- ============================================

-- Check table structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'dhan_sector_data'
-- ORDER BY ordinal_position;

-- Check indexes
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'dhan_sector_data'
-- ORDER BY indexname;

-- Check for duplicates (should return 0 rows)
-- SELECT symbol, data_type, COALESCE(parent_sector, 'NULL'), COUNT(*)
-- FROM dhan_sector_data
-- GROUP BY symbol, data_type, COALESCE(parent_sector, 'NULL')
-- HAVING COUNT(*) > 1;

-- ============================================
-- HOW THIS PREVENTS DUPLICATES
-- ============================================
-- 
-- Old Problem:
--   UNIQUE(symbol, data_type, parent_sector) doesn't work with NULLs
--   because in SQL: NULL != NULL
--   So multiple rows with (NIFTY Auto, SECTOR, NULL) were allowed
--
-- New Solution:
--   1. Partial index for sectors: UNIQUE(symbol, data_type) WHERE parent_sector IS NULL
--      - Only applies to rows where parent_sector IS NULL
--      - Ensures each sector appears exactly once
--
--   2. Partial index for stocks: UNIQUE(symbol, data_type, parent_sector) WHERE parent_sector IS NOT NULL
--      - Only applies to rows where parent_sector IS NOT NULL
--      - Ensures each stock appears exactly once per sector
--
-- Result:
--   - Python script can run multiple times
--   - INSERT will fail with unique violation error
--   - Script will catch the error and do UPDATE instead
--   - No duplicates possible!
--
