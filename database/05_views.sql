-- ============================================
-- ASAAN DIGITAL - VIEWS & MATERIALIZED VIEWS
-- ADBMS Project - Spring 2026
-- ============================================
-- Purpose: Analytics, reporting, and performance optimization
-- Strategy: Mix of regular views (real-time) and materialized views (pre-computed)
-- ============================================

-- ============================================
-- REGULAR VIEWS (Real-time, always fresh)
-- ============================================

-- 1. Tutorial Summary View
CREATE OR REPLACE VIEW tutorial_summary AS
SELECT 
  t.id,
  t.title_english,
  t.title_urdu,
  t.difficulty_level,
  t.estimated_time_minutes,
  c.name_english as category_name,
  c.name_urdu as category_name_urdu,
  (SELECT COUNT(*) FROM tutorial_steps WHERE tutorial_id = t.id) as step_count,
  (SELECT COUNT(*) FROM intents WHERE tutorial_id = t.id) as intent_count,
  (SELECT COUNT(*) FROM keywords k JOIN intents i ON k.intent_id = i.id WHERE i.tutorial_id = t.id) as keyword_count,
  (SELECT COUNT(*) FROM query_logs WHERE matched_tutorial_id = t.id) as total_searches,
  t.metadata->>'last_searched' as last_searched,
  t.created_at,
  t.updated_at
FROM tutorials t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.is_published = true;

COMMENT ON VIEW tutorial_summary IS 'Comprehensive tutorial statistics for admin dashboard';

-- 2. Query Success Rate View (Last 7 days)
CREATE OR REPLACE VIEW query_success_rate AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_queries,
  COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful,
  COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed,
  COUNT(*) FILTER (WHERE query_status = 'LOW_CONFIDENCE') as low_confidence,
  ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms,
  ROUND(AVG(confidence_score)::numeric, 3) as avg_confidence
FROM query_logs
WHERE created_at > CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

COMMENT ON VIEW query_success_rate IS 'Daily query performance metrics';

-- 3. Popular Keywords View
CREATE OR REPLACE VIEW popular_keywords AS
SELECT 
  k.keyword,
  k.language,
  COUNT(ql.id) as usage_count,
  AVG(ql.confidence_score) as avg_confidence,
  MAX(ql.created_at) as last_used
FROM keywords k
JOIN intents i ON k.intent_id = i.id
JOIN query_logs ql ON ql.matched_intent_id = i.id
WHERE ql.created_at > CURRENT_DATE - INTERVAL '30 days'
GROUP BY k.keyword, k.language
ORDER BY usage_count DESC;

COMMENT ON VIEW popular_keywords IS 'Most frequently matched keywords';

-- 4. Category Performance View
CREATE OR REPLACE VIEW category_performance AS
SELECT 
  c.id,
  c.name_english,
  c.name_urdu,
  COUNT(DISTINCT t.id) as tutorial_count,
  COUNT(DISTINCT i.id) as intent_count,
  COUNT(DISTINCT k.id) as keyword_count,
  COALESCE(SUM(ql.search_count), 0) as total_searches,
  COALESCE(AVG(ql.avg_confidence), 0) as avg_confidence
FROM categories c
LEFT JOIN tutorials t ON c.id = t.category_id AND t.is_published = true
LEFT JOIN intents i ON t.id = i.tutorial_id
LEFT JOIN keywords k ON i.id = k.intent_id
LEFT JOIN (
  SELECT 
    matched_tutorial_id,
    COUNT(*) as search_count,
    AVG(confidence_score) as avg_confidence
  FROM query_logs
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY matched_tutorial_id
) ql ON t.id = ql.matched_tutorial_id
WHERE c.is_active = true
GROUP BY c.id, c.name_english, c.name_urdu
ORDER BY total_searches DESC;

COMMENT ON VIEW category_performance IS 'Category-level analytics and coverage metrics';

-- 5. User Activity View
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  session_id,
  MIN(created_at) as session_start,
  MAX(created_at) as session_end,
  COUNT(*) as queries_in_session,
  COUNT(DISTINCT matched_tutorial_id) as unique_tutorials_viewed,
  COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful_queries,
  COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed_queries,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as session_duration_seconds,
  MIN(user_ip) as user_ip,
  MIN(user_agent) as user_agent
FROM query_logs
WHERE created_at > CURRENT_DATE - INTERVAL '24 hours'
GROUP BY session_id
HAVING COUNT(*) >= 2;

COMMENT ON VIEW user_activity_summary IS 'User session analysis for behavior tracking';

-- 6. Intent Effectiveness View
CREATE OR REPLACE VIEW intent_effectiveness AS
SELECT 
  i.id,
  i.intent_name,
  i.tutorial_id,
  t.title_urdu as tutorial_title,
  i.popularity_score,
  i.success_count,
  i.fail_count,
  CASE 
    WHEN (i.success_count + i.fail_count) > 0 
    THEN ROUND((i.success_count::numeric / (i.success_count + i.fail_count)) * 100, 2)
    ELSE 0
  END as success_rate,
  (SELECT COUNT(*) FROM keywords WHERE intent_id = i.id) as keyword_count,
  (SELECT AVG(confidence_score) FROM query_logs WHERE matched_intent_id = i.id) as avg_confidence
FROM intents i
JOIN tutorials t ON i.tutorial_id = t.id
WHERE t.is_published = true
ORDER BY i.popularity_score DESC;

COMMENT ON VIEW intent_effectiveness IS 'Intent performance and effectiveness metrics';

-- ============================================
-- MATERIALIZED VIEWS (Pre-computed for performance)
-- Refresh Strategy: Every hour via cron job
-- ============================================

-- 1. Content Gaps Materialized View
-- Purpose: Identify missing content opportunities
-- Refresh: Hourly
DROP MATERIALIZED VIEW IF EXISTS content_gaps_mv;
CREATE MATERIALIZED VIEW content_gaps_mv AS
WITH failed_analysis AS (
  SELECT 
    LOWER(TRIM(query_text)) as normalized_query,
    COUNT(*) as fail_count,
    COUNT(DISTINCT session_id) as unique_users,
    MAX(created_at) as last_searched,
    ARRAY_AGG(DISTINCT query_text ORDER BY query_text)[1:5] as sample_queries,
    AVG(response_time_ms)::INT as avg_response_time
  FROM query_logs
  WHERE 
    query_status = 'FAILED'
    AND created_at > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY LOWER(TRIM(query_text))
  HAVING COUNT(*) >= 3
)
SELECT 
  ROW_NUMBER() OVER (ORDER BY fail_count DESC) as gap_rank,
  normalized_query,
  fail_count,
  unique_users,
  last_searched,
  sample_queries,
  avg_response_time,
  jsonb_build_object(
    'suggested_category', 
    CASE 
      WHEN normalized_query LIKE '%cnic%' OR normalized_query LIKE '%nadra%' THEN 'Government Services'
      WHEN normalized_query LIKE '%whatsapp%' OR normalized_query LIKE '%whats app%' THEN 'WhatsApp'
      WHEN normalized_query LIKE '%facebook%' THEN 'Social Media'
      WHEN normalized_query LIKE '%jazzcash%' OR normalized_query LIKE '%easypaisa%' THEN 'Digital Payments'
      WHEN normalized_query LIKE '%gmail%' OR normalized_query LIKE '%email%' THEN 'Email'
      WHEN normalized_query LIKE '%youtube%' THEN 'YouTube'
      WHEN normalized_query LIKE '%google%' THEN 'Google Services'
      ELSE 'Other'
    END,
    'priority',
    CASE 
      WHEN fail_count >= 10 THEN 'High'
      WHEN fail_count >= 5 THEN 'Medium'
      ELSE 'Low'
    END
  ) as suggestions
FROM failed_analysis
ORDER BY fail_count DESC, last_searched DESC
LIMIT 50;

CREATE UNIQUE INDEX ON content_gaps_mv (normalized_query);
CREATE INDEX ON content_gaps_mv (gap_rank);
CREATE INDEX ON content_gaps_mv (last_searched DESC);

COMMENT ON MATERIALIZED VIEW content_gaps_mv IS 'Failed query analysis for content planning - Refreshed hourly';

-- 2. Tutorial Analytics Materialized View
-- Purpose: Performance metrics for all tutorials
-- Refresh: Hourly
DROP MATERIALIZED VIEW IF EXISTS tutorial_analytics_mv;
CREATE MATERIALIZED VIEW tutorial_analytics_mv AS
WITH weekly_stats AS (
  SELECT 
    t.id as tutorial_id,
    t.title_urdu,
    t.title_english,
    t.difficulty_level,
    c.name_english as category_name,
    COUNT(ql.id) as total_searches_7d,
    COUNT(CASE WHEN ql.query_status = 'SUCCESS' THEN 1 END) as successful_matches_7d,
    COUNT(CASE WHEN ql.query_status = 'LOW_CONFIDENCE' THEN 1 END) as low_confidence_7d,
    ROUND(AVG(ql.confidence_score)::numeric, 3) as avg_confidence_7d,
    COUNT(DISTINCT ql.session_id) as unique_users_7d,
    MAX(ql.created_at) as last_accessed
  FROM tutorials t
  LEFT JOIN categories c ON t.category_id = c.id
  LEFT JOIN query_logs ql ON ql.matched_tutorial_id = t.id
    AND ql.created_at > CURRENT_DATE - INTERVAL '7 days'
  WHERE t.is_published = true
  GROUP BY t.id, t.title_urdu, t.title_english, t.difficulty_level, c.name_english
),
monthly_stats AS (
  SELECT 
    t.id as tutorial_id,
    COUNT(ql.id) as total_searches_30d,
    ROUND(AVG(ql.confidence_score)::numeric, 3) as avg_confidence_30d
  FROM tutorials t
  LEFT JOIN query_logs ql ON ql.matched_tutorial_id = t.id
    AND ql.created_at > CURRENT_DATE - INTERVAL '30 days'
  WHERE t.is_published = true
  GROUP BY t.id
)
SELECT 
  ws.tutorial_id,
  ws.title_urdu,
  ws.title_english,
  ws.difficulty_level,
  ws.category_name,
  ws.total_searches_7d,
  ws.successful_matches_7d,
  ws.low_confidence_7d,
  ws.avg_confidence_7d,
  ws.unique_users_7d,
  ms.total_searches_30d,
  ms.avg_confidence_30d,
  ws.last_accessed,
  RANK() OVER (ORDER BY ws.total_searches_7d DESC) as popularity_rank_7d,
  RANK() OVER (ORDER BY ms.total_searches_30d DESC) as popularity_rank_30d,
  CASE 
    WHEN ws.total_searches_7d >= 50 THEN 'High'
    WHEN ws.total_searches_7d >= 20 THEN 'Medium'
    WHEN ws.total_searches_7d >= 5 THEN 'Low'
    ELSE 'Very Low'
  END as popularity_level,
  CASE
    WHEN ws.last_accessed > CURRENT_DATE - INTERVAL '1 day' THEN 'Active'
    WHEN ws.last_accessed > CURRENT_DATE - INTERVAL '7 days' THEN 'Recent'
    ELSE 'Inactive'
  END as activity_status
FROM weekly_stats ws
JOIN monthly_stats ms ON ws.tutorial_id = ms.tutorial_id
ORDER BY ws.total_searches_7d DESC;

CREATE UNIQUE INDEX ON tutorial_analytics_mv (tutorial_id);
CREATE INDEX ON tutorial_analytics_mv (popularity_rank_7d);
CREATE INDEX ON tutorial_analytics_mv (category_name);
CREATE INDEX ON tutorial_analytics_mv (activity_status);

COMMENT ON MATERIALIZED VIEW tutorial_analytics_mv IS 'Comprehensive tutorial performance analytics - Refreshed hourly';

-- 3. Daily Platform Stats Materialized View
-- Purpose: Time-series analytics for dashboards
-- Refresh: Daily at midnight
DROP MATERIALIZED VIEW IF EXISTS daily_platform_stats_mv;
CREATE MATERIALIZED VIEW daily_platform_stats_mv AS
SELECT 
  DATE_TRUNC('day', created_at) as stat_date,
  COUNT(*) as total_queries,
  COUNT(DISTINCT session_id) as unique_users,
  COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful_queries,
  COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed_queries,
  COUNT(*) FILTER (WHERE query_status = 'LOW_CONFIDENCE') as low_confidence_queries,
  ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_ms) as p50_response_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_ms,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_ms,
  ROUND(AVG(confidence_score)::numeric, 3) as avg_confidence,
  COUNT(DISTINCT matched_tutorial_id) as unique_tutorials_accessed
FROM query_logs
WHERE created_at > CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY stat_date DESC;

CREATE UNIQUE INDEX ON daily_platform_stats_mv (stat_date);
CREATE INDEX ON daily_platform_stats_mv (stat_date DESC);

COMMENT ON MATERIALIZED VIEW daily_platform_stats_mv IS 'Daily aggregated platform statistics - Refreshed daily';

-- 4. Hourly Traffic Heatmap Materialized View
-- Purpose: Identify peak usage times
-- Refresh: Every 30 minutes
DROP MATERIALIZED VIEW IF EXISTS traffic_heatmap_mv;
CREATE MATERIALIZED VIEW traffic_heatmap_mv AS
SELECT 
  EXTRACT(DOW FROM created_at) as day_of_week,  -- 0=Sunday, 6=Saturday
  EXTRACT(HOUR FROM created_at) as hour_of_day,
  COUNT(*) as query_count,
  COUNT(DISTINCT session_id) as unique_users,
  ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms,
  COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful_queries,
  COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed_queries
FROM query_logs
WHERE created_at > CURRENT_DATE - INTERVAL '60 days'
GROUP BY EXTRACT(DOW FROM created_at), EXTRACT(HOUR FROM created_at)
ORDER BY day_of_week, hour_of_day;

CREATE UNIQUE INDEX ON traffic_heatmap_mv (day_of_week, hour_of_day);

COMMENT ON MATERIALIZED VIEW traffic_heatmap_mv IS 'Hourly traffic patterns for capacity planning - Refreshed every 30 min';

-- 5. Keyword Effectiveness Materialized View
-- Purpose: Optimize search keyword weighting
-- Refresh: Every 6 hours
DROP MATERIALIZED VIEW IF EXISTS keyword_effectiveness_mv;
CREATE MATERIALIZED VIEW keyword_effectiveness_mv AS
SELECT 
  k.id as keyword_id,
  k.keyword,
  k.language,
  i.id as intent_id,
  i.intent_name,
  COUNT(ql.id) as times_matched,
  AVG(ql.confidence_score) as avg_confidence_when_matched,
  COUNT(*) FILTER (WHERE ql.query_status = 'SUCCESS') as successful_matches,
  COUNT(*) FILTER (WHERE ql.query_status = 'LOW_CONFIDENCE') as low_confidence_matches,
  MAX(ql.created_at) as last_matched,
  -- Calculate effectiveness score
  ROUND(
    (COUNT(ql.id) * AVG(ql.confidence_score))::numeric, 
    2
  ) as effectiveness_score
FROM keywords k
JOIN intents i ON k.intent_id = i.id
LEFT JOIN query_logs ql ON ql.matched_intent_id = i.id 
  AND ql.query_text ILIKE '%' || k.keyword || '%'
  AND ql.created_at > CURRENT_DATE - INTERVAL '30 days'
GROUP BY k.id, k.keyword, k.language, i.id, i.intent_name
HAVING COUNT(ql.id) > 0
ORDER BY effectiveness_score DESC;

CREATE UNIQUE INDEX ON keyword_effectiveness_mv (keyword_id);
CREATE INDEX ON keyword_effectiveness_mv (effectiveness_score DESC);
CREATE INDEX ON keyword_effectiveness_mv (intent_id);

COMMENT ON MATERIALIZED VIEW keyword_effectiveness_mv IS 'Keyword performance for search optimization - Refreshed every 6 hours';

-- ============================================
-- REFRESH ALL MATERIALIZED VIEWS FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS TABLE(view_name TEXT, status TEXT, error_message TEXT) AS $$
DECLARE
  v_views TEXT[] := ARRAY['content_gaps_mv', 'tutorial_analytics_mv', 'daily_platform_stats_mv', 'traffic_heatmap_mv', 'keyword_effectiveness_mv'];
  v_view TEXT;
BEGIN
  FOREACH v_view IN ARRAY v_views LOOP
    BEGIN
      EXECUTE 'REFRESH MATERIALIZED VIEW CONCURRENTLY ' || v_view;
      RETURN QUERY SELECT v_view, 'SUCCESS', NULL::TEXT;
    EXCEPTION WHEN OTHERS THEN
      RETURN QUERY SELECT v_view, 'FAILED', SQLERRM;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresh all materialized views with error handling';

-- Verify views
DO $$
DECLARE
  regular_views INT;
  mat_views INT;
BEGIN
  SELECT COUNT(*) INTO regular_views FROM pg_views WHERE schemaname = 'public';
  SELECT COUNT(*) INTO mat_views FROM pg_matviews WHERE schemaname = 'public';
  RAISE NOTICE '✅ Created % regular views and % materialized views', regular_views, mat_views;
  RAISE NOTICE '📊 Materialized views provide pre-computed analytics for dashboard performance';
END $$;