const express = require('express');
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const Url = require('../models/Url');

const router = express.Router();

const baseUrl = (req) =>
  (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

// Validation rules
const validateUrl = [
  body('originalUrl')
    .trim()
    .notEmpty()
    .withMessage('originalUrl is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid URL starting with http:// or https://'),
];

const format = (req, url) => ({
  shortUrl: baseUrl(req) + '/' + url.shortCode,
  shortCode: url.shortCode,
  originalUrl: url.originalUrl,
});

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
      return res.status(200).json(format(req, url));
    }

    // Retry on the (rare) short-code collision
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        url = await Url.create({ originalUrl, shortCode: nanoid(7) });
        break;
      } catch (e) {
        if (e.code !== 11000 || attempt === 2) throw e;
      }
    }

    return res.status(201).json(format(req, url));
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
      ...format(req, url),
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
