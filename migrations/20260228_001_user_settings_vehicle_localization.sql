-- ============================================================================
-- MIGRATION: User Settings & Vehicle Localization
-- DATE: 2026-02-28
-- VERSION: 001
-- ============================================================================
-- 
-- WHAT'S NEW FOR USERS:
-- ---------------------
-- 1. Account Settings Page:
--    - Users can now set default country, currency, distance units, and date format
--    - Settings accessible from Profile → Settings tab
--    - These defaults apply to all new vehicles added
--
-- 2. Per-Vehicle Localization:
--    - Each vehicle can have its own country, currency, and units
--    - Vehicle-specific settings override account defaults
--    - Useful for users with vehicles in different countries
--
-- 3. Quick Add Button:
--    - Floating Action Button (FAB) added to vehicles page
--    - Quick access to add expense records from any screen
--
-- TECHNICAL CHANGES:
-- ------------------
-- - Added columns to profiles: country, currency, distance_unit, volume_unit, date_format
-- - Added columns to vehicles: country, currency, distance_unit, volume_unit
-- - Updated RLS policies remain unchanged (no security changes)
-- ============================================================================

-- Add settings columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT,
  ADD COLUMN IF NOT EXISTS distance_unit TEXT,
  ADD COLUMN IF NOT EXISTS volume_unit TEXT,
  ADD COLUMN IF NOT EXISTS date_format TEXT;

-- Add localization columns to vehicles table
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS currency TEXT,
  ADD COLUMN IF NOT EXISTS distance_unit TEXT,
  ADD COLUMN IF NOT EXISTS volume_unit TEXT;

-- Add comments to columns for documentation
COMMENT ON COLUMN profiles.country IS 'User default country code (e.g., US, DE, GB)';
COMMENT ON COLUMN profiles.currency IS 'User default currency (e.g., USD, EUR, GBP)';
COMMENT ON COLUMN profiles.distance_unit IS 'User default distance unit (mi or km)';
COMMENT ON COLUMN profiles.volume_unit IS 'User default volume unit (gal or l)';
COMMENT ON COLUMN profiles.date_format IS 'User default date format (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)';

COMMENT ON COLUMN vehicles.country IS 'Vehicle-specific country override (null = use account default)';
COMMENT ON COLUMN vehicles.currency IS 'Vehicle-specific currency override (null = use account default)';
COMMENT ON COLUMN vehicles.distance_unit IS 'Vehicle-specific distance unit override (null = use account default)';
COMMENT ON COLUMN vehicles.volume_unit IS 'Vehicle-specific volume unit override (null = use account default)';

-- Create indexes for settings queries (optional, improves profile loading)
CREATE INDEX IF NOT EXISTS profiles_settings_idx ON profiles(country, currency) WHERE country IS NOT NULL;
