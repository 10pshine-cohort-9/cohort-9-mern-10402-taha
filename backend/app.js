const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const { randomUUID } = require('node:crypto');
const logger = require('./utils/logger');
const healthRoutes = require('./routes/healthRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Prevent Express from disclosing version information via X-Powered-By header
app.disable('x-powered-by');

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
}));
app.use(express.json());

app.use(pinoHttp({
  logger,
  genReqId: function (req, res) {
    return req.id || req.headers['x-request-id'] || randomUUID();
  },
  serializers: {
    req: (req) => {
      const sanitizedReq = pinoHttp.stdSerializers.req(req);
      if (req.raw?.body) {
        sanitizedReq.body = req.raw.body;
      }
      return sanitizedReq;
    },
    res: pinoHttp.stdSerializers.res,
    err: pinoHttp.stdSerializers.err,
  }
}));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;

