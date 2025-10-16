const BaseRepository = require('./BaseRepository');

class CourseMaterialTestRepository extends BaseRepository {
  constructor(pool) {
    super('course_materials_tests', pool);
  }

  async linkMaterialToTest(materialId, testId) {
    const result = await this.pool.query(`
      INSERT INTO course_materials_tests (material_id, test_id) VALUES ($1, $2) RETURNING *
    `, [materialId, testId]);
    return result.rows[0];
  }

  async findTestsByMaterialId(materialId) {
    const result = await this.pool.query(`
      SELECT t.* FROM course_materials_tests cmt
      JOIN tests t ON cmt.test_id = t.id
      WHERE cmt.material_id = $1
    `, [materialId]);
    return result.rows;
  }
}

module.exports = CourseMaterialTestRepository;