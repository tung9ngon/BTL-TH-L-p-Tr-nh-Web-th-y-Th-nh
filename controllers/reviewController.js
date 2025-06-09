const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
  const { pitch_id, user_id, rating, comment } = req.body;

  // Validate input
  if (!pitch_id || !user_id || !rating) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp pitch_id, user_id và rating'
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
    // Kiểm tra user đã đánh giá sân này chưa
    const isReviewed = await Review.checkUserReviewed(pitch_id, user_id);
    
    if (isReviewed) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã đánh giá sân này rồi'
      });
    }

    // Tạo đánh giá mới
    const reviewId = await Review.create(pitch_id, user_id, rating, comment);
    
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
    const reviews = await Review.getByPitchId(pitch_id);
    const ratingStats = await Review.getAverageRating(pitch_id);

    res.json({
      success: true,
      average_rating: ratingStats.avg_rating,
      total_reviews: ratingStats.total_reviews,
      rating_distribution: ratingStats.rating_distribution,
      reviews: reviews
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