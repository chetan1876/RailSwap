<<<<<<< HEAD
 
const express = require("express");
const cors = require("cors");
// Extension ke sath load karein taaki module easily mil sake
const pnrRoutes = require("../modules/pnr/pnr.routes.js"); 
=======
'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const corsMiddleware = require('../config/cors');
const { generalLimiter } = require('../config/rateLimit');
const errorHandler = require('../middleware/errorHandler');

// Route modules
const authRoutes = require('../modules/auth/auth.routes');
const chatbotRoutes = require('../modules/chatbot/chatbot.routes');
const pnrRoutes = require('../modules/pnr/pnr.routes');
>>>>>>> 39d5a554612735bc9a6f3e38d0f61bd91235d7ef

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow frontend embedding
}));
app.use(corsMiddleware);
app.use(generalLimiter);  // General rate limiting

// ─── Parsing Middleware ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

// ─── Request Logging ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'RailSwap Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RailSwap API — Smart Railway Passenger Assistance Platform',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/pnr', pnrRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`,
  });
});

// ─── Global Error Handler (must be LAST) ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
<<<<<<< HEAD
 
=======
>>>>>>> 39d5a554612735bc9a6f3e38d0f61bd91235d7ef
