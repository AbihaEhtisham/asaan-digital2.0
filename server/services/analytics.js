const { query } = require('../config/database');

/**
 * Analytics Service - Advanced analytics operations
 */
class AnalyticsService {
  
  /**
   * Get comprehensive platform analytics
   */
  async getPlatformAnalytics(days = 30) {
    const result = await query(`
      WITH stats AS (
        SELECT 
          COUNT(*) as total_queries,
          COUNT(DISTINCT session_id) as total_users,
          COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful_queries,
          AVG(response_time_ms) as avg_response_time,
          AVG(confidence_score) as avg_confidence
        FROM query_logs
        WHERE created_at > NOW() - INTERVAL '1 day' * $1
      ),
      top_tutorials AS (
        SELECT 
          t.id,
          t.title_english,
          COUNT(*) as view_count
        FROM query_logs ql
        JOIN tutorials t ON ql.matched_tutorial_id = t.id
        WHERE ql.created_at > NOW() - INTERVAL '1 day' * $1
        GROUP BY t.id, t.title_english
        ORDER BY view_count DESC
        LIMIT 5
      )
      SELECT 
        (SELECT row_to_json(stats) FROM stats) as metrics,
        (SELECT json_agg(top_tutorials) FROM top_tutorials) as popular_content
    `, [days]);
    
    return result.rows[0];
  }
  
  /**
   * Calculate user retention cohort
   */
  async getUserRetentionCohort(weeks = 12) {
    const result = await query(`
      WITH user_cohorts AS (
        SELECT 
          session_id,
          DATE_TRUNC('week', MIN(created_at)) as cohort_week
        FROM query_logs
        WHERE created_at > NOW() - INTERVAL '1 week' * $1
        GROUP BY session_id
      ),
      weekly_activity AS (
        SELECT 
          session_id,
          DATE_TRUNC('week', created_at) as activity_week
        FROM query_logs
        WHERE created_at > NOW() - INTERVAL '1 week' * $1
        GROUP BY session_id, DATE_TRUNC('week', created_at)
      ),
      cohort_data AS (
        SELECT 
          uc.cohort_week,
          wa.activity_week,
          COUNT(DISTINCT uc.session_id) as users
        FROM user_cohorts uc
        LEFT JOIN weekly_activity wa ON uc.session_id = wa.session_id
        GROUP BY uc.cohort_week, wa.activity_week
      )
      SELECT 
        cohort_week,
        activity_week,
        EXTRACT(WEEK FROM activity_week) - EXTRACT(WEEK FROM cohort_week) as week_number,
        users
      FROM cohort_data
      ORDER BY cohort_week, week_number
    `, [weeks]);
    
    return this.formatCohortData(result.rows);
  }
  
  /**
   * Format cohort data for visualization
   */
  formatCohortData(rows) {
    const cohorts = {};
    
    rows.forEach(row => {
      const cohortKey = row.cohort_week.toISOString().split('T')[0];
      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = {
          week: cohortKey,
          totalUsers: 0,
          retention: []
        };
      }
      
      if (row.week_number === 0) {
        cohorts[cohortKey].totalUsers = parseInt(row.users);
      }
      
      cohorts[cohortKey].retention.push({
        week: row.week_number,
        users: parseInt(row.users),
        rate: cohorts[cohortKey].totalUsers > 0 
          ? (row.users / cohorts[cohortKey].totalUsers * 100).toFixed(1)
          : 0
      });
    });
    
    return Object.values(cohorts);
  }
  
  /**
   * Get search quality metrics
   */
  async getSearchQualityMetrics(days = 7) {
    const result = await query(`
      SELECT 
        COUNT(*) as total_searches,
        COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as high_confidence_matches,
        COUNT(*) FILTER (WHERE query_status = 'LOW_CONFIDENCE') as low_confidence_matches,
        COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed_searches,
        ROUND(AVG(confidence_score)::numeric, 3) as avg_confidence,
        ROUND(AVG(response_time_ms)::numeric, 2) as avg_response_ms,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time
      FROM query_logs
      WHERE created_at > NOW() - INTERVAL '1 day' * $1
    `, [days]);
    
    const metrics = result.rows[0];
    
    return {
      ...metrics,
      success_rate: metrics.total_searches > 0
        ? ((metrics.high_confidence_matches / metrics.total_searches) * 100).toFixed(1)
        : 0
    };
  }
  
  /**
   * Get content gap analysis
   */
  async getContentGapAnalysis() {
    const result = await query(`
      SELECT 
        normalized_query,
        fail_count,
        unique_users,
        suggestions->>'suggested_category' as category,
        suggestions->>'priority' as priority
      FROM content_gaps_mv
      WHERE gap_rank <= 10
      ORDER BY fail_count DESC
    `);
    
    return result.rows;
  }
  
  /**
   * Get real-time analytics snapshot
   */
  async getRealtimeSnapshot() {
    const result = await query(`
      SELECT 
        -- Last 5 minutes
        (SELECT COUNT(*) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '5 minutes') as queries_last_5min,
        
        (SELECT COUNT(DISTINCT session_id) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '5 minutes') as active_users,
        
        -- Last hour
        (SELECT COUNT(*) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '1 hour') as queries_last_hour,
        
        -- Current response time
        (SELECT ROUND(AVG(response_time_ms)::numeric, 2) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '1 minute') as current_avg_response_ms,
        
        -- Success rate
        (SELECT ROUND(
          (COUNT(*) FILTER (WHERE query_status = 'SUCCESS')::numeric / NULLIF(COUNT(*), 0)) * 100, 1
        ) FROM query_logs WHERE created_at > NOW() - INTERVAL '5 minutes') as success_rate
    `);
    
    return result.rows[0];
  }
}

module.exports = new AnalyticsService();