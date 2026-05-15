const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Note
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, content, link } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    const noteData = {
      title,
      content,
      link,
      userId: req.userId
    };

    if (req.file) {
      noteData.file = 'uploads/' + req.file.filename;
      noteData.originalFileName = req.file.originalname;
    }

    const note = await Note.create(noteData);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Notes of user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.title = req.body.title ?? note.title;
    note.content = req.body.content ?? note.content;
    note.link = req.body.link ?? note.link;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//testing
router.get('/check', auth, (req, res) => {
  res.json({
    userId: req.userId,
    user: req.user
  });
});

module.exports = router;
