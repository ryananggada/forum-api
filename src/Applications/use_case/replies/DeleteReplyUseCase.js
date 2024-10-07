class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(threadId, commentId, replyId, userId) {
    await this._replyRepository.verifyReplyOwner(replyId, userId);

    return this._replyRepository(threadId, commentId, replyId);
  }
}

module.exports = DeleteReplyUseCase;
