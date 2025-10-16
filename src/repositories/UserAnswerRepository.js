const BaseRepository = require('./BaseRepository');

class UserAnswerRepository extends BaseRepository {
  constructor(pool) {
    super('user_answers', pool);
  }

  async createUserAnswer(attemptId, questionId, selectedOptionId) {
    const result = await this.pool.query(`
      INSERT INTO user_answers (attempt_id, question_id, selected_option_id) 
      VALUES ($1, $2, $3) RETURNING *
    `, [attemptId, questionId, selectedOptionId]);
    return result.rows[0];
  }

  async getAttemptScore(attemptId) {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_questions,
        COUNT(CASE WHEN ao.is_correct = true THEN 1 END) as correct_answers,
        ROUND(COUNT(CASE WHEN ao.is_correct = true THEN 1 END) * 100.0 / GREATEST(COUNT(*), 1)) as score_percentage
      FROM user_answers ua
      LEFT JOIN answer_options ao ON ua.selected_option_id = ao.id
      WHERE ua.attempt_id = $1
    `, [attemptId]);
    return result.rows[0];
  }
}

module.exports = UserAnswerRepository;