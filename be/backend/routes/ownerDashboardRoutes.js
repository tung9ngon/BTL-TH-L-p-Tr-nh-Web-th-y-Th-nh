const express = require('express');
const router = express.Router();
const ownerDashboardController = require('../controllers/ownerDashboardController');

// Route lấy dashboard của 1 owner cụ thể
// Có thể dùng: /api/owner/dashboard/123 hoặc /api/owner/dashboard?owner_id=123
router.get('/:owner_id', ownerDashboardController.getOwnerDashboard);
router.get('/', ownerDashboardController.getOwnerDashboard);

// Route lấy danh sách tất cả owners
router.get('/owners/all', ownerDashboardController.getAllOwners);

module.exports = router;