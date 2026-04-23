const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get platform stats for homepage
router.get('/stats', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM tutorials WHERE is_published = true) as total_tutorials,
        (SELECT COUNT(DISTINCT session_id) FROM query_logs) as total_users,
        (SELECT COUNT(*) FROM categories WHERE is_active = true) as total_categories,
        (SELECT ROUND(AVG(confidence_score)::numeric, 2) 
         FROM query_logs 
         WHERE query_status = 'SUCCESS' 
         AND created_at > CURRENT_DATE - 7) as avg_success_rate
    `);
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Get categories
router.get('/categories', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        id,
        name_english,
        name_urdu,
        icon_class,
        (SELECT COUNT(*) FROM tutorials WHERE category_id = c.id AND is_published = true) as tutorial_count
      FROM categories c
      WHERE is_active = true
      ORDER BY display_order
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get featured content
router.get('/featured', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        t.id,
        t.title_urdu,
        t.title_english,
        t.description_urdu,
        t.description_english,
        t.difficulty_level,
        t.estimated_time_minutes,
        fc.feature_type,
        fc.metadata
      FROM featured_content fc
      JOIN tutorials t ON fc.tutorial_id = t.id
      WHERE t.is_published = true
        AND (fc.end_date IS NULL OR fc.end_date > NOW())
      ORDER BY fc.display_order
      LIMIT 6
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