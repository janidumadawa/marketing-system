// backend/routes/oldClientRoutes.js
const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  addOldClient,
  getOldClients,
  calculateTotal,
  updateOldClient,
  deleteOldClient,
  countUniqueClients,
  countAllClients,
  getTopClients,
  getSalesByYear
} = require('../controllers/oldClientController');

const router = express.Router();

// All routes are now protected
router.post('/', protect, addOldClient);
router.get('/', protect, getOldClients);
router.get('/total', protect, calculateTotal);
router.put('/:id', protect, updateOldClient);
router.delete('/:id', protect, deleteOldClient);
router.get('/count-unique', protect, countUniqueClients);
router.get('/count', protect, countAllClients);
router.get('/top-clients', protect, getTopClients);
router.get('/sales-by-year', protect, getSalesByYear);

// Bulk delete route (protected)
router.delete('/bulk-delete', protect, async (req, res) => {
  try {
    const result = await require('../models/OldClient').deleteMany({ user: req.user._id });
    res.json({ message: 'All old clients deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;