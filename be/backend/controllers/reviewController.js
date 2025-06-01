const Review = require('../models/reviewModel');

exports.createReview = (req, res) => {
  const { booking_id, user_id, rating, comment } = req.body;

  // Validate input
  if (!booking_id || !user_id || !rating) {
    return res.status(400).json({ 
      success: false,
      message: 'Vui lòng cung cấp booking_id, user_id và rating' 
    });
  }

  // Kiểm tra rating hợp lệ (1-5)
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ 
      success: false,
      message: 'Rating phải từ 1 đến 5 sao' 
    });
  }

  // Bước 1: Kiểm tra booking có thuộc về user không
  Review.checkBookingOwner(booking_id, user_id, (err, bookingResults) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi server',
        error: err.message 
      });
    }

    if (bookingResults.length === 0) {
      return res.status(403).json({ 
        success: false,
        message: 'Bạn không có quyền đánh giá booking này' 
      });
    }

    // Bước 2: Kiểm tra booking đã được đánh giá chưa
    Review.checkBookingReviewed(booking_id, (err, reviewResults) => {
      if (err) {
        return res.status(500).json({ 
          success: false,
          message: 'Lỗi server',
          error: err.message 
        });
      }

      if (reviewResults.length > 0) {
        return res.status(409).json({ 
          success: false,
          message: 'Bạn đã đánh giá booking này rồi' 
        });
      }

      // Bước 3: Tạo đánh giá mới
      Review.create(booking_id, rating, comment, (err, result) => {
        if (err) {
          return res.status(500).json({ 
            success: false,
            message: 'Lỗi khi tạo đánh giá',
            error: err.message 
          });
        }

        res.status(201).json({ 
          success: true,
          message: 'Đánh giá thành công',
          review_id: result.insertId 
        });
      });
    });
  });
};

exports.getReviewsByPitch = (req, res) => {
  const pitch_id = req.params.pitchId;

  if (!pitch_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Thiếu pitch_id' 
    });
  }

  Review.getByPitchId(pitch_id, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Lỗi khi lấy đánh giá',
        error: err.message 
      });
    }

    // Tính điểm trung bình
    const totalRating = results.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = results.length > 0 ? (totalRating / results.length).toFixed(1) : 0;

    res.json({
      success: true,
      average_rating: parseFloat(averageRating),
      total_reviews: results.length,
      reviews: results
    });
  });
};