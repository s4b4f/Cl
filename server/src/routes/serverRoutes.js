const express = require('express');
const router = express.Router();
const { createServer, getServers, joinServer, deleteServer, getServerInfo } = require('../controllers/serverController');

router.post('/', createServer);
router.post('/join', joinServer);
router.get('/info/:serverId', getServerInfo);
router.get('/:userId', getServers);
router.delete('/', deleteServer);

module.exports = router;