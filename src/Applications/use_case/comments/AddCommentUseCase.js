const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, userId, useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    const thread = await this._threadRepository.verifyThreadAvailability(
      threadId,
    );

    return this._commentRepository.addComment(threadId, userId, newComment);
  }
}

module.exports = AddCommentUseCase;
