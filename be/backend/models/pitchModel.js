const db = require('../config/db');

async function getAllPitches() {
  const connection = await db.getConnection();
  try {
    const [pitches] = await connection.execute(
      `SELECT 
        p.*,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as total_reviews,
        COALESCE(
          (SELECT COUNT(*) 
           FROM pitch_reviews pr2 
           WHERE pr2.pitch_id = p.id AND pr2.rating = 5), 0
        ) as five_star_reviews
      FROM pitches p
      LEFT JOIN pitch_reviews pr ON p.id = pr.pitch_id
      GROUP BY p.id`
    );
    
    return pitches.map(pitch => ({
      ...pitch,
      avg_rating: parseFloat(pitch.avg_rating).toFixed(1),
      total_reviews: parseInt(pitch.total_reviews),
      five_star_reviews: parseInt(pitch.five_star_reviews)
    }));
  } finally {
    connection.release();
  }
}

async function searchPitches({ search, location, minPrice, maxPrice, pitchType, sortBy }) {
  const connection = await db.getConnection();
  try {
    let query = `
      SELECT 
        p.*,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as total_reviews
      FROM pitches p
      LEFT JOIN pitch_reviews pr ON p.id = pr.pitch_id
      WHERE p.status = 'available'
    `;
    const params = [];
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (location) {
      query += ' AND p.location LIKE ?';
      params.push(`%${location}%`);
    }
    
    if (minPrice) {
      query += ' AND p.price_per_hour >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND p.price_per_hour <= ?';
      params.push(maxPrice);
    }
    
    if (pitchType) {
      query += ' AND p.pitch_type_id = ?';
      params.push(pitchType);
    }
    
    query += ' GROUP BY p.id';
    
    if (sortBy === 'rating') {
      query += ' ORDER BY avg_rating DESC';
    } else if (sortBy === 'price_asc') {
      query += ' ORDER BY p.price_per_hour ASC';
    } else if (sortBy === 'price_desc') {
      query += ' ORDER BY p.price_per_hour DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }
    
    const [pitches] = await connection.execute(query, params);
    
    return pitches.map(pitch => ({
      ...pitch,
      avg_rating: parseFloat(pitch.avg_rating).toFixed(1),
      total_reviews: parseInt(pitch.total_reviews)
    }));
  } finally {
    connection.release();
  }
}

async function getPitchesByOwner(ownerId) {
  const connection = await db.getConnection();
  try {
    const [pitches] = await connection.execute(
      `SELECT 
        p.*,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as total_reviews
      FROM pitches p
      LEFT JOIN pitch_reviews pr ON p.id = pr.pitch_id
      WHERE p.owner_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [ownerId]
    );
    
    return pitches.map(pitch => ({
      ...pitch,
      avg_rating: parseFloat(pitch.avg_rating).toFixed(1),
      total_reviews: parseInt(pitch.total_reviews)
    }));
  } finally {
    connection.release();
  }
}

async function addPitch(ownerId, { name, location, price_per_hour, pitch_type_id, avatar }) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO pitches (owner_id, name, location, price_per_hour, pitch_type_id, avatar) VALUES (?, ?, ?, ?, ?, ?)',
      [ownerId, name, location, price_per_hour, pitch_type_id, avatar]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function verifyPitchOwnership(pitchId, ownerId) {
  const connection = await db.getConnection();
  try {
    const [ownerCheck] = await connection.execute(
      'SELECT id FROM pitches WHERE id = ? AND owner_id = ?',
      [pitchId, ownerId]
    );
    return ownerCheck.length > 0;
  } finally {
    connection.release();
  }
}

async function updatePitch(pitchId, { name, location, price_per_hour, pitch_type_id, status, avatar }) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE pitches SET name = ?, location = ?, price_per_hour = ?, pitch_type_id = ?, status = ?, avatar = ? WHERE id = ?',
      [name, location, price_per_hour, pitch_type_id, status, avatar, pitchId]
    );
  } finally {
    connection.release();
  }
}

async function getBookingsByPitch(ownerId, pitchId, date) {
  const connection = await db.getConnection();
  try {
    const [ownerCheck] = await connection.execute(
      'SELECT id FROM pitches WHERE id = ? AND owner_id = ?',
      [pitchId, ownerId]
    );
    if (ownerCheck.length === 0) {
      return null;
    }

    let query = `
      SELECT b.*, u.name as user_name, u.phone as user_phone,
             ts.start_time, ts.end_time
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN time_slots ts ON b.time_slot_id = ts.id
      WHERE b.pitch_id = ?`;
    let params = [pitchId];

    if (date) {
      query += ' AND b.booking_date = ?';
      params.push(date);
    }

    query += ' ORDER BY b.booking_date DESC, ts.start_time ASC';

    const [bookings] = await connection.execute(query, params);
    return bookings;
  } finally {
    connection.release();
  }
}

async function updateBookingStatus(ownerId, bookingId, status) {
  const connection = await db.getConnection();
  try {
    const [ownerCheck] = await connection.execute(`
      SELECT b.id FROM bookings b
      JOIN pitches p ON b.pitch_id = p.id
      WHERE b.id = ? AND p.owner_id = ?
    `, [bookingId, ownerId]);

    if (ownerCheck.length === 0) {
      return false;
    }

    await connection.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, bookingId]
    );
    return true;
  } finally {
    connection.release();
  }
}

async function getPitchById(pitchId) {
  const connection = await db.getConnection();
  try {
    const [pitches] = await connection.execute(
      'SELECT * FROM pitches WHERE id = ?',
      [pitchId]
    );
    return pitches[0] || null;
  } finally {
    connection.release();
  }
}

async function deletePitch(pitchId) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // Xóa các booking liên quan
    await connection.execute(
      'DELETE FROM bookings WHERE pitch_id = ?',
      [pitchId]
    );
    
    // Xóa các review liên quan
    await connection.execute(
      'DELETE FROM pitch_reviews WHERE pitch_id = ?',
      [pitchId]
    );
    
    // Xóa sân
    await connection.execute(
      'DELETE FROM pitches WHERE id = ?',
      [pitchId]
    );
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
module.exports = {
  getAllPitches,
  searchPitches,
  getPitchesByOwner,
  addPitch,
  verifyPitchOwnership,
  updatePitch,
  getBookingsByPitch,
  updateBookingStatus,
  getPitchById,
  deletePitch
};