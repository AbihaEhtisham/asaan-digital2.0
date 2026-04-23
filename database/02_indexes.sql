-- ============================================
-- ASAAN DIGITAL - INDEXING STRATEGY
-- ADBMS Project - Spring 2026
-- ============================================
-- Purpose: Optimize query performance for search and analytics
-- Strategy: Mix of B-Tree, GIN, GiST, and partial indexes
-- ============================================

-- ============================================
-- 1. FULL-TEXT SEARCH INDEXES
-- ============================================

-- GIN index for fast full-text search on tutorials
CREATE INDEX idx_tutorials_search ON tutorials USING GIN(search_vector);
COMMENT ON INDEX idx_tutorials_search IS 'GIN index for tsvector full-text search';

-- ============================================
-- 2. FUZZY SEARCH INDEXES (Trigram)
-- ============================================

-- GiST trigram index for similarity matching
CREATE INDEX idx_keywords_trgm ON keywords USING GIST(keyword gist_trgm_ops);
COMMENT ON INDEX idx_keywords_trgm IS 'GiST trigram index for fuzzy keyword matching';

-- Additional GIN trigram index for ILIKE queries
CREATE INDEX idx_keywords_trgm_gin ON keywords USING GIN(keyword gin_trgm_ops);
COMMENT ON INDEX idx_keywords_trgm_gin IS 'GIN trigram index for pattern matching';

-- ============================================
-- 3. B-TREE INDEXES FOR FOREIGN KEYS
-- ============================================

CREATE INDEX idx_tutorials_category ON tutorials(category_id) WHERE is_published = true;
CREATE INDEX idx_tutorial_steps_tutorial ON tutorial_steps(tutorial_id, step_number);
CREATE INDEX idx_intents_tutorial ON intents(tutorial_id);
CREATE INDEX idx_keywords_intent ON keywords(intent_id);
CREATE INDEX idx_query_logs_intent ON query_logs(matched_intent_id);
CREATE INDEX idx_query_logs_tutorial ON query_logs(matched_tutorial_id);
CREATE INDEX idx_featured_tutorial ON featured_content(tutorial_id);
CREATE INDEX idx_dependencies_tutorial ON tutorial_dependencies(tutorial_id);
CREATE INDEX idx_dependencies_prereq ON tutorial_dependencies(prerequisite_id);

COMMENT ON INDEX idx_tutorial_steps_tutorial IS 'Composite index for efficient step retrieval';

-- ============================================
-- 4. DATE-BASED INDEXES FOR ANALYTICS
-- ============================================

-- Time-series indexes for query logs
CREATE INDEX idx_query_logs_created ON query_logs(created_at DESC);
CREATE INDEX idx_query_logs_date_status ON query_logs(created_at, query_status);
CREATE INDEX idx_query_logs_session_created ON query_logs(session_id, created_at DESC);

COMMENT ON INDEX idx_query_logs_created IS 'BRIN could be used for very large datasets';
COMMENT ON INDEX idx_query_logs_date_status IS 'Composite index for filtered analytics queries';

-- ============================================
-- 5. PARTIAL INDEXES FOR PERFORMANCE
-- ============================================

-- Index only recent failed queries (most queried subset)
CREATE INDEX idx_failed_queries_recent ON query_logs(created_at) 
WHERE query_status = 'FAILED' AND created_at > CURRENT_DATE - INTERVAL '30 days';
COMMENT ON INDEX idx_failed_queries_recent IS 'Partial index for recent failures only';

-- Index for low confidence matches
CREATE INDEX idx_low_confidence_recent ON query_logs(matched_intent_id, created_at) 
WHERE query_status = 'LOW_CONFIDENCE' AND created_at > CURRENT_DATE - INTERVAL '7 days';
COMMENT ON INDEX idx_low_confidence_recent IS 'Partial index for recent low-confidence queries';

-- Index for successful searches (most common case)
CREATE INDEX idx_successful_searches ON query_logs(matched_tutorial_id) 
WHERE query_status = 'SUCCESS';
COMMENT ON INDEX idx_successful_searches IS 'Partial index for successful searches only';

-- ============================================
-- 6. PHONETIC SEARCH INDEXES
-- ============================================

CREATE INDEX idx_keywords_phonetic ON keywords(phonetic_code) WHERE phonetic_code IS NOT NULL;
COMMENT ON INDEX idx_keywords_phonetic IS 'B-Tree index for SOUNDEX phonetic matching';

-- ============================================
-- 7. COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================

-- Popular searches aggregation
CREATE INDEX idx_query_logs_popular ON query_logs(matched_intent_id, created_at) 
WHERE matched_intent_id IS NOT NULL;
COMMENT ON INDEX idx_query_logs_popular IS 'Optimizes trending topics queries';

-- User progress lookup
CREATE INDEX idx_user_progress_user ON user_progress(user_id, last_accessed DESC);
CREATE INDEX idx_user_progress_tutorial ON user_progress(tutorial_id) WHERE is_completed = false;
COMMENT ON INDEX idx_user_progress_user IS 'Optimizes user dashboard queries';

-- ============================================
-- 8. CATEGORY AND DISPLAY INDEXES
-- ============================================

CREATE INDEX idx_categories_display ON categories(display_order) WHERE is_active = true;
CREATE INDEX idx_featured_active ON featured_content(feature_type, display_order) 
WHERE end_date IS NULL OR end_date > NOW();
COMMENT ON INDEX idx_featured_active IS 'Optimizes homepage featured content queries';

-- ============================================
-- 9. EXPRESSION INDEXES
-- ============================================

-- Index on lowercase query text for case-insensitive search
CREATE INDEX idx_query_logs_text_lower ON query_logs(LOWER(query_text));
COMMENT ON INDEX idx_query_logs_text_lower IS 'Expression index for case-insensitive text search';

-- Index on date truncated to hour for time-based analytics
CREATE INDEX idx_query_logs_hour ON query_logs(DATE_TRUNC('hour', created_at));
COMMENT ON INDEX idx_query_logs_hour IS 'Expression index for hourly analytics';

-- ============================================
-- 10. COVERING INDEXES (INCLUDE clause)
-- ============================================

-- Covering index for tutorial listing (reduces table access)
CREATE INDEX idx_tutorials_listing ON tutorials(category_id, difficulty_level) 
INCLUDE (title_english, title_urdu, estimated_time_minutes)
WHERE is_published = true;
COMMENT ON INDEX idx_tutorials_listing IS 'Covering index for tutorial listing page';

-- ============================================
-- INDEX SIZE MONITORING QUERY (for documentation)
-- ============================================
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   pg_size_pretty(pg_relation_size(indexname::regclass)) as index_size
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY pg_relation_size(indexname::regclass) DESC;

-- Verify indexes
DO $$
DECLARE
  index_count INT;
BEGIN
  SELECT COUNT(*) INTO index_count FROM pg_indexes WHERE schemaname = 'public';
  RAISE NOTICE '✅ Created % indexes for optimal query performance', index_count;
  RAISE NOTICE '📈 Index types: B-Tree, GIN, GiST, Partial, Expression, Covering';
END $$;