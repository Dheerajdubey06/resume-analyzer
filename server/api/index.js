const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  // Ensure database connection is initialized for serverless invocations
  await connectDB();
  return app(req, res);
};
