const db = require('../config/db');

async function findOwnerByEmail(email) {
  const connection = await db.getConnection();
  try {
    const [owners] = await connection.query(
      'SELECT * FROM owners WHERE email = ?',
      [email]
    );
    return owners;
  } catch (error) {
    console.error('Error in findOwnerByEmail:', error);
    throw error; // Re-throw để controller có thể bắt
  } finally {
    connection.release(); // Trả connection về pool
  }
}

async function createOwner({ name, email, password, phone }) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      'INSERT INTO owners (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error in createOwner:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function findOwnerByCredentials(email, password) {
  const connection = await db.getConnection();
  try {
    const [owners] = await connection.query(
      'SELECT * FROM owners WHERE email = ? AND password = ?',
      [email, password]
    );
    return owners;
  } catch (error) {
    console.error('Error in findOwnerByCredentials:', error);
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { findOwnerByEmail, createOwner, findOwnerByCredentials };