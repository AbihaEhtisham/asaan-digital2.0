import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get session ID from localStorage
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Request interceptor
api.interceptors.request.use((config) => {
  config.headers['X-Session-Id'] = getSessionId();
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// ============================================
// SEARCH API
// ============================================
export const searchAPI = {
  search: (query, sessionId, userId = null) =>
    api.post('/search', { query, userId }),
  
  getSuggestions: (q, limit = 10) =>
    api.get('/search/suggestions', { params: { q, limit } }),
  
  getTrending: (days = 7) =>
    api.get('/search/trending', { params: { days } }),
  
  getPopularKeywords: () =>
    api.get('/search/popular-keywords'),
  
  voiceSearch: (transcript, sessionId) =>
    api.post('/search/voice', { transcript }),
  
  getSearchHistory: (sessionId, limit = 20) =>
    api.get(`/search/history/${sessionId}`, { params: { limit } }),
};

// ============================================
// TUTORIAL API
// ============================================
export const tutorialAPI = {
  getTutorials: (params = {}) =>
    api.get('/tutorials', { params }),
  
  getTutorialById: (id) =>
    api.get(`/tutorials/${id}`),
  
  getTutorialSteps: (id) =>
    api.get(`/tutorials/${id}/steps`),
  
  getPrerequisites: (id) =>
    api.get(`/tutorials/${id}/prerequisites`),
  
  getRelatedTutorials: (id, limit = 4) =>
    api.get(`/tutorials/${id}/related`, { params: { limit } }),
  
  updateProgress: (id, userId, currentStep, completed) =>
    api.post(`/tutorials/${id}/progress`, { userId, currentStep, completed }),
  
  getUserProgress: (id, userId) =>
    api.get(`/tutorials/${id}/progress/${userId}`),
  
  getLearningPath: (categoryId = null) =>
    api.get(`/tutorials/learning-path/${categoryId || ''}`),
  
  getCategories: () =>
    api.get('/categories'),
  
  getFeatured: () =>
    api.get('/featured'),
  
  getStats: () =>
    api.get('/stats'),
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
  getDashboard: () =>
    api.get('/admin/dashboard', {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  getContentGaps: (minFailures = 3) =>
    api.get('/admin/content-gaps', {
      params: { min_failures },
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  getFailedQueries: (days = 7, limit = 50) =>
    api.get('/admin/failed-queries', {
      params: { days, limit },
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  createTutorial: (data) =>
    api.post('/admin/tutorials', data, {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  updateTutorial: (id, data) =>
    api.put(`/admin/tutorials/${id}`, data, {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  deleteTutorial: (id) =>
    api.delete(`/admin/tutorials/${id}`, {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  bulkImportKeywords: (data) =>
    api.post('/admin/keywords/bulk', data, {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  refreshMVs: () =>
    api.post('/admin/refresh-mvs', {}, {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  getSystemHealth: () =>
    api.get('/admin/system-health', {
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
  
  getPopularIntents: (limit = 20) =>
    api.get('/admin/popular-intents', {
      params: { limit },
      headers: { 'X-Admin-Key': localStorage.getItem('adminKey') }
    }),
};

// ============================================
// ANALYTICS API
// ============================================
export const analyticsAPI = {
  getQueryAnalytics: (params = {}) =>
    api.get('/analytics/queries', { params }),
  
  getTutorialPerformance: () =>
    api.get('/analytics/tutorials'),
  
  getCategoryPerformance: () =>
    api.get('/analytics/categories'),
  
  getUserAnalytics: () =>
    api.get('/analytics/users'),
  
  getTrafficHeatmap: () =>
    api.get('/analytics/heatmap'),
  
  getTopSearches: (limit = 20, days = 7) =>
    api.get('/analytics/top-searches', { params: { limit, days } }),
  
  getPerformanceMetrics: () =>
    api.get('/analytics/performance'),
  
  getContentCoverage: () =>
    api.get('/analytics/coverage'),
  
  getDailyStats: (days = 30) =>
    api.get('/analytics/daily-stats', { params: { days } }),
  
  exportAnalytics: (format = 'json', from_date, to_date) =>
    api.get('/analytics/export', { params: { format, from_date, to_date } }),
};

export default api;