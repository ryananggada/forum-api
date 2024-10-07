const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
  }

  async execute(commentId, threadId, userId, useCasePayload) {
    const newReply = new NewReply(useCasePayload);
    await this._threadRepository.getThreadById(threadId);

    return this._replyRepository.addReply(userId, commentId, newReply);
  }
}

module.exports = AddReplyUseCase;
