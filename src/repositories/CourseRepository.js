const BaseRepository = require('./BaseRepository');

class CourseRepository extends BaseRepository {
  constructor(pool) {
    super('courses', pool);
  }

  async findWithMaterials(courseId) {
    const result = await this.pool.query(`
      SELECT 
        c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', m.id,
              'title', m.title,
              'content_url', m.content_url,
              'content_type', m.content_type,
              'order_index', m.order_index
            ) ORDER BY m.order_index
          ) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) as materials
      FROM courses c
      LEFT JOIN materials m ON c.id = m.course_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [courseId]);
    return result.rows[0];
  }

  async getPopularCourses(limit = 5) {
    const result = await this.pool.query(`
      SELECT c.*, COUNT(up.user_id) as enrollment_count
      FROM courses c
      LEFT JOIN user_progress up ON c.id = up.course_id
      GROUP BY c.id
      ORDER BY enrollment_count DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  }
}

module.exports = CourseRepository;