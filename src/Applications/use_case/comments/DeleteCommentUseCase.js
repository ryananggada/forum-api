class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, userId) {
    await this._commentRepository.verifyCommentOwner(commentId, userId);

    return this._commentRepository.deleteCommentById(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
