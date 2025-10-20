const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { 
  upsertMonthlyTarget,
  getMonthlyTarget
} = require('../controllers/monthlyTargetController');

const router = express.Router();

router.post('/', protect, upsertMonthlyTarget);
router.get('/', protect, getMonthlyTarget);

module.exports = router;