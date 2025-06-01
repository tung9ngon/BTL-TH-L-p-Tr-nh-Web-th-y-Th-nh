const db = require('../config/db');

class ReviewModel {
  static async create(booking_id, rating, comment) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO pitch_reviews (booking_id, rating, comment) VALUES (?, ?, ?)`,
        [booking_id, rating, comment || null]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  static async checkBookingReviewed(booking_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [reviews] = await connection.execute(
        'SELECT id FROM pitch_reviews WHERE booking_id = ?',
        [booking_id]
      );
      return reviews.length > 0;
    } catch (error) {
      console.error('Error checking if booking reviewed:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getByPitchId(pitch_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [reviews] = await connection.execute(
        `SELECT 
          pr.id,
          pr.booking_id,
          pr.rating,
          pr.comment,
          pr.created_at,
          u.name AS user_name,
          u.avatar AS user_avatar
        FROM pitch_reviews pr
        JOIN bookings b ON pr.booking_id = b.id
        JOIN users u ON b.user_id = u.id
        WHERE b.pitch_id = ?
        ORDER BY pr.created_at DESC`,
        [pitch_id]
      );
      return reviews;
    } catch (error) {
      console.error('Error getting reviews by pitch:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  static async checkBookingOwner(booking_id, user_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [bookings] = await connection.execute(
        'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
        [booking_id, user_id]
      );
      return bookings.length > 0;
    } catch (error) {
      console.error('Error checking booking owner:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  static async getAverageRating(pitch_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `SELECT 
          AVG(rating) as avg_rating, 
          COUNT(*) as total_reviews
        FROM pitch_reviews pr
        JOIN bookings b ON pr.booking_id = b.id
        WHERE b.pitch_id = ?`,
        [pitch_id]
      );
      
      return {
        avg_rating: parseFloat(result[0]?.avg_rating) || 0,
        total_reviews: parseInt(result[0]?.total_reviews) || 0
      };
    } catch (error) {
      console.error('Error getting average rating:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }
}

module.exports = ReviewModel;