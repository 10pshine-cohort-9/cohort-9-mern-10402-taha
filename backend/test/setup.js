/**
 * Global test setup — loaded via .mocharc.yml `require` before all test files.
 *
 * Responsibilities:
 * - Load .env.test environment variables
 * - Provide root hooks for Mocha (DB connect / disconnect / cleanup)
 * - Export the Express app and helpers for test files
 */

const path = require('path');
const dotenv = require('dotenv');

// Load test environment variables BEFORE importing app or models
dotenv.config({ path: path.join(__dirname, '..', '.env.test'), override: true });

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Note = require('../models/Note');

let app;

/**
 * Mocha Root Hook Plugin — these hooks run for every test file.
 * See: https://mochajs.org/#root-hook-plugins
 */
exports.mochaHooks = {
  async beforeAll() {
    this.timeout(15000);
    await mongoose.connect(process.env.MONGO_URI);
    // Import app after env vars are loaded and DB is connected
    app = require('../app');
  },

  async afterAll() {
    this.timeout(15000);
    await User.deleteMany({});
    await Note.deleteMany({});
    await mongoose.connection.close();
  },
};

/**
 * Generate a valid JWT token for a given user ID.
 * Uses the same signing logic as the production authController.
 *
 * @param {string} id - The user's MongoDB ObjectId as a string
 * @param {object} [options] - Optional overrides
 * @param {string} [options.expiresIn='30d'] - Token expiry
 * @returns {string} Signed JWT token
 */
exports.generateTestToken = function (id, options = {}) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: options.expiresIn || '30d',
  });
};

/**
 * Get the Express app instance (lazy-loaded after env setup).
 * @returns {object} Express app
 */
exports.getApp = function () {
  return app;
};
