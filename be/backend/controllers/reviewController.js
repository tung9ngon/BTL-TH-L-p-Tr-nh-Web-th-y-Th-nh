const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
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

  try {
    // Bước 1: Kiểm tra booking có thuộc về user không
    const isBookingOwner = await Review.checkBookingOwner(booking_id, user_id);
    
    if (!isBookingOwner) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền đánh giá booking này'
      });
    }

    // Bước 2: Kiểm tra booking đã được đánh giá chưa
    const isReviewed = await Review.checkBookingReviewed(booking_id);
    
    if (isReviewed) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã đánh giá booking này rồi'
      });
    }

    // Bước 3: Tạo đánh giá mới
    const reviewId = await Review.create(booking_id, rating, comment);
    
    res.status(201).json({
      success: true,
      message: 'Đánh giá thành công',
      review_id: reviewId
    });

  } catch (error) {
    console.error('Error in createReview:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

exports.getReviewsByPitch = async (req, res) => {
  const pitch_id = req.params.pitchId;

  if (!pitch_id) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu pitch_id'
    });
  }

  try {
    const results = await Review.getByPitchId(pitch_id);

    // Tính điểm trung bình
    const totalRating = results.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = results.length > 0 ? (totalRating / results.length).toFixed(1) : 0;

    res.json({
      success: true,
      average_rating: parseFloat(averageRating),
      total_reviews: results.length,
      reviews: results
    });

  } catch (error) {
    console.error('Error in getReviewsByPitch:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy đánh giá',
      error: error.message
    });
  }
};