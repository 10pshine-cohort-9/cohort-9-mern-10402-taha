const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      logger.warn({ reqId: req.id, error: error.message }, 'Unauthorized access attempt - token failed');
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    logger.warn({ reqId: req.id }, 'Unauthorized access attempt - no token provided');
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

module.exports = { protect };
