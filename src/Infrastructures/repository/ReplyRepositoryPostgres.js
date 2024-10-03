const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(userId, commentId, newReply) {
    const { content } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO replies
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, content, owner
      `,
      values: [id, content, date, commentId, userId, false],
    };

    const result = await this._pool.query(query);
    return new AddedReply(result.rows[0]);
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete
        FROM replies
        INNER JOIN users ON users.id = replies.owner
        WHERE replies.comment = $1
        ORDER BY replies.date ASC
        `,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `
        SELECT replies.*, user.username
        FROM replies
        LEFT JOIN users ON users.id = replies.owner
        LEFT JOIN comments ON comments.id = replies.comment
        WHERE comments.thread = $1 AND comments.is_delete = false
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReplyById(id) {
    const query = {
      text: `
        UPDATE replies
        SET is_delete = true
        WHERE id = $1
      `,
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
