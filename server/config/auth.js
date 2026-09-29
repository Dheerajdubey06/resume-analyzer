// Unified JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_resume_ai_2026_dev_seed';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
