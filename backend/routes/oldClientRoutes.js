const express = require('express');
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

router.post('/', addOldClient);
router.get('/', getOldClients);
router.get('/total', calculateTotal);
router.put('/:id', updateOldClient);
router.delete('/:id', deleteOldClient);
router.get('/count-unique', countUniqueClients);

// POST /api/old-clients
router.post('/', addOldClient);

router.get('/count', countAllClients);

router.get('/top-clients', getTopClients);        
router.get('/sales-by-year', getSalesByYear);    

// Optional: bulk delete route for testing
router.delete('/bulk-delete', async (req, res) => {
  try {
    const result = await require('../models/OldClient').deleteMany({});
    res.json({ message: 'All old clients deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;

