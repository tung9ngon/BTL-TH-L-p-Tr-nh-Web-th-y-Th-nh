const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


router.get('/pitches', bookingController.getPitches);
router.get('/pitches/:id/availability', bookingController.getPitchAvailability);
router.post('/bookings',  bookingController.createBooking);
router.get('/user/bookings', bookingController.getUserBookings);
router.put('/bookings/:id/cancel',  bookingController.cancelBooking);

module.exports = router;