const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(userId, threadId, commentId) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3, $4)',
      values: [id, userId, threadId, commentId],
    };

    await this._pool.query(query);
  }

  async deleteLikeById(id) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getHasLiked(userId, threadId, commentId) {
    const query = {
      text: 'SELECT id FROM likes WHERE user_id = $1 AND thread_id = $2 AND comment_id = $3',
      values: [userId, threadId, commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getLikesByThreadId(threadId) {
    const query = {
      text: 'SELECT * FROM likes WHERE thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
