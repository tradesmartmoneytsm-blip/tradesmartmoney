-- Sector Indices Mapping Table
-- Stores the mapping between stocks and their sectoral indices
-- Updated weekly via GitHub Action

CREATE TABLE IF NOT EXISTS sector_indices (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(200),
    industry VARCHAR(100),
    isin_code VARCHAR(20),
    index_name VARCHAR(100) NOT NULL,
    series VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(symbol, index_name) -- A stock can be in multiple indices, but not duplicate entries
);

-- Create indexes separately
CREATE INDEX IF NOT EXISTS idx_sector_indices_symbol ON sector_indices (symbol);
CREATE INDEX IF NOT EXISTS idx_sector_indices_index_name ON sector_indices (index_name);
CREATE INDEX IF NOT EXISTS idx_sector_indices_isin ON sector_indices (isin_code);

-- Enable Row Level Security
ALTER TABLE sector_indices ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to sector indices" ON sector_indices
    FOR SELECT USING (true);

-- Create policy for service role write access
CREATE POLICY "Allow service role write access to sector indices" ON sector_indices
    FOR ALL USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sector_indices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_sector_indices_updated_at
    BEFORE UPDATE ON sector_indices
    FOR EACH ROW
    EXECUTE FUNCTION update_sector_indices_updated_at();

-- Create view for easy sector analysis
CREATE OR REPLACE VIEW stock_sector_mapping AS
SELECT 
    symbol,
    company_name,
    industry,
    isin_code,
    array_agg(DISTINCT index_name ORDER BY index_name) as indices,
    count(DISTINCT index_name) as index_count,
    max(updated_at) as last_updated
FROM sector_indices
GROUP BY symbol, company_name, industry, isin_code
ORDER BY symbol;

-- Comments for documentation
COMMENT ON TABLE sector_indices IS 'Stores mapping between stocks and their sectoral indices, updated weekly via GitHub Action';
COMMENT ON COLUMN sector_indices.symbol IS 'Stock symbol (e.g., RELIANCE, TCS)';
COMMENT ON COLUMN sector_indices.company_name IS 'Full company name from Nifty indices';
COMMENT ON COLUMN sector_indices.industry IS 'Industry classification';
COMMENT ON COLUMN sector_indices.isin_code IS 'International Securities Identification Number';
COMMENT ON COLUMN sector_indices.index_name IS 'Nifty index name (e.g., Nifty IT, Nifty Bank)';
COMMENT ON COLUMN sector_indices.series IS 'Trading series (usually EQ for equity)';

-- Sample data structure:
-- INSERT INTO sector_indices (symbol, company_name, industry, isin_code, index_name, series) VALUES
-- ('TCS', 'Tata Consultancy Services Ltd.', 'IT Services', 'INE467B01029', 'Nifty IT', 'EQ'),
-- ('TCS', 'Tata Consultancy Services Ltd.', 'IT Services', 'INE467B01029', 'Nifty Financial Services', 'EQ'),
-- ('RELIANCE', 'Reliance Industries Ltd.', 'Oil & Gas', 'INE002A01018', 'Nifty Oil and Gas', 'EQ');
