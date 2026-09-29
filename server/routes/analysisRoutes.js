const express = require('express');
const router = express.Router();
const {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createAnalysis)
  .get(getAnalyses);

router.route('/:id')
  .get(getAnalysisById)
  .delete(deleteAnalysis);

module.exports = router;
