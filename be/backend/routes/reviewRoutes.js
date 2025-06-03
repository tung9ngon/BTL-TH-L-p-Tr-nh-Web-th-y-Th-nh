const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Tạo đánh giá
router.post('/', reviewController.createReview);

// Lấy đánh giá theo sân
router.get('/pitch/:pitchId', reviewController.getReviewsByPitch);

module.exports = router;