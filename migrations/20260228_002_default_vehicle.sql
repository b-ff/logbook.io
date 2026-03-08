-- ============================================================================
-- MIGRATION: Default Vehicle Feature
-- DATE: 2026-02-28
-- VERSION: 002
-- ============================================================================
-- 
-- WHAT'S NEW FOR USERS:
-- ---------------------
-- 1. Default Vehicle:
--    - Users can mark one vehicle as their "Default Vehicle"
--    - Default vehicle is pre-selected when adding new expense records
--    - Default vehicle appears first in the vehicle list
--    - Visual indicator (badge) shows which vehicle is the default
--
-- TECHNICAL CHANGES:
-- ------------------
-- - Added is_default column to vehicles table (boolean, default false)
-- - Only one vehicle per user can be default (enforced by trigger)
-- - Updated vehicle actions to handle is_default
-- ============================================================================

-- Add is_default column to vehicles table
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN vehicles.is_default IS 'Indicates if this is the user default vehicle (only one per user)';

-- Create index for default vehicle lookup
CREATE INDEX IF NOT EXISTS vehicles_default_idx ON vehicles(user_id, is_default) WHERE is_default = TRUE;

-- Function to ensure only one default vehicle per user
CREATE OR REPLACE FUNCTION public.ensure_single_default_vehicle()
RETURNS TRIGGER AS $$
BEGIN
  -- If setting this vehicle as default, unset all others for this user
  IF NEW.is_default = TRUE THEN
    UPDATE vehicles 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id 
    AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to maintain single default vehicle
DROP TRIGGER IF EXISTS trg_ensure_single_default ON vehicles;
CREATE TRIGGER trg_ensure_single_default
  BEFORE INSERT OR UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_vehicle();
