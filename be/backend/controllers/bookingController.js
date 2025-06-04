const bookingModel = require('../models/bookingModel');

// Helper function để kiểm tra user_type (lấy từ body thay vì query để test dễ hơn)
const validateUserType = (req, expectedType) => {
  // Lấy từ body để test trên Postman dễ hơn
  const { user_type } = req.body;
  if (!user_type || user_type !== expectedType) {
    return false;
  }
  return true;
};

module.exports = {
  async getPitches(req, res) {
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

      if (!availability.pitch) {
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
        pitch: availability.pitch,
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
      if (!validateUserType(req, 'user')) {
        return res.status(403).json({ message: 'Access denied. Only users can create bookings' });
      }

      const { user_id, pitch_id, time_slot_id, booking_date } = req.body;
      
      if (!user_id || !pitch_id || !time_slot_id || !booking_date) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Kiểm tra sân có tồn tại và available không
      const isAvailable = await bookingModel.checkPitchAvailable(pitch_id);
      if (!isAvailable) {
        return res.status(400).json({ message: 'Pitch not available' });
      }

      // Kiểm tra slot đã được đặt chưa
      const isBooked = await bookingModel.checkSlotBooked(pitch_id, booking_date, time_slot_id);
      if (isBooked) {
        return res.status(400).json({ message: 'Time slot already booked' });
      }

      // Lấy thông tin sân và time slot để tính giá
      const pitch = await bookingModel.getPitchById(pitch_id);
      const timeSlot = await bookingModel.getTimeSlotById(time_slot_id);
      
      if (!pitch || !timeSlot) {
        return res.status(400).json({ message: 'Pitch or time slot not found' });
      }

      // Tính toán giá theo khung giờ cố định
      // Giá cố định cho mỗi khung giờ = price_per_hour của sân
      const totalPrice = pitch.price_per_hour; // Mỗi khung giờ tính bằng giá 1 giờ

      // Tạo booking
      const booking = await bookingModel.createBooking({
        user_id, 
        pitch_id, 
        time_slot_id, 
        booking_date,
        status: 'pending',
        payment_status: 'pending',
        total_price: totalPrice
      });
      
      res.status(201).json({ 
        message: 'Booking created successfully', 
        booking,
        price_details: {
          pitch_name: pitch.name,
          time_slot: `${timeSlot.start_time} - ${timeSlot.end_time}`,
          price_per_slot: pitch.price_per_hour,
          total_price: totalPrice
        }
      });
    } catch (error) {
      console.error('Error in createBooking:', error);
      res.status(500).json({ 
        message: 'Failed to create booking', 
        error: error.message 
      });
    }
  },

  async updatePaymentStatus(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can update payment status' });
      }

      const bookingId = req.params.id;
      const { payment_status, owner_id } = req.body;
      
      // Sử dụng hàm verifyOwnership mới
      const isOwner = await bookingModel.verifyOwnership('booking', bookingId, owner_id);
      if (!isOwner) {
        return res.status(403).json({ message: 'You do not own this booking' });
      }

      const result = await bookingModel.updatePaymentStatus(bookingId, payment_status, owner_id);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: 'Payment status updated successfully' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ 
        message: 'Failed to update payment status', 
        error: error.message 
      });
    }
  },

  async getUserBookings(req, res) {
    try {
      // Lấy user_type từ body thay vì query
      if (!validateUserType(req, 'user')) {
        return res.status(403).json({ message: 'Access denied. Only users can view their bookings' });
      }

      const { user_id } = req.body; // Lấy từ body thay vì query
      if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id parameter' });
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
      if (!validateUserType(req, 'user')) {
        return res.status(403).json({ message: 'Access denied. Only users can cancel bookings' });
      }

      const bookingId = req.params.id;
      const { user_id } = req.body;
      
      // Sử dụng hàm verifyOwnership mới
      const isOwner = await bookingModel.verifyOwnership('user_booking', bookingId, user_id);
      if (!isOwner) {
        return res.status(403).json({ message: 'You do not own this booking' });
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
  },

  async getOwnerBookings(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can view their bookings' });
      }

      const { owner_id, status } = req.body; // Lấy từ body thay vì query
      if (!owner_id) {
        return res.status(400).json({ message: 'Missing owner_id parameter' });
      }

      const bookings = status 
        ? await bookingModel.getBookingsByStatus(owner_id, status)
        : await bookingModel.getOwnerBookings(owner_id);
      
      res.json(bookings);
    } catch (error) {
      console.error('Error in getOwnerBookings:', error);
      res.status(500).json({ 
        message: 'Failed to fetch bookings', 
        error: error.message 
      });
    }
  },

  async updateBookingStatus(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can update booking status' });
      }

      const bookingId = req.params.id;
      const { status, owner_id } = req.body;
      
      // Sử dụng hàm verifyOwnership mới
      const isOwner = await bookingModel.verifyOwnership('booking', bookingId, owner_id);
      if (!isOwner) {
        return res.status(403).json({ message: 'You do not own this booking' });
      }

      const result = await bookingModel.updateBookingStatus(bookingId, status, owner_id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: 'Booking status updated successfully' });
    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      res.status(500).json({ 
        message: 'Failed to update booking status', 
        error: error.message 
      });
    }
  },

  async updatePitchStatus(req, res) {
    try {
      if (!validateUserType(req, 'owner')) {
        return res.status(403).json({ message: 'Access denied. Only owners can update pitch status' });
      }

      const pitchId = req.params.id;
      const { status, owner_id } = req.body;
      
      // Sử dụng hàm verifyOwnership mới
      const isOwner = await bookingModel.verifyOwnership('pitch', pitchId, owner_id);
      if (!isOwner) {
        return res.status(403).json({ message: 'You do not own this pitch' });
      }

      const result = await bookingModel.updatePitchStatus(pitchId, status, owner_id);
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: 'Pitch status updated successfully' });
    } catch (error) {
      console.error('Error in updatePitchStatus:', error);
      res.status(500).json({ 
        message: 'Failed to update pitch status', 
        error: error.message 
      });
    }
  }

  


  
};