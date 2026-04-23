const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { processUserQuery } = require('../services/queryEngine');

// Main search endpoint
router.post('/', async (req, res, next) => {
  try {
    const { query: searchQuery, userId } = req.body;
    const { sessionId, userIp, userAgent } = req;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }
    
    const result = await processUserQuery(
      searchQuery.trim(),
      sessionId,
      userId,
      userIp,
      userAgent
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get search suggestions (for autocomplete)
router.get('/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
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
      LIMIT 10
    `, [`${q}%`, q]);
    
    res.json({
      success: true,
      data: result.rows.map(r => r.keyword)
    });
  } catch (error) {
    next(error);
  }
});

// Get trending searches
router.get('/trending', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    
    const result = await query(
      'SELECT * FROM get_trending_topics($1)',
      [days]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get popular keywords
router.get('/popular-keywords', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        keyword,
        COUNT(*) as search_count
      FROM query_logs ql
      JOIN keywords k ON k.id = (
        SELECT id FROM keywords 
        WHERE intent_id = ql.matched_intent_id 
        LIMIT 1
      )
      WHERE ql.created_at > CURRENT_DATE - INTERVAL '7 days'
      GROUP BY keyword
      ORDER BY search_count DESC
      LIMIT 10
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;