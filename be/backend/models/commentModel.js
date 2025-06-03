const db = require('../config/db');

class Comment {
  static async create({ user_id, username, comment, rating }) {
    const [result] = await db.query(
      'INSERT INTO comments (user_id, username, comment, rating) VALUES (?, ?, ?, ?)',
      [user_id, username, comment, rating]
    );
    return result;
  }

  static async getAll() {
    const [comments] = await db.query(
      'SELECT * FROM comments ORDER BY created_at DESC'
    );
    return comments;
  }

  static async getByUserId(user_id) {
    const [comments] = await db.query(
      'SELECT * FROM comments WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return comments;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Comment;