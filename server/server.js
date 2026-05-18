const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('[DATABASE] MongoDB Atlas connected successfully.'))
  .catch((err) => {
    console.error('[DATABASE] Connection error encountered:', err.message);
    process.exit(1);
  });

// ==========================================
// API Route Registration
// ==========================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks')); // <-- ADD THIS LINE

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: "Server and Database pipelines are green" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] Operating smoothly on port ${PORT}`);
});