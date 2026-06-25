const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/url');
const Url = require('./models/Url');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again after a minute' },
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.static('public'));
app.use('/api', urlRoutes);

app.get('/:code', async (req, res, next) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    url.clicks += 1;
    await url.save();
    return res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener API is running!' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});