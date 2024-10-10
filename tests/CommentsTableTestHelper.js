/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'Nice article!',
    threadId = 'thread-123',
    userId = 'user-123',
    isDelete = false,
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, content, threadId, userId, isDelete, createdAt],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
