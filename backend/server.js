require('dotenv').config();
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const app = require('./app');

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});