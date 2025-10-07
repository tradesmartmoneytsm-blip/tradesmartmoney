-- FNO Symbols Table Schema for Supabase
-- This table stores the list of F&O (Futures & Options) symbols
-- Updated daily via GitHub Action at 9:00 AM

-- Drop table if exists (for clean re-creation during development)
DROP TABLE IF EXISTS fno_symbols;

-- Create fno_symbols table
CREATE TABLE fno_symbols (
    id SERIAL PRIMARY KEY,
    symbol_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_fno_symbols_name ON fno_symbols(symbol_name);
CREATE INDEX idx_fno_symbols_active ON fno_symbols(is_active);
CREATE INDEX idx_fno_symbols_updated ON fno_symbols(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE fno_symbols ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow public read access for the application
CREATE POLICY "Allow public read access" ON fno_symbols
    FOR SELECT USING (true);

-- Allow service role to insert/update/delete (for GitHub Action)
CREATE POLICY "Allow service role full access" ON fno_symbols
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_fno_symbols_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_fno_symbols_updated_at
    BEFORE UPDATE ON fno_symbols
    FOR EACH ROW
    EXECUTE FUNCTION update_fno_symbols_updated_at();

-- Insert some sample data for testing (optional)
INSERT INTO fno_symbols (symbol_name) VALUES 
('NIFTY'),
('BANKNIFTY'),
('RELIANCE'),
('TCS'),
('HDFCBANK'),
('INFY'),
('ICICIBANK'),
('SBIN'),
('BHARTIARTL'),
('ITC')
ON CONFLICT (symbol_name) DO NOTHING;

COMMENT ON TABLE fno_symbols IS 'Stores F&O symbols fetched daily from market data API';
COMMENT ON COLUMN fno_symbols.symbol_name IS 'F&O symbol name (e.g., NIFTY, RELIANCE)';
COMMENT ON COLUMN fno_symbols.is_active IS 'Whether the symbol is currently active for trading';
COMMENT ON COLUMN fno_symbols.created_at IS 'When the symbol was first added';
COMMENT ON COLUMN fno_symbols.updated_at IS 'When the symbol was last updated'; 