const BaseRepository = require('./BaseRepository');

class TestRepository extends BaseRepository {
  constructor(pool) {
    super('tests', pool);
  }

  async findByCourseId(courseId) {
    const result = await this.pool.query('SELECT * FROM tests WHERE course_id = $1', [courseId]);
    return result.rows;
  }

  async findWithQuestions(testId) {
    const result = await this.pool.query(`
      SELECT 
        t.*,
        json_agg(
          json_build_object(
            'id', q.id,
            'question_text', q.question_text,
            'question_type', q.question_type,
            'order_index', q.order_index
          ) ORDER BY q.order_index
        ) as questions
      FROM tests t
      LEFT JOIN questions q ON t.id = q.test_id
      WHERE t.id = $1
      GROUP BY t.id
    `, [testId]);
    return result.rows[0];
  }
}

module.exports = TestRepository;