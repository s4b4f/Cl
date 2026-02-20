const express = require('express');
const router = express.Router();
const { sendRequest, getRequests, respondRequest, getFriends } = require('../controllers/friendController');

router.post('/request', sendRequest);
router.post('/respond', respondRequest);
router.get('/requests/:userId', getRequests);
router.get('/:userId', getFriends);

module.exports = router;