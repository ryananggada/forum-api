const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, newThread) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO threads
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, user_id
      `,
      values: [id, title, body, date, userId],
    };

    const result = await this._pool.query(query);
    return new AddedThread({
      id: result.rows[0].id,
      title: result.rows[0].title,
      owner: result.rows[0].user_id,
    });
  }

  async getThreadById(id) {
    const query = {
      text: `
        SELECT * FROM threads
        WHERE id = $1
        INNER JOIN users ON threads.user_id = user.id
      `,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread not found');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
