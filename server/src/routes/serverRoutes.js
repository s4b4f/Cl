const express = require('express');
const router = express.Router();
const { createServer, getServers, joinServer, deleteServer } = require('../controllers/serverController');

router.post('/', createServer);
router.get('/:userId', getServers);
router.post('/join', joinServer);
router.delete('/', deleteServer);

module.exports = router;