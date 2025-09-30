-- Simplified Intraday Activity Manager Database Schema
-- Real-time push-based activity tracking

-- Main activities table - simplified structure
CREATE TABLE intraday_activities (
    id BIGSERIAL PRIMARY KEY,
    stock_name VARCHAR(50) NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
    activity_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional fields for better functionality
    trading_date DATE DEFAULT CURRENT_DATE, -- For daily cleanup
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_intraday_activities_timestamp ON intraday_activities (activity_timestamp DESC);
CREATE INDEX idx_intraday_activities_stock ON intraday_activities (stock_name, activity_timestamp DESC);

-- Enable Row Level Security for Supabase Realtime
ALTER TABLE intraday_activities ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since this is for real-time updates)
CREATE POLICY "Allow all operations on intraday_activities" ON intraday_activities
    FOR ALL USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE intraday_activities;


