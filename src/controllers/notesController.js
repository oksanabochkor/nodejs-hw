import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    tag,
    search,
  } = req.query;

  const skip = (page - 1) * perPage;

  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        content: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }

  const totalNotes = await Note.countDocuments(filter);

  const notes = await Note.find(filter)
    .skip(skip)
    .limit(Number(perPage));

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
    return res.status(404).json({ message: 'Note not found' });
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
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json({ message: 'Note deleted' });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const updated = await Note.findByIdAndUpdate(noteId, req.body, {
    new: true,
  });

  if (!updated) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(updated);
};