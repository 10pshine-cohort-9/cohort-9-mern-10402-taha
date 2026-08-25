const Note = require('../models/Note');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

// @desc    Get notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      return next(new Error('Invalid note ID'));
    }

    const note = await Note.findById(id);

    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }

    // Check for user ownership
    if (note.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized'));
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400);
      return next(new Error('Please add a title and content'));
    }

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    logger.info(`Note created by user ${req.user.id}: ${note._id}`);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      return next(new Error('Invalid note ID'));
    }

    const note = await Note.findById(id);

    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }

    // Check for user ownership
    if (note.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized'));
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );

    logger.info(`Note updated by user ${req.user.id}: ${note._id}`);
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      return next(new Error('Invalid note ID'));
    }

    const note = await Note.findById(id);

    if (!note) {
      res.status(404);
      return next(new Error('Note not found'));
    }

    // Check for user ownership
    if (note.user.toString() !== req.user.id) {
      res.status(401);
      return next(new Error('User not authorized'));
    }

    await note.deleteOne();

    logger.info(`Note deleted by user ${req.user.id}: ${note._id}`);
    // Returning 200 with the deleted id is a common pattern for frontend to remove it from state easily,
    // though 204 No Content is also standard. Following PR #8 pattern (json response).
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
};
