<<<<<<< HEAD


const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const connectDatabase = require("./config/database"); // Path check kar lena aapka database folder kahan hai
=======
'use strict';
>>>>>>> 39d5a554612735bc9a6f3e38d0f61bd91235d7ef

require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDatabase = require('../config/database');
const { initSocket } = require('../config/socket');
const { logger } = require('../shared/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server (required for Socket.IO to attach to)
const httpServer = http.createServer(app);

// Initialize Socket.IO on the HTTP server
initSocket(httpServer);

// Connect to MongoDB then start server
connectDatabase()
  .then(() => {
    httpServer.listen(PORT, () => {
      logger.info(`RailSwap server running on port ${PORT}`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        frontend: process.env.FRONTEND_URL || 'http://localhost:5173',
      });
      logger.info('Socket.IO real-time server active');
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to database. Shutting down.', { error: err.message });
    process.exit(1);
  });

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  httpServer.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason: String(reason) });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  process.exit(1);
});
