-- ============================================
-- ASAAN DIGITAL - PL/pgSQL FUNCTIONS
-- ADBMS Project - Spring 2026
-- ============================================
-- Purpose: Core business logic in database layer
-- Features: Fuzzy search, query processing, analytics
-- ============================================

-- ============================================
-- 1. FUZZY SEARCH FUNCTION
-- Purpose: Find matching intents using multiple strategies
-- ============================================
CREATE OR REPLACE FUNCTION search_intent_fuzzy(
  p_query TEXT,
  p_similarity_threshold FLOAT DEFAULT 0.3
)
RETURNS TABLE(
  intent_id INT,
  tutorial_id INT,
  matched_keyword VARCHAR(255),
  confidence NUMERIC,
  tutorial_title_urdu VARCHAR(255),
  tutorial_title_english VARCHAR(255),
  category_name VARCHAR(100)
)AS $$
DECLARE
  v_phonetic_code VARCHAR(10);
BEGIN
  -- Generate phonetic code for Roman Urdu variations
  v_phonetic_code := SOUNDEX(p_query);
  
  RETURN QUERY
  WITH keyword_matches AS (
    SELECT 
      k.intent_id,
      k.keyword,
      -- Combined confidence score using multiple strategies
      GREATEST(
        similarity(k.keyword, p_query),                                    -- Trigram similarity
        CASE 
          WHEN k.keyword ILIKE '%' || p_query || '%' THEN 0.8              -- Substring match
          WHEN k.phonetic_code = v_phonetic_code THEN 0.6                  -- Phonetic match
          WHEN levenshtein(k.keyword, p_query) < 3 THEN 0.5                -- Edit distance
          ELSE 0
        END
      ) as match_confidence
    FROM keywords k
    WHERE 
      k.keyword % p_query                                                  -- Trigram operator
      OR k.keyword ILIKE '%' || p_query || '%'                             -- Substring
      OR k.phonetic_code = v_phonetic_code                                 -- Phonetic
      OR levenshtein(k.keyword, p_query) < 3                               -- Similar spelling
  )
  SELECT DISTINCT ON (km.intent_id)
    km.intent_id,
    i.tutorial_id,
    km.keyword,
    ROUND(km.match_confidence::numeric, 2) as confidence,
    t.title_urdu,
    t.title_english,
    c.name_english
  FROM keyword_matches km
  JOIN intents i ON km.intent_id = i.id
  JOIN tutorials t ON i.tutorial_id = t.id
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE km.match_confidence >= p_similarity_threshold
    AND t.is_published = true
  ORDER BY km.intent_id, km.match_confidence DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_intent_fuzzy IS 'Multi-strategy fuzzy search with trigram, phonetic, and edit distance matching';

-- ============================================
-- 2. PROCESS USER QUERY (Main Search Handler)
-- Purpose: Complete query processing with logging
-- ============================================
CREATE OR REPLACE FUNCTION process_user_query(
  p_query TEXT,
  p_session_id UUID,
  p_user_id INT DEFAULT NULL,
  p_user_ip INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_result RECORD;
  v_response JSONB;
  v_start_time TIMESTAMP;
  v_response_time INT;
BEGIN
  v_start_time := clock_timestamp();
  
  -- Search for matching intent
  SELECT * INTO v_result 
  FROM search_intent_fuzzy(p_query, 0.25) 
  LIMIT 1;
  
  v_response_time := EXTRACT(MILLISECONDS FROM (clock_timestamp() - v_start_time));
  
  -- Log the query with failure tracking
  IF v_result.intent_id IS NOT NULL THEN
    -- Success/Low-confidence case
    INSERT INTO query_logs (
      session_id, user_id, query_text, 
      matched_intent_id, matched_tutorial_id, confidence_score,
      query_status, response_time_ms, user_ip, user_agent
    ) VALUES (
      p_session_id, p_user_id, p_query,
      v_result.intent_id, v_result.tutorial_id, v_result.confidence,
      CASE 
        WHEN v_result.confidence >= 0.7 THEN 'SUCCESS'
        ELSE 'LOW_CONFIDENCE'
      END,
      v_response_time, p_user_ip, p_user_agent
    );
    
    -- Update intent popularity
    UPDATE intents 
    SET 
      popularity_score = popularity_score + 1,
      success_count = success_count + 1
    WHERE id = v_result.intent_id;
    
    -- Build success response
    v_response := jsonb_build_object(
      'status', 'success',
      'intent_id', v_result.intent_id,
      'tutorial_id', v_result.tutorial_id,
      'matched_keyword', v_result.matched_keyword,
      'confidence', v_result.confidence,
      'tutorial_title', jsonb_build_object(
        'urdu', v_result.tutorial_title_urdu,
        'english', v_result.tutorial_title_english
      ),
      'category', v_result.category_name,
      'response_time_ms', v_response_time
    );
  ELSE
    -- Failure case - track for content gaps
    INSERT INTO query_logs (
      session_id, user_id, query_text,
      query_status, failure_reason, response_time_ms, user_ip, user_agent
    ) VALUES (
      p_session_id, p_user_id, p_query,
      'FAILED', 'No matching intent found above threshold',
      v_response_time, p_user_ip, p_user_agent
    );
    
    -- Get suggestions for failed queries
    v_response := jsonb_build_object(
      'status', 'failed',
      'message_urdu', 'Ú©ÙˆØ¦ÛŒ Ù†ØªÛŒØ¬Û Ù†ÛÛŒÚº Ù…Ù„Ø§Û” Ø¨Ø±Ø§Û Ú©Ø±Ù… Ø¯ÙˆØ³Ø±Û’ Ø§Ù„ÙØ§Ø¸ Ø§Ø³ØªØ¹Ù…Ø§Ù„ Ú©Ø±ÛŒÚºÛ”',
      'message_english', 'No results found. Please try different words.',
      'suggestions', (
        SELECT jsonb_agg(DISTINCT keyword) 
        FROM keywords 
        WHERE keyword % p_query 
        LIMIT 3
      ),
      'response_time_ms', v_response_time
    );
  END IF;
  
  RETURN v_response;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION process_user_query IS 'Main search handler with automatic logging and analytics';

-- ============================================
-- 3. GET TUTORIAL WITH STEPS
-- Purpose: Fetch complete tutorial data efficiently
-- ============================================
CREATE OR REPLACE FUNCTION get_tutorial_with_steps(p_tutorial_id INT)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'id', t.id,
    'title_urdu', t.title_urdu,
    'title_english', t.title_english,
    'description_urdu', t.description_urdu,
    'description_english', t.description_english,
    'difficulty_level', t.difficulty_level,
    'estimated_time', t.estimated_time_minutes,
    'category', jsonb_build_object(
      'id', c.id,
      'name_urdu', c.name_urdu,
      'name_english', c.name_english
    ),
    'steps', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'step_number', ts.step_number,
          'instruction_urdu', ts.instruction_urdu,
          'instruction_english', ts.instruction_english,
          'image_url', ts.image_url,
          'audio_url', ts.audio_url
        ) ORDER BY ts.step_number
      )
      FROM tutorial_steps ts
      WHERE ts.tutorial_id = t.id
    ),
    'metadata', t.metadata,
    'prerequisites', (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', pt.id,
          'title_urdu', pt.title_urdu,
          'title_english', pt.title_english,
          'is_mandatory', td.is_mandatory
        )
      )
      FROM tutorial_dependencies td
      JOIN tutorials pt ON td.prerequisite_id = pt.id
      WHERE td.tutorial_id = t.id AND pt.is_published = true
    )
  )
  INTO v_result
  FROM tutorials t
  LEFT JOIN categories c ON t.category_id = c.id
  WHERE t.id = p_tutorial_id AND t.is_published = true;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_tutorial_with_steps IS 'Efficiently fetch complete tutorial with all related data';

-- ============================================
-- 4. GET TRENDING TOPICS
-- Purpose: Analytics for popular content
-- ============================================
CREATE OR REPLACE FUNCTION get_trending_topics(p_days INT DEFAULT 7)
RETURNS TABLE(
  tutorial_id INT,
  title_urdu VARCHAR(255),
  title_english VARCHAR(255),
  search_count BIGINT,
  success_rate NUMERIC,
  trend_direction TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT 
      matched_tutorial_id,
      COUNT(*) as count,
      AVG(CASE WHEN query_status = 'SUCCESS' THEN 1.0 ELSE 0.0 END) as success_rate
    FROM query_logs
    WHERE created_at > CURRENT_DATE - p_days
      AND matched_tutorial_id IS NOT NULL
    GROUP BY matched_tutorial_id
  ),
  previous_period AS (
    SELECT 
      matched_tutorial_id,
      COUNT(*) as count
    FROM query_logs
    WHERE created_at BETWEEN CURRENT_DATE - (p_days * 2) AND CURRENT_DATE - p_days
      AND matched_tutorial_id IS NOT NULL
    GROUP BY matched_tutorial_id
  )
  SELECT 
    cp.matched_tutorial_id,
    t.title_urdu,
    t.title_english,
    cp.count,
    ROUND(cp.success_rate::numeric * 100, 1),
    CASE 
      WHEN cp.count > COALESCE(pp.count, 0) * 1.2 THEN 'rising_fast'
      WHEN cp.count > COALESCE(pp.count, 0) THEN 'rising'
      WHEN cp.count < COALESCE(pp.count, 0) * 0.8 THEN 'falling'
      ELSE 'stable'
    END
  FROM current_period cp
  JOIN tutorials t ON cp.matched_tutorial_id = t.id
  LEFT JOIN previous_period pp ON cp.matched_tutorial_id = pp.matched_tutorial_id
  WHERE t.is_published = true
  ORDER BY cp.count DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_trending_topics IS 'Calculate trending tutorials with trend direction analysis';

-- ============================================
-- 5. GET CONTENT GAPS
-- Purpose: Identify missing content opportunities
-- ============================================
CREATE OR REPLACE FUNCTION get_content_gaps(p_min_failures INT DEFAULT 3)
RETURNS TABLE(
  normalized_query TEXT,
  fail_count BIGINT,
  unique_users BIGINT,
  last_searched TIMESTAMP,
  suggested_keywords TEXT[],
  suggested_category TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    LOWER(TRIM(ql.query_text)) as norm_query,
    COUNT(*) as fails,
    COUNT(DISTINCT ql.session_id) as users,
    MAX(ql.created_at) as last_search,
    ARRAY_AGG(DISTINCT k.keyword) FILTER (WHERE k.keyword IS NOT NULL)[1:5] as suggestions,
    CASE 
      WHEN LOWER(ql.query_text) LIKE '%cnic%' OR LOWER(ql.query_text) LIKE '%nadra%' THEN 'Government Services'
      WHEN LOWER(ql.query_text) LIKE '%whatsapp%' THEN 'WhatsApp'
      WHEN LOWER(ql.query_text) LIKE '%jazzcash%' OR LOWER(ql.query_text) LIKE '%easypaisa%' THEN 'Digital Payments'
      WHEN LOWER(ql.query_text) LIKE '%facebook%' OR LOWER(ql.query_text) LIKE '%instagram%' THEN 'Social Media'
      WHEN LOWER(ql.query_text) LIKE '%email%' OR LOWER(ql.query_text) LIKE '%gmail%' THEN 'Email'
      ELSE 'Other'
    END as category
  FROM query_logs ql
  LEFT JOIN keywords k ON k.keyword % ql.query_text
  WHERE 
    ql.query_status = 'FAILED'
    AND ql.created_at > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY LOWER(TRIM(ql.query_text))
  HAVING COUNT(*) >= p_min_failures
  ORDER BY fails DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_content_gaps IS 'Identify frequently failed searches to guide content creation';

-- ============================================
-- 6. GET LEARNING PATH (Recursive CTE)
-- Purpose: Generate optimal learning sequence
-- ============================================
CREATE OR REPLACE FUNCTION get_learning_path(p_category_id INT DEFAULT NULL)
RETURNS TABLE(
  tutorial_id INT,
  title_urdu VARCHAR(255),
  title_english TEXT,
  difficulty_level INT,
  estimated_time INT,
  path_level INT,
  prerequisites INT[]
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE tutorial_path AS (
    -- Anchor: Tutorials with no mandatory prerequisites
    SELECT 
      t.id,
      t.title_urdu,
      t.title_english,
      t.difficulty_level,
      t.estimated_time_minutes,
      1 as level,
      ARRAY[]::INT[] as prereqs,
      ARRAY[t.id] as visited
    FROM tutorials t
    WHERE t.is_published = true
      AND (p_category_id IS NULL OR t.category_id = p_category_id)
      AND NOT EXISTS (
        SELECT 1 FROM tutorial_dependencies td 
        WHERE td.tutorial_id = t.id AND td.is_mandatory = true
      )
    
    UNION ALL
    
    -- Recursive: Add tutorials that depend on current ones
    SELECT 
      t.id,
      t.title_urdu,
      t.title_english,
      t.difficulty_level,
      t.estimated_time_minutes,
      tp.level + 1,
      tp.visited,
      tp.visited || t.id
    FROM tutorials t
    JOIN tutorial_dependencies td ON t.id = td.tutorial_id
    JOIN tutorial_path tp ON td.prerequisite_id = tp.id
    WHERE t.is_published = true
      AND NOT t.id = ANY(tp.visited)  -- Prevent cycles
  )
  SELECT DISTINCT ON (tp.id)
    tp.id,
    tp.title_urdu,
    tp.title_english,
    tp.difficulty_level,
    tp.estimated_time_minutes,
    tp.level,
    tp.prereqs
  FROM tutorial_path tp
  ORDER BY tp.id, tp.level;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_learning_path IS 'Generate optimal learning sequence using recursive CTE';

-- ============================================
-- 7. SEARCH PERFORMANCE ANALYTICS
-- Purpose: Monitor query performance
-- ============================================
CREATE OR REPLACE FUNCTION get_search_performance(p_hours INT DEFAULT 24)
RETURNS TABLE(
  time_bucket TIMESTAMP,
  total_queries BIGINT,
  successful_queries BIGINT,
  failed_queries BIGINT,
  avg_response_ms NUMERIC,
  avg_confidence NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as success,
    COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed,
    ROUND(AVG(response_time_ms), 1) as avg_time,
    ROUND(AVG(confidence_score)::numeric, 3) as avg_conf
  FROM query_logs
  WHERE created_at > NOW() - (p_hours || ' hours')::INTERVAL
  GROUP BY DATE_TRUNC('hour', created_at)
  ORDER BY hour DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_search_performance IS 'Hourly search performance metrics';

-- Verify functions
DO $$
DECLARE
  func_count INT;
BEGIN
  SELECT COUNT(*) INTO func_count 
  FROM pg_proc 
  WHERE pronamespace = 'public'::regnamespace 
    AND proname IN ('search_intent_fuzzy', 'process_user_query', 'get_tutorial_with_steps', 
                    'get_trending_topics', 'get_content_gaps', 'get_learning_path');
  RAISE NOTICE 'âœ… Created % PL/pgSQL functions', func_count;
END $$;