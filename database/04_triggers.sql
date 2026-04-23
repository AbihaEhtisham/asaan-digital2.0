-- ============================================
-- ASAAN DIGITAL - DATABASE TRIGGERS
-- ADBMS Project - Spring 2026
-- ============================================
-- Purpose: Automated data maintenance and integrity
-- ============================================

-- ============================================
-- 1. PHONETIC CODE AUTO-GENERATION
-- ============================================
CREATE OR REPLACE FUNCTION update_phonetic_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate SOUNDEX code for Roman Urdu keywords
  IF NEW.language = 'roman_urdu' THEN
    NEW.phonetic_code := SOUNDEX(NEW.keyword);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_phonetic_code
  BEFORE INSERT OR UPDATE OF keyword ON keywords
  FOR EACH ROW
  EXECUTE FUNCTION update_phonetic_code();

COMMENT ON TRIGGER set_phonetic_code ON keywords IS 'Auto-generate SOUNDEX code for Roman Urdu keywords';

-- ============================================
-- 2. TUTORIAL STATISTICS UPDATE
-- ============================================
CREATE OR REPLACE FUNCTION update_tutorial_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.matched_tutorial_id IS NOT NULL THEN
    -- Update last searched timestamp in metadata
    UPDATE tutorials 
    SET metadata = jsonb_set(
      COALESCE(metadata, '{}'),
      '{last_searched}',
      to_jsonb(NOW())
    ),
    updated_at = NOW()
    WHERE id = NEW.matched_tutorial_id;
    
    -- Update search count in metadata
    UPDATE tutorials 
    SET metadata = jsonb_set(
      metadata,
      '{search_count}',
      to_jsonb(COALESCE((metadata->>'search_count')::int, 0) + 1)
    )
    WHERE id = NEW.matched_tutorial_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tutorial_search_trigger
  AFTER INSERT ON query_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_tutorial_stats();

COMMENT ON TRIGGER tutorial_search_trigger ON query_logs IS 'Auto-update tutorial statistics after searches';

-- ============================================
-- 3. AUTO-COMPLETE TUTORIAL
-- ============================================
CREATE OR REPLACE FUNCTION check_tutorial_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_total_steps INT;
BEGIN
  -- Get total steps for this tutorial
  SELECT COUNT(*) INTO v_total_steps
  FROM tutorial_steps
  WHERE tutorial_id = NEW.tutorial_id;
  
  -- Check if all steps are completed
  IF array_length(NEW.completed_steps, 1) >= v_total_steps THEN
    NEW.is_completed := true;
    NEW.last_accessed := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_complete_tutorial
  BEFORE UPDATE OF completed_steps ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION check_tutorial_completion();

COMMENT ON TRIGGER auto_complete_tutorial ON user_progress IS 'Auto-mark tutorial as complete when all steps done';

-- ============================================
-- 4. PREVENT CIRCULAR DEPENDENCIES
-- ============================================
CREATE OR REPLACE FUNCTION prevent_circular_dependency()
RETURNS TRIGGER AS $$
DECLARE
  v_cycle_found BOOLEAN;
BEGIN
  -- Check if adding this dependency creates a cycle
  WITH RECURSIVE dep_chain AS (
    -- Start with the prerequisite
    SELECT 
      prerequisite_id as id,
      ARRAY[tutorial_id, prerequisite_id] as path
    FROM tutorial_dependencies
    WHERE tutorial_id = NEW.tutorial_id 
      AND prerequisite_id = NEW.prerequisite_id
    
    UNION ALL
    
    -- Follow the chain
    SELECT 
      td.prerequisite_id,
      dc.path || td.prerequisite_id
    FROM tutorial_dependencies td
    JOIN dep_chain dc ON td.tutorial_id = dc.id
    WHERE NOT td.prerequisite_id = ANY(dc.path)
  )
  SELECT EXISTS (
    SELECT 1 FROM dep_chain WHERE NEW.tutorial_id = ANY(path)
  ) INTO v_cycle_found;
  
  IF v_cycle_found THEN
    RAISE EXCEPTION 'Circular dependency detected: Tutorial % cannot depend on %', 
      NEW.tutorial_id, NEW.prerequisite_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_circular_dependency
  BEFORE INSERT OR UPDATE ON tutorial_dependencies
  FOR EACH ROW
  EXECUTE FUNCTION prevent_circular_dependency();

COMMENT ON TRIGGER check_circular_dependency ON tutorial_dependencies IS 'Prevent circular prerequisite relationships';

-- ============================================
-- 5. CLEANUP OLD SESSIONS
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete sessions older than 90 days (optional - can be moved to cron job)
  DELETE FROM query_logs 
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND query_status = 'FAILED';  -- Keep successful searches longer
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Commented out - use cron job instead
-- CREATE TRIGGER auto_cleanup_trigger
--   AFTER INSERT ON query_logs
--   FOR EACH STATEMENT
--   EXECUTE FUNCTION cleanup_old_data();

-- ============================================
-- 6. VALIDATE TUTORIAL STEPS
-- ============================================
CREATE OR REPLACE FUNCTION validate_tutorial_steps()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure step numbers are sequential
  IF EXISTS (
    SELECT 1 FROM tutorial_steps 
    WHERE tutorial_id = NEW.tutorial_id 
      AND step_number = NEW.step_number
      AND id != COALESCE(NEW.id, -1)
  ) THEN
    RAISE EXCEPTION 'Step number % already exists for tutorial %', 
      NEW.step_number, NEW.tutorial_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_unique_step_numbers
  BEFORE INSERT OR UPDATE ON tutorial_steps
  FOR EACH ROW
  EXECUTE FUNCTION validate_tutorial_steps();

COMMENT ON TRIGGER ensure_unique_step_numbers ON tutorial_steps IS 'Ensure step numbers are unique per tutorial';

-- ============================================
-- 7. UPDATE PLATFORM STATS
-- ============================================
CREATE OR REPLACE FUNCTION update_platform_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total queries count in admin_settings
  UPDATE admin_settings
  SET setting_value = jsonb_set(
    setting_value,
    '{total_queries}',
    to_jsonb(COALESCE((setting_value->>'total_queries')::int, 0) + 1)
  )
  WHERE setting_key = 'platform_stats';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER platform_stats_trigger
  AFTER INSERT ON query_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_stats();

COMMENT ON TRIGGER platform_stats_trigger ON query_logs IS 'Auto-update platform statistics';

-- Verify triggers
DO $$
DECLARE
  trigger_count INT;
BEGIN
  SELECT COUNT(*) INTO trigger_count 
  FROM pg_trigger 
  WHERE tgname IN ('set_phonetic_code', 'tutorial_search_trigger', 'auto_complete_tutorial',
                   'check_circular_dependency', 'ensure_unique_step_numbers', 'platform_stats_trigger');
  RAISE NOTICE '✅ Created % automation triggers', trigger_count;
END $$;