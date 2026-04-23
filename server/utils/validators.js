/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {Object} Validation result
 */
const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return { isValid: false, error: 'Search query is required' };
  }
  
  const trimmed = query.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Search query must be at least 2 characters' };
  }
  
  if (trimmed.length > 500) {
    return { isValid: false, error: 'Search query too long (max 500 characters)' };
  }
  
  // Check for SQL injection patterns
  const dangerousPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|;|--|\/\*|\*\/)/i;
  if (dangerousPatterns.test(trimmed)) {
    return { isValid: false, error: 'Invalid characters in search query' };
  }
  
  return { isValid: true, value: trimmed };
};

/**
 * Validate tutorial ID
 * @param {string|number} id - Tutorial ID
 * @returns {boolean} Is valid
 */
const validateTutorialId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0 && numId < 999999999;
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Pakistani format)
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate tutorial input
 * @param {Object} tutorial - Tutorial data
 * @returns {Object} Validation result
 */
const validateTutorialInput = (tutorial) => {
  const errors = [];
  
  if (!tutorial.title_english || tutorial.title_english.trim().length < 5) {
    errors.push('English title must be at least 5 characters');
  }
  
  if (!tutorial.title_urdu || tutorial.title_urdu.trim().length < 5) {
    errors.push('Urdu title must be at least 5 characters');
  }
  
  if (!tutorial.category_id || isNaN(parseInt(tutorial.category_id))) {
    errors.push('Valid category ID is required');
  }
  
  if (tutorial.difficulty_level && (tutorial.difficulty_level < 1 || tutorial.difficulty_level > 5)) {
    errors.push('Difficulty level must be between 1 and 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize input string
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Normalized pagination params
 */
const validatePagination = (page, limit) => {
  let validPage = parseInt(page) || 1;
  let validLimit = parseInt(limit) || 10;
  
  if (validPage < 1) validPage = 1;
  if (validLimit < 1) validLimit = 10;
  if (validLimit > 100) validLimit = 100;
  
  return { page: validPage, limit: validLimit };
};

module.exports = {
  validateSearchQuery,
  validateTutorialId,
  validateEmail,
  validatePhoneNumber,
  validateTutorialInput,
  sanitizeString,
  validatePagination
};