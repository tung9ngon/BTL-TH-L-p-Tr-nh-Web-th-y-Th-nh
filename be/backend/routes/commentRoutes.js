const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Create a new comment
router.post('/', commentController.createComment);

// Get all comments
router.get('/', commentController.getAllComments);

// Get comments by user ID
router.get('/user/:user_id', commentController.getCommentsByUser);

// Delete a comment
router.delete('/:id', commentController.deleteComment);

module.exports = router;