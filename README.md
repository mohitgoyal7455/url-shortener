# 🔗 URL Shortener

A full-stack URL Shortener built with **Node.js**, **Express**, and **MongoDB**.

## Features
- Shorten any long URL
- Redirect to original URL via short code
- Track click counts
- Input validation
- Rate limiting & security headers
- Clean frontend UI

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- nanoid (short code generation)
- express-validator (validation)
- helmet + cors + express-rate-limit (security)

## Getting Started

### Prerequisites
- Node.js v20.19+
- MongoDB (local or Atlas)

### Installation

1. Clone the repo
   git clone https://github.com/mohitgoyal7455/url-shortener.git
   cd url-shortener

2. Install dependencies
   npm install

3. Create .env file
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/urlshortener
   BASE_URL=http://localhost:8000
   (or copy .env.example to .env)

4. Start the server
   npm run dev

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/shorten | Shorten a URL |
| GET | /api/stats/:code | Get URL stats |
| GET | /:code | Redirect to original URL |

## API Examples

### Shorten a URL
POST /api/shorten
Content-Type: application/json
{ "originalUrl": "https://google.com" }

### Get Stats
GET /api/stats/JPNBfKK

## Deploy on Render (Free)

1. Push code to GitHub
2. Go to https://render.com and sign up
3. Click New → Web Service
4. Connect your GitHub repo
5. Set these settings:
   - Build Command: npm install
   - Start Command: node src/index.js
6. Add environment variables:
   - MONGO_URI = your MongoDB Atlas connection string
   - BASE_URL = your Render app URL
   - PORT = 8000
   - NODE_ENV = production
7. Click Deploy!

## Project Structure

url-shortener/
├── public/
│   └── index.html
├── src/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Url.js
│   ├── routes/
│   │   └── url.js
│   └── index.js
├── .env.example
├── .gitignore
└── package.json
