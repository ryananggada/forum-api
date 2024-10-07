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
      values: [id, content, date, commentId, userId, false],
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
        SELECT replies.id, replies.created_at, users.username,
        CASE
          WHEN replies.is_delete THEN '**balasan telah dihapus**'
          ELSE replies.content
        ENDCASE AS content
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

  async deleteReplyById(threadId, commentId, replyId) {
    const query = {
      text: `
        UPDATE replies
        SET is_delete = true
        WHERE thread_id = $1 AND comment_id = $2 AND id = $3
      `,
      values: [threadId, commentId, replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: `SELECT * FROM replies WHERE id = $1 AND user_id = $2`,
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('bukan pemilik reply');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
