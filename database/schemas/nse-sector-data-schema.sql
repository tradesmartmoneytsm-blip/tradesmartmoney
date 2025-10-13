-- NSE Sector Data Schema
-- Flexible design to accommodate any number of sector indices

-- ============================================================================
-- CLEANUP QUERIES - Run these first to clean existing data/schema
-- ============================================================================

-- Drop existing views (in dependency order)
DROP VIEW IF EXISTS stock_sector_mapping_enhanced CASCADE;
DROP VIEW IF EXISTS sector_indices_summary CASCADE;
DROP VIEW IF EXISTS latest_sector_performance CASCADE;

-- Drop existing tables (in dependency order)
DROP TABLE IF EXISTS nse_sector_data CASCADE;
DROP TABLE IF EXISTS nse_sector_indices_config CASCADE;

-- ============================================================================
-- DDL QUERIES - Create fresh schema
-- ============================================================================

-- Main table for sector data (both indices and constituent stocks)
CREATE TABLE IF NOT EXISTS nse_sector_data (
    id SERIAL PRIMARY KEY,
    
    -- Data Classification
    data_type VARCHAR(10) NOT NULL CHECK (data_type IN ('INDEX', 'STOCK')),
    index_name VARCHAR(100) NOT NULL,
    
    -- Stock/Index Identification
    symbol VARCHAR(150) NOT NULL,
    company_name VARCHAR(200),
    industry VARCHAR(100),
    
    -- Price Data
    current_price DECIMAL(12,2),
    previous_close DECIMAL(12,2),
    day_change DECIMAL(12,2),
    day_change_percent DECIMAL(8,3),
    day_high DECIMAL(12,2),
    day_low DECIMAL(12,2),
    year_high DECIMAL(12,2),
    year_low DECIMAL(12,2),
    
    -- Volume & Value Data
    total_traded_volume BIGINT DEFAULT 0,
    total_traded_value DECIMAL(15,2) DEFAULT 0,
    
    -- Sector-specific Data (for INDEX type)
    advances INTEGER DEFAULT 0,
    declines INTEGER DEFAULT 0,
    unchanged INTEGER DEFAULT 0,
    
    -- Additional Metrics
    is_fno_sec BOOLEAN DEFAULT FALSE,
    near_week_high DECIMAL(8,3) DEFAULT 0,
    near_week_low DECIMAL(8,3) DEFAULT 0,
    perf_30d DECIMAL(8,3) DEFAULT 0,
    perf_365d DECIMAL(8,3) DEFAULT 0,
    
    -- Timestamps
    timestamp VARCHAR(100), -- NSE timestamp format
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trading_date DATE DEFAULT CURRENT_DATE,
    
    -- Constraints
    UNIQUE(symbol, index_name, analysis_timestamp, data_type)
);

-- ============================================================================
-- INDEXES - Create indexes for efficient querying
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_nse_sector_data_symbol ON nse_sector_data (symbol);
CREATE INDEX IF NOT EXISTS idx_nse_sector_data_index_name ON nse_sector_data (index_name);
CREATE INDEX IF NOT EXISTS idx_nse_sector_data_trading_date ON nse_sector_data (trading_date);
CREATE INDEX IF NOT EXISTS idx_nse_sector_data_type ON nse_sector_data (data_type);
CREATE INDEX IF NOT EXISTS idx_nse_sector_data_composite ON nse_sector_data (trading_date, data_type, index_name);

-- Index configuration table (for easy addition of new indices)
CREATE TABLE IF NOT EXISTS nse_sector_indices_config (
    id SERIAL PRIMARY KEY,
    index_name VARCHAR(100) UNIQUE NOT NULL,
    api_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    category VARCHAR(50), -- e.g., 'SECTORAL', 'THEMATIC', 'BROAD_MARKET'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INITIAL DATA - Insert configuration for sector indices
-- ============================================================================

-- Insert initial configuration
INSERT INTO nse_sector_indices_config (index_name, api_url, category, description) VALUES
('NIFTY CONSUMER DURABLES', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20CONSUMER%20DURABLES', 'SECTORAL', 'Consumer durables companies'),
('NIFTY FINANCIAL SERVICES 25/50', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20FINANCIAL%20SERVICES%2025%2F50', 'SECTORAL', 'Financial services mid-cap companies'),
('NIFTY MEDIA', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MEDIA', 'SECTORAL', 'Media and entertainment companies'),
('NIFTY IT', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20IT', 'SECTORAL', 'Information technology companies'),
('NIFTY PRIVATE BANK', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20PRIVATE%20BANK', 'SECTORAL', 'Private sector banks'),
('NIFTY AUTO', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20AUTO', 'SECTORAL', 'Automobile companies'),
('NIFTY FMCG', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20FMCG', 'SECTORAL', 'Fast moving consumer goods'),
('NIFTY PHARMA', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20PHARMA', 'SECTORAL', 'Pharmaceutical companies'),
('NIFTY PSU BANK', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20PSU%20BANK', 'SECTORAL', 'Public sector banks'),
('NIFTY REALTY', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20REALTY', 'SECTORAL', 'Real estate companies'),
('NIFTY HEALTHCARE INDEX', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20HEALTHCARE%20INDEX', 'SECTORAL', 'Healthcare companies'),
('NIFTY OIL & GAS', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20OIL%20%26%20GAS', 'SECTORAL', 'Oil and gas companies'),
('NIFTY FINANCIAL SERVICES EX-BANK', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20FINANCIAL%20SERVICES%20EX-BANK', 'SECTORAL', 'Financial services excluding banks'),
('NIFTY MIDSMALL HEALTHCARE', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDSMALL%20HEALTHC', 'THEMATIC', 'Mid-small cap healthcare'),
('NIFTY MIDSMALL IT & TELECOM', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDSMALL%20IT%20%26%20TELECOM', 'THEMATIC', 'Mid-small cap IT and telecom'),
('NIFTY BANK', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20BANK', 'SECTORAL', 'Banking sector companies'),
('NIFTY METAL', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20METAL', 'SECTORAL', 'Metal and mining companies'),
('NIFTY MIDCAP 50', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20MIDCAP%2050', 'BROAD_MARKET', 'Mid-cap companies index'),
('NIFTY SMALLCAP 50', 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%20SMALLCAP%2050', 'BROAD_MARKET', 'Small-cap companies index')
ON CONFLICT (index_name) DO UPDATE SET
    api_url = EXCLUDED.api_url,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- VIEWS - Create database views for easy querying
-- ============================================================================

-- Latest sector performance view
CREATE OR REPLACE VIEW latest_sector_performance AS
SELECT 
    index_name,
    symbol,
    company_name,
    industry,
    current_price,
    day_change_percent,
    total_traded_volume,
    is_fno_sec,
    perf_30d,
    perf_365d,
    trading_date,
    ROW_NUMBER() OVER (PARTITION BY symbol, index_name ORDER BY created_at DESC) as rn
FROM nse_sector_data 
WHERE data_type = 'STOCK'
AND trading_date = CURRENT_DATE;

-- Sector indices summary view
CREATE OR REPLACE VIEW sector_indices_summary AS
SELECT 
    index_name,
    current_price as index_value,
    day_change_percent as index_change_percent,
    advances,
    declines,
    unchanged,
    total_traded_volume as index_volume,
    total_traded_value as index_turnover,
    perf_30d as monthly_performance,
    perf_365d as yearly_performance,
    trading_date,
    timestamp
FROM nse_sector_data 
WHERE data_type = 'INDEX'
AND trading_date = CURRENT_DATE;

-- Stock sector mapping view (for cross-referencing)
CREATE OR REPLACE VIEW stock_sector_mapping_enhanced AS
SELECT DISTINCT
    symbol,
    company_name,
    industry,
    index_name,
    is_fno_sec,
    CASE 
        WHEN is_fno_sec THEN 'FNO_ELIGIBLE'
        ELSE 'CASH_ONLY'
    END as trading_segment
FROM nse_sector_data 
WHERE data_type = 'STOCK'
AND trading_date = CURRENT_DATE;

-- ============================================================================
-- SECURITY - Row Level Security and Policies
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE nse_sector_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE nse_sector_indices_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to sector data" ON nse_sector_data
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access to sector data" ON nse_sector_data
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow public read access to indices config" ON nse_sector_indices_config
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access to indices config" ON nse_sector_indices_config
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- DOCUMENTATION - Table and column comments
-- ============================================================================
COMMENT ON TABLE nse_sector_data IS 'Stores NSE sector indices data and constituent stock data';
COMMENT ON TABLE nse_sector_indices_config IS 'Configuration table for managing sector indices - add new indices here';
COMMENT ON COLUMN nse_sector_data.data_type IS 'INDEX for sector index data, STOCK for constituent stock data';
COMMENT ON COLUMN nse_sector_data.index_name IS 'Name of the sector index (e.g., NIFTY IT, NIFTY AUTO)';
COMMENT ON VIEW latest_sector_performance IS 'Latest stock performance data across all sectors';
COMMENT ON VIEW sector_indices_summary IS 'Summary of all sector indices performance';
COMMENT ON VIEW stock_sector_mapping_enhanced IS 'Enhanced mapping of stocks to sectors with FNO eligibility';
