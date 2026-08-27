const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const { getApp, generateTestToken } = require('./setup');
const User = require('../models/User');
const Note = require('../models/Note');

describe('Notes CRUD API', function () {
  let userOneToken;
  let userOneId;
  let userTwoToken;
  let userTwoId;

  // Create two test users before the suite
  before(async function () {
    await User.deleteMany({});
    await Note.deleteMany({});

    // Register User One
    const res1 = await request(getApp())
      .post('/api/auth/signup')
      .send({ name: 'User One', email: 'userone@example.com', password: 'password123' });
    userOneToken = res1.body.token;
    userOneId = res1.body._id;

    // Register User Two
    const res2 = await request(getApp())
      .post('/api/auth/signup')
      .send({ name: 'User Two', email: 'usertwo@example.com', password: 'password123' });
    userTwoToken = res2.body.token;
    userTwoId = res2.body._id;
  });

  // Clean up notes between each test (keep users)
  afterEach(async function () {
    await Note.deleteMany({});
  });

  after(async function () {
    await User.deleteMany({});
    await Note.deleteMany({});
  });

  // ─── Create Note ──────────────────────────────────────────────────

  describe('POST /api/notes', function () {
    it('should create a note with valid data and return 201', async function () {
      const res = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Test Note', content: 'Test content' });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('title', 'Test Note');
      expect(res.body).to.have.property('content', 'Test content');
      expect(res.body).to.have.property('user', userOneId);
    });

    it('should return 401 when creating a note without authentication', async function () {
      const res = await request(getApp())
        .post('/api/notes')
        .send({ title: 'Test Note', content: 'Test content' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 when title is missing', async function () {
      const res = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ content: 'Test content' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });

    it('should return 400 when content is missing', async function () {
      const res = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Test Note' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
    });
  });

  // ─── Get Notes ────────────────────────────────────────────────────

  describe('GET /api/notes', function () {
    it('should return 200 with an empty array for a user with no notes', async function () {
      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('should return all notes for the authenticated user', async function () {
      // Create two notes for User One
      await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Note 1', content: 'Content 1' });

      await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Note 2', content: 'Content 2' });

      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
      expect(res.body[0]).to.have.property('title');
      expect(res.body[0]).to.have.property('content');
    });

    it('should only return notes belonging to the authenticated user', async function () {
      // Create a note for User One
      await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'User One Note', content: 'Private content' });

      // Create a note for User Two
      await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send({ title: 'User Two Note', content: 'Also private' });

      // User One should only see their own note
      const res = await request(getApp())
        .get('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0]).to.have.property('title', 'User One Note');
    });
  });

  // ─── Get Single Note ──────────────────────────────────────────────

  describe('GET /api/notes/:id', function () {
    it('should return a single note by ID', async function () {
      const createRes = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Single Note', content: 'Single content' });

      const noteId = createRes.body._id;

      const res = await request(getApp())
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', noteId);
      expect(res.body).to.have.property('title', 'Single Note');
      expect(res.body).to.have.property('content', 'Single content');
    });

    it('should return 404 for a nonexistent note ID', async function () {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(getApp())
        .get(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Note not found');
    });

    it('should return 400 for an invalid ObjectId', async function () {
      const res = await request(getApp())
        .get('/api/notes/invalid-id-format')
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Invalid note ID');
    });
  });

  // ─── Update Note ──────────────────────────────────────────────────

  describe('PUT /api/notes/:id', function () {
    it('should update an existing note and return 200', async function () {
      const createRes = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Original Title', content: 'Original content' });

      const noteId = createRes.body._id;

      const res = await request(getApp())
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Updated Title', content: 'Updated content' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', noteId);
      expect(res.body).to.have.property('title', 'Updated Title');
      expect(res.body).to.have.property('content', 'Updated content');
    });

    it('should return 404 for updating a nonexistent note', async function () {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(getApp())
        .put(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Updated', content: 'Updated' });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Note not found');
    });

    it('should return 400 for an invalid ObjectId', async function () {
      const res = await request(getApp())
        .put('/api/notes/invalid-id-format')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Updated', content: 'Updated' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Invalid note ID');
    });

    it('should return 401 when updating without authentication', async function () {
      const createRes = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Some Note', content: 'Some content' });

      const noteId = createRes.body._id;

      const res = await request(getApp())
        .put(`/api/notes/${noteId}`)
        .send({ title: 'Hacked', content: 'Hacked content' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
    });
  });

  // ─── Delete Note ──────────────────────────────────────────────────

  describe('DELETE /api/notes/:id', function () {
    it('should delete an existing note and return 200 with the deleted id', async function () {
      const createRes = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'To Delete', content: 'Will be deleted' });

      const noteId = createRes.body._id;

      const res = await request(getApp())
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id', noteId);

      // Verify note is actually deleted from the database
      const check = await request(getApp())
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(check.status).to.equal(404);
    });

    it('should return 404 for deleting a nonexistent note', async function () {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(getApp())
        .delete(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Note not found');
    });

    it('should return 400 for an invalid ObjectId', async function () {
      const res = await request(getApp())
        .delete('/api/notes/invalid-id-format')
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('Invalid note ID');
    });

    it('should return 401 when deleting without authentication', async function () {
      const createRes = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'Protected Note', content: 'Cannot delete without auth' });

      const noteId = createRes.body._id;

      const res = await request(getApp())
        .delete(`/api/notes/${noteId}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
    });
  });

  // ─── Authorization / Ownership ────────────────────────────────────

  describe('Authorization / Ownership', function () {
    let userOneNoteId;

    beforeEach(async function () {
      // Create a note owned by User One
      const createRes = await request(getApp())
        .post('/api/notes')
        .set('Authorization', `Bearer ${userOneToken}`)
        .send({ title: 'User One Private Note', content: 'Private content' });

      userOneNoteId = createRes.body._id;
    });

    it('should allow a user to access their own note', async function () {
      const res = await request(getApp())
        .get(`/api/notes/${userOneNoteId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', userOneNoteId);
    });

    it('should return 401 when a user tries to GET another user\'s note', async function () {
      const res = await request(getApp())
        .get(`/api/notes/${userOneNoteId}`)
        .set('Authorization', `Bearer ${userTwoToken}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('User not authorized');
    });

    it('should return 401 when a user tries to UPDATE another user\'s note', async function () {
      const res = await request(getApp())
        .put(`/api/notes/${userOneNoteId}`)
        .set('Authorization', `Bearer ${userTwoToken}`)
        .send({ title: 'Hijacked', content: 'Hijacked content' });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('User not authorized');

      // Verify the note was NOT modified
      const check = await request(getApp())
        .get(`/api/notes/${userOneNoteId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(check.body).to.have.property('title', 'User One Private Note');
    });

    it('should return 401 when a user tries to DELETE another user\'s note', async function () {
      const res = await request(getApp())
        .delete(`/api/notes/${userOneNoteId}`)
        .set('Authorization', `Bearer ${userTwoToken}`);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.include('User not authorized');

      // Verify the note still exists
      const check = await request(getApp())
        .get(`/api/notes/${userOneNoteId}`)
        .set('Authorization', `Bearer ${userOneToken}`);

      expect(check.status).to.equal(200);
      expect(check.body).to.have.property('_id', userOneNoteId);
    });
  });
});
