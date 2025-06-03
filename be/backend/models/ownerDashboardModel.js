const mysql = require('mysql2/promise');
const db = require('../config/db');

const getDashboardData = async (ownerId) => {
  const connection = await db.getConnection();
  
  try {
    // Kiểm tra owner có tồn tại không
    const [ownerCheck] = await connection.execute(
      'SELECT id FROM owners WHERE id = ?',
      [ownerId]
    );

    if (ownerCheck.length === 0) {
      throw new Error('Owner not found');
    }

    // Tổng số sân
    const [pitchCount] = await connection.execute(
      'SELECT COUNT(*) as total FROM pitches WHERE owner_id = ?',
      [ownerId]
    );

    // Tổng đặt chỗ hôm nay
    const [todayBookings] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ? AND DATE(b.booking_date) = CURDATE()
    `, [ownerId]);

    // Doanh thu tháng này (tính theo bookings confirmed)
    const [monthlyRevenue] = await connection.execute(`
      SELECT SUM(p.price_per_hour) as total
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ?
        AND b.status = 'confirmed'
        AND MONTH(b.booking_date) = MONTH(CURDATE())
        AND YEAR(b.booking_date) = YEAR(CURDATE())
    `, [ownerId]);

    // Thông tin chi tiết về owner
    const [ownerInfo] = await connection.execute(
      'SELECT id, name, email, phone, created_at FROM owners WHERE id = ?',
      [ownerId]
    );

    // Thống kê booking theo trạng thái
    const [bookingStats] = await connection.execute(`
      SELECT 
        b.status,
        COUNT(*) as count
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE p.owner_id = ?
      GROUP BY b.status
    `, [ownerId]);

    // Danh sách sân của owner
    const [pitches] = await connection.execute(`
      SELECT 
        id, name, location, price_per_hour, status, created_at,
        (SELECT COUNT(*) FROM bookings WHERE pitch_id = pitches.id) as total_bookings
      FROM pitches 
      WHERE owner_id = ?
      ORDER BY created_at DESC
    `, [ownerId]);

    // Booking gần đây
    const [recentBookings] = await connection.execute(`
      SELECT 
        b.id, b.booking_date, b.status, b.created_at,
        p.name as pitch_name,
        u.name as user_name,
        ts.start_time, ts.end_time
      FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      JOIN users u ON b.user_id = u.id
      JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE p.owner_id = ?
      ORDER BY b.created_at DESC
      LIMIT 10
    `, [ownerId]);

    return {
      owner_info: ownerInfo[0] || null,
      total_pitches: pitchCount[0].total,
      today_bookings: todayBookings[0].total,
      monthly_revenue: monthlyRevenue[0].total || 0,
      booking_stats: bookingStats,
      pitches: pitches,
      recent_bookings: recentBookings
    };
  } finally {
    connection.release();
  }
};

// Lấy danh sách tất cả owners
const getAllOwners = async () => {
  const connection = await db.getConnection();
  
  try {
    const [owners] = await connection.execute(`
      SELECT 
        o.id, o.name, o.email, o.phone, o.created_at,
        COUNT(p.id) as total_pitches,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' 
          AND MONTH(b.booking_date) = MONTH(CURDATE()) 
          AND YEAR(b.booking_date) = YEAR(CURDATE()) 
          THEN p.price_per_hour ELSE 0 END), 0) as monthly_revenue
      FROM owners o
      LEFT JOIN pitches p ON o.id = p.owner_id
      LEFT JOIN bookings b ON p.id = b.pitch_id
      GROUP BY o.id, o.name, o.email, o.phone, o.created_at
      ORDER BY o.created_at DESC
    `);

    return owners;
  } finally {
    connection.release();
  }
};

module.exports = {
  getDashboardData,
  getAllOwners,
};