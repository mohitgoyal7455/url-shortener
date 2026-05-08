const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const router = express.Router();

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }
  try {
    let url = await Url.findOne({ originalUrl });
    if (url) {
      return res.status(200).json({
        shortUrl: process.env.BASE_URL + '/' + url.shortCode,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
      });
    }
    const shortCode = nanoid(7);
    url = await Url.create({ originalUrl, shortCode });
    return res.status(201).json({
      shortUrl: process.env.BASE_URL + '/' + url.shortCode,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/stats/:code
router.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    return res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: process.env.BASE_URL + '/' + url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;