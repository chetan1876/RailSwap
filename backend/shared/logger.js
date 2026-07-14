'use strict';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const shouldLog = (level) => LEVELS[level] <= LEVELS[LOG_LEVEL];

const format = (level, message, meta) => {
  const ts = new Date().toISOString();
  const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${ts}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

const logger = {
  error: (message, meta = {}) => {
    if (shouldLog('error')) {
      console.error(format('error', message, meta instanceof Error
        ? { message: meta.message, stack: meta.stack }
        : meta));
    }
  },
  warn: (message, meta = {}) => {
    if (shouldLog('warn')) console.warn(format('warn', message, meta));
  },
  info: (message, meta = {}) => {
    if (shouldLog('info')) console.info(format('info', message, meta));
  },
  debug: (message, meta = {}) => {
    if (shouldLog('debug')) console.debug(format('debug', message, meta));
  },
};

module.exports = { logger };
