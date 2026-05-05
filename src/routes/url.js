const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const router = express.Router();

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

module.exports = router;