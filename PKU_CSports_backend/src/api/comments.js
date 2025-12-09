const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/auth');

router.post('/:postId', authMiddleware, commentController.create);
router.get('/:postId', commentController.list);

module.exports = router;

