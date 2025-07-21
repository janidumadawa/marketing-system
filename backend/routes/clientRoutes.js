  const express = require('express');
  const {
    addClient,
    getClients,
    updateClient,
    deleteClient,
    countUniqueClients,
  } = require('../controllers/clientController');

  const router = express.Router();


  // POST /api/clients
  router.post('/', addClient);

  // GET /api/clients
  router.get('/', getClients);

  // PUT /api/clients/:id
  router.put('/:id', updateClient);

  // DELETE /api/clients/:id
  router.delete('/:id', deleteClient);

  // GET /api/clients/count-unique
  router.get('/count-unique', countUniqueClients);


  module.exports = router;