const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
  constructor(pool) {
    super('users', pool);
  }

  async findByEmail(email) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async updateLastAccess(userId) {
    const result = await this.pool.query(
      'UPDATE users SET updated_at = NOW() WHERE id = $1 RETURNING *',
      [userId]
    );
    return result.rows[0];
  }

  async getUserStats(userId) {
    const result = await this.pool.query(`
      SELECT 
        u.id, u.name, u.email,
        COUNT(DISTINCT up.course_id) as enrolled_courses_count,
        COUNT(DISTINCT up.material_id) as completed_materials_count,
        COUNT(DISTINCT uqa.id) as quiz_attempts_count,
        COALESCE(AVG(uqa.score), 0) as average_score
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id AND up.completed = true
      LEFT JOIN user_quiz_attempts uqa ON u.id = uqa.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email
    `, [userId]);
    return result.rows[0];
  }
}

module.exports = UserRepository;