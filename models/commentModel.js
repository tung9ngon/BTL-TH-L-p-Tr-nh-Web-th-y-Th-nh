const db = require('../config/db');

class Comment {
  static async create({ user_id, comment, rating }) {
    // Lấy thông tin user từ bảng users
    const [userResult] = await db.query(
      'SELECT name, email FROM users WHERE id = ?',
      [user_id]
    );
    
    if (userResult.length === 0) {
      throw new Error('User not found');
    }
    
    const username = userResult[0].name;
    
    const [result] = await db.query(
      'INSERT INTO comments (user_id, username, comment, rating) VALUES (?, ?, ?, ?)',
      [user_id, username, comment, rating]
    );
    return result;
  }


  static async getAll() {
    const [comments] = await db.query(`
      SELECT c.*, u.name, u.email 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
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