const { query } = require('../config/database');

/**
 * Intent Model - Data access layer for intents
 */
class Intent {
  
  /**
   * Find all intents
   */
  static async findAll(filters = {}) {
    const { tutorial_id } = filters;
    let sql = 'SELECT * FROM intents';
    const params = [];
    
    if (tutorial_id) {
      sql += ' WHERE tutorial_id = $1';
      params.push(tutorial_id);
    }
    
    sql += ' ORDER BY popularity_score DESC';
    
    const result = await query(sql, params);
    return result.rows;
  }
  
  /**
   * Find intent by ID
   */
  static async findById(id) {
    const result = await query(
      'SELECT * FROM intents WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }
  
  /**
   * Create new intent
   */
  static async create(data) {
    const { tutorial_id, intent_name, description } = data;
    
    const result = await query(
      `INSERT INTO intents (tutorial_id, intent_name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tutorial_id, intent_name, description]
    );
    
    return result.rows[0];
  }
  
  /**
   * Update intent
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
      `UPDATE intents 
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    return result.rows[0];
  }
  
  /**
   * Delete intent
   */
  static async delete(id) {
    const result = await query(
      'DELETE FROM intents WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  /**
   * Get keywords for intent
   */
  static async getKeywords(intentId) {
    const result = await query(
      'SELECT * FROM keywords WHERE intent_id = $1',
      [intentId]
    );
    
    return result.rows;
  }
  
  /**
   * Get popularity stats
   */
  static async getPopularityStats(intentId) {
    const result = await query(
      `SELECT 
        popularity_score,
        success_count,
        fail_count,
        CASE 
          WHEN (success_count + fail_count) > 0 
          THEN ROUND((success_count::numeric / (success_count + fail_count)) * 100, 2)
          ELSE 0
        END as success_rate
       FROM intents
       WHERE id = $1`,
      [intentId]
    );
    
    return result.rows[0] || null;
  }
}

module.exports = Intent;