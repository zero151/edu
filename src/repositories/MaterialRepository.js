const BaseRepository = require('./BaseRepository');

class MaterialRepository extends BaseRepository {
  constructor(pool) {
    super('materials', pool);
  }

  async findByCourseId(courseId) {
    const result = await this.pool.query(`
      SELECT * FROM materials WHERE course_id = $1 ORDER BY order_index ASC
    `, [courseId]);
    return result.rows;
  }

  async getNextMaterial(courseId, currentOrderIndex) {
    const result = await this.pool.query(`
      SELECT * FROM materials 
      WHERE course_id = $1 AND order_index > $2
      ORDER BY order_index ASC LIMIT 1
    `, [courseId, currentOrderIndex]);
    return result.rows[0] || null;
  }
}

module.exports = MaterialRepository;