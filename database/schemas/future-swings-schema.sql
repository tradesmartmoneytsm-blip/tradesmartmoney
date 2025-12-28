-- Drop existing table if it exists
DROP TABLE IF EXISTS future_swings_elite CASCADE;

-- Create future_swings_elite table
CREATE TABLE future_swings_elite (
    id BIGSERIAL PRIMARY KEY,
    stock_symbol VARCHAR(50) NOT NULL,
    entry_date DATE NOT NULL,
    entry_price NUMERIC(10, 2),
    cmp NUMERIC(10, 2),
    stop_loss NUMERIC(10, 2),
    target_price NUMERIC(10, 2),
    exit_date DATE,
    exit_price NUMERIC(10, 2),
    result VARCHAR(20) CHECK (result IN ('SL', 'Target', 'Running')),
    percentage_change NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(stock_symbol, entry_date)
);

-- Create indexes for faster queries
CREATE INDEX idx_future_swings_elite_stock_symbol ON future_swings_elite(stock_symbol);
CREATE INDEX idx_future_swings_elite_entry_date ON future_swings_elite(entry_date);
CREATE INDEX idx_future_swings_elite_result ON future_swings_elite(result);
CREATE INDEX idx_future_swings_elite_created_at ON future_swings_elite(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_future_swings_elite_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before any update
CREATE TRIGGER trigger_update_future_swings_elite_updated_at
    BEFORE UPDATE ON future_swings_elite
    FOR EACH ROW
    EXECUTE FUNCTION update_future_swings_elite_updated_at();

-- Add comments for documentation
COMMENT ON TABLE future_swings_elite IS 'Tracks futures swing trading positions with entry, exit, and performance metrics';
COMMENT ON COLUMN future_swings_elite.stock_symbol IS 'Stock ticker symbol (e.g., RELIANCE, TCS)';
COMMENT ON COLUMN future_swings_elite.entry_date IS 'Date when position was entered';
COMMENT ON COLUMN future_swings_elite.entry_price IS 'Price at which position was entered';
COMMENT ON COLUMN future_swings_elite.cmp IS 'Current Market Price for running trades';
COMMENT ON COLUMN future_swings_elite.stop_loss IS 'Stop loss price level';
COMMENT ON COLUMN future_swings_elite.target_price IS 'Target price level';
COMMENT ON COLUMN future_swings_elite.exit_date IS 'Date when position was exited (NULL if still running)';
COMMENT ON COLUMN future_swings_elite.exit_price IS 'Price at which position was exited';
COMMENT ON COLUMN future_swings_elite.result IS 'Trade outcome: SL (Stop Loss hit), Target (Target achieved), Running (Position still active)';
COMMENT ON COLUMN future_swings_elite.percentage_change IS 'Percentage profit/loss of the trade';
COMMENT ON COLUMN future_swings_elite.notes IS 'Additional notes or trading rationale';

-- Enable Row Level Security (optional, uncomment if needed)
-- ALTER TABLE future_swings_elite ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (optional, uncomment if needed)
-- CREATE POLICY "Allow authenticated users full access to future_swings_elite"
--     ON future_swings_elite
--     FOR ALL
--     USING (true)
--     WITH CHECK (true);

