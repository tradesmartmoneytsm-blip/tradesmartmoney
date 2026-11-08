-- =============================================================================
-- Market Section Removal — drop backing tables that are no longer referenced
-- =============================================================================
-- Run in the Supabase SQL editor (or psql) with a role that owns the objects.
-- ⚠️  IRREVERSIBLE: these tables and all their data are permanently deleted.
--
-- The original CREATE schemas lived in (now removed) files:
--   database/schemas/database-schema.sql       -> fii_dii_data
--   database/schemas/sector-indices-schema.sql -> sector_indices + views
--
-- Intentionally KEPT (still used by other features):
--   dhan_sector_data / dhan_sector_indices_config  -> Market Outlook rail
--     (SectorPerformanceHistogram via /api/sector-data + /api/sector-stocks;
--      populated by scripts/dhan_historical_data_collector.py)
--   nse_sector_data / nse_sector_indices_config    -> Smart Money Flow
--     (/api/equity/smart-money-flow; schema in nse-sector-data-schema.sql)
--   intraday_activities / activity_categories      -> Live Activities panel
--   update_updated_at_column()                     -> shared trigger fn (earnings)
-- =============================================================================

-- 1) FII/DII data
--    (was fed by /api/fii-dii-data + /api/cron/daily-fii-dii, both removed)
DROP TABLE IF EXISTS fii_dii_data;                -- indexes + its trigger drop with it
DROP FUNCTION IF EXISTS cleanup_old_fii_dii_data();

-- 2) Sector indices constituents
--    (was fed by scripts/sector_indices_updater.py, removed;
--     only consumer was /api/sector-indices, removed)
DROP VIEW IF EXISTS stock_sector_mapping;         -- depended on sector_indices
DROP TABLE IF EXISTS sector_indices;
DROP FUNCTION IF EXISTS update_sector_indices_updated_at();
