const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const ReplyDetail = require('../../../Domains/replies/entities/ReplyDetail');

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    userRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const threadFromId = await this._threadRepository.getThreadById(threadId);
    const { username: threadUsername } = await this._userRepository.getUserById(
      threadFromId.user_id,
    );

    const thread = new ThreadDetail({
      id: threadFromId.id,
      title: threadFromId.title,
      body: threadFromId.body,
      date: threadFromId.created_at.toString(),
      username: threadUsername,
      comments: [],
    });

    const commentsInThread =
      await this._commentRepository.getCommentsByThreadId(threadId);

    if (commentsInThread.length > 0) {
      const commentDetails = await Promise.all(
        commentsInThread.map(async (comment) => {
          const { username: commentUsername } =
            await this._userRepository.getUserById(comment.user_id);

          const commentDetail = new CommentDetail({
            id: comment.id,
            username: commentUsername,
            date: comment.created_at,
            content: comment.content,
            replies: [],
          });

          const repliesInComment =
            await this._replyRepository.getRepliesByCommentId(comment.id);

          if (repliesInComment.length > 0) {
            const replyDetails = await Promise.all(
              repliesInComment.map(async (reply) => {
                const { username: replyUsername } =
                  await this._userRepository.getUserById(reply.user_id);
                return new ReplyDetail({
                  id: reply.id,
                  content: reply.content,
                  date: reply.created_at,
                  username: replyUsername,
                });
              }),
            );

            commentDetail.replies.push(...replyDetails);
          }

          return commentDetail;
        }),
      );

      thread.comments.push(...commentDetails);
    }

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
