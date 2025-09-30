-- Swing Trades Database Schema
-- Table to store swing trading opportunities across different strategies

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS public.swing_trades DISABLE ROW LEVEL SECURITY;
DROP TABLE IF EXISTS public.swing_trades;

-- Create swing_trades table
CREATE TABLE public.swing_trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy VARCHAR(50) NOT NULL CHECK (strategy IN ('BIT', 'Swing Angle', 'Bottom Formation')),
    stock_name VARCHAR(100) NOT NULL,
    stock_symbol VARCHAR(20) NOT NULL,
    entry_price DECIMAL(10,2) NOT NULL,
    exit_price DECIMAL(10,2),
    stop_loss DECIMAL(10,2) NOT NULL,
    target_price DECIMAL(10,2),
    current_price DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'Running' CHECK (status IN ('Running', 'SL Hit', 'Trade Successful', 'Cancelled')),
    setup_description TEXT,
    risk_reward_ratio VARCHAR(10),
    timeframe VARCHAR(20),
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    exit_date DATE,
    chart_image_url TEXT,
    notes TEXT,
    potential_return DECIMAL(5,2), -- Percentage return
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_swing_trades_strategy ON public.swing_trades(strategy);
CREATE INDEX idx_swing_trades_status ON public.swing_trades(status);
CREATE INDEX idx_swing_trades_entry_date ON public.swing_trades(entry_date);
CREATE INDEX idx_swing_trades_symbol ON public.swing_trades(stock_symbol);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_swing_trades_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_swing_trades_updated_at ON public.swing_trades;
CREATE TRIGGER trigger_swing_trades_updated_at
    BEFORE UPDATE ON public.swing_trades
    FOR EACH ROW
    EXECUTE FUNCTION update_swing_trades_updated_at();

-- Enable RLS
ALTER TABLE public.swing_trades ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow read access to all users
CREATE POLICY "Allow read access for swing trades"
ON public.swing_trades FOR SELECT
USING (true);

-- Allow insert/update for service role (for admin functionality)
CREATE POLICY "Allow insert for service role"
ON public.swing_trades FOR INSERT
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow update for service role"
ON public.swing_trades FOR UPDATE
USING (auth.role() = 'service_role');

CREATE POLICY "Allow delete for service role"
ON public.swing_trades FOR DELETE
USING (auth.role() = 'service_role');

-- Insert sample data for testing
INSERT INTO public.swing_trades (
    strategy, stock_name, stock_symbol, entry_price, exit_price, stop_loss, 
    target_price, current_price, status, setup_description, risk_reward_ratio, 
    timeframe, entry_date, potential_return, notes
) VALUES 
(
    'BIT', 'Reliance Industries', 'RELIANCE', 2450.00, NULL, 2320.00, 
    2650.00, 2485.50, 'Running', 'Breakout from resistance with volume confirmation', 
    '1:2.5', '5-10 days', '2025-01-06', 8.16, 
    'Strong volume breakout above 2440 resistance level'
),
(
    'Swing Angle', 'HDFC Bank', 'HDFCBANK', 1645.00, 1720.00, 1580.00, 
    1750.00, 1720.00, 'Trade Successful', 'Swing angle formation with RSI divergence', 
    '1:2.2', '7-12 days', '2024-12-28', 6.38, 
    'Perfect swing angle setup with bullish divergence'
),
(
    'Bottom Formation', 'TCS', 'TCS', 3890.00, NULL, 3750.00, 
    4200.00, 3825.00, 'SL Hit', 'Double bottom formation at key support', 
    '1:2.8', '10-15 days', '2024-12-20', 7.97, 
    'False breakout from double bottom pattern'
),
(
    'BIT', 'Infosys', 'INFY', 1825.00, NULL, 1750.00, 
    1950.00, 1842.00, 'Running', 'Break into trend with momentum confirmation', 
    '1:1.8', '5-8 days', '2025-01-05', 6.85, 
    'Clean breakout above downtrend line'
),
(
    'Swing Angle', 'Asian Paints', 'ASIANPAINT', 2680.00, NULL, 2580.00, 
    2850.00, 2695.00, 'Running', 'Perfect swing angle with volume spike', 
    '1:1.7', '8-12 days', '2025-01-04', 6.34, 
    'Swing angle formed after consolidation'
);

-- Grant permissions
GRANT ALL ON public.swing_trades TO postgres;
GRANT SELECT ON public.swing_trades TO anon;
GRANT ALL ON public.swing_trades TO service_role; 