const { query } = require('../config/database');
const { formatErrorResponse } = require('../utils/responseFormatter');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Simple API key authentication for admin routes
 * In production, use JWT or session-based authentication
 */
const adminAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatErrorResponse(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, HTTP_STATUS.UNAUTHORIZED)
      );
    }
    
    // Check API key in database (you can add a table for API keys)
    // For demo, check against environment variable
    const validApiKey = process.env.ADMIN_API_KEY || 'admin-secret-key-2026';
    
    if (apiKey !== validApiKey) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatErrorResponse('Invalid API key', HTTP_STATUS.UNAUTHORIZED)
      );
    }
    
    // Add admin info to request
    req.admin = {
      authenticated: true,
      timestamp: new Date().toISOString()
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication for user-specific features
 * Currently placeholder for future JWT implementation
 */
const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No auth, but allow to continue as anonymous
      req.user = null;
      return next();
    }
    
    const token = authHeader.substring(7);
    
    // Placeholder for JWT verification
    // In production, verify JWT and extract user ID
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = { id: decoded.userId };
    
    req.user = null; // Anonymous for now
    
    next();
  } catch (error) {
    // Invalid token, treat as anonymous
    req.user = null;
    next();
  }
};

/**
 * Rate limit by user/session
 */
const rateLimitByUser = async (req, res, next) => {
  try {
    const identifier = req.user?.id || req.sessionId || req.ip;
    const endpoint = req.path;
    
    // Check rate limit in database
    const result = await query(`
      SELECT COUNT(*) as request_count
      FROM query_logs
      WHERE session_id = $1
        AND created_at > NOW() - INTERVAL '1 minute'
    `, [identifier]);
    
    const requestCount = parseInt(result.rows[0].request_count);
    
    if (requestCount > 60) { // 60 requests per minute limit
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json(
        formatErrorResponse(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, HTTP_STATUS.TOO_MANY_REQUESTS)
      );
    }
    
    next();
  } catch (error) {
    // If rate limit check fails, allow request to continue
    console.error('Rate limit check failed:', error);
    next();
  }
};

/**
 * Check if user owns the resource
 */
const checkResourceOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const resourceId = req.params.id;
      
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(
          formatErrorResponse(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, HTTP_STATUS.UNAUTHORIZED)
        );
      }
      
      // Check ownership based on resource type
      let ownershipQuery;
      switch (resourceType) {
        case 'progress':
          ownershipQuery = `
            SELECT 1 FROM user_progress 
            WHERE user_id = $1 AND tutorial_id = $2
          `;
          break;
        default:
          return next();
      }
      
      const result = await query(ownershipQuery, [userId, resourceId]);
      
      if (result.rows.length === 0) {
        return res.status(HTTP_STATUS.FORBIDDEN).json(
          formatErrorResponse('Access denied', HTTP_STATUS.FORBIDDEN)
        );
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  adminAuth,
  userAuth,
  rateLimitByUser,
  checkResourceOwnership
};