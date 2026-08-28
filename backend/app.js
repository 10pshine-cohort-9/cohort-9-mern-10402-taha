const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const { randomUUID } = require('crypto');
const logger = require('./utils/logger');
const healthRoutes = require('./routes/healthRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(pinoHttp({
  logger,
  genReqId: function (req, res) {
    return req.id || req.headers['x-request-id'] || randomUUID();
  },
  serializers: {
    req: (req) => {
      const sanitizedReq = pinoHttp.stdSerializers.req(req);
      if (req.raw && req.raw.body) {
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
