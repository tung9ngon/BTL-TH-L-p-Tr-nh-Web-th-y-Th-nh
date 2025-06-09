const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');

// Routes cụ thể phải đặt TRƯỚC routes có parameter
router.get('/search', pitchController.searchPitches);
router.get('/', pitchController.getAllPitches);

// Routes owner (cụ thể)
router.get('/owner/:ownerId/pitches', pitchController.getPitchesByOwner);
router.post('/owner/:ownerId/pitches', pitchController.addPitch);
router.put('/owner/:ownerId/pitches/:id', pitchController.updatePitch);
router.get('/owner/:ownerId/pitches/:id/bookings', pitchController.getBookingsByPitch);
router.put('/owner/:ownerId/bookings/:id/status', pitchController.updateBookingStatus);


// Route có parameter phải đặt CUỐI CÙNG
router.get('/:id', pitchController.getPitchDetail);

module.exports = router;