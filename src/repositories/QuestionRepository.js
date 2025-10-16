const BaseRepository = require('./BaseRepository');

class QuestionRepository extends BaseRepository {
  constructor(pool) {
    super('questions', pool);
  }

  async findByTestId(testId) {
    const result = await this.pool.query(`
      SELECT * FROM questions WHERE test_id = $1 ORDER BY order_index ASC
    `, [testId]);
    return result.rows;
  }

  async findWithAnswers(questionId) {
    const result = await this.pool.query(`
      SELECT 
        q.*,
        json_agg(
          json_build_object(
            'id', ao.id,
            'option_text', ao.option_text,
            'is_correct', ao.is_correct,
            'order_index', ao.order_index
          ) ORDER BY ao.order_index
        ) as answer_options
      FROM questions q
      LEFT JOIN answer_options ao ON q.id = ao.question_id
      WHERE q.id = $1
      GROUP BY q.id
    `, [questionId]);
    return result.rows[0];
  }
}

module.exports = QuestionRepository;