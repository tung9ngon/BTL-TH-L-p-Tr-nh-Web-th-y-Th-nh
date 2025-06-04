const mysql = require('mysql2/promise');
const db = require('../config/db');

const getAllTimeSlots = async () => {
  const connection = await db.getConnection();
  const [timeSlots] = await connection.execute(
    'SELECT * FROM time_slots ORDER BY start_time'
  );
  connection.release()
  return timeSlots;
};

const addTimeSlot = async (start_time, end_time) => {
  const connection = await db.getConnection();
  const [result] = await connection.execute(
    'INSERT INTO time_slots (start_time, end_time) VALUES (?, ?)',
    [start_time, end_time]
  );
  connection.release()
  return result.insertId;
};

module.exports = {
  getAllTimeSlots,
  addTimeSlot,
};
