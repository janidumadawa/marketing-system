const express = require('express');
const {
  getOldTarget,
  upsertOldTarget,
  getAllOldTargets, 
  deleteOldTarget,
  getTargetsByYear,
  getTargetsByMonth,  // Add this import
  getAvailableYears,  // Add this import
} = require('../controllers/oldTargetController');

const router = express.Router();

router.get('/', getOldTarget);
router.get('/all', getAllOldTargets);
router.get('/targets-by-year', getTargetsByYear);
router.get('/targets-by-month', getTargetsByMonth);  // Add this new route
router.get('/available-years', getAvailableYears);   // Add this new route
router.post('/', upsertOldTarget);
router.delete('/', deleteOldTarget); 

module.exports = router;