-- ============================================
-- ASAAN DIGITAL - OLAP ANALYTICS QUERIES
-- ADBMS Project - Spring 2026
-- ============================================

-- 1. ROLLUP: Query counts by category and language
SELECT 
  c.name_english as category,
  k.language,
  COUNT(ql.id) as total_queries
FROM query_logs ql
JOIN intents i ON ql.matched_intent_id = i.id
JOIN tutorials t ON i.tutorial_id = t.id
JOIN categories c ON t.category_id = c.id
JOIN keywords k ON k.intent_id = i.id
GROUP BY ROLLUP(c.name_english, k.language)
ORDER BY category, language;

-- 2. CUBE: Multi-dimensional search analysis
SELECT 
  DATE_TRUNC('week', ql.created_at) as week,
  c.name_english as category,
  ql.query_status,
  COUNT(*) as query_count,
  ROUND(AVG(ql.confidence_score)::numeric, 2) as avg_confidence
FROM query_logs ql
LEFT JOIN intents i ON ql.matched_intent_id = i.id
LEFT JOIN tutorials t ON i.tutorial_id = t.id
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY CUBE(DATE_TRUNC('week', ql.created_at), c.name_english, ql.query_status)
ORDER BY week DESC NULLS LAST, category NULLS LAST;

-- 3. WINDOW FUNCTION: Tutorial ranking with moving average
SELECT 
  title_english,
  category_name,
  total_searches_7d,
  RANK() OVER (PARTITION BY category_name ORDER BY total_searches_7d DESC) as rank_in_category,
  ROUND(AVG(total_searches_7d) OVER (
    PARTITION BY category_name
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ), 2) as moving_avg_searches
FROM tutorial_analytics_mv;

-- 4. WINDOW FUNCTION: Response time percentiles per day
SELECT 
  stat_date,
  total_queries,
  avg_response_ms,
  p50_response_ms,
  p95_response_ms,
  p99_response_ms,
  ROUND(successful_queries::numeric / NULLIF(total_queries, 0) * 100, 1) as success_rate_pct
FROM daily_platform_stats_mv
ORDER BY stat_date DESC;

-- 5. COHORT ANALYSIS: User retention by week
WITH cohorts AS (
  SELECT 
    session_id,
    DATE_TRUNC('week', MIN(created_at)) as cohort_week,
    DATE_TRUNC('week', created_at) as activity_week
  FROM query_logs
  GROUP BY session_id, DATE_TRUNC('week', created_at)
)
SELECT 
  cohort_week,
  activity_week,
  COUNT(DISTINCT session_id) as users,
  ROUND(
    COUNT(DISTINCT session_id)::numeric / 
    FIRST_VALUE(COUNT(DISTINCT session_id)) OVER (
      PARTITION BY cohort_week ORDER BY activity_week
    ) * 100, 1
  ) as retention_pct
FROM cohorts
GROUP BY cohort_week, activity_week
ORDER BY cohort_week, activity_week;

-- 6. STAR SCHEMA QUERY: Full dimensional analysis
SELECT 
  DATE_TRUNC('day', ql.created_at) as date_dim,
  c.name_english as category_dim,
  k.language as language_dim,
  ql.query_status as status_dim,
  COUNT(*) as fact_query_count,
  AVG(ql.confidence_score) as fact_avg_confidence,
  AVG(ql.response_time_ms) as fact_avg_response_ms
FROM query_logs ql
LEFT JOIN intents i ON ql.matched_intent_id = i.id
LEFT JOIN tutorials t ON i.tutorial_id = t.id
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN keywords k ON k.intent_id = i.id
GROUP BY 1, 2, 3, 4
ORDER BY date_dim DESC, fact_query_count DESC;