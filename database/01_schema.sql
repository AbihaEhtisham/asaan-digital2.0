-- ============================================
-- ASAAN DIGITAL - CORE DATABASE SCHEMA
-- ADBMS Project - Spring 2026
-- NUST SEECS - CS 236
-- ============================================
-- Description: Core tables for digital literacy platform
-- Features: Multilingual support, JSONB flexibility, Full-text search
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- For fuzzy search (trigram similarity)
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";  -- For SOUNDEX phonetic matching
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- For UUID generation

-- ============================================
-- 1. CATEGORIES TABLE
-- Purpose: Organize tutorials into logical groups
-- ============================================
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_english VARCHAR(100) NOT NULL,
  name_urdu VARCHAR(100) NOT NULL,
  icon_class VARCHAR(50) DEFAULT 'fa-folder',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE categories IS 'Main categories for organizing tutorials';
COMMENT ON COLUMN categories.name_urdu IS 'Category name in Urdu script';

-- ============================================
-- 2. TUTORIALS TABLE
-- Purpose: Main content storage with hybrid JSONB approach
-- Note: Steps stored separately for better querying
-- ============================================
CREATE TABLE tutorials (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  title_english VARCHAR(255) NOT NULL,
  title_urdu VARCHAR(255) NOT NULL,
  description_english TEXT,
  description_urdu TEXT,
  difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_time_minutes INT DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- JSONB for flexible metadata (tags, SEO, versioning)
  metadata JSONB DEFAULT '{}',
  
  -- Generated column for full-text search (combines English and Urdu)
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title_english,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(title_urdu,'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(description_english,'')), 'C') ||
    setweight(to_tsvector('simple', coalesce(description_urdu,'')), 'C')
  ) STORED
);

COMMENT ON TABLE tutorials IS 'Digital literacy tutorials with multilingual support';
COMMENT ON COLUMN tutorials.search_vector IS 'Generated tsvector for full-text search optimization';

-- ============================================
-- 3. TUTORIAL STEPS TABLE
-- Purpose: Normalized storage of step-by-step instructions
-- Rationale: Better than pure JSONB for querying and indexing
-- ============================================
CREATE TABLE tutorial_steps (
  id SERIAL PRIMARY KEY,
  tutorial_id INT REFERENCES tutorials(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  instruction_urdu TEXT NOT NULL,
  instruction_english TEXT NOT NULL,
  image_url VARCHAR(500),
  audio_url VARCHAR(500),
  extra_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tutorial_id, step_number)
);

COMMENT ON TABLE tutorial_steps IS 'Individual steps for each tutorial';
COMMENT ON COLUMN tutorial_steps.extra_data IS 'Flexible field for future enhancements';

-- ============================================
-- 4. INTENTS TABLE
-- Purpose: Map user queries to specific learning goals
-- ============================================
CREATE TABLE intents (
  id SERIAL PRIMARY KEY,
  tutorial_id INT REFERENCES tutorials(id) ON DELETE CASCADE,
  intent_name VARCHAR(100) NOT NULL,
  description TEXT,
  popularity_score INT DEFAULT 0,
  success_count INT DEFAULT 0,
  fail_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE intents IS 'User intent mapping for query understanding';
COMMENT ON COLUMN intents.popularity_score IS 'Auto-updated by trigger on successful searches';

-- ============================================
-- 5. KEYWORDS TABLE
-- Purpose: Multilingual keyword mapping with phonetic support
-- ============================================
CREATE TABLE keywords (
  id SERIAL PRIMARY KEY,
  intent_id INT REFERENCES intents(id) ON DELETE CASCADE,
  keyword VARCHAR(255) NOT NULL,
  language VARCHAR(10) CHECK (language IN ('urdu', 'roman_urdu', 'english')),
  phonetic_code VARCHAR(10),  -- SOUNDEX code for Roman Urdu variations
  weight FLOAT DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE keywords IS 'Search keywords in multiple languages';
COMMENT ON COLUMN keywords.phonetic_code IS 'SOUNDEX code for handling spelling variations';

-- ============================================
-- 6. QUERY LOGS TABLE
-- Purpose: Track all searches for analytics and optimization
-- ============================================
CREATE TABLE query_logs (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id INT,
  query_text TEXT NOT NULL,
  matched_intent_id INT REFERENCES intents(id) ON DELETE SET NULL,
  matched_tutorial_id INT REFERENCES tutorials(id) ON DELETE SET NULL,
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  query_status VARCHAR(20) CHECK (query_status IN ('SUCCESS', 'FAILED', 'LOW_CONFIDENCE')),
  failure_reason TEXT,
  response_time_ms INT,
  user_ip INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE query_logs IS 'Search query analytics and performance tracking';
COMMENT ON COLUMN query_logs.query_status IS 'SUCCESS (confidence >= 0.7), LOW_CONFIDENCE (<0.7), FAILED (no match)';

-- ============================================
-- 7. USER PROGRESS TABLE
-- Purpose: Track individual learning progress
-- ============================================
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,  -- Will reference users table when authentication added
  tutorial_id INT REFERENCES tutorials(id) ON DELETE CASCADE,
  current_step INT DEFAULT 1,
  completed_steps INT[] DEFAULT '{}',
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP DEFAULT NOW(),
  last_accessed TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tutorial_id)
);

COMMENT ON TABLE user_progress IS 'User learning progress tracking';
COMMENT ON COLUMN user_progress.completed_steps IS 'Array of completed step numbers for efficient querying';

-- ============================================
-- 8. TUTORIAL DEPENDENCIES TABLE
-- Purpose: Define prerequisite relationships
-- ============================================
CREATE TABLE tutorial_dependencies (
  id SERIAL PRIMARY KEY,
  tutorial_id INT REFERENCES tutorials(id) ON DELETE CASCADE,
  prerequisite_id INT REFERENCES tutorials(id) ON DELETE CASCADE,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tutorial_id, prerequisite_id),
  CHECK (tutorial_id != prerequisite_id)  -- Prevent self-reference
);

COMMENT ON TABLE tutorial_dependencies IS 'Prerequisite relationships between tutorials';
COMMENT ON CONSTRAINT tutorial_dependencies_check ON tutorial_dependencies IS 'Prevent circular self-references';

-- ============================================
-- 9. FEATURED CONTENT TABLE
-- Purpose: Admin-curated content for homepage
-- ============================================
CREATE TABLE featured_content (
  id SERIAL PRIMARY KEY,
  tutorial_id INT REFERENCES tutorials(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) CHECK (feature_type IN ('hero', 'trending', 'recommended', 'new')),
  display_order INT DEFAULT 0,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE featured_content IS 'Curated content for homepage and promotions';

-- ============================================
-- 10. ADMIN SETTINGS TABLE
-- Purpose: Platform configuration
-- ============================================
CREATE TABLE admin_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE admin_settings IS 'Platform configuration and settings';

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value, updated_by) VALUES
('search_config', '{"min_confidence": 0.3, "max_results": 5, "fuzzy_threshold": 0.25}', 'system'),
('platform_stats', '{"total_users": 0, "total_queries": 0, "last_updated": null}', 'system'),
('feature_flags', '{"voice_search": true, "user_accounts": false, "analytics": true}', 'system');

-- ============================================
-- Create updated_at triggers for all tables
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tutorials_updated_at 
  BEFORE UPDATE ON tutorials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify setup
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables created: categories, tutorials, tutorial_steps, intents, keywords, query_logs, user_progress, tutorial_dependencies, featured_content, admin_settings';
END $$;