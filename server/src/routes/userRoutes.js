const express = require('express');
const router = express.Router();
const { changeUsername } = require('../controllers/userController');

router.put('/username', changeUsername);

module.exports = router;