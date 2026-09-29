const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  deleteUserByAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUserByAdmin);

module.exports = router;
