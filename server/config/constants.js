// ============================================
// APPLICATION CONSTANTS
// ============================================

module.exports = {
  // API Configuration
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Search Configuration
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 500,
    DEFAULT_CONFIDENCE_THRESHOLD: 0.3,
    HIGH_CONFIDENCE_THRESHOLD: 0.7,
    MAX_SUGGESTIONS: 10,
    FUZZY_MATCH_THRESHOLD: 0.25
  },
  
  // Cache Configuration
  CACHE: {
    TTL: 3600, // 1 hour in seconds
    SEARCH_CACHE_TTL: 300, // 5 minutes
    TUTORIAL_CACHE_TTL: 3600, // 1 hour
    ANALYTICS_CACHE_TTL: 900 // 15 minutes
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    SEARCH_MAX_REQUESTS: 30,
    ADMIN_MAX_REQUESTS: 200
  },
  
  // Tutorial Configuration
  TUTORIAL: {
    DIFFICULTY_LEVELS: {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Advanced'
    },
    DEFAULT_ESTIMATED_TIME: 5
  },
  
  // Languages
  LANGUAGES: {
    ENGLISH: 'english',
    URDU: 'urdu',
    ROMAN_URDU: 'roman_urdu'
  },
  
  // Query Status
  QUERY_STATUS: {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    LOW_CONFIDENCE: 'LOW_CONFIDENCE'
  },
  
  // Feature Types
  FEATURE_TYPES: {
    HERO: 'hero',
    TRENDING: 'trending',
    RECOMMENDED: 'recommended',
    NEW: 'new'
  },
  
  // Analytics Periods
  PERIODS: {
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month'
  },
  
  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    TUTORIAL_NOT_FOUND: 'Tutorial not found',
    INVALID_SEARCH_QUERY: 'Invalid search query',
    UNAUTHORIZED_ACCESS: 'Unauthorized access',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
    DATABASE_ERROR: 'Database error occurred',
    VALIDATION_ERROR: 'Validation failed'
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    TUTORIAL_CREATED: 'Tutorial created successfully',
    TUTORIAL_UPDATED: 'Tutorial updated successfully',
    TUTORIAL_DELETED: 'Tutorial deleted successfully',
    PROGRESS_UPDATED: 'Progress updated successfully',
    SEARCH_COMPLETED: 'Search completed successfully'
  }
};