const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server .env or root .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 ====================================================
     ResumeAI Server running in ${process.env.NODE_ENV || 'development'} mode
     API Base URL: http://localhost:${PORT}/api
     Health Check: http://localhost:${PORT}/api/health
  ====================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Do not crash in development
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});
