// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const dotenv = require("dotenv");
const authRoutes = require('./routes/authRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://edu-connect-snowy.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
