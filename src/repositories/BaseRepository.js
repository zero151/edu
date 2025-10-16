class BaseRepository {
  constructor(tableName, pool) {
    this.table = tableName;
    this.pool = pool;
  }

  async findById(id) {
    const result = await this.pool.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  async findAll() {
    const result = await this.pool.query(`SELECT * FROM ${this.table}`);
    return result.rows;
  }

  async create(data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await this.pool.query(
      `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  }

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    
    const result = await this.pool.query(
      `UPDATE ${this.table} SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await this.pool.query(`DELETE FROM ${this.table} WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
  }
}

module.exports = BaseRepository;