const express = require('express');
const { 
  upsertMonthlyTarget,
  getMonthlyTarget
} = require('../controllers/monthlyTargetController');

const router = express.Router();

router.post('/', upsertMonthlyTarget);
router.get('/', getMonthlyTarget);

module.exports = router;
