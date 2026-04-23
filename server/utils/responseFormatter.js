/**
 * Format success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted response
 */
const formatSuccessResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format error response
 * @param {string|Object} error - Error message or object
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted error response
 */
const formatErrorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    error: typeof error === 'string' ? error : error.message || 'An error occurred',
    statusCode,
    timestamp: new Date().toISOString()
  };
};

/**
 * Format paginated response
 * @param {Array} data - Data array
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Formatted paginated response
 */
const formatPaginatedResponse = (data, page, limit, total) => {
  return {
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(total),
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * Format validation error response
 * @param {Array|Object} errors - Validation errors
 * @returns {Object} Formatted validation error
 */
const formatValidationError = (errors) => {
  return {
    success: false,
    error: 'Validation failed',
    validationErrors: Array.isArray(errors) ? errors : [errors],
    statusCode: 400,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  formatSuccessResponse,
  formatErrorResponse,
  formatPaginatedResponse,
  formatValidationError
};