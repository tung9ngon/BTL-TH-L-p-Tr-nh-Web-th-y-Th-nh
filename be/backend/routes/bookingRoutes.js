const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Public routes
router.get('/pitches', bookingController.getPitches);
router.get('/pitches/:id/availability', bookingController.getPitchAvailability);

// User routes
router.post('/', bookingController.createBooking);
router.get('/user/bookings', bookingController.getUserBookings);
router.put('/bookings/:id/cancel', bookingController.cancelBooking);

// Owner routes
router.get('/owner/bookings', bookingController.getOwnerBookings);
router.put('/bookings/:id/payment', bookingController.updatePaymentStatus);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.put('/pitches/:id/status', bookingController.updatePitchStatus);

module.exports = router;