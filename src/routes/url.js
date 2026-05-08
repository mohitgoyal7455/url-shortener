const express = require('express');
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const Url = require('../models/Url');

const router = express.Router();

// Validation rules
const validateUrl = [
  body('originalUrl')
    .notEmpty()
    .withMessage('originalUrl is required')
    .isURL()
    .withMessage('Please provide a valid URL'),
];

// POST /api/shorten
router.post('/shorten', validateUrl, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { originalUrl } = req.body;

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
    next(error);
  }
});

// GET /api/stats/:code
router.get('/stats/:code', async (req, res, next) => {
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
    next(error);
  }
});

module.exports = router;