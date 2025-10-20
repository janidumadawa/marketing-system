// backend/routes/oldTargetRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getOldTarget,
  createOldTarget,
  updateOldTarget,
  upsertOldTarget,
  getAllOldTargets, 
  deleteOldTarget,
  getTargetsByYear,
  getTargetsByMonth,
  getAvailableYears,
} = require('../controllers/oldTargetController');

const router = express.Router();

// All routes are protected
router.get('/', protect, getOldTarget);
router.get('/all', protect, getAllOldTargets);
router.get('/targets-by-year', protect, getTargetsByYear);
router.get('/targets-by-month', protect, getTargetsByMonth);
router.get('/available-years', protect, getAvailableYears);

// Use separate create and update routes
router.post('/', protect, createOldTarget); // Create new target
router.put('/', protect, updateOldTarget);  // Update existing target

// Optional: Keep upsert for backward compatibility (you can remove this later)
router.post('/upsert', protect, upsertOldTarget);

router.delete('/', protect, deleteOldTarget);

module.exports = router;