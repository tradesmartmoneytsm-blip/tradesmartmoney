-- Database schema for FII/DII data storage
-- Table to store daily FII/DII institutional investor data

CREATE TABLE IF NOT EXISTS fii_dii_data (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(10) NOT NULL CHECK (category IN ('FII', 'DII')),
  buy_value DECIMAL(12,2) NOT NULL,  -- Buy value in crores
  sell_value DECIMAL(12,2) NOT NULL, -- Sell value in crores  
  net_value DECIMAL(12,2) NOT NULL,  -- Net value (buy - sell) in crores
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate entries for same date+category
CREATE UNIQUE INDEX IF NOT EXISTS idx_fii_dii_date_category 
ON fii_dii_data(date, category);

-- Index for faster queries by date range
CREATE INDEX IF NOT EXISTS idx_fii_dii_date ON fii_dii_data(date DESC);

-- Index for faster queries by category
CREATE INDEX IF NOT EXISTS idx_fii_dii_category ON fii_dii_data(category);

-- Create a function to automatically delete data older than 30 days
CREATE OR REPLACE FUNCTION cleanup_old_fii_dii_data()
RETURNS void AS $$
BEGIN
  DELETE FROM fii_dii_data 
  WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fii_dii_updated_at
  BEFORE UPDATE ON fii_dii_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE fii_dii_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Allow read access to fii_dii_data" ON fii_dii_data
FOR SELECT USING (true);

-- Create policy to allow insert/update for service role
CREATE POLICY "Allow insert/update for service role" ON fii_dii_data
FOR ALL USING (auth.role() = 'service_role'); 