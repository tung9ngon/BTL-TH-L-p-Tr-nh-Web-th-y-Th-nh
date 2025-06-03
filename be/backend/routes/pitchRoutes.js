const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');

// Thêm 2 route mới
router.get('/pitches', pitchController.getAllPitches);
router.get('/pitches/search', pitchController.searchPitches);
router.get('/owner/:ownerId/pitches', pitchController.getPitchesByOwner);
router.post('/owner/:ownerId/pitches', pitchController.addPitch);
router.put('/owner/:ownerId/pitches/:id', pitchController.updatePitch);
router.get('/owner/:ownerId/pitches/:id/bookings', pitchController.getBookingsByPitch);
router.put('/owner/:ownerId/bookings/:id/status', pitchController.updateBookingStatus);

module.exports = router;