const { query, transaction } = require('../config/database');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

/**
 * Get dashboard overview
 * @route GET /api/admin/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        -- Platform stats
        (SELECT COUNT(*) FROM tutorials WHERE is_published = true) as total_tutorials,
        (SELECT COUNT(*) FROM intents) as total_intents,
        (SELECT COUNT(*) FROM keywords) as total_keywords,
        (SELECT COUNT(*) FROM categories WHERE is_active = true) as total_categories,
        
        -- Query stats (last 24 hours)
        (SELECT COUNT(*) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '24 hours') as queries_24h,
        (SELECT COUNT(*) FROM query_logs 
         WHERE query_status = 'SUCCESS' 
         AND created_at > NOW() - INTERVAL '24 hours') as successful_queries_24h,
        (SELECT COUNT(*) FROM query_logs 
         WHERE query_status = 'FAILED' 
         AND created_at > NOW() - INTERVAL '24 hours') as failed_queries_24h,
        
        -- User stats
        (SELECT COUNT(DISTINCT session_id) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '24 hours') as active_users_24h,
        (SELECT COUNT(DISTINCT session_id) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '7 days') as active_users_7d,
        (SELECT ROUND(AVG(response_time_ms)::numeric, 2) FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '1 hour') as avg_response_time,
        
        -- Success rate
        (SELECT ROUND(
          (COUNT(*) FILTER (WHERE query_status = 'SUCCESS')::numeric / NULLIF(COUNT(*), 0)) * 100, 1
        ) FROM query_logs WHERE created_at > NOW() - INTERVAL '24 hours') as success_rate_24h,
        
        -- Content gaps
        (SELECT COUNT(*) FROM content_gaps_mv) as content_gaps,
        
        -- System health
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections
    `);
    
    res.json(
      formatSuccessResponse(result.rows[0], 'Dashboard data retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get content gaps
 * @route GET /api/admin/content-gaps
 */
const getContentGaps = async (req, res, next) => {
  try {
    const minFailures = parseInt(req.query.min_failures) || 3;
    
    const result = await query(
      'SELECT * FROM get_content_gaps($1)',
      [minFailures]
    );
    
    res.json(
      formatSuccessResponse(result.rows, 'Content gaps retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get failed queries
 * @route GET /api/admin/failed-queries
 */
const getFailedQueries = async (req, res, next) => {
  try {
    const { days = 7, limit = 50 } = req.query;
    
    const result = await query(`
      SELECT 
        id,
        query_text,
        failure_reason,
        user_ip,
        user_agent,
        created_at
      FROM query_logs
      WHERE query_status = 'FAILED'
        AND created_at > NOW() - INTERVAL '1 day' * $1
      ORDER BY created_at DESC
      LIMIT $2
    `, [days, limit]);
    
    res.json(
      formatSuccessResponse(result.rows, 'Failed queries retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create new tutorial
 * @route POST /api/admin/tutorials
 */
const createTutorial = async (req, res, next) => {
  const client = await query('BEGIN');
  
  try {
    const {
      title_english,
      title_urdu,
      description_english,
      description_urdu,
      category_id,
      difficulty_level,
      estimated_time_minutes,
      steps,
      intents,
      keywords,
      metadata = {}
    } = req.body;
    
    // Validate required fields
    if (!title_english || !title_urdu || !category_id) {
      throw new Error('Missing required fields');
    }
    
    // Insert tutorial
    const tutorialResult = await query(
      `INSERT INTO tutorials 
        (title_english, title_urdu, description_english, description_urdu, 
         category_id, difficulty_level, estimated_time_minutes, metadata, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        title_english, title_urdu, description_english, description_urdu,
        category_id, difficulty_level, estimated_time_minutes, 
        JSON.stringify(metadata), 'admin'
      ]
    );
    
    const tutorialId = tutorialResult.rows[0].id;
    
    // Insert steps
    if (steps && steps.length > 0) {
      for (const step of steps) {
        await query(
          `INSERT INTO tutorial_steps 
            (tutorial_id, step_number, instruction_urdu, instruction_english, image_url, audio_url)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            tutorialId, step.step_number, step.instruction_urdu, 
            step.instruction_english, step.image_url, step.audio_url
          ]
        );
      }
    }
    
    // Insert intents and keywords
    if (intents && intents.length > 0) {
      for (const intent of intents) {
        const intentResult = await query(
          `INSERT INTO intents (tutorial_id, intent_name, description)
           VALUES ($1, $2, $3)
           RETURNING id`,
          [tutorialId, intent.name, intent.description]
        );
        
        const intentId = intentResult.rows[0].id;
        
        // Insert keywords for this intent
        if (intent.keywords && intent.keywords.length > 0) {
          for (const keyword of intent.keywords) {
            await query(
              `INSERT INTO keywords (intent_id, keyword, language, weight)
               VALUES ($1, $2, $3, $4)`,
              [intentId, keyword.text, keyword.language, keyword.weight || 1.0]
            );
          }
        }
      }
    }
    
    await query('COMMIT');
    
    res.status(201).json(
      formatSuccessResponse({ id: tutorialId }, 'Tutorial created successfully')
    );
  } catch (error) {
    await query('ROLLBACK');
    next(error);
  }
};

/**
 * Update tutorial
 * @route PUT /api/admin/tutorials/:id
 */
const updateTutorial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const allowedFields = [
      'title_english', 'title_urdu', 'description_english', 'description_urdu',
      'category_id', 'difficulty_level', 'estimated_time_minutes', 'is_published'
    ];
    
    const setClauses = [];
    const values = [id];
    let paramIndex = 2;
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(updates[field]);
        paramIndex++;
      }
    }
    
    if (setClauses.length === 0) {
      return res.status(400).json(
        formatErrorResponse('No valid fields to update', 400)
      );
    }
    
    const result = await query(
      `UPDATE tutorials 
       SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json(
        formatErrorResponse('Tutorial not found', 404)
      );
    }
    
    res.json(
      formatSuccessResponse(result.rows[0], 'Tutorial updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete tutorial (soft delete)
 * @route DELETE /api/admin/tutorials/:id
 */
const deleteTutorial = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Soft delete - just unpublish
    const result = await query(
      `UPDATE tutorials 
       SET is_published = false, updated_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json(
        formatErrorResponse('Tutorial not found', 404)
      );
    }
    
    res.json(
      formatSuccessResponse(null, 'Tutorial deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk import keywords
 * @route POST /api/admin/keywords/bulk
 */
const bulkImportKeywords = async (req, res, next) => {
  try {
    const { intent_id, keywords } = req.body;
    
    if (!intent_id || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json(
        formatErrorResponse('Invalid request format', 400)
      );
    }
    
    // Use transaction for bulk insert
    await transaction(async (client) => {
      for (const kw of keywords) {
        await client.query(
          `INSERT INTO keywords (intent_id, keyword, language, weight)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT DO NOTHING`,
          [intent_id, kw.text, kw.language, kw.weight || 1.0]
        );
      }
    });
    
    res.json(
      formatSuccessResponse({ inserted: keywords.length }, 'Keywords imported successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh materialized views
 * @route POST /api/admin/refresh-mvs
 */
const refreshMaterializedViews = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM refresh_all_materialized_views()');
    
    res.json(
      formatSuccessResponse(result.rows, 'Materialized views refreshed')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get system health
 * @route GET /api/admin/system-health
 */
const getSystemHealth = async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        pg_database_size(current_database()) as db_size_bytes,
        (SELECT ROUND(
          (sum(heap_blks_hit)::numeric / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0)) * 100, 2
        ) FROM pg_statio_user_tables) as cache_hit_ratio,
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
        (SELECT COUNT(*) FROM query_logs 
         WHERE response_time_ms > 1000 
         AND created_at > NOW() - INTERVAL '1 hour') as slow_queries_last_hour,
        EXTRACT(EPOCH FROM (NOW() - pg_postmaster_start_time())) as uptime_seconds
    `);
    
    const stats = result.rows[0];
    
    res.json(
      formatSuccessResponse({
        ...stats,
        db_size_mb: Math.round(stats.db_size_bytes / (1024 * 1024)),
        uptime_hours: Math.round(stats.uptime_seconds / 3600),
        status: stats.cache_hit_ratio > 90 ? 'healthy' : 'warning'
      }, 'System health retrieved')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular intents
 * @route GET /api/admin/popular-intents
 */
const getPopularIntents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await query(`
      SELECT * FROM intent_effectiveness
      ORDER BY popularity_score DESC
      LIMIT $1
    `, [limit]);
    
    res.json(
      formatSuccessResponse(result.rows, 'Popular intents retrieved')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getContentGaps,
  getFailedQueries,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  bulkImportKeywords,
  refreshMaterializedViews,
  getSystemHealth,
  getPopularIntents
};