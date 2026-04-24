const express = require('express');
const router = express.Router();
const { query, transaction } = require('../config/database');

// Middleware for admin authentication (simplified - add proper auth later)
const adminAuth = (req, res, next) => {
  // In production, use proper JWT verification
  const adminKey = req.headers['x-admin-key'];
  
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }
  
  next();
};

// Apply auth middleware to all admin routes
router.use(adminAuth);

// Get dashboard overview stats
router.get('/dashboard', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        -- Platform stats
        (SELECT COUNT(*) FROM tutorials WHERE is_published = true) as total_tutorials,
        (SELECT COUNT(*) FROM intents) as total_intents,
        (SELECT COUNT(*) FROM keywords) as total_keywords,
        
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
        (SELECT AVG(response_time_ms)::INT FROM query_logs 
         WHERE created_at > NOW() - INTERVAL '1 hour') as avg_response_time,
        
        -- Content gaps
        (SELECT COUNT(*) FROM content_gaps_mv) as content_gaps,
        
        -- System health
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections
    `);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get content gaps
router.get('/content-gaps', async (req, res, next) => {
  try {
    const minFailures = parseInt(req.query.min_failures) || 3;
    
    const result = await query(
      'SELECT * FROM get_content_gaps($1)',
      [minFailures]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get failed queries details
router.get('/failed-queries', async (req, res, next) => {
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
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Add new tutorial (with transaction)
router.post('/tutorials', async (req, res, next) => {
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
      keywords
    } = req.body;
    
    // Insert tutorial
    const tutorialResult = await query(
      `INSERT INTO tutorials 
        (title_english, title_urdu, description_english, description_urdu, 
         category_id, difficulty_level, estimated_time_minutes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [title_english, title_urdu, description_english, description_urdu,
       category_id, difficulty_level, estimated_time_minutes, 'admin']
    );
    
    const tutorialId = tutorialResult.rows[0].id;
    
    // Insert steps
    if (steps && steps.length > 0) {
      for (const step of steps) {
        await query(
          `INSERT INTO tutorial_steps 
            (tutorial_id, step_number, instruction_urdu, instruction_english, image_url, audio_url)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [tutorialId, step.step_number, step.instruction_urdu, 
           step.instruction_english, step.image_url, step.audio_url]
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
    else { // AUTO-GENERATE DEFAULT INTENT + KEYWORDS

      const title = title_english.toLowerCase();

      const intentResult = await query(
        `INSERT INTO intents (tutorial_id, intent_name, description)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          tutorialId,
          title.replace(/\s+/g, '_'), // intent_name
          title_english // description
        ]
      );

      const intentId = intentResult.rows[0].id;

      // Split title into keywords
      const words = title.split(' ').filter(w => w.length > 2);

      for (const word of words) {
        await query(
          `INSERT INTO keywords (intent_id, keyword, language, weight)
           VALUES ($1, $2, 'english', 1.0)`,
          [intentId, word]
        );
      }
        await query(
        `INSERT INTO keywords (intent_id, keyword, language, weight)
         VALUES ($1, $2, 'english', 1.0)`,
        [intentId, title]
      );
    }
    
    await query('COMMIT');
    
    res.json({
      success: true,
      data: { id: tutorialId },
      message: 'Tutorial created successfully'
    });
  } catch (error) {
    await query('ROLLBACK');
    next(error);
  }
});

// Update tutorial
router.put('/tutorials/:id', async (req, res, next) => {
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
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    const result = await query(
      `UPDATE tutorials 
       SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      values
    );
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Bulk import keywords
router.post('/keywords/bulk', async (req, res, next) => {
  try {
    const { intent_id, keywords } = req.body;
    
    if (!intent_id || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format'
      });
    }
    
    const values = keywords.map(k => 
      `(${intent_id}, '${k.text}', '${k.language}', ${k.weight || 1.0})`
    ).join(',');
    
    const result = await query(`
      INSERT INTO keywords (intent_id, keyword, language, weight)
      VALUES ${values}
      RETURNING id
    `);
    
    res.json({
      success: true,
      data: { inserted: result.rowCount }
    });
  } catch (error) {
    next(error);
  }
});

// Refresh materialized views
router.post('/refresh-mvs', async (req, res, next) => {
  try {
    const views = ['content_gaps_mv', 'tutorial_analytics_mv'];
    const results = [];
    
    for (const view of views) {
      try {
        await query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${view}`);
        results.push({ view, status: 'success' });
      } catch (error) {
        results.push({ view, status: 'error', error: error.message });
      }
    }
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
});

// Get system health metrics
router.get('/system-health', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        -- Database size
        pg_database_size(current_database()) as db_size_bytes,
        
        -- Cache hit ratio
        (SELECT ROUND(
          (sum(heap_blks_hit)::numeric / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0)) * 100, 2
        ) FROM pg_statio_user_tables) as cache_hit_ratio,
        
        -- Active connections
        (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_connections,
        
        -- Slow queries (>1000ms)
        (SELECT COUNT(*) FROM query_logs 
         WHERE response_time_ms > 1000 
         AND created_at > NOW() - INTERVAL '1 hour') as slow_queries_last_hour,
        
        -- Database uptime
        EXTRACT(EPOCH FROM (NOW() - pg_postmaster_start_time())) as uptime_seconds
    `);
    
    const stats = result.rows[0];
    
    res.json({
      success: true,
      data: {
        ...stats,
        db_size_mb: Math.round(stats.db_size_bytes / (1024 * 1024)),
        uptime_hours: Math.round(stats.uptime_seconds / 3600)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get popular intents (for optimization)
router.get('/popular-intents', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await query(`
      SELECT 
        i.id,
        i.intent_name,
        i.popularity_score,
        i.success_count,
        i.fail_count,
        ROUND(
          CASE 
            WHEN (i.success_count + i.fail_count) > 0 
            THEN (i.success_count::numeric / (i.success_count + i.fail_count)) * 100
            ELSE 0
          END, 2
        ) as success_rate,
        t.title_urdu as tutorial_title,
        (SELECT COUNT(*) FROM keywords WHERE intent_id = i.id) as keyword_count
      FROM intents i
      JOIN tutorials t ON i.tutorial_id = t.id
      ORDER BY i.popularity_score DESC
      LIMIT $1
    `, [limit]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;