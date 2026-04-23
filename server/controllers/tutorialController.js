const { query, transaction } = require('../config/database');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');
const { validateTutorialId } = require('../utils/validators');

/**
 * Get all tutorials with filters
 * @route GET /api/tutorials
 */
const getTutorials = async (req, res, next) => {
  try {
    const { 
      category, 
      difficulty, 
      search, 
      page = 1, 
      limit = 12,
      sort = 'created_at'
    } = req.query;
    
    const offset = (page - 1) * limit;
    const params = [];
    let whereConditions = ['t.is_published = true'];
    let paramIndex = 1;
    
    // Build WHERE clause
    if (category) {
      whereConditions.push(`t.category_id = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    
    if (difficulty) {
      whereConditions.push(`t.difficulty_level = $${paramIndex}`);
      params.push(difficulty);
      paramIndex++;
    }
    
    if (search) {
      whereConditions.push(`t.search_vector @@ plainto_tsquery('simple', $${paramIndex})`);
      params.push(search);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';
    
    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM tutorials t ${whereClause}`,
      params
    );
    
    // Validate sort field to prevent SQL injection
    const allowedSortFields = ['created_at', 'difficulty_level', 'estimated_time_minutes', 'title_english'];
    const sortField = allowedSortFields.includes(sort) ? `t.${sort}` : 't.created_at';
    const sortDirection = req.query.order === 'asc' ? 'ASC' : 'DESC';
    
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
        t.created_at,
        c.name_english as category_name,
        c.name_urdu as category_name_urdu,
        c.icon_class as category_icon,
        (SELECT COUNT(*) FROM tutorial_steps WHERE tutorial_id = t.id) as step_count,
        (SELECT COUNT(*) FROM query_logs WHERE matched_tutorial_id = t.id) as search_count
      FROM tutorials t
      LEFT JOIN categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY ${sortField} ${sortDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );
    
    res.json(
      formatSuccessResponse({
        tutorials: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
        }
      }, 'Tutorials retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get single tutorial by ID
 * @route GET /api/tutorials/:id
 */
const getTutorialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!validateTutorialId(id)) {
      return res.status(400).json(
        formatErrorResponse('Invalid tutorial ID', 400)
      );
    }
    
    const result = await query(
      'SELECT get_tutorial_with_steps($1) as tutorial',
      [id]
    );
    
    if (!result.rows[0].tutorial) {
      return res.status(404).json(
        formatErrorResponse('Tutorial not found', 404)
      );
    }
    
    // Increment view count asynchronously (don't wait)
    query(
      `UPDATE tutorials 
       SET metadata = jsonb_set(
         COALESCE(metadata, '{}'),
         '{views}',
         to_jsonb(COALESCE((metadata->>'views')::int, 0) + 1)
       )
       WHERE id = $1`,
      [id]
    ).catch(console.error);
    
    res.json(
      formatSuccessResponse(result.rows[0].tutorial, 'Tutorial retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get tutorial steps only
 * @route GET /api/tutorials/:id/steps
 */
const getTutorialSteps = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT 
        step_number,
        instruction_urdu,
        instruction_english,
        image_url,
        audio_url,
        extra_data
      FROM tutorial_steps
      WHERE tutorial_id = $1
      ORDER BY step_number`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json(
        formatErrorResponse('No steps found for this tutorial', 404)
      );
    }
    
    res.json(
      formatSuccessResponse(result.rows, 'Tutorial steps retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get tutorial prerequisites
 * @route GET /api/tutorials/:id/prerequisites
 */
const getPrerequisites = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `WITH RECURSIVE prereq_tree AS (
        SELECT 
          td.prerequisite_id as id,
          1 as depth,
          ARRAY[td.tutorial_id] as path
        FROM tutorial_dependencies td
        WHERE td.tutorial_id = $1
          AND td.is_mandatory = true
        
        UNION ALL
        
        SELECT 
          td.prerequisite_id,
          pt.depth + 1,
          pt.path || td.tutorial_id
        FROM tutorial_dependencies td
        JOIN prereq_tree pt ON td.tutorial_id = pt.id
        WHERE NOT td.prerequisite_id = ANY(pt.path)
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
    
    res.json(
      formatSuccessResponse(result.rows, 'Prerequisites retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get related tutorials
 * @route GET /api/tutorials/:id/related
 */
const getRelatedTutorials = async (req, res, next) => {
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
        c.name_english as category_name,
        c.name_urdu as category_name_urdu
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
    
    res.json(
      formatSuccessResponse(result.rows, 'Related tutorials retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user progress
 * @route POST /api/tutorials/:id/progress
 */
const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, currentStep, completed } = req.body;
    
    if (!userId) {
      return res.status(400).json(
        formatErrorResponse('User ID is required', 400)
      );
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
      [
        userId, 
        id, 
        currentStep || 1, 
        completed ? [currentStep] : [], 
        completed || false
      ]
    );
    
    res.json(
      formatSuccessResponse(result.rows[0], 'Progress updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user progress for a tutorial
 * @route GET /api/tutorials/:id/progress/:userId
 */
const getUserProgress = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    
    const result = await query(
      `SELECT 
        current_step,
        completed_steps,
        is_completed,
        started_at,
        last_accessed,
        EXTRACT(EPOCH FROM (last_accessed - started_at))::INT as time_spent_seconds
      FROM user_progress
      WHERE tutorial_id = $1 AND user_id = $2`,
      [id, userId]
    );
    
    res.json(
      formatSuccessResponse(result.rows[0] || null, 'Progress retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get learning path
 * @route GET /api/tutorials/learning-path/:categoryId?
 */
const getLearningPath = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    const result = await query(
      'SELECT * FROM get_learning_path($1)',
      [categoryId || null]
    );
    
    // Group by level for better frontend display
    const groupedPath = result.rows.reduce((acc, tutorial) => {
      const level = tutorial.path_level;
      if (!acc[level]) acc[level] = [];
      acc[level].push(tutorial);
      return acc;
    }, {});
    
    res.json(
      formatSuccessResponse({
        path: result.rows,
        grouped: groupedPath,
        totalTutorials: result.rows.length
      }, 'Learning path retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get tutorials by category
 * @route GET /api/tutorials/category/:categoryId
 */
const getTutorialsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await query(
      `SELECT 
        t.id,
        t.title_english,
        t.title_urdu,
        t.description_english,
        t.difficulty_level,
        t.estimated_time_minutes,
        (SELECT COUNT(*) FROM tutorial_steps WHERE tutorial_id = t.id) as step_count,
        (SELECT COUNT(*) FROM query_logs WHERE matched_tutorial_id = t.id) as search_count
      FROM tutorials t
      WHERE t.category_id = $1 AND t.is_published = true
      ORDER BY t.difficulty_level, t.created_at DESC
      LIMIT $2`,
      [categoryId, limit]
    );
    
    res.json(
      formatSuccessResponse(result.rows, 'Category tutorials retrieved')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTutorials,
  getTutorialById,
  getTutorialSteps,
  getPrerequisites,
  getRelatedTutorials,
  updateProgress,
  getUserProgress,
  getLearningPath,
  getTutorialsByCategory
};