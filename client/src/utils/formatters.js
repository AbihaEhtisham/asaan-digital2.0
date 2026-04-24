// ============================================
// ASAAN DIGITAL 2.0 — Formatting Utilities
// ============================================

/**
 * Format number with K/M/B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  const n = parseInt(num);
  if (isNaN(n)) return '0';
  
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  
  return n.toLocaleString();
};

/**
 * Format percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (total === 0 || total === null || total === undefined) return '0%';
  return ((value / total) * 100).toFixed(decimals) + '%';
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit', hour12: true },
    datetime: { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true },
    relative: null,
  };
  
  if (format === 'relative') {
    return formatRelativeTime(d);
  }
  
  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format relative time
 * @param {Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 30) return formatDate(date, 'short');
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

/**
 * Format duration in milliseconds
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (ms) => {
  if (!ms || ms < 0) return '0ms';
  
  if (ms < 1000) return `${Math.round(ms)}ms`;
  
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format file size
 * @param {number} bytes - Bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format confidence score to percentage
 * @param {number} score - Confidence score (0-1)
 * @returns {string} Formatted confidence
 */
export const formatConfidence = (score) => {
  if (score === null || score === undefined) return '0%';
  return Math.round(score * 100) + '%';
};

/**
 * Get confidence level class
 * @param {number} score - Confidence score
 * @returns {string} CSS class name
 */
export const getConfidenceClass = (score) => {
  if (score >= 0.8) return 'high-confidence';
  if (score >= 0.5) return 'medium-confidence';
  return 'low-confidence';
};

/**
 * Get confidence level label
 * @param {number} score - Confidence score
 * @returns {string} Confidence label
 */
export const getConfidenceLabel = (score) => {
  if (score >= 0.8) return 'High Match';
  if (score >= 0.5) return 'Medium Match';
  return 'Low Match';
};

/**
 * Format difficulty level
 * @param {number} level - Difficulty level (1-5)
 * @returns {string} Difficulty label
 */
export const formatDifficulty = (level) => {
  const labels = {
    1: 'Very Easy',
    2: 'Easy',
    3: 'Medium',
    4: 'Hard',
    5: 'Advanced',
  };
  return labels[level] || 'Unknown';
};

/**
 * Get difficulty color
 * @param {number} level - Difficulty level
 * @returns {string} Color hex code
 */
export const getDifficultyColor = (level) => {
  const colors = {
    1: '#28a745',
    2: '#20c997',
    3: '#ffc107',
    4: '#fd7e14',
    5: '#dc3545',
  };
  return colors[level] || '#6c757d';
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Capitalize first letter
 * @param {string} text - Input text
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format list to comma-separated string
 * @param {Array} list - Array of strings
 * @param {string} separator - Separator
 * @returns {string} Formatted list
 */
export const formatList = (list, separator = ', ') => {
  if (!list || list.length === 0) return '';
  return list.join(separator);
};

/**
 * Format phone number (Pakistani format)
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('03')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  
  if (cleaned.length === 13 && cleaned.startsWith('923')) {
    return '+' + cleaned.replace(/(\d{2})(\d{4})(\d{7})/, '$1 $2 $3');
  }
  
  return phone;
};

/**
 * Generate random ID
 * @param {number} length - ID length
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value
 */
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * Build query string from object
 * @param {Object} params - Parameters object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export default {
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatFileSize,
  formatConfidence,
  getConfidenceClass,
  getConfidenceLabel,
  formatDifficulty,
  getDifficultyColor,
  truncateText,
  capitalize,
  formatList,
  formatPhoneNumber,
  generateId,
  getQueryParam,
  buildQueryString,
};