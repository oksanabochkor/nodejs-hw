import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
  } = req.query;

  const skip = (page - 1) * perPage;

  let query = Note.find();

  // filter by tag
  if (tag) {
    query = query.where('tag').equals(tag);
  }

  // search (title + content) через OR chaining
  if (search) {
    query = query.or([
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ]);
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(query.getFilter()),
    query.skip(skip).limit(Number(perPage)),
  ]);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages: Math.ceil(totalNotes / perPage),
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.json(note);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  const deleted = await Note.findByIdAndDelete(noteId);

  if (!deleted) {
    throw createHttpError(404, 'Note not found');
  }

  res.json(deleted);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const updated = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });

  if (!updated) {
    throw createHttpError(404, 'Note not found');
  }

  res.json(updated);
};