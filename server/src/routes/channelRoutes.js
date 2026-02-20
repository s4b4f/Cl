const express = require('express');
const router = express.Router();
const { createChannel, getChannels } = require('../controllers/channelController');

router.post('/', createChannel);
router.get('/:serverId', getChannels);

module.exports = router;