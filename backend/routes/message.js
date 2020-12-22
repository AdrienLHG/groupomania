const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const messageCtrl = require('../controllers/message');


router.post('/', auth, multer, messageCtrl.createMessage);
router.get('/', auth, messageCtrl.findAllMessages);
router.get('/:messageId', auth, multer, messageCtrl.findOneMessage);
router.put('/:messageId', auth, multer, messageCtrl.updateMessage);
router.delete('/:messageId', auth, messageCtrl.deleteMessage);

module.exports = router; 