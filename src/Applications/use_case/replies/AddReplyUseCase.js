const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(commentId, threadId, userId, useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    return this._replyRepository.addReply(userId, commentId, newReply);
  }
}

module.exports = AddReplyUseCase;
