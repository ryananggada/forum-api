const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const mockCommentRepository = new CommentRepository();

    const mockComment = {
      id: 'comment-123',
    };
    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };

    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });
    await deleteCommentUseCase.execute(
      mockThread.id,
      mockComment.id,
      mockUser.id,
    );

    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      mockComment.id,
      mockUser.id,
    );
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      mockThread.id,
      mockComment.id,
    );
  });
});
