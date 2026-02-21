const express = require('express');
const router = express.Router();
const { createServer, getServers, joinServer, deleteServer, getServerInfo, createInvite, joinByInvite } = require('../controllers/serverController');

router.post('/', createServer);
router.post('/join', joinServer);
router.post('/invite', createInvite);
router.post('/invite/join', joinByInvite);
router.get('/info/:serverId', getServerInfo);
router.get('/:userId', getServers);
router.delete('/', deleteServer);

module.exports = router;