const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/database');

// Get all tutorials with filters
router.get('/', async (req, res, next) => {
  try {
    const { 
      category, 
      difficulty, 
      search, 
      page = 1, 
      limit = 12 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const params = [];
    let whereConditions = ['is_published = true'];
    let paramIndex = 1;
    
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
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM tutorials ${whereClause}`,
      params
    );
    
    // Get tutorials
    const result = await query(
      `SELECT 
        t.id,
        t.title_english,
        t.title_urdu,
        t.description_english,
        t.description_urdu,
        t.difficulty_level,
        t.estimated_time_minutes,
        t.metadata,
        c.name_english as category_name,
        c.name_urdu as category_name_urdu,
        (SELECT COUNT(*) FROM tutorial_steps WHERE tutorial_id = t.id) as step_count,
        (SELECT COUNT(*) FROM query_logs WHERE matched_tutorial_id = t.id) as search_count
      FROM tutorials t
      LEFT JOIN categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single tutorial with full details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      'SELECT get_tutorial_with_steps($1) as tutorial',
      [id]
    );
    
    if (!result.rows[0].tutorial) {
      return res.status(404).json({
        success: false,
        error: 'Tutorial not found'
      });
    }
    
    // Log view 
    await query(
      `UPDATE tutorials 
       SET metadata = metadata || jsonb_build_object( 'views',
         COALESCE((metadata->>'views')::int, 0) + 1)
       WHERE id = $1`,
      [id]
    );
    
    res.json({
      success: true,
      data: result.rows[0].tutorial
    });
  } catch (error) {
    next(error);
  }
});

// Get tutorial steps only
router.get('/:id/steps', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT 
        step_number,
        instruction_urdu,
        instruction_english,
        image_url,
        audio_url
      FROM tutorial_steps
      WHERE tutorial_id = $1
      ORDER BY step_number`,
      [id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get tutorial prerequisites
router.get('/:id/prerequisites', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `WITH RECURSIVE prereq_tree AS (
        -- Base: Get direct prerequisites
        SELECT 
          td.prerequisite_id as id,
          1 as depth,
          ARRAY[td.tutorial_id] as path
        FROM tutorial_dependencies td
        WHERE td.tutorial_id = $1
        
        UNION ALL
        
        -- Recursive: Get prerequisites of prerequisites
        SELECT 
          td.prerequisite_id,
          pt.depth + 1,
          pt.path || td.tutorial_id
        FROM tutorial_dependencies td
        JOIN prereq_tree pt ON td.tutorial_id = pt.id
        WHERE NOT td.prerequisite_id = ANY(pt.path)  -- Prevent cycles
      )
      SELECT DISTINCT
        t.id,
        t.title_urdu,
        t.title_english,
        t.difficulty_level,
        t.estimated_time_minutes,
        pt.depth as prerequisite_level
      FROM prereq_tree pt
      JOIN tutorials t ON pt.id = t.id
      WHERE t.is_published = true
      ORDER BY pt.depth DESC`,
      [id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get related tutorials
router.get('/:id/related', async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;
    
    const result = await query(
      `SELECT 
        t2.id,
        t2.title_urdu,
        t2.title_english,
        t2.description_english,
        t2.difficulty_level,
        t2.estimated_time_minutes,
        c.name_english as category_name
      FROM tutorials t1
      JOIN tutorials t2 ON t1.category_id = t2.category_id
      LEFT JOIN categories c ON t2.category_id = c.id
      WHERE t1.id = $1
        AND t2.id != $1
        AND t2.is_published = true
      ORDER BY 
        t2.difficulty_level = t1.difficulty_level DESC,
        RANDOM()
      LIMIT $2`,
      [id, limit]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Update user progress
router.post('/:id/progress', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, currentStep, completed } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    const result = await query(
      `INSERT INTO user_progress 
        (user_id, tutorial_id, current_step, completed_steps, is_completed, last_accessed)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (user_id, tutorial_id) 
       DO UPDATE SET
         current_step = EXCLUDED.current_step,
         completed_steps = EXCLUDED.completed_steps,
         is_completed = EXCLUDED.is_completed,
         last_accessed = NOW()
       RETURNING *`,
      [userId, id, currentStep || 1, completed ? [currentStep] : [], completed || false]
    );
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get user progress for tutorial
router.get('/:id/progress/:userId', async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    
    const result = await query(
      `SELECT 
        current_step,
        completed_steps,
        is_completed,
        started_at,
        last_accessed,
        EXTRACT(EPOCH FROM (last_accessed - started_at)) as time_spent_seconds
      FROM user_progress
      WHERE tutorial_id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    next(error);
  }
});

// Get learning path (all tutorials in order)
router.get('/learning-path/:categoryId?', async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const params = [];
    let whereClause = 'WHERE t.is_published = true';
    
    if (categoryId) {
      whereClause += ' AND t.category_id = $1';
      params.push(categoryId);
    }
    
    const result = await query(
      `WITH RECURSIVE tutorial_path AS (
        -- Start with tutorials that have no prerequisites
        SELECT 
          t.id,
          t.title_urdu,
          t.title_english,
          t.difficulty_level,
          t.estimated_time_minutes,
          1 as level,
          ARRAY[t.id] as path
        FROM tutorials t
        ${whereClause}
        AND NOT EXISTS (
          SELECT 1 FROM tutorial_dependencies td 
          WHERE td.tutorial_id = t.id AND td.is_mandatory = true
        )
        
        UNION ALL
        
        -- Add tutorials that depend on current ones
        SELECT 
          t.id,
          t.title_urdu,
          t.title_english,
          t.difficulty_level,
          t.estimated_time_minutes,
          tp.level + 1,
          tp.path || t.id
        FROM tutorials t
        JOIN tutorial_dependencies td ON t.id = td.tutorial_id
        JOIN tutorial_path tp ON td.prerequisite_id = tp.id
        WHERE t.is_published = true
          AND NOT t.id = ANY(tp.path)
      )
      SELECT DISTINCT
        id,
        title_urdu,
        title_english,
        difficulty_level,
        estimated_time_minutes,
        level
      FROM tutorial_path
      ORDER BY level, difficulty_level`,
      params
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;