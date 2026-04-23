const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // PostgreSQL specific errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(409).json({
          error: 'Duplicate entry',
          detail: err.detail
        });
      case '23503': // Foreign key violation
        return res.status(400).json({
          error: 'Invalid reference',
          detail: err.detail
        });
      case '42P01': // Undefined table
        return res.status(500).json({
          error: 'Database schema error',
          detail: 'Table does not exist'
        });
    }
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };