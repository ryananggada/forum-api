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
      date: threadFromId.date.toISOString(),
      username: threadUsername,
      comments: [],
    });

    const commentsInThread =
      await this._commentRepository.getCommentsByThreadId(threadId);

    if (commentsInThread.length > 0) {
      commentsInThread.map(async (comment) => {
        const { username: commentUsername } =
          await this._userRepository.getUserById(comment.user_id);
        const commentDetail = new CommentDetail({
          id: comment.id,
          username: commentUsername,
          date: comment.date.toISOString(),
          content: comment.content,
          replies: [],
        });

        const repliesInComment =
          await this._replyRepository.getRepliesByCommentId(comment.id);

        if (repliesInComment.length > 0) {
          repliesInComment.map(async (reply) => {
            const { username: replyUsername } =
              await this._userRepository.getUserById(reply.user_id);
            const replyDetail = new ReplyDetail({
              id: reply.id,
              content: reply.content,
              date: reply.date.toISOString(),
              username: replyUsername,
            });

            commentDetail.replies.push(replyDetail);
          });
        }

        thread.comments.push(commentDetail);
      });
    }

    return thread;
  }
}

module.exports = GetThreadDetailUseCase;
