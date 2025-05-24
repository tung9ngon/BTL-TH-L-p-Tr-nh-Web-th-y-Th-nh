const db = require('../config/db'); // Sử dụng connection pool đã được cấu hình

module.exports = {
  getAvailablePitches: async (location) => {
    const connection = await db.getConnection();
    try {
      let query = `
        SELECT p.*, o.name as owner_name, o.phone as owner_phone
        FROM pitches p
        JOIN owners o ON p.owner_id = o.id
        WHERE p.status = 'available'
      `;
      const params = [];
      if (location) {
        query += ' AND p.location LIKE ?';
        params.push(`%${location}%`);
      }
      query += ' ORDER BY p.created_at DESC';

      const [pitches] = await connection.execute(query, params);
      return pitches;
    } finally {
      connection.release();
    }
  },

  getBookedSlots: async (pitchId, date) => {
    const connection = await db.getConnection();
    try {
      const [bookedSlots] = await connection.execute(
        `SELECT time_slot_id
         FROM bookings
         WHERE pitch_id = ? AND booking_date = ? AND status != 'cancelled'`,
        [pitchId, date]
      );
      return bookedSlots;
    } finally {
      connection.release();
    }
  },

  getPitchAvailability: async (pitchId, date) => {
    const connection = await db.getConnection();
    try {
      const [pitches] = await connection.execute(
        `SELECT p.*, o.name as owner_name, o.phone as owner_phone
         FROM pitches p
         JOIN owners o ON p.owner_id = o.id
         WHERE p.id = ? AND p.status = 'available'`,
        [pitchId]
      );

      const [timeSlots] = await connection.execute(
        'SELECT * FROM time_slots ORDER BY start_time'
      );

      const [bookedSlots] = await connection.execute(
        `SELECT time_slot_id FROM bookings
         WHERE pitch_id = ? AND booking_date = ? AND status != 'cancelled'`,
        [pitchId, date]
      );

      return {
        pitch: pitches,
        timeSlots: timeSlots,
        bookedSlots: bookedSlots
      };
    } finally {
      connection.release();
    }
  },

  checkPitchAvailable: async (pitch_id) => {
    const connection = await db.getConnection();
    try {
      const [pitches] = await connection.execute(
        'SELECT id FROM pitches WHERE id = ? AND status = "available"',
        [pitch_id]
      );
      return pitches.length > 0;
    } finally {
      connection.release();
    }
  },

  checkSlotBooked: async (pitch_id, date, slot_id) => {
    const connection = await db.getConnection();
    try {
      const [existing] = await connection.execute(
        `SELECT id FROM bookings 
         WHERE pitch_id = ? AND booking_date = ? AND time_slot_id = ? 
         AND status != 'cancelled'`,
        [pitch_id, date, slot_id]
      );
      return existing.length > 0;
    } finally {
      connection.release();
    }
  },

  createBooking: async (user_id, pitch_id, time_slot_id, booking_date) => {
    const connection = await db.getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO bookings (user_id, pitch_id, time_slot_id, booking_date) VALUES (?, ?, ?, ?)',
        [user_id, pitch_id, time_slot_id, booking_date]
      );
      return result;
    } finally {
      connection.release();
    }
  },

  getUserBookings: async (user_id) => {
    const connection = await db.getConnection();
    try {
      const [bookings] = await connection.execute(
        `SELECT b.*, p.name as pitch_name, p.location, p.price_per_hour,
                ts.start_time, ts.end_time, o.name as owner_name, o.phone as owner_phone
         FROM bookings b
         JOIN pitches p ON b.pitch_id = p.id
         JOIN time_slots ts ON b.time_slot_id = ts.id
         JOIN owners o ON p.owner_id = o.id
         WHERE b.user_id = ?
         ORDER BY b.booking_date DESC, ts.start_time DESC`,
        [user_id]
      );
      return bookings;
    } finally {
      connection.release();
    }
  },

  cancelUserBooking: async (bookingId, user_id) => {
    const connection = await db.getConnection();
    try {
      // Kiểm tra xem booking có thuộc về user không
      const [bookings] = await connection.execute(
        'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
        [bookingId, user_id]
      );

      if (bookings.length === 0) {
        return { success: false, message: 'Booking not found or not owned by user' };
      }

      await connection.execute(
        'UPDATE bookings SET status = "cancelled" WHERE id = ?',
        [bookingId]
      );

      return { success: true, message: 'Booking cancelled successfully' };
    } finally {
      connection.release();
    }
  }
};