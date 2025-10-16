const BaseRepository = require('./BaseRepository');

class ProgressRepository extends BaseRepository {
  constructor(pool) {
    super('user_progress', pool);
  }

  async markAsCompleted(userId, courseId, materialId) {
    const result = await this.pool.query(`
      INSERT INTO user_progress (user_id, course_id, material_id, completed) 
      VALUES ($1, $2, $3, true)
      ON CONFLICT (user_id, material_id) 
      DO UPDATE SET completed = true, last_accessed_at = NOW()
      RETURNING *
    `, [userId, courseId, materialId]);
    return result.rows[0];
  }

  async getCourseProgress(userId, courseId) {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_materials,
        COUNT(CASE WHEN up.completed = true THEN 1 END) as completed_materials,
        ROUND(COUNT(CASE WHEN up.completed = true THEN 1 END) * 100.0 / GREATEST(COUNT(*), 1)) as completion_percentage
      FROM materials m
      LEFT JOIN user_progress up ON m.id = up.material_id AND up.user_id = $1
      WHERE m.course_id = $2
    `, [userId, courseId]);
    return result.rows[0];
  }
}

module.exports = ProgressRepository;