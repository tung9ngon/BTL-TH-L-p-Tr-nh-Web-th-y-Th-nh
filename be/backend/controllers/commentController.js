const Comment = require('../models/commentModel');

exports.createComment = async (req, res) => {
  try {
    const { user_id, comment, rating } = req.body;
    
    console.log('Received comment data:', { user_id, comment, rating }); // Debug log
    
    // Validate input
    if (!user_id || !comment || !rating) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin (user_id, comment, rating)'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating phải từ 1 đến 5 sao'
      });
    }

    const result = await Comment.create({ user_id, comment, rating });
    
    res.status(201).json({
      success: true,
      message: 'Bình luận đã được thêm',
      commentId: result.insertId
    });
    
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server: ' + error.message,
      error: error.message
    });
  }
};


exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.getAll();
    res.json({ 
      success: true, 
      comments 
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi lấy bình luận', 
      error: error.message 
    });
  }
};

exports.getCommentsByUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const comments = await Comment.getByUserId(userId);
    res.json({ 
      success: true, 
      comments 
    });
  } catch (error) {
    console.error('Error getting user comments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi lấy bình luận', 
      error: error.message 
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const success = await Comment.delete(commentId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Bình luận đã được xóa' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy bình luận' 
      });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi khi xóa bình luận', 
      error: error.message 
    });
  }
};