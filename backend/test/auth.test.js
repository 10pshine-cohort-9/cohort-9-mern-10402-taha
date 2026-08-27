const { expect } = require('chai');
const request = require('supertest');
const { getApp } = require('./setup');
const User = require('../models/User');

describe('Authentication API', function () {
  // Clean up users before each test for full isolation
  beforeEach(async function () {
    await User.deleteMany({});
  });

  // ─── Signup ────────────────────────────────────────────────────────

  describe('POST /api/auth/signup', function () {
    it('should register a new user and return 201 with _id, name, email, token', async function () {
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name', 'Test User');
      expect(res.body).to.have.property('email', 'test@example.com');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.be.a('string').and.not.be.empty;
    });

    it('should not return the password in the signup response', async function () {
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(201);
      expect(res.body).to.not.have.property('password');
    });

    it('should store a hashed password in the database, not the plain password', async function () {
      await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password123' });

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).to.exist;
      expect(user.password).to.not.equal('password123');
      // bcrypt hashes start with $2a$ or $2b$
      expect(user.password).to.match(/^\$2[ab]\$/);
    });

    it('should return 400 when name is missing', async function () {
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 when email is missing', async function () {
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Test User', password: 'password123' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 when password is missing', async function () {
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Test User', email: 'test@example.com' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 for duplicate email', async function () {
      // Register first user
      await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'User One', email: 'duplicate@example.com', password: 'password123' });

      // Attempt duplicate registration
      const res = await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'User Two', email: 'duplicate@example.com', password: 'password456' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('User already exists');
    });
  });

  // ─── Login ─────────────────────────────────────────────────────────

  describe('POST /api/auth/login', function () {
    // Create a user to log in with
    beforeEach(async function () {
      await request(getApp())
        .post('/api/auth/signup')
        .send({ name: 'Login User', email: 'login@example.com', password: 'password123' });
    });

    it('should login successfully and return 200 with _id, name, email, token', async function () {
      const res = await request(getApp())
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name', 'Login User');
      expect(res.body).to.have.property('email', 'login@example.com');
      expect(res.body).to.have.property('token');
      expect(res.body.token).to.be.a('string').and.not.be.empty;
    });

    it('should not return the password in the login response', async function () {
      const res = await request(getApp())
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).to.equal(200);
      expect(res.body).to.not.have.property('password');
    });

    it('should return 401 for wrong password', async function () {
      const res = await request(getApp())
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Invalid credentials');
    });

    it('should return 401 for nonexistent email', async function () {
      const res = await request(getApp())
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Invalid credentials');
    });

    it('should return 400 when email is missing', async function () {
      const res = await request(getApp())
        .post('/api/auth/login')
        .send({ password: 'password123' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 when password is missing', async function () {
      const res = await request(getApp())
        .post('/api/auth/login')
        .send({ email: 'login@example.com' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });
  });
});
