const db = require('../config/db');

async function findUserByEmail(email) {
  const connection = await db.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users;
  } catch (error) {
    console.error('Error in findUserByEmail:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function createUser({ name, email, password, phone }) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function findUserByCredentials(email, password) {
  const connection = await db.getConnection();
  try {
    const [users] = await connection.query(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    return users;
  } catch (error) {
    console.error('Error in findUserByCredentials:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { findUserByEmail, createUser, findUserByCredentials };