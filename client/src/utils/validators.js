// ============================================
// ASAAN DIGITAL 2.0 — Validation Utilities
// ============================================

/**
 * Validate search query
 * @param {string} query - Search query
 * @returns {Object} Validation result
 */
export const validateSearchQuery = (query) => {
  const errors = [];
  
  if (!query || typeof query !== 'string') {
    errors.push('Search query is required');
    return { isValid: false, errors };
  }
  
  const trimmed = query.trim();
  
  if (trimmed.length < 2) {
    errors.push('Search query must be at least 2 characters');
  }
  
  if (trimmed.length > 500) {
    errors.push('Search query is too long (maximum 500 characters)');
  }
  
  // Check for potentially dangerous patterns
  const dangerousPatterns = /<script|javascript:|on\w+=/i;
  if (dangerousPatterns.test(trimmed)) {
    errors.push('Search query contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: trimmed,
  };
};

/**
 * Validate email address
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate Pakistani phone number
 * @param {string} phone - Phone number
 * @returns {boolean} Is valid
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
  
  return phoneRegex.test(cleaned);
};

/**
 * Validate CNIC number (Pakistani)
 * @param {string} cnic - CNIC number
 * @returns {boolean} Is valid
 */
export const validateCNIC = (cnic) => {
  if (!cnic || typeof cnic !== 'string') return false;
  
  const cleaned = cnic.replace(/[\s\-]/g, '');
  const cnicRegex = /^[0-9]{5}[0-9]{7}[0-9]{1}$/;
  
  return cnicRegex.test(cleaned);
};

/**
 * Validate URL
 * @param {string} url - URL string
 * @returns {boolean} Is valid
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url.trim());
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate tutorial ID
 * @param {string|number} id - Tutorial ID
 * @returns {boolean} Is valid
 */
export const validateTutorialId = (id) => {
  const numId = parseInt(id);
  return !isNaN(numId) && numId > 0 && numId < 999999999;
};

/**
 * Validate tutorial form data
 * @param {Object} data - Tutorial form data
 * @returns {Object} Validation result
 */
export const validateTutorialForm = (data) => {
  const errors = [];
  
  if (!data.title_english || data.title_english.trim().length < 5) {
    errors.push({ field: 'title_english', message: 'English title must be at least 5 characters' });
  }
  
  if (!data.title_urdu || data.title_urdu.trim().length < 5) {
    errors.push({ field: 'title_urdu', message: 'Urdu title must be at least 5 characters' });
  }
  
  if (!data.category_id || isNaN(parseInt(data.category_id))) {
    errors.push({ field: 'category_id', message: 'Please select a valid category' });
  }
  
  if (data.difficulty_level && (data.difficulty_level < 1 || data.difficulty_level > 5)) {
    errors.push({ field: 'difficulty_level', message: 'Difficulty must be between 1 and 5' });
  }
  
  if (data.estimated_time_minutes && (data.estimated_time_minutes < 1 || data.estimated_time_minutes > 120)) {
    errors.push({ field: 'estimated_time_minutes', message: 'Estimated time must be between 1 and 120 minutes' });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Normalized pagination params
 */
export const validatePagination = (page, limit) => {
  let validPage = parseInt(page) || 1;
  let validLimit = parseInt(limit) || 12;
  
  if (validPage < 1) validPage = 1;
  if (validLimit < 1) validLimit = 12;
  if (validLimit > 100) validLimit = 100;
  
  return { page: validPage, limit: validLimit };
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (password && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (password && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (password && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize string input
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '')    // Remove angle brackets
    .trim();
};

/**
 * Validate file upload
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const errors = [];
  const {
    maxSizeMB = 10,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  } = options;
  
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    errors.push(`File size must be less than ${maxSizeMB}MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Accepted types: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean} Is valid number
 */
export const isValidNumber = (value) => {
  if (typeof value === 'number') return !isNaN(value) && isFinite(value);
  if (typeof value === 'string') return !isNaN(parseFloat(value)) && isFinite(value);
  return false;
};

export default {
  validateSearchQuery,
  validateEmail,
  validatePhone,
  validateCNIC,
  validateURL,
  validateTutorialId,
  validateTutorialForm,
  validatePagination,
  validatePassword,
  sanitizeString,
  validateFile,
  isEmpty,
  isValidNumber,
};