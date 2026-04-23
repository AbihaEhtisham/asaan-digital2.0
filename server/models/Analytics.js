const { query } = require('../config/database');

/**
 * Analytics Model - Data access layer for analytics data
 */
class Analytics {
  
  /**
   * Get daily stats
   */
  static async getDailyStats(days = 30) {
    const result = await query(
      `SELECT * FROM daily_platform_stats_mv
       WHERE stat_date > CURRENT_DATE - INTERVAL '1 day' * $1
       ORDER BY stat_date DESC`,
      [days]
    );
    
    return result.rows;
  }
  
  /**
   * Get tutorial analytics
   */
  static async getTutorialAnalytics() {
    const result = await query(
      `SELECT * FROM tutorial_analytics_mv
       ORDER BY popularity_rank_7d`
    );
    
    return result.rows;
  }
  
  /**
   * Get category analytics
   */
  static async getCategoryAnalytics() {
    const result = await query(
      'SELECT * FROM category_performance'
    );
    
    return result.rows;
  }
  
  /**
   * Get traffic heatmap
   */
  static async getTrafficHeatmap() {
    const result = await query(
      `SELECT * FROM traffic_heatmap_mv
       ORDER BY day_of_week, hour_of_day`
    );
    
    return result.rows;
  }
  
  /**
   * Get keyword effectiveness
   */
  static async getKeywordEffectiveness(limit = 50) {
    const result = await query(
      `SELECT * FROM keyword_effectiveness_mv
       ORDER BY effectiveness_score DESC
       LIMIT $1`,
      [limit]
    );
    
    return result.rows;
  }
  
  /**
   * Get content gaps
   */
  static async getContentGaps(minFailures = 3) {
    const result = await query(
      'SELECT * FROM get_content_gaps($1)',
      [minFailures]
    );
    
    return result.rows;
  }
  
  /**
   * Get real-time metrics
   */
  static async getRealtimeMetrics() {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM query_logs WHERE created_at > NOW() - INTERVAL '5 minutes') as queries_5min,
        (SELECT COUNT(DISTINCT session_id) FROM query_logs WHERE created_at > NOW() - INTERVAL '5 minutes') as users_5min,
        (SELECT ROUND(AVG(response_time_ms)::numeric, 2) FROM query_logs WHERE created_at > NOW() - INTERVAL '1 minute') as avg_response_ms,
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections
    `);
    
    return result.rows[0];
  }
  
  /**
   * Get summary metrics for dashboard
   */
  static async getDashboardSummary() {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM tutorials WHERE is_published = true) as total_tutorials,
        (SELECT COUNT(*) FROM intents) as total_intents,
        (SELECT COUNT(*) FROM keywords) as total_keywords,
        (SELECT COUNT(DISTINCT session_id) FROM query_logs WHERE created_at > NOW() - INTERVAL '24 hours') as active_users_24h,
        (SELECT COUNT(*) FROM query_logs WHERE created_at > NOW() - INTERVAL '24 hours') as queries_24h,
        (SELECT COUNT(*) FROM content_gaps_mv) as content_gaps
    `);
    
    return result.rows[0];
  }
}

module.exports = Analytics;