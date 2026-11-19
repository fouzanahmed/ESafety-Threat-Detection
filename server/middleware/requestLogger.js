const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const REQUEST_ID_HEADER = 'X-Request-Id';

// Only forward client-supplied IDs that are short and made of safe characters,
// so an incoming header can't inject arbitrary content into the logs.
const VALID_REQUEST_ID = /^[A-Za-z0-9._-]{1,128}$/;

function resolveRequestId(req) {
  const incoming = req.get(REQUEST_ID_HEADER);
  if (typeof incoming === 'string' && VALID_REQUEST_ID.test(incoming)) {
    return incoming;
  }
  return uuidv4();
}

/**
 * Assigns each request a correlation ID (forwarded from the X-Request-Id
 * header when valid, otherwise a new UUID v4), echoes it on the response,
 * and logs method, path, status and duration once the response finishes.
 */
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  const requestId = resolveRequestId(req);

  req.id = requestId;
  res.setHeader(REQUEST_ID_HEADER, requestId);

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info('request completed', {
      requestId,
      method: req.method,
      path: req.originalUrl.split('?')[0],
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100
    });
  });

  next();
}

module.exports = requestLogger;
module.exports.REQUEST_ID_HEADER = REQUEST_ID_HEADER;
