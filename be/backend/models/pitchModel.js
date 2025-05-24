const db = require('../config/db');

async function getPitchesByOwner(ownerId) {
  const connection = await db.getConnection();
  const [pitches] = await connection.execute(
    'SELECT * FROM pitches WHERE owner_id = ? ORDER BY created_at DESC',
    [ownerId]
  );
  connection.release()
  return pitches;
}

async function addPitch(ownerId, { name, location, price_per_hour, pitch_type_id }) {
  const connection = await db.getConnection();
  const [result] = await connection.execute(
    'INSERT INTO pitches (owner_id, name, location, price_per_hour, pitch_type_id) VALUES (?, ?, ?, ?, ?)',
    [ownerId, name, location, price_per_hour, pitch_type_id]
  );
  connection.release()
  return result.insertId;
}

async function verifyPitchOwnership(pitchId, ownerId) {
  const connection = await db.getConnection();
  const [ownerCheck] = await connection.execute(
    'SELECT id FROM pitches WHERE id = ? AND owner_id = ?',
    [pitchId, ownerId]
  );
  connection.release()
  return ownerCheck.length > 0;
}

async function updatePitch(pitchId, { name, location, price_per_hour, pitch_type_id, status }) {
  const connection = await db.getConnection();
  await connection.execute(
    'UPDATE pitches SET name = ?, location = ?, price_per_hour = ?, pitch_type_id = ?, status = ? WHERE id = ?',
    [name, location, price_per_hour, pitch_type_id, status, pitchId]
  );
  connection.release()
}

async function getBookingsByPitch(ownerId, pitchId, date) {
  const connection = await db.getConnection();

  const [ownerCheck] = await connection.execute(
    'SELECT id FROM pitches WHERE id = ? AND owner_id = ?',
    [pitchId, ownerId]
  );
  if (ownerCheck.length === 0) {
    connection.release()
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
  connection.release()
  return bookings;
}

async function updateBookingStatus(ownerId, bookingId, status) {
  const connection = await db.getConnection();
  const [ownerCheck] = await connection.execute(`
    SELECT b.id FROM bookings b
    JOIN pitches p ON b.pitch_id = p.id
    WHERE b.id = ? AND p.owner_id = ?
  `, [bookingId, ownerId]);

  if (ownerCheck.length === 0) {
    connection.release()
    return false;
  }

  await connection.execute(
    'UPDATE bookings SET status = ? WHERE id = ?',
    [status, bookingId]
  );
  connection.release()
  return true;
}

module.exports = {
  getPitchesByOwner,
  addPitch,
  verifyPitchOwnership,
  updatePitch,
  getBookingsByPitch,
  updateBookingStatus
};

