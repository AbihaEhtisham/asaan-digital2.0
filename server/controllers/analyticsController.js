const { query } = require('../config/database');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

/**
 * Get query analytics by time period
 * @route GET /api/analytics/queries
 */
const getQueryAnalytics = async (req, res, next) => {
  try {
    const { period = 'day', from_date, to_date, limit = 30 } = req.query;
    
    let dateTrunc;
    switch(period) {
      case 'hour': dateTrunc = 'hour'; break;
      case 'day': dateTrunc = 'day'; break;
      case 'week': dateTrunc = 'week'; break;
      case 'month': dateTrunc = 'month'; break;
      default: dateTrunc = 'day';
    }
    
    const result = await query(`
      SELECT 
        DATE_TRUNC($1, created_at) as time_period,
        COUNT(*) as total_queries,
        COUNT(CASE WHEN query_status = 'SUCCESS' THEN 1 END) as successful_queries,
        COUNT(CASE WHEN query_status = 'FAILED' THEN 1 END) as failed_queries,
        COUNT(CASE WHEN query_status = 'LOW_CONFIDENCE' THEN 1 END) as low_confidence_queries,
        ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_time,
        ROUND(AVG(confidence_score)::numeric, 3) as avg_confidence,
        COUNT(DISTINCT session_id) as unique_users,
        COUNT(DISTINCT matched_tutorial_id) as unique_tutorials
      FROM query_logs
      WHERE created_at BETWEEN COALESCE($2::timestamp, NOW() - INTERVAL '30 days') 
        AND COALESCE($3::timestamp, NOW())
      GROUP BY DATE_TRUNC($1, created_at)
      ORDER BY time_period DESC
      LIMIT $4
    `, [dateTrunc, from_date, to_date, limit]);
    
    res.json(
      formatSuccessResponse(result.rows, 'Query analytics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get tutorial performance
 * @route GET /api/analytics/tutorials
 */
const getTutorialPerformance = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT * FROM tutorial_analytics_mv
      ORDER BY popularity_rank_7d
    `);
    
    res.json(
      formatSuccessResponse(result.rows, 'Tutorial performance retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get category performance
 * @route GET /api/analytics/categories
 */
const getCategoryPerformance = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT * FROM category_performance
    `);
    
    res.json(
      formatSuccessResponse(result.rows, 'Category performance retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user behavior analytics
 * @route GET /api/analytics/users
 */
const getUserAnalytics = async (req, res, next) => {
  try {
    const result = await query(`
      WITH user_sessions AS (
        SELECT 
          session_id,
          MIN(created_at) as session_start,
          MAX(created_at) as session_end,
          COUNT(*) as queries_per_session,
          COUNT(CASE WHEN query_status = 'SUCCESS' THEN 1 END) as successful_queries,
          EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as session_duration_seconds
        FROM query_logs
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY session_id
        HAVING COUNT(*) >= 2
      )
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        ROUND(AVG(queries_per_session), 1) as avg_queries_per_session,
        ROUND(AVG(session_duration_seconds), 0) as avg_session_duration_seconds,
        ROUND(AVG(successful_queries::numeric / NULLIF(queries_per_session, 0)) * 100, 1) as avg_success_rate,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY queries_per_session) as median_queries,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY queries_per_session) as p95_queries,
        MAX(queries_per_session) as max_queries_per_session
      FROM user_sessions
    `);
    
    res.json(
      formatSuccessResponse(result.rows[0], 'User analytics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get traffic heatmap data
 * @route GET /api/analytics/heatmap
 */
const getTrafficHeatmap = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT * FROM traffic_heatmap_mv
      ORDER BY day_of_week, hour_of_day
    `);
    
    // Transform into 2D array for frontend
    const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
    const uniqueUsers = Array(7).fill(null).map(() => Array(24).fill(0));
    
    result.rows.forEach(row => {
      const day = parseInt(row.day_of_week);
      const hour = parseInt(row.hour_of_day);
      heatmap[day][hour] = parseInt(row.query_count);
      uniqueUsers[day][hour] = parseInt(row.unique_users);
    });
    
    res.json(
      formatSuccessResponse({
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hours: Array.from({ length: 24 }, (_, i) => i),
        heatmap,
        uniqueUsers,
        raw: result.rows
      }, 'Traffic heatmap retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get top search terms
 * @route GET /api/analytics/top-searches
 */
const getTopSearches = async (req, res, next) => {
  try {
    const { limit = 20, days = 7 } = req.query;
    
    const result = await query(`
      SELECT 
        LOWER(TRIM(query_text)) as search_term,
        COUNT(*) as search_count,
        COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful_searches,
        COUNT(DISTINCT session_id) as unique_users,
        ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_time
      FROM query_logs
      WHERE created_at > NOW() - INTERVAL '1 day' * $2
        AND query_text IS NOT NULL
        AND TRIM(query_text) != ''
      GROUP BY LOWER(TRIM(query_text))
      ORDER BY search_count DESC
      LIMIT $1
    `, [limit, days]);
    
    res.json(
      formatSuccessResponse(result.rows, 'Top searches retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get performance metrics
 * @route GET /api/analytics/performance
 */
const getPerformanceMetrics = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_ms) as p50_response_time,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time,
        ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_time,
        MAX(response_time_ms) as max_response_time,
        MIN(response_time_ms) as min_response_time,
        COUNT(*) FILTER (WHERE response_time_ms > 1000) as slow_queries,
        COUNT(*) as total_queries
      FROM query_logs
      WHERE created_at > NOW() - INTERVAL '1 hour'
    `);
    
    res.json(
      formatSuccessResponse(result.rows[0], 'Performance metrics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get content coverage stats
 * @route GET /api/analytics/coverage
 */
const getContentCoverage = async (req, res, next) => {
  try {
    const result = await query(`
      WITH category_coverage AS (
        SELECT 
          c.id,
          c.name_english,
          c.name_urdu,
          COUNT(DISTINCT t.id) as tutorial_count,
          COUNT(DISTINCT i.id) as intent_count,
          COUNT(DISTINCT k.id) as keyword_count
        FROM categories c
        LEFT JOIN tutorials t ON c.id = t.category_id AND t.is_published = true
        LEFT JOIN intents i ON t.id = i.tutorial_id
        LEFT JOIN keywords k ON i.id = k.intent_id
        WHERE c.is_active = true
        GROUP BY c.id, c.name_english, c.name_urdu
      )
      SELECT 
        *,
        ROUND(
          (tutorial_count::numeric / NULLIF(SUM(tutorial_count) OVER (), 0)) * 100, 
          1
        ) as tutorial_percentage
      FROM category_coverage
      ORDER BY tutorial_count DESC
    `);
    
    res.json(
      formatSuccessResponse(result.rows, 'Content coverage retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily platform stats
 * @route GET /api/analytics/daily-stats
 */
const getDailyStats = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    const result = await query(`
      SELECT * FROM daily_platform_stats_mv
      WHERE stat_date > CURRENT_DATE - INTERVAL '1 day' * $1
      ORDER BY stat_date DESC
    `, [days]);
    
    res.json(
      formatSuccessResponse(result.rows, 'Daily stats retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Export analytics data
 * @route GET /api/analytics/export
 */
const exportAnalytics = async (req, res, next) => {
  try {
    const { format = 'json', from_date, to_date } = req.query;
    
    const result = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_queries,
        COUNT(CASE WHEN query_status = 'SUCCESS' THEN 1 END) as successful,
        COUNT(CASE WHEN query_status = 'FAILED' THEN 1 END) as failed,
        ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms,
        COUNT(DISTINCT session_id) as unique_users
      FROM query_logs
      WHERE created_at BETWEEN COALESCE($1::timestamp, NOW() - INTERVAL '30 days') 
        AND COALESCE($2::timestamp, NOW())
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [from_date, to_date]);
    
    if (format === 'csv') {
      const csv = [
        Object.keys(result.rows[0] || {}).join(','),
        ...result.rows.map(row => Object.values(row).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics_${Date.now()}.csv`);
      return res.send(csv);
    }
    
    res.json(
      formatSuccessResponse(result.rows, 'Analytics exported')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQueryAnalytics,
  getTutorialPerformance,
  getCategoryPerformance,
  getUserAnalytics,
  getTrafficHeatmap,
  getTopSearches,
  getPerformanceMetrics,
  getContentCoverage,
  getDailyStats,
  exportAnalytics
};