/*/ const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');

//logique de routing
router.post('/:messageId/newComment', auth, commentCtrl.createComment);
router.get('/:messageId/comment/:commentId', auth, commentCtrl.getOneComment);
router.get('/:messageId/comment/', auth, commentCtrl.getAllComment);
router.delete('/comment/:commentId', auth, commentCtrl.deleteComment);

module.exports = router; /*/