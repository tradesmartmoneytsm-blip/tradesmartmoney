-- =====================================================
-- INTRADAY SIGNALS TABLE SCHEMA FOR SUPABASE
-- =====================================================

-- Drop table if exists (for development)
DROP TABLE IF EXISTS public.intraday_signals;

-- Create intraday_signals table
CREATE TABLE public.intraday_signals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    m30_1 DECIMAL(15,2), -- [=1] 30 minute momentum
    m30_2 DECIMAL(15,2), -- [=2] 30 minute momentum
    m30_3 DECIMAL(15,2), -- [=3] 30 minute momentum
    m60_1 DECIMAL(15,2), -- [=1] 60 minute momentum
    scan_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    scan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    rank_position INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_intraday_signals_symbol ON public.intraday_signals(symbol);
CREATE INDEX idx_intraday_signals_scan_date ON public.intraday_signals(scan_date);
CREATE INDEX idx_intraday_signals_scan_time ON public.intraday_signals(scan_time);
CREATE INDEX idx_intraday_signals_m30_1 ON public.intraday_signals(m30_1 DESC);

-- Composite index for efficient queries
CREATE INDEX idx_intraday_signals_date_rank 
ON public.intraday_signals(scan_date, rank_position);

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
-- USEFUL QUERIES FOR DEVELOPMENT
-- =====================================================

-- Get latest signals for today
-- SELECT * FROM public.intraday_signals 
-- WHERE scan_date = CURRENT_DATE 
-- ORDER BY m30_1 DESC 
-- LIMIT 10;

-- Get signals by date
-- SELECT symbol, m30_1, m30_2, m30_3, m60_1, scan_time 
-- FROM public.intraday_signals 
-- WHERE scan_date = CURRENT_DATE
-- ORDER BY m30_1 DESC;

-- Cleanup old data (older than 7 days)
-- DELETE FROM public.intraday_signals 
-- WHERE scan_date < CURRENT_DATE - INTERVAL '7 days';

-- =====================================================
-- NOTES FOR IMPLEMENTATION
-- =====================================================

/*
1. The ChartInk query returns momentum scores for different timeframes
2. Higher M30-1 values suggest more institutional interest in the stock
3. We maintain historical data for analysis and trending
4. The rank_position helps identify top performers for each scan
5. RLS policies ensure data security while allowing API access
6. Indexes optimize for common query patterns (latest signals, top performers)
7. Consider partitioning if data volume becomes large (>1M rows)
*/ 