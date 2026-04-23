const { query } = require('../config/database');
const { QUERY_STATUS } = require('../config/constants');

/**
 * QueryLog Model - Data access layer for query logs
 */
class QueryLog {
  
  /**
   * Create query log entry
   */
  static async create(data) {
    const {
      session_id,
      user_id = null,
      query_text,
      matched_intent_id = null,
      matched_tutorial_id = null,
      confidence_score = null,
      query_status = QUERY_STATUS.SUCCESS,
      failure_reason = null,
      response_time_ms = null,
      user_ip = null,
      user_agent = null
    } = data;
    
    const result = await query(
      `INSERT INTO query_logs 
        (session_id, user_id, query_text, matched_intent_id, matched_tutorial_id,
         confidence_score, query_status, failure_reason, response_time_ms, user_ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [session_id, user_id, query_text, matched_intent_id, matched_tutorial_id,
       confidence_score, query_status, failure_reason, response_time_ms, user_ip, user_agent]
    );
    
    return result.rows[0];
  }
  
  /**
   * Find recent queries
   */
  static async findRecent(limit = 50, filters = {}) {
    const { session_id, query_status } = filters;
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (session_id) {
      conditions.push(`session_id = $${paramIndex}`);
      params.push(session_id);
      paramIndex++;
    }
    
    if (query_status) {
      conditions.push(`query_status = $${paramIndex}`);
      params.push(query_status);
      paramIndex++;
    }
    
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    params.push(limit);
    
    const result = await query(
      `SELECT * FROM query_logs 
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${paramIndex}`,
      params
    );
    
    return result.rows;
  }
  
  /**
   * Get query statistics
   */
  static async getStats(days = 7) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_queries,
        COUNT(*) FILTER (WHERE query_status = $1) as successful_queries,
        COUNT(*) FILTER (WHERE query_status = $2) as failed_queries,
        COUNT(DISTINCT session_id) as unique_users,
        AVG(response_time_ms)::INT as avg_response_time,
        AVG(confidence_score)::FLOAT as avg_confidence
       FROM query_logs
       WHERE created_at > NOW() - INTERVAL '1 day' * $3`,
      [QUERY_STATUS.SUCCESS, QUERY_STATUS.FAILED, days]
    );
    
    return result.rows[0];
  }
  
  /**
   * Get failed queries for analysis
   */
  static async getFailedQueries(days = 7, limit = 50) {
    const result = await query(
      `SELECT 
        query_text,
        COUNT(*) as fail_count,
        MAX(created_at) as last_attempt
       FROM query_logs
       WHERE query_status = $1
         AND created_at > NOW() - INTERVAL '1 day' * $2
       GROUP BY query_text
       ORDER BY fail_count DESC
       LIMIT $3`,
      [QUERY_STATUS.FAILED, days, limit]
    );
    
    return result.rows;
  }
}

module.exports = QueryLog;