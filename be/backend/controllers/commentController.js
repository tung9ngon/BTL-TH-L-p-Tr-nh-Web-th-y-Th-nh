const Comment = require('../models/commentModel');

const commentController = {
  // Create a new comment
createComment: async (req, res) => {
  console.log('Received data:', req.body); // Thêm dòng này để kiểm tra dữ liệu nhận được
  try {
    const { user_id, username, comment, rating } = req.body;
    
    if (!user_id || !username || !comment || !rating) {
      console.log('Missing fields:', { user_id, username, comment, rating });
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const result = await Comment.create({ user_id, username, comment, rating });
    console.log('Created comment:', result);
    res.status(201).json({
      id: result.insertId,
      user_id,
      username,
      comment,
      rating,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
},

  // Get all comments
  getAllComments: async (req, res) => {
    try {
      const comments = await Comment.getAll();
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get comments by user ID
  getCommentsByUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const comments = await Comment.getByUserId(user_id);
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching user comments:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete a comment
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const isDeleted = await Comment.delete(id);
      
      if (!isDeleted) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = commentController;