class LikeCommentUseCase {
  constructor({ likeRepository, threadRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);

    const hasLiked = await this._likeRepository.getHasLiked(
      userId,
      threadId,
      commentId,
    );

    if (hasLiked.length) {
      return this._likeRepository.deleteLikeById(hasLiked[0].id);
    }

    return this._likeRepository.addLike(userId, threadId, commentId);
  }
}

module.exports = LikeCommentUseCase;
