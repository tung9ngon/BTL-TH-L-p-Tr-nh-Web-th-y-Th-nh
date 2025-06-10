const db = require('../config/db');
const emailService = require('../util/emailService');
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
      const booking = await module.exports.findById(bookingId);
    const [users] = await connection.execute(
      'SELECT email, name FROM users WHERE id = ?',
      [user_id]
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

      if (payment_status === 'completed') {
      const booking = await module.exports.findById(bookingId);
      const [users] = await connection.execute(
        'SELECT email, name FROM users WHERE id = ?',
        [booking.user_id]
      );
      
      if (users.length > 0) {
        const user = users[0];
        const formattedBooking = {
          ...booking,
          user_name: user.name,
          formatted_date: new Date(booking.booking_date).toLocaleDateString('vi-VN'),
          start_time: booking.start_time.slice(0, 5),
          end_time: booking.end_time.slice(0, 5)
        };
        
        emailService.sendBookingConfirmationEmail(user.email, formattedBooking)
          .catch(err => console.error('Error sending confirmation email:', err));
      }
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

      if (status === 'cancelled') {
      const booking = await module.exports.findById(bookingId);
      const [users] = await connection.execute(
        'SELECT email, name FROM users WHERE id = ?',
        [booking.user_id]
      );
      
      if (users.length > 0) {
        const user = users[0];
        const formattedBooking = {
          ...booking,
          user_name: user.name,
          formatted_date: new Date(booking.booking_date).toLocaleDateString('vi-VN'),
          start_time: booking.start_time.slice(0, 5),
          end_time: booking.end_time.slice(0, 5)
        };
        
        emailService.sendBookingCancellationEmail(user.email, formattedBooking)
          .catch(err => console.error('Error sending confirmation email:', err));
      }
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
  },


  getOwnerStatistics: async (ownerId) => {
  const connection = await db.getConnection();
  try {
    // Lấy tổng số booking theo trạng thái
    const [bookingStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_bookings
       FROM bookings b
       JOIN pitches p ON b.pitch_id = p.id
       WHERE p.owner_id = ?`,
      [ownerId]
    );

    // Lấy tổng doanh thu (theo payment_status: pending/completed)
    const [revenueStats] = await connection.execute(
      `SELECT 
        SUM(CASE WHEN b.payment_status = 'completed' THEN b.total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN b.payment_status = 'pending' THEN b.total_price ELSE 0 END) as pending_revenue,
        SUM(b.total_price) as gross_revenue
       FROM bookings b
       JOIN pitches p ON b.pitch_id = p.id
       WHERE p.owner_id = ? AND b.status != 'cancelled'`,
      [ownerId]
    );

    // Lấy thống kê sân
    const [pitchStats] = await connection.execute(
      `SELECT 
        COUNT(*) as total_pitches,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_pitches,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_pitches
       FROM pitches 
       WHERE owner_id = ?`,
      [ownerId]
    );

    return {
      bookings: bookingStats[0],
      revenue: revenueStats[0],
      pitches: pitchStats[0]
    };
  } finally {
    connection.release();
  }
},

// Lấy danh sách booking gần đây (10 booking mới nhất)
getRecentBookings: async (ownerId, limit = 10) => {
  const connection = await db.getConnection();
  try {
    // Sử dụng giá trị LIMIT cố định thay vì parameter
    const [bookings] = await connection.execute(
      `SELECT b.*, p.name as pitch_name, p.location,
              ts.start_time, ts.end_time, u.name as user_name, u.phone as user_phone,
              DATE_FORMAT(b.created_at, '%d/%m/%Y %H:%i') as booking_time,
              DATE_FORMAT(b.booking_date, '%d/%m/%Y') as formatted_date
       FROM bookings b
       JOIN pitches p ON b.pitch_id = p.id
       JOIN time_slots ts ON b.time_slot_id = ts.id
       JOIN users u ON b.user_id = u.id
       WHERE p.owner_id = ?
       ORDER BY b.created_at DESC
       LIMIT 50`,
      [ownerId]
    );
    
    // Nếu cần limit nhỏ hơn, cắt trong JavaScript
    return limit < 50 ? bookings.slice(0, limit) : bookings;
  } finally {
    connection.release();
  }
},

// Lấy thống kê doanh thu theo tháng (12 tháng gần nhất)
getMonthlyRevenue: async (ownerId) => {
  const connection = await db.getConnection();
  try {
    const [monthlyData] = await connection.execute(
      `SELECT 
        DATE_FORMAT(b.booking_date, '%Y-%m') as month,
        DATE_FORMAT(b.booking_date, '%m/%Y') as month_formatted,
        COUNT(*) as total_bookings,
        SUM(CASE WHEN b.payment_status = 'completed' THEN b.total_price ELSE 0 END) as revenue,
        SUM(CASE WHEN b.payment_status = 'pending' THEN b.total_price ELSE 0 END) as pending_revenue
       FROM bookings b
       JOIN pitches p ON b.pitch_id = p.id
       WHERE p.owner_id = ? 
       AND b.booking_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
       AND b.status != 'cancelled'
       GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
       ORDER BY month DESC`,
      [ownerId]
    );
    return monthlyData;
  } finally {
    connection.release();
  }
},

// Lấy thống kê theo sân
getPitchStatistics: async (ownerId) => {
  const connection = await db.getConnection();
  try {
    const [pitchStats] = await connection.execute(
      `SELECT 
        p.id, 
        p.name, 
        p.location,
        p.price_per_hour,
        p.status,
        p.avatar,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN b.status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
        SUM(CASE WHEN b.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN b.payment_status = 'completed' AND b.status != 'cancelled' THEN b.total_price ELSE 0 END) as total_revenue,
        SUM(CASE WHEN b.payment_status = 'pending' AND b.status != 'cancelled' THEN b.total_price ELSE 0 END) as pending_revenue,
        AVG(CASE WHEN b.payment_status = 'completed' AND b.status != 'cancelled' THEN b.total_price ELSE NULL END) as avg_booking_value,
        DATE_FORMAT(MAX(b.created_at), '%d/%m/%Y %H:%i') as last_booking_date
       FROM pitches p
       LEFT JOIN bookings b ON p.id = b.pitch_id
       WHERE p.owner_id = ?
       GROUP BY p.id, p.name, p.location, p.price_per_hour, p.status, p.avatar
       ORDER BY total_bookings DESC`,
      [ownerId]
    );
    return pitchStats;
  } finally {
    connection.release();
  }
},

// Lấy top sân có doanh thu cao nhất
getTopRevenePitches: async (ownerId, limit = 5) => {
  const connection = await db.getConnection();
  try {
    const [topPitches] = await connection.execute(
      `SELECT 
        p.id, 
        p.name, 
        p.location,
        p.price_per_hour,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.payment_status = 'completed' AND b.status != 'cancelled' THEN b.total_price ELSE 0 END) as total_revenue
       FROM pitches p
       LEFT JOIN bookings b ON p.id = b.pitch_id
       WHERE p.owner_id = ?
       GROUP BY p.id, p.name, p.location, p.price_per_hour
       HAVING total_revenue > 0
       ORDER BY total_revenue DESC
       LIMIT 20`,
      [ownerId]
    );
    
    return limit < 20 ? topPitches.slice(0, limit) : topPitches;
  } finally {
    connection.release();
  }
},
// Lấy booking theo ngày (hôm nay, tuần này, tháng này)
getBookingsByPeriod: async (ownerId) => {
  const connection = await db.getConnection();
  try {
    const [periodStats] = await connection.execute(
      `SELECT 
        SUM(CASE WHEN DATE(b.booking_date) = CURDATE() THEN 1 ELSE 0 END) as today_bookings,
        SUM(CASE WHEN YEARWEEK(b.booking_date) = YEARWEEK(CURDATE()) THEN 1 ELSE 0 END) as week_bookings,
        SUM(CASE WHEN MONTH(b.booking_date) = MONTH(CURDATE()) AND YEAR(b.booking_date) = YEAR(CURDATE()) THEN 1 ELSE 0 END) as month_bookings,
        SUM(CASE WHEN DATE(b.booking_date) = CURDATE() AND b.payment_status = 'completed' THEN b.total_price ELSE 0 END) as today_revenue,
        SUM(CASE WHEN YEARWEEK(b.booking_date) = YEARWEEK(CURDATE()) AND b.payment_status = 'completed' THEN b.total_price ELSE 0 END) as week_revenue,
        SUM(CASE WHEN MONTH(b.booking_date) = MONTH(CURDATE()) AND YEAR(b.booking_date) = YEAR(CURDATE()) AND b.payment_status = 'completed' THEN b.total_price ELSE 0 END) as month_revenue
       FROM bookings b
       JOIN pitches p ON b.pitch_id = p.id
       WHERE p.owner_id = ? AND b.status != 'cancelled'`,
      [ownerId]
    );
    return periodStats[0];
  } finally {
    connection.release();
  }
}
};