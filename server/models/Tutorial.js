const { query } = require('../config/database');

/**
 * Tutorial Model - Data access layer for tutorials
 */
class Tutorial {
  
  /**
   * Find all tutorials with filters
   */
  static async findAll(filters = {}, pagination = {}) {
    const { category, difficulty, search, isPublished = true } = filters;
    const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = pagination;
    
    const offset = (page - 1) * limit;
    const params = [];
    let whereConditions = ['is_published = $1'];
    params.push(isPublished);
    let paramIndex = 2;
    
    if (category) {
      whereConditions.push(`category_id = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    
    if (difficulty) {
      whereConditions.push(`difficulty_level = $${paramIndex}`);
      params.push(difficulty);
      paramIndex++;
    }
    
    if (search) {
      whereConditions.push(`search_vector @@ plainto_tsquery('simple', $${paramIndex})`);
      params.push(search);
      paramIndex++;
    }
    
    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    
    const result = await query(
      `SELECT * FROM tutorials ${whereClause}
       ORDER BY ${sort} ${order}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );
    
    return result.rows;
  }
  
  /**
   * Find tutorial by ID
   */
  static async findById(id) {
    const result = await query(
      'SELECT * FROM tutorials WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  }
  
  /**
   * Find tutorial with full details
   */
  static async findByIdWithDetails(id) {
    const result = await query(
      'SELECT get_tutorial_with_steps($1) as tutorial',
      [id]
    );
    
    return result.rows[0]?.tutorial || null;
  }
  
  /**
   * Create new tutorial
   */
  static async create(data) {
    const { 
      title_english, title_urdu, description_english, description_urdu,
      category_id, difficulty_level, estimated_time_minutes, metadata = {}
    } = data;
    
    const result = await query(
      `INSERT INTO tutorials 
        (title_english, title_urdu, description_english, description_urdu,
         category_id, difficulty_level, estimated_time_minutes, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title_english, title_urdu, description_english, description_urdu,
       category_id, difficulty_level, estimated_time_minutes, JSON.stringify(metadata)]
    );
    
    return result.rows[0];
  }
  
  /**
   * Update tutorial
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
      `UPDATE tutorials 
       SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    return result.rows[0];
  }
  
  /**
   * Delete tutorial (soft delete)
   */
  static async delete(id) {
    const result = await query(
      `UPDATE tutorials 
       SET is_published = false, updated_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    
    return result.rowCount > 0;
  }
  
  /**
   * Get tutorial steps
   */
  static async getSteps(tutorialId) {
    const result = await query(
      `SELECT * FROM tutorial_steps 
       WHERE tutorial_id = $1 
       ORDER BY step_number`,
      [tutorialId]
    );
    
    return result.rows;
  }
  
  /**
   * Increment view count
   */
  static async incrementViews(id) {
    await query(
      `UPDATE tutorials 
       SET metadata = jsonb_set(
         COALESCE(metadata, '{}'),
         '{views}',
         to_jsonb(COALESCE((metadata->>'views')::int, 0) + 1)
       )
       WHERE id = $1`,
      [id]
    );
  }
}

module.exports = Tutorial;