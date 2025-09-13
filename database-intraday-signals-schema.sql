-- =====================================================
-- INTRADAY SIGNALS TABLE SCHEMA FOR SUPABASE
-- =====================================================

-- Drop table if exists (for development)
DROP TABLE IF EXISTS public.intraday_signals;

-- Create intraday_signals table
CREATE TABLE public.intraday_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    total_score DECIMAL(15,2) NOT NULL, -- Combined momentum score
    m30_1 DECIMAL(15,2), -- [=1] 30 minute momentum
    m30_2 DECIMAL(15,2), -- [=2] 30 minute momentum
    m30_3 DECIMAL(15,2), -- [=3] 30 minute momentum
    m60_1 DECIMAL(15,2), -- [=1] 60 minute momentum
    current_price DECIMAL(10,2),
    volume BIGINT,
    scan_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    market_session VARCHAR(20) NOT NULL, -- 'OPENING_HOUR', 'INTRADAY'
    rank_position INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_intraday_signals_symbol ON public.intraday_signals(symbol);
CREATE INDEX idx_intraday_signals_scan_date ON public.intraday_signals(scan_date);
CREATE INDEX idx_intraday_signals_scan_time ON public.intraday_signals(scan_time);
CREATE INDEX idx_intraday_signals_score ON public.intraday_signals(total_score DESC);
CREATE INDEX idx_intraday_signals_session ON public.intraday_signals(market_session);
CREATE INDEX idx_intraday_signals_active ON public.intraday_signals(is_active) WHERE is_active = true;

-- Composite index for efficient queries
CREATE INDEX idx_intraday_signals_date_session_active 
ON public.intraday_signals(scan_date, market_session, is_active) 
WHERE is_active = true;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_intraday_signals_updated_at 
    BEFORE UPDATE ON public.intraday_signals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.intraday_signals ENABLE ROW LEVEL SECURITY;

-- Policy: Allow read access to all authenticated users and service role
CREATE POLICY "Allow read access for intraday signals" 
ON public.intraday_signals FOR SELECT 
USING (
    auth.role() = 'authenticated' 
    OR auth.role() = 'service_role'
    OR auth.role() = 'anon'
);

-- Policy: Allow insert/update/delete for service role only (for automated jobs)
CREATE POLICY "Allow full access for service role" 
ON public.intraday_signals FOR ALL 
USING (auth.role() = 'service_role');

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample data (remove this in production)
INSERT INTO public.intraday_signals (
    symbol, bit_sit_score, bit_sit1, bit_sit2, current_price, volume,
    scan_time, market_session, rank_position
) VALUES 
('RELIANCE', 1250000.50, 650000.25, 600000.25, 2847.30, 5420000, NOW(), 'OPENING_HOUR', 1),
('TCS', 980000.75, 520000.40, 460000.35, 4125.60, 3250000, NOW(), 'OPENING_HOUR', 2),
('HDFCBANK', 875000.20, 475000.10, 400000.10, 1684.45, 4100000, NOW(), 'OPENING_HOUR', 3),
('INFY', 720000.80, 380000.45, 340000.35, 1867.90, 2850000, NOW(), 'OPENING_HOUR', 4),
('ICICIBANK', 650000.60, 350000.30, 300000.30, 1298.75, 3750000, NOW(), 'OPENING_HOUR', 5);

-- =====================================================
-- USEFUL QUERIES FOR DEVELOPMENT
-- =====================================================

-- Get latest signals for today
-- SELECT * FROM public.intraday_signals 
-- WHERE scan_date = CURRENT_DATE 
-- AND is_active = true 
-- ORDER BY bit_sit_score DESC 
-- LIMIT 10;

-- Get signals by market session
-- SELECT symbol, bit_sit_score, current_price, scan_time 
-- FROM public.intraday_signals 
-- WHERE scan_date = CURRENT_DATE 
-- AND market_session = 'OPENING_HOUR'
-- AND is_active = true 
-- ORDER BY bit_sit_score DESC;

-- Cleanup old data (older than 7 days)
-- DELETE FROM public.intraday_signals 
-- WHERE scan_date < CURRENT_DATE - INTERVAL '7 days';

-- =====================================================
-- NOTES FOR IMPLEMENTATION
-- =====================================================

/*
1. The ChartInk query returns BIT+SIT scores which indicate institutional buying/selling activity
2. Higher scores suggest more institutional interest in the stock
3. We store both current session data and maintain historical data for analysis
4. The rank_position helps identify top performers for each scan
5. Market session helps categorize signals (opening hour is most important)
6. RLS policies ensure data security while allowing API access
7. Indexes optimize for common query patterns (latest signals, top performers)
8. Consider partitioning if data volume becomes large (>1M rows)
*/ 