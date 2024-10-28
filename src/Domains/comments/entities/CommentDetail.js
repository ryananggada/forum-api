class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, likeCount, replies } =
      this._remapPayload(payload);

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({ id, username, date, content, likeCount, replies }) {
    if (
      !id ||
      !username ||
      !date ||
      !content ||
      likeCount === undefined ||
      !replies
    ) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string' ||
      typeof likeCount !== 'number' ||
      !Array.isArray(replies)
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _remapPayload({ id, username, date, content, likeCount, replies, isDelete }) {
    return {
      id,
      username,
      date,
      content: isDelete ? '**komentar telah dihapus**' : content,
      likeCount,
      replies,
    };
  }
}

module.exports = CommentDetail;
