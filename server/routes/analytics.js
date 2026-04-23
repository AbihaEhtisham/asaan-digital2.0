const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get query analytics by time period
router.get('/queries', async (req, res, next) => {
  try {
    const { 
      period = 'day',  // hour, day, week, month
      from_date,
      to_date 
    } = req.query;
    
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
        AVG(response_time_ms)::INT as avg_response_time,
        AVG(confidence_score)::FLOAT as avg_confidence,
        COUNT(DISTINCT session_id) as unique_users
      FROM query_logs
      WHERE created_at BETWEEN COALESCE($2, NOW() - INTERVAL '30 days') AND COALESCE($3, NOW())
      GROUP BY DATE_TRUNC($1, created_at)
      ORDER BY time_period DESC
    `, [dateTrunc, from_date, to_date]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get tutorial performance analytics
router.get('/tutorials', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT * FROM tutorial_analytics_mv
      ORDER BY popularity_rank
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get category performance
router.get('/categories', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        c.id,
        c.name_english,
        c.name_urdu,
        COUNT(DISTINCT t.id) as tutorial_count,
        COALESCE(SUM(ql.search_count), 0) as total_searches,
        ROUND(AVG(ql.avg_confidence)::numeric, 2) as avg_confidence
      FROM categories c
      LEFT JOIN tutorials t ON c.id = t.category_id AND t.is_published = true
      LEFT JOIN (
        SELECT 
          matched_tutorial_id,
          COUNT(*) as search_count,
          AVG(confidence_score) as avg_confidence
        FROM query_logs
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY matched_tutorial_id
      ) ql ON t.id = ql.matched_tutorial_id
      WHERE c.is_active = true
      GROUP BY c.id, c.name_english, c.name_urdu
      ORDER BY total_searches DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get user behavior analytics
router.get('/users', async (req, res, next) => {
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
      )
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        ROUND(AVG(queries_per_session), 1) as avg_queries_per_session,
        ROUND(AVG(session_duration_seconds), 0) as avg_session_duration_seconds,
        ROUND(AVG(successful_queries::numeric / NULLIF(queries_per_session, 0)) * 100, 1) as avg_success_rate,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY queries_per_session) as median_queries,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY queries_per_session) as p95_queries
      FROM user_sessions
    `);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get time-based heatmap data
router.get('/heatmap', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        EXTRACT(DOW FROM created_at) as day_of_week,
        EXTRACT(HOUR FROM created_at) as hour_of_day,
        COUNT(*) as query_count
      FROM query_logs
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY EXTRACT(DOW FROM created_at), EXTRACT(HOUR FROM created_at)
      ORDER BY day_of_week, hour_of_day
    `);
    
    // Transform into 2D array for heatmap
    const heatmap = Array(7).fill(null).map(() => Array(24).fill(0));
    
    result.rows.forEach(row => {
      heatmap[parseInt(row.day_of_week)][parseInt(row.hour_of_day)] = parseInt(row.query_count);
    });
    
    res.json({
      success: true,
      data: {
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        hours: Array.from({ length: 24 }, (_, i) => i),
        heatmap
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get top search terms
router.get('/top-searches', async (req, res, next) => {
  try {
    const { limit = 20, days = 7 } = req.query;
    
    const result = await query(`
      SELECT 
        LOWER(TRIM(query_text)) as search_term,
        COUNT(*) as search_count,
        COUNT(CASE WHEN query_status = 'SUCCESS' THEN 1 END) as successful_searches,
        COUNT(DISTINCT session_id) as unique_users,
        AVG(response_time_ms)::INT as avg_response_time
      FROM query_logs
      WHERE created_at > NOW() - INTERVAL '1 day' * $2
      GROUP BY LOWER(TRIM(query_text))
      ORDER BY search_count DESC
      LIMIT $1
    `, [limit, days]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get performance metrics
router.get('/performance', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_ms) as p50_response_time,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
        PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time,
        AVG(response_time_ms)::INT as avg_response_time,
        MAX(response_time_ms) as max_response_time,
        COUNT(*) FILTER (WHERE response_time_ms > 1000) as slow_queries,
        COUNT(*) as total_queries
      FROM query_logs
      WHERE created_at > NOW() - INTERVAL '1 hour'
    `);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get content coverage stats
router.get('/coverage', async (req, res, next) => {
  try {
    const result = await query(`
      WITH category_coverage AS (
        SELECT 
          c.id,
          c.name_english,
          COUNT(DISTINCT t.id) as tutorial_count,
          COUNT(DISTINCT i.id) as intent_count,
          COUNT(DISTINCT k.id) as keyword_count
        FROM categories c
        LEFT JOIN tutorials t ON c.id = t.category_id AND t.is_published = true
        LEFT JOIN intents i ON t.id = i.tutorial_id
        LEFT JOIN keywords k ON i.id = k.intent_id
        WHERE c.is_active = true
        GROUP BY c.id, c.name_english
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
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Export analytics data (for reports)
router.get('/export', async (req, res, next) => {
  try {
    const { format = 'json', from_date, to_date } = req.query;
    
    const result = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_queries,
        COUNT(CASE WHEN query_status = 'SUCCESS' THEN 1 END) as successful,
        COUNT(CASE WHEN query_status = 'FAILED' THEN 1 END) as failed,
        AVG(response_time_ms)::INT as avg_response_ms,
        COUNT(DISTINCT session_id) as unique_users
      FROM query_logs
      WHERE created_at BETWEEN COALESCE($1, NOW() - INTERVAL '30 days') AND COALESCE($2, NOW())
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [from_date, to_date]);
    
    if (format === 'csv') {
      // Convert to CSV
      const csv = [
        Object.keys(result.rows[0]).join(','),
        ...result.rows.map(row => Object.values(row).join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      return res.send(csv);
    }
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;