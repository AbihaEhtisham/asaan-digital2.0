const { query } = require('../config/database');

const processUserQuery = async (searchQuery, sessionId, userId, userIp, userAgent) => {
  try {
    const result = await query(
      'SELECT process_user_query($1, $2, $3, $4, $5) as response',
      [searchQuery, sessionId, userId, userIp, userAgent]
    );
    
    const response = result.rows[0].response;
    
    return {
      success: true,
      ...response
    };
  } catch (error) {
    console.error('Query processing error:', error);
    throw new Error('Failed to process search query');
  }
};

const getSearchSuggestions = async (partialQuery, limit = 10) => {
  try {
    const result = await query(`
      SELECT DISTINCT keyword
      FROM keywords
      WHERE keyword ILIKE $1
         OR keyword % $2
      ORDER BY similarity(keyword, $2) DESC
      LIMIT $3
    `, [`%${partialQuery}%`, partialQuery, limit]);
    
    return result.rows.map(r => r.keyword);
  } catch (error) {
    console.error('Suggestion error:', error);
    return [];
  }
};

module.exports = {
  processUserQuery,
  getSearchSuggestions
};