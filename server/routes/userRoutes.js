const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(uploadImage.single('avatar'), updateProfile);

router.put('/settings/password', updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;
