const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, userId, newComment) {
    const { content } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO comments
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, content, user_id
      `,
      values: [id, content, threadId, userId, false, date],
    };

    const result = await this._pool.query(query);
    return new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].user_id,
    });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id, users.username, comments.created_at,
        CASE
          WHEN comments.is_delete THEN '**komentar telah dihapus**'
          ELSE comments.content
        END AS content
        FROM comments
        INNER JOIN users ON comments.user_id = users.id
        WHERE comments.thread_id = $1
        ORDER BY comments.created_at ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async checkAvailabilityComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async deleteCommentById(threadId, commentId) {
    const query = {
      text: `
        UPDATE comments
        SET is_delete = true
        WHERE thread_id = $1 AND id = $2
      `,
      values: [threadId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: `SELECT * FROM comments WHERE id = $1 AND user_id = $2`,
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('unauthorized, not the owner of comment');
    }
  }
}

module.exports = CommentRepositoryPostgres;
