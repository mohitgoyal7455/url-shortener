const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/url');
const Url = require('./models/Url');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use('/api', urlRoutes);

// GET /:code - redirect
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    url.clicks += 1;
    await url.save();
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener API is running!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});