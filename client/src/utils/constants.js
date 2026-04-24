// ============================================
// ASAAN DIGITAL 2.0 — Application Constants
// ============================================

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 10000;

// Search Configuration
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 500,
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 10,
  DEFAULT_CONFIDENCE_THRESHOLD: 0.3,
  HIGH_CONFIDENCE: 0.7,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
  TUTORIALS_PER_PAGE: 12,
  ADMIN_ITEMS_PER_PAGE: 25,
};

// Tutorial Difficulty Levels
export const DIFFICULTY_LEVELS = {
  1: { label: 'Very Easy', color: '#28a745', icon: 'fa-baby' },
  2: { label: 'Easy', color: '#20c997', icon: 'fa-child' },
  3: { label: 'Medium', color: '#ffc107', icon: 'fa-user' },
  4: { label: 'Hard', color: '#fd7e14', icon: 'fa-user-graduate' },
  5: { label: 'Advanced', color: '#dc3545', icon: 'fa-brain' },
};

// Languages
export const LANGUAGES = {
  ENGLISH: 'english',
  URDU: 'urdu',
  ROMAN_URDU: 'roman_urdu',
};

// Query Status
export const QUERY_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  LOW_CONFIDENCE: 'LOW_CONFIDENCE',
};

// Feature Types
export const FEATURE_TYPES = {
  HERO: 'hero',
  TRENDING: 'trending',
  RECOMMENDED: 'recommended',
  NEW: 'new',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  POOCHNA: '/poochna',
  SEEKHNA: '/seekhna',
  IMPACT: '/impact',
  ABOUT: '/about',
  TUTORIAL: '/tutorial/:id',
  ADMIN: '/admin',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_CONTENT: '/admin/content',
};

// Navigation Links
export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: 'fa-home' },
  { path: '/poochna', label: 'Poochna', icon: 'fa-search' },
  { path: '/seekhna', label: 'Seekhna', icon: 'fa-graduation-cap' },
  { path: '/impact', label: 'Community', icon: 'fa-users' },
  { path: '/about', label: 'About', icon: 'fa-info-circle' },
];

// Admin Navigation Links
export const ADMIN_NAV_LINKS = [
  { path: '/admin', label: 'Dashboard', icon: 'fa-chart-pie' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'fa-chart-line' },
  { path: '/admin/content', label: 'Content', icon: 'fa-book' },
];

// Admin Section Links
export const ADMIN_SECTIONS = [
  { path: '/admin', label: 'Overview', icon: 'fa-chart-pie', section: 'main' },
  { path: '/admin/analytics', label: 'Analytics', icon: 'fa-chart-line', section: 'analytics' },
  { path: '/admin/content', label: 'Content Management', icon: 'fa-book', section: 'content' },
];

// Toast Messages
export const TOAST_MESSAGES = {
  SEARCH_SUCCESS: 'Found matching tutorial!',
  SEARCH_FAILED: 'No results found. Please try different words.',
  SEARCH_ERROR: 'Search failed. Please try again.',
  TUTORIAL_NOT_FOUND: 'Tutorial not found.',
  PROGRESS_UPDATED: 'Progress updated successfully!',
  STEP_COMPLETED: (step) => `Step ${step} completed!`,
  ADMIN_LOGIN_REQUIRED: 'Admin access required.',
  CONTENT_CREATED: 'Tutorial created successfully!',
  CONTENT_UPDATED: 'Tutorial updated successfully!',
  CONTENT_DELETED: 'Tutorial deleted successfully!',
  VIEWS_REFRESHED: 'Materialized views refreshed!',
  DATA_REFRESHED: 'Data refreshed successfully!',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
};

// Category Icons
export const CATEGORY_ICONS = {
  'WhatsApp': 'fab fa-whatsapp',
  'Digital Payments': 'fas fa-money-bill',
  'Government Services': 'fas fa-building',
  'Social Media': 'fas fa-users',
  'Phone Basics': 'fas fa-mobile-alt',
  'Email & Internet': 'fas fa-envelope',
  'Online Safety': 'fas fa-shield-alt',
  'Job Applications': 'fas fa-briefcase',
  'default': 'fas fa-folder',
};

// Color Palette (for charts and visualizations)
export const CHART_COLORS = [
  '#0d3320', '#1a5d3c', '#2a7a52', '#3dba6f',
  '#c9a03d', '#e0b85c', '#0a0a0a', '#555555',
  '#3498db', '#e74c3c', '#f39c12', '#2ecc71',
];

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM D, YYYY',
  LONG: 'MMMM D, YYYY',
  TIME: 'h:mm A',
  DATETIME: 'MMM D, YYYY h:mm A',
  RELATIVE: 'relative',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SESSION_ID: 'sessionId',
  ADMIN_KEY: 'adminKey',
  USER_PREFERENCES: 'userPreferences',
  LANGUAGE: 'language',
  THEME: 'theme',
};

// Session Configuration
export const SESSION = {
  ID_LENGTH: 36,
  STORAGE_KEY: 'sessionId',
};

export default {
  API_BASE_URL,
  SEARCH,
  PAGINATION,
  DIFFICULTY_LEVELS,
  LANGUAGES,
  QUERY_STATUS,
  ROUTES,
  NAV_LINKS,
  ADMIN_NAV_LINKS,
  TOAST_MESSAGES,
  ERROR_MESSAGES,
  CATEGORY_ICONS,
  CHART_COLORS,
  DATE_FORMATS,
  STORAGE_KEYS,
};