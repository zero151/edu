const BaseRepository = require('./BaseRepository');

class QuizAttemptRepository extends BaseRepository {
  constructor(pool) {
    super('user_quiz_attempts', pool);
  }

  async startAttempt(userId, testId) {
    const result = await this.pool.query(`
      INSERT INTO user_quiz_attempts (user_id, test_id) VALUES ($1, $2) RETURNING *
    `, [userId, testId]);
    return result.rows[0];
  }

  async finishAttempt(attemptId, score) {
    const result = await this.pool.query(`
      UPDATE user_quiz_attempts SET finished_at = NOW(), score = $2 WHERE id = $1 RETURNING *
    `, [attemptId, score]);
    return result.rows[0];
  }

  async getActiveAttempt(userId, testId) {
    const result = await this.pool.query(`
      SELECT * FROM user_quiz_attempts 
      WHERE user_id = $1 AND test_id = $2 AND finished_at IS NULL
      LIMIT 1
    `, [userId, testId]);
    return result.rows[0] || null;
  }
}

module.exports = QuizAttemptRepository;