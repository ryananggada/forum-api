const LikeCommentUseCase = require('../../../../Applications/use_case/likes/LikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.likeCommentHandler = this.likeCommentHandler.bind(this);
  }

  async likeCommentHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name,
    );

    const { id: userId } = request.auth.credentials;

    const { threadId, commentId } = request.params;

    await likeCommentUseCase.execute(userId, threadId, commentId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
