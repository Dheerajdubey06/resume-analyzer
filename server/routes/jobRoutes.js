const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { uploadResume: multerUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .post(multerUpload.single('jobFile'), createJob)
  .get(getJobs);

router.route('/:id')
  .get(getJobById)
  .delete(deleteJob);

module.exports = router;
