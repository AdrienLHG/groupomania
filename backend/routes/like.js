/*/ const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/like');
const auth = require('../middleware/auth');

//logique de routing
router.post('/:messageId/like', auth, likeCtrl.likeMessage);

module.exports = router; /*/