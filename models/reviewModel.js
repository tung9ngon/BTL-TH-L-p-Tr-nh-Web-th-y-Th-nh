const db = require('../config/db');

class ReviewModel {
  static async create(pitch_id, user_id, rating, comment) {
    let connection;
    try {
      connection = await db.getConnection();
      const [result] = await connection.execute(
        `INSERT INTO pitch_reviews (pitch_id, user_id, rating, comment) VALUES (?, ?, ?, ?)`,
        [pitch_id, user_id, rating, comment || null]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  }

  static async checkUserReviewed(pitch_id, user_id) {
    let connection;
    try {
      connection = await db.getConnection();
      const [reviews] = await connection.execute(
        'SELECT id FROM pitch_reviews WHERE pitch_id = ? AND user_id = ?',
        [pitch_id, user_id]
      );
      return reviews.length > 0;
    } catch (error) {
      console.error('Error checking if user reviewed:', error);
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
          pr.user_id,
          pr.rating,
          pr.comment,
          pr.created_at,
          u.name AS user_name
        FROM pitch_reviews pr
        JOIN users u ON pr.user_id = u.id
        WHERE pr.pitch_id = ?
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

  static async getAverageRating(pitch_id) {
  let connection;
  try {
    connection = await db.getConnection();
    const [result] = await connection.execute(
      `SELECT 
        ROUND(AVG(rating), 1) as avg_rating, 
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars
      FROM pitch_reviews
      WHERE pitch_id = ?`,
      [pitch_id]
    );
    
    return {
      avg_rating: parseFloat(result[0]?.avg_rating) || 0,
      total_reviews: parseInt(result[0]?.total_reviews) || 0,
      rating_distribution: {
        1: result[0]?.one_star || 0,
        2: result[0]?.two_stars || 0,
        3: result[0]?.three_stars || 0,
        4: result[0]?.four_stars || 0,
        5: result[0]?.five_stars || 0
      }
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