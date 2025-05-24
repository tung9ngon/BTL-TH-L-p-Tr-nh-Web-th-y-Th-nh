const bookingModel = require('../models/bookingModel');

module.exports = {
  async getPitches(req, res) {
    let connection;
    try {
      const { location, date } = req.query;
      const pitches = await bookingModel.getAvailablePitches(location);

      if (date) {
        for (let pitch of pitches) {
          const bookedSlots = await bookingModel.getBookedSlots(pitch.id, date);
          pitch.booked_slots = bookedSlots.map(slot => slot.time_slot_id);
        }
      }

      res.json(pitches);
    } catch (error) {
      console.error('Error in getPitches:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  async getPitchAvailability(req, res) {
    try {
      const pitchId = req.params.id;
      const { date } = req.query;
      if (!pitchId || !date) {
      return res.status(400).json({ 
        message: 'Missing required parameters: pitchId or date'
      });
    }
      
      const availability = await bookingModel.getPitchAvailability(pitchId, date);

      if (availability.pitch.length === 0) {
        return res.status(404).json({ 
          message: 'Pitch not found or not available' 
        });
      }

      const bookedSlotIds = availability.bookedSlots.map(slot => slot.time_slot_id);
      const availableSlots = availability.timeSlots.map(slot => ({
        ...slot,
        is_available: !bookedSlotIds.includes(slot.id)
      }));

      res.json({
        pitch: availability.pitch[0],
        time_slots: availableSlots,
        date
      });
    } catch (error) {
      console.error('Error in getPitchAvailability:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  async createBooking(req, res) {
    try {
      const { user_id, user_type, pitch_id, time_slot_id, booking_date } = req.body;
      
      if (user_type !== 'user') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const isAvailable = await bookingModel.checkPitchAvailable(pitch_id);
      if (!isAvailable) {
        return res.status(400).json({ message: 'Pitch not available' });
      }

      const isBooked = await bookingModel.checkSlotBooked(pitch_id, booking_date, time_slot_id);
      if (isBooked) {
        return res.status(400).json({ message: 'Time slot already booked' });
      }

      const result = await bookingModel.createBooking(
        user_id, 
        pitch_id, 
        time_slot_id, 
        booking_date
      );
      
      res.status(201).json({ 
        message: 'Booking created successfully', 
        bookingId: result.insertId 
      });
    } catch (error) {
      console.error('Error in createBooking:', error);
      res.status(500).json({ 
        message: 'Failed to create booking', 
        error: error.message 
      });
    }
  },

  async getUserBookings(req, res) {
    try {
      const { user_id, user_type } = req.query;
      
      if (user_type !== 'user') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const bookings = await bookingModel.getUserBookings(user_id);
      res.json(bookings);
    } catch (error) {
      console.error('Error in getUserBookings:', error);
      res.status(500).json({ 
        message: 'Failed to fetch bookings', 
        error: error.message 
      });
    }
  },

  async cancelBooking(req, res) {
    try {
      const bookingId = req.params.id;
      const { user_id, user_type } = req.body;
      
      if (user_type !== 'user') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const result = await bookingModel.cancelUserBooking(bookingId, user_id);

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
      console.error('Error in cancelBooking:', error);
      res.status(500).json({ 
        message: 'Failed to cancel booking', 
        error: error.message 
      });
    }
  }
};