const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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
        RETURNING id, content, user_id
      `,
      values: [id, content, commentId, userId, false, date],
    };

    const result = await this._pool.query(query);
    return new AddedReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: `
        SELECT replies.id, replies.created_at, users.username, replies.is_delete, replies.content
        FROM replies
        INNER JOIN users ON users.id = replies.user_id
        WHERE replies.comment_id = $1
        ORDER BY replies.created_at ASC
        `,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkAvailabilityReply(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply not found');
    }
  }

  async deleteReplyById(threadId, commentId, replyId) {
    const query = {
      text: `
        UPDATE replies r
        SET is_delete = true
        FROM comments c
        INNER JOIN threads t ON c.thread_id = t.id
        WHERE r.comment_id = c.id
          AND t.id = $1
          AND r.comment_id = $2
          AND r.id = $3
      `,
      values: [threadId, commentId, replyId],
    };

    await this._pool.query(query);
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: `SELECT * FROM replies WHERE id = $1 AND user_id = $2`,
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('unauthorized, not the owner of reply');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
