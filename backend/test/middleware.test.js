const { expect } = require('chai');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { getApp, generateTestToken } = require('./setup');
const User = require('../models/User');

describe('Middleware', function () {
  // ─── Auth Middleware ───────────────────────────────────────────────

  describe('Auth Middleware (protect)', function () {
    let testUser;

    before(async function () {
      await User.deleteMany({});
      // Create a user via the API so we have a valid DB record
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Middleware User', email: 'middleware@example.com', password: 'password123' });
      testUser = res.body;
    });

    after(async function () {
      await User.deleteMany({});
    });

    it('should return 401 when no Authorization header is provided', async function () {
      const res = await request(getApp())
        .get('/api/notes');

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Not authorized, no token');
    });

    it('should return 401 when Authorization header has no Bearer prefix', async function () {
      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', 'NotBearer sometoken');

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Not authorized, no token');
    });

    it('should return 401 when token is invalid/malformed', async function () {
      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Not authorized, token failed');
    });

    it('should return 401 when token is expired', async function () {
      // Generate a token that expires immediately
      const expiredToken = jwt.sign(
        { id: testUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Small delay to ensure token is expired
      await new Promise((resolve) => setTimeout(resolve, 100));

      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Not authorized, token failed');
    });

    it('should allow access with a valid token', async function () {
      const token = generateTestToken(testUser._id);

      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      // Should reach the notes handler successfully (200 with empty array or notes)
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });
  });

  // ─── 404 Not Found Middleware ──────────────────────────────────────

  describe('404 Not Found Middleware', function () {
    it('should return 404 with message for unknown routes', async function () {
      const res = await request(getApp())
        .get('/api/nonexistent-route');

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Not Found');
      expect(res.body.message).to.include('/api/nonexistent-route');
    });

    it('should return JSON response for unknown POST routes', async function () {
      const res = await request(getApp())
        .post('/api/does-not-exist')
        .send({ data: 'test' });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message');
    });
  });

  // ─── Central Error Handler ─────────────────────────────────────────

  describe('Central Error Handler', function () {
    it('should return JSON error with message property', async function () {
      // Trigger an error by accessing a protected route without auth
      const res = await request(getApp())
        .get('/api/notes');

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.a('string');
    });

    it('should include stack trace in non-production environment', async function () {
      const res = await request(getApp())
        .get('/api/notes');

      expect(res.status).to.equal(401);
      // In test/development, stack should be present
      expect(res.body).to.have.property('stack');
      expect(res.body.stack).to.be.a('string');
    });

    it('should NOT include stack trace when NODE_ENV is production', async function () {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const res = await request(getApp())
          .get('/api/notes');

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
        // In production, stack should be null (not leaked to clients)
        expect(res.body.stack).to.be.null;
      } finally {
        // Restore original env to avoid polluting other tests
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
