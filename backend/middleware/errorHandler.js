const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({ err, reqId: req.id }, err.message || 'An unexpected error occurred');
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
