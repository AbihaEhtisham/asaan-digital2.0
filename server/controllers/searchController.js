const { query } = require('../config/database');
const { processUserQuery } = require('../services/queryEngine');
const { validateSearchQuery } = require('../utils/validators');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

/**
 * Main search handler
 * @route POST /api/search
 */
const handleSearch = async (req, res, next) => {
  try {
    const { query: searchQuery, userId } = req.body;
    const { sessionId, userIp, userAgent } = req;
    
    // Validate input
    const validation = validateSearchQuery(searchQuery);
    if (!validation.isValid) {
      return res.status(400).json(
        formatErrorResponse(validation.error, 400)
      );
    }
    
    // Process query using PL/pgSQL function
    const result = await processUserQuery(
      searchQuery.trim(),
      sessionId,
      userId,
      userIp,
      userAgent
    );
    
    // Format and send response
    if (result.status === 'success') {
      return res.json(
        formatSuccessResponse(result, 'Search completed successfully')
      );
    } else {
      return res.json(
        formatSuccessResponse(result, 'No exact match found', 200)
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get search suggestions (autocomplete)
 * @route GET /api/search/suggestions
 */
const getSuggestions = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
      return res.json(
        formatSuccessResponse([], 'No suggestions')
      );
    }
    
    const result = await query(`
      SELECT DISTINCT keyword
      FROM keywords
      WHERE keyword ILIKE $1
         OR keyword % $2
      ORDER BY 
        CASE 
          WHEN keyword ILIKE $1 || '%' THEN 1
          WHEN keyword ILIKE '%' || $1 || '%' THEN 2
          ELSE 3
        END,
        similarity(keyword, $2) DESC
      LIMIT $3
    `, [`${q}%`, q, limit]);
    
    const suggestions = result.rows.map(r => r.keyword);
    
    res.json(
      formatSuccessResponse(suggestions, 'Suggestions retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get trending searches
 * @route GET /api/search/trending
 */
const getTrending = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    const result = await query(
      'SELECT * FROM get_trending_topics($1)',
      [days]
    );
    
    res.json(
      formatSuccessResponse(result.rows, 'Trending topics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular keywords
 * @route GET /api/search/popular-keywords
 */
const getPopularKeywords = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT * FROM popular_keywords
      LIMIT 20
    `);
    
    res.json(
      formatSuccessResponse(result.rows, 'Popular keywords retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Voice search handler (same as text but with voice flag)
 * @route POST /api/search/voice
 */
const handleVoiceSearch = async (req, res, next) => {
  try {
    const { transcript, userId } = req.body;
    const { sessionId, userIp, userAgent } = req;
    
    if (!transcript || transcript.trim().length < 2) {
      return res.status(400).json(
        formatErrorResponse('Voice transcript too short', 400)
      );
    }
    
    // Add voice flag to query logs
    const result = await query(
      `SELECT process_user_query($1, $2, $3, $4, $5) as response`,
      [transcript.trim(), sessionId, userId, userIp, userAgent]
    );
    
    const response = result.rows[0].response;
    
    // Mark as voice query
    await query(
      `UPDATE query_logs 
       SET metadata = jsonb_set(COALESCE(metadata, '{}'), '{voice_query}', 'true')
       WHERE session_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [sessionId]
    );
    
    res.json(
      formatSuccessResponse(response, 'Voice search processed')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get search history for a session
 * @route GET /api/search/history/:sessionId
 */
const getSearchHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await query(`
      SELECT 
        id,
        query_text,
        matched_tutorial_id,
        confidence_score,
        query_status,
        created_at
      FROM query_logs
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [sessionId, limit]);
    
    res.json(
      formatSuccessResponse(result.rows, 'Search history retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get search analytics for a query
 * @route GET /api/search/analytics/:query
 */
const getQueryAnalytics = async (req, res, next) => {
  try {
    const { query: searchQuery } = req.params;
    
    const result = await query(`
      SELECT 
        COUNT(*) as total_searches,
        COUNT(*) FILTER (WHERE query_status = 'SUCCESS') as successful,
        COUNT(*) FILTER (WHERE query_status = 'FAILED') as failed,
        AVG(confidence_score) as avg_confidence,
        AVG(response_time_ms)::INT as avg_response_ms,
        MAX(created_at) as last_searched
      FROM query_logs
      WHERE query_text ILIKE $1
    `, [`%${searchQuery}%`]);
    
    res.json(
      formatSuccessResponse(result.rows[0], 'Query analytics retrieved')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleSearch,
  getSuggestions,
  getTrending,
  getPopularKeywords,
  handleVoiceSearch,
  getSearchHistory,
  getQueryAnalytics
};