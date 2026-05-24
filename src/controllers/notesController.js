import { Note } from '../models/note.js';

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