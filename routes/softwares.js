const express = require('express');
const router = express.Router();
const Software = require('../models/Software');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const category = req.query.category || '';

  try {
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const total = await Software.countDocuments(query);
    const softwares = await Software.find(query)
      .populate('category')
      .skip((page - 1) * limit)
      .limit(limit);
    res.json({ softwares, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const software = await Software.findById(req.params.id).populate('category');
    if (!software) return res.status(404).json({ message: 'Software not found' });
    res.json(software);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { title, description, category, downloadLink } = req.body;
  try {
    const software = new Software({ title, description, category, downloadLink });
    await software.save();
    res.status(201).json(software);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  const { title, description, category, downloadLink } = req.body;
  try {
    const software = await Software.findById(req.params.id);
    if (!software) return res.status(404).json({ message: 'Software not found' });
    software.title = title || software.title;
    software.description = description || software.description;
    software.category = category || software.category;
    software.downloadLink = downloadLink || software.downloadLink;
    await software.save();
    res.json(software);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await Software.findByIdAndDelete(req.params.id);
    res.json({ message: 'Software deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;