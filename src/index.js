const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/url');
const Url = require('./models/Url');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Needed on Render/Heroku etc. so rate limiting uses the real client IP
app.set('trust proxy', 1);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again after a minute' },
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.static('public'));
app.use('/api', urlRoutes);

app.get('/:code', async (req, res, next) => {
  try {
    // Atomic increment avoids lost updates under concurrent clicks
    const url = await Url.findOneAndUpdate(
      { shortCode: req.params.code },
      { $inc: { clicks: 1 } }
    );
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
