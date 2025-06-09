// ownerDashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Tất cả routes sử dụng POST để lấy owner_id từ body (theo pattern hiện tại)

// Lấy thống kê tổng quan
router.post('/stats', dashboardController.getOverviewStats);

// Lấy booking gần đây
router.post('/recent-bookings', dashboardController.getRecentBookings);

// Lấy doanh thu theo tháng
router.post('/monthly-revenue', dashboardController.getMonthlyRevenue);

// Lấy thống kê theo sân
router.post('/pitch-stats', dashboardController.getPitchStatistics);

// Lấy top sân có doanh thu cao nhất
router.post('/top-pitches', dashboardController.getTopRevenuePitches);

// Lấy tất cả dữ liệu dashboard (endpoint tổng hợp)
router.post('/', dashboardController.getDashboardData);

module.exports = router;