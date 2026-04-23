const { formatValidationError } = require('../utils/responseFormatter');
const { validateSearchQuery, validateTutorialId, validateTutorialInput } = require('../utils/validators');
const { SEARCH } = require('../config/constants');

/**
 * Validate search request
 */
const validateSearch = (req, res, next) => {
  const { query: searchQuery } = req.body;
  
  const validation = validateSearchQuery(searchQuery);
  
  if (!validation.isValid) {
    return res.status(400).json(
      formatValidationError([{ field: 'query', message: validation.error }])
    );
  }
  
  // Sanitize and normalize
  req.body.query = validation.value;
  
  next();
};

/**
 * Validate tutorial ID parameter
 */
const validateTutorialIdParam = (req, res, next) => {
  const { id } = req.params;
  
  if (!validateTutorialId(id)) {
    return res.status(400).json(
      formatValidationError([{ field: 'id', message: 'Invalid tutorial ID' }])
    );
  }
  
  req.params.id = parseInt(id);
  
  next();
};

/**
 * Validate tutorial creation/update
 */
const validateTutorial = (req, res, next) => {
  const validation = validateTutorialInput(req.body);
  
  if (!validation.isValid) {
    return res.status(400).json(
      formatValidationError(validation.errors.map(err => ({ message: err })))
    );
  }
  
  next();
};

/**
 * Validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  let { page, limit } = req.query;
  
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;
  
  req.query.page = page;
  req.query.limit = limit;
  
  next();
};

/**
 * Validate date range
 */
const validateDateRange = (req, res, next) => {
  const { from_date, to_date } = req.query;
  
  if (from_date) {
    const fromDate = new Date(from_date);
    if (isNaN(fromDate.getTime())) {
      return res.status(400).json(
        formatValidationError([{ field: 'from_date', message: 'Invalid start date' }])
      );
    }
    req.query.from_date = fromDate.toISOString();
  }
  
  if (to_date) {
    const toDate = new Date(to_date);
    if (isNaN(toDate.getTime())) {
      return res.status(400).json(
        formatValidationError([{ field: 'to_date', message: 'Invalid end date' }])
      );
    }
    req.query.to_date = toDate.toISOString();
  }
  
  if (from_date && to_date && new Date(from_date) > new Date(to_date)) {
    return res.status(400).json(
      formatValidationError([{ message: 'Start date must be before end date' }])
    );
  }
  
  next();
};

/**
 * Validate bulk keyword import
 */
const validateBulkKeywords = (req, res, next) => {
  const { intent_id, keywords } = req.body;
  
  const errors = [];
  
  if (!intent_id || isNaN(parseInt(intent_id))) {
    errors.push({ field: 'intent_id', message: 'Valid intent ID is required' });
  }
  
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    errors.push({ field: 'keywords', message: 'Keywords array is required' });
  } else if (keywords.length > 1000) {
    errors.push({ field: 'keywords', message: 'Maximum 1000 keywords per batch' });
  } else {
    // Validate each keyword
    keywords.forEach((kw, index) => {
      if (!kw.text || typeof kw.text !== 'string' || kw.text.trim().length < 2) {
        errors.push({ 
          field: `keywords[${index}].text`, 
          message: 'Keyword must be at least 2 characters' 
        });
      }
      if (!kw.language || !['urdu', 'roman_urdu', 'english'].includes(kw.language)) {
        errors.push({ 
          field: `keywords[${index}].language`, 
          message: 'Invalid language (use: urdu, roman_urdu, or english)' 
        });
      }
    });
  }
  
  if (errors.length > 0) {
    return res.status(400).json(formatValidationError(errors));
  }
  
  next();
};

/**
 * Validate progress update
 */
const validateProgressUpdate = (req, res, next) => {
  const { userId, currentStep, completed } = req.body;
  
  const errors = [];
  
  if (!userId) {
    errors.push({ field: 'userId', message: 'User ID is required' });
  }
  
  if (currentStep !== undefined) {
    const step = parseInt(currentStep);
    if (isNaN(step) || step < 1) {
      errors.push({ field: 'currentStep', message: 'Step must be a positive number' });
    }
    req.body.currentStep = step;
  }
  
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push({ field: 'completed', message: 'Completed must be a boolean' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json(formatValidationError(errors));
  }
  
  next();
};

module.exports = {
  validateSearch,
  validateTutorialIdParam,
  validateTutorial,
  validatePagination,
  validateDateRange,
  validateBulkKeywords,
  validateProgressUpdate
};