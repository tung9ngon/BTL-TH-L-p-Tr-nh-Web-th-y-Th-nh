const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../authMiddleWare');

// Create a new comment (yêu cầu xác thực)
router.post('/', authMiddleware, commentController.createComment);

// Get all comments
router.get('/', commentController.getAllComments);

// Get comments by user ID
router.get('/user/:user_id', commentController.getCommentsByUser);

// Delete a comment (yêu cầu xác thực)
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;