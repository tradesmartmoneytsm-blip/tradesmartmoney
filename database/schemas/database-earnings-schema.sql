-- Earnings Estimates Table for MoneyControl Data
-- This table stores earnings data fetched from MoneyControl API

CREATE TABLE IF NOT EXISTS earnings_estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Company Information
  symbol VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  stock_url VARCHAR(500),
  exchange VARCHAR(10) DEFAULT 'NSE',
  
  -- Market Data
  current_price DECIMAL(10,2),
  price_change DECIMAL(8,2),
  price_change_percent DECIMAL(8,2),
  market_cap DECIMAL(15,2), -- in crores
  
  -- Quarter and Reporting
  quarter VARCHAR(20),
  report_date DATE,
  financial_type VARCHAR(20) DEFAULT 'Consolidated', -- Consolidated/Standalone
  
  -- Performance Analysis
  expectations VARCHAR(50), -- "Beat Expectations", "Missed Expectations", etc.
  expectations_percent DECIMAL(8,2),
  
  -- Financial Metrics (in crores)
  actual_revenue DECIMAL(15,2),
  estimated_revenue DECIMAL(15,2),
  revenue_variance DECIMAL(8,2),
  
  actual_net_profit DECIMAL(15,2),
  estimated_net_profit DECIMAL(15,2),
  profit_variance DECIMAL(8,2),
  
  actual_eps DECIMAL(10,2),
  estimated_eps DECIMAL(10,2),
  eps_variance DECIMAL(8,2),
  
  -- Overall Performance
  overall_performance VARCHAR(10) CHECK (overall_performance IN ('Beat', 'Missed', 'Met')),
  performance_percent DECIMAL(8,2),
  
  -- Sector Classification (we'll map this from company data)
  sector VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  data_source VARCHAR(50) DEFAULT 'MoneyControl',
  api_fetch_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for better performance
  CONSTRAINT unique_symbol_quarter UNIQUE(symbol, quarter, report_date)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_earnings_symbol ON earnings_estimates(symbol);
CREATE INDEX IF NOT EXISTS idx_earnings_sector ON earnings_estimates(sector);
CREATE INDEX IF NOT EXISTS idx_earnings_performance ON earnings_estimates(overall_performance);
CREATE INDEX IF NOT EXISTS idx_earnings_report_date ON earnings_estimates(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_earnings_created_at ON earnings_estimates(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_earnings_updated_at BEFORE UPDATE ON earnings_estimates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE earnings_estimates ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (since this is public financial data)
CREATE POLICY "Allow read access to earnings data" ON earnings_estimates
  FOR SELECT USING (true);

-- Only allow insert/update via service role (for GitHub Actions)
CREATE POLICY "Allow insert for service role" ON earnings_estimates
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow update for service role" ON earnings_estimates  
  FOR UPDATE USING (auth.role() = 'service_role');

-- Sample query to test the schema
-- SELECT symbol, company_name, current_price, expectations, performance_percent
-- FROM earnings_estimates 
-- WHERE overall_performance = 'Beat'
-- ORDER BY report_date DESC
-- LIMIT 10; 