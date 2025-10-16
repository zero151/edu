const BaseRepository = require('./BaseRepository');

class AnswerOptionRepository extends BaseRepository {
  constructor(pool) {
    super('answer_options', pool);
  }

  async findByQuestionId(questionId) {
    const result = await this.pool.query(`
      SELECT * FROM answer_options WHERE question_id = $1 ORDER BY order_index ASC
    `, [questionId]);
    return result.rows;
  }

  async validateAnswer(selectedOptionId) {
    const result = await this.pool.query(`
      SELECT is_correct FROM answer_options WHERE id = $1
    `, [selectedOptionId]);
    return result.rows[0] ? result.rows[0].is_correct : false;
  }
}

module.exports = AnswerOptionRepository;