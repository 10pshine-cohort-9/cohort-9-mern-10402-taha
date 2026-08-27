require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const pinoHttp = require('pino-http');
const healthRoutes = require('./routes/healthRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
const { randomUUID } = require('crypto');

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});