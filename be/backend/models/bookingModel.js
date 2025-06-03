const db = require('../config/db');

// Hàm tổng hợp kiểm tra quyền sở hữu (đặt ở đầu để có thể sử dụng)
const verifyOwnership = async (type, id, ownerId) => {
  const connection = await db.getConnection();
  try {
    let query;
    switch(type) {
      case 'booking':
        query = `SELECT b.id FROM bookings b JOIN pitches p ON b.pitch_id = p.id 
                 WHERE b.id = ? AND p.owner_id = ?`;
        break;
      case 'pitch':
        query = 'SELECT id FROM pitches WHERE id = ? AND owner_id = ?';
        break;
      case 'user_booking':
        query = 'SELECT id FROM bookings WHERE id = ? AND user_id = ?';
        break;
      default:
        return false;
    }
    const [result] = await connection.execute(query, [id, ownerId]);
    return result.length > 0;
  } finally {
    connection.release();
  }
};

module.exports = {
  // Lấy thông tin sân theo ID
  getPitchById: async (pitch_id) => {
    const connection = await db.getConnection();
    try {
      const [pitches] = await connection.execute(
        'SELECT * FROM pitches WHERE id = ?',
        [pitch_id]
      );
      return pitches[0];
    } finally {
      connection.release();
    }
  },

  // Lấy thông tin khung giờ theo ID
  getTimeSlotById: async (time_slot_id) => {
    const connection = await db.getConnection();
    try {
      const [slots] = await connection.execute(
        'SELECT * FROM time_slots WHERE id = ?',
        [time_slot_id]
      );
      return slots[0];
    } finally {
      connection.release();
    }
  },

  // Lấy danh sách sân có sẵn
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

  // Lấy các khung giờ đã đặt của sân
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

  // Kiểm tra khả dụng của sân
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
        pitch: pitches[0],
        timeSlots: timeSlots,
        bookedSlots: bookedSlots
      };
    } finally {
      connection.release();
    }
  },

  // Kiểm tra sân có khả dụng không
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

  // Kiểm tra khung giờ đã được đặt chưa
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

  // Tạo booking mới
  createBooking: async ({ user_id, pitch_id, time_slot_id, booking_date, status, payment_status, total_price }) => {
    const connection = await db.getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO bookings 
        (user_id, pitch_id, time_slot_id, booking_date, status, payment_status, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, pitch_id, time_slot_id, booking_date, status, payment_status, total_price]
      );
      
      const booking = await module.exports.findById(result.insertId);
      return {
        ...booking,
        total_price: total_price
      };
    } finally {
      connection.release();
    }
  },

  // Lấy danh sách booking của user
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

  // Hủy booking
  cancelUserBooking: async (bookingId, user_id) => {
    const connection = await db.getConnection();
    try {
      const isOwner = await verifyOwnership('user_booking', bookingId, user_id);
      if (!isOwner) {
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
  },

  // Cập nhật trạng thái thanh toán (cho owner)
  updatePaymentStatus: async (bookingId, payment_status, owner_id) => {
    const connection = await db.getConnection();
    try {
      const isOwner = await verifyOwnership('booking', bookingId, owner_id);
      if (!isOwner) {
        return { success: false, message: 'Booking not found or not owned by you' };
      }

      const [result] = await connection.execute(
        'UPDATE bookings SET payment_status = ? WHERE id = ?',
        [payment_status, bookingId]
      );

      if (result.affectedRows === 0) {
        return { success: false, message: 'Failed to update payment status' };
      }

      return { success: true, message: 'Payment status updated successfully' };
    } finally {
      connection.release();
    }
  },

  // Lấy booking theo ID
  findById: async (id) => {
    const connection = await db.getConnection();
    try {
      const [bookings] = await connection.execute(
        `SELECT b.*, p.name as pitch_name, p.location, p.price_per_hour,
                ts.start_time, ts.end_time, o.name as owner_name, o.phone as owner_phone
         FROM bookings b
         JOIN pitches p ON b.pitch_id = p.id
         JOIN time_slots ts ON b.time_slot_id = ts.id
         JOIN owners o ON p.owner_id = o.id
         WHERE b.id = ?`,
        [id]
      );
      return bookings[0];
    } finally {
      connection.release();
    }
  },

  // Export hàm verifyOwnership để controller có thể sử dụng
  verifyOwnership: verifyOwnership,

  // Lấy danh sách booking của owner
  getOwnerBookings: async (ownerId) => {
    const connection = await db.getConnection();
    try {
      const [bookings] = await connection.execute(
        `SELECT b.*, p.name as pitch_name, p.location, p.price_per_hour,
                ts.start_time, ts.end_time, u.name as user_name, u.phone as user_phone
         FROM bookings b
         JOIN pitches p ON b.pitch_id = p.id
         JOIN time_slots ts ON b.time_slot_id = ts.id
         JOIN users u ON b.user_id = u.id
         WHERE p.owner_id = ?
         ORDER BY b.booking_date DESC, ts.start_time DESC`,
        [ownerId]
      );
      return bookings;
    } finally {
      connection.release();
    }
  },

  // Cập nhật trạng thái sân
  updatePitchStatus: async (pitchId, status, ownerId) => {
    const connection = await db.getConnection();
    try {
      const isOwner = await verifyOwnership('pitch', pitchId, ownerId);
      if (!isOwner) {
        return { success: false, message: 'Pitch not found or not owned by you' };
      }

      const [result] = await connection.execute(
        'UPDATE pitches SET status = ? WHERE id = ?',
        [status, pitchId]
      );

      if (result.affectedRows === 0) {
        return { success: false, message: 'Failed to update pitch status' };
      }

      return { success: true, message: 'Pitch status updated successfully' };
    } finally {
      connection.release();
    }
  },

  // Cập nhật trạng thái booking
  updateBookingStatus: async (bookingId, status, ownerId) => {
    const connection = await db.getConnection();
    try {
      const isOwner = await verifyOwnership('booking', bookingId, ownerId);
      if (!isOwner) {
        return { success: false, message: 'Booking not found or not owned by you' };
      }

      const [result] = await connection.execute(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, bookingId]
      );

      if (result.affectedRows === 0) {
        return { success: false, message: 'Failed to update booking status' };
      }

      return { success: true, message: 'Booking status updated successfully' };
    } finally {
      connection.release();
    }
  },

  // Lấy danh sách booking theo trạng thái
  getBookingsByStatus: async (ownerId, status) => {
    const connection = await db.getConnection();
    try {
      const [bookings] = await connection.execute(
        `SELECT b.*, p.name as pitch_name, p.location, 
                ts.start_time, ts.end_time, u.name as user_name, u.phone as user_phone
        FROM bookings b
        JOIN pitches p ON b.pitch_id = p.id
        JOIN time_slots ts ON b.time_slot_id = ts.id
        JOIN users u ON b.user_id = u.id
        WHERE p.owner_id = ? AND b.status = ?
        ORDER BY b.booking_date DESC, ts.start_time DESC`,
        [ownerId, status]
      );
      return bookings;
    } finally {
      connection.release();
    }
  }
};