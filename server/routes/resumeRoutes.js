const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const { uploadResume: multerUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getResumes);

router.post('/upload', multerUpload.single('resume'), uploadResume);

router.route('/:id')
  .get(getResumeById)
  .delete(deleteResume);

module.exports = router;
