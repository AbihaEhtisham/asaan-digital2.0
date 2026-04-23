const { query } = require('../config/database');

/**
 * Keyword Model - Data access layer for keywords
 */
class Keyword {
  
  /**
   * Find all keywords
   */
  static async findAll(filters = {}) {
    const { intent_id, language } = filters;
    const conditions = [];
    const params = [];
    let paramIndex = 1;
    
    if (intent_id) {
      conditions.push(`intent_id = $${paramIndex}`);
      params.push(intent_id);
      paramIndex++;
    }
    
    if (language) {
      conditions.push(`language = $${paramIndex}`);
      params.push(language);
      paramIndex++;
    }
    
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    const result = await query(
      `SELECT * FROM keywords ${whereClause} ORDER BY weight DESC`,
      params
    );
    
    return result.rows;
  }
  
  /**
   * Find keyword by ID
   */
  static async findById(id) {
    const result = await query(
      'SELECT * FROM keywords WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }
  
  /**
   * Create new keyword
   */
  static async create(data) {
    const { intent_id, keyword, language, weight = 1.0 } = data;
    
    const result = await query(
      `INSERT INTO keywords (intent_id, keyword, language, weight)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [intent_id, keyword, language, weight]
    );
    
    return result.rows[0];
  }
  
  /**
   * Bulk create keywords
   */
  static async bulkCreate(intentId, keywords) {
    const values = [];
    const params = [intentId];
    let paramIndex = 2;
    
    keywords.forEach((kw, index) => {
      values.push(`($1, $${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2})`);
      params.push(kw.text, kw.language, kw.weight || 1.0);
      paramIndex += 3;
    });
    
    const result = await query(
      `INSERT INTO keywords (intent_id, keyword, language, weight)
       VALUES ${values.join(', ')}
       ON CONFLICT DO NOTHING
       RETURNING id`,
      params
    );
    
    return result.rowCount;
  }
  
  /**
   * Update keyword
   */
  static async update(id, data) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });
    
    if (fields.length === 0) return null;
    
    values.push(id);
    
    const result = await query(
      `UPDATE keywords 
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    return result.rows[0];
  }
  
  /**
   * Delete keyword
   */
  static async delete(id) {
    const result = await query(
      'DELETE FROM keywords WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  /**
   * Search keywords
   */
  static async search(query, limit = 10) {
    const result = await query(
      `SELECT DISTINCT keyword
       FROM keywords
       WHERE keyword ILIKE $1 OR keyword % $2
       ORDER BY similarity(keyword, $2) DESC
       LIMIT $3`,
      [`%${query}%`, query, limit]
    );
    
    return result.rows.map(r => r.keyword);
  }
}

module.exports = Keyword;