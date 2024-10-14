const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const mockReplyRepository = new ReplyRepository();

    const mockReply = {
      id: 'reply-123',
    };
    const mockComment = {
      id: 'comment-123',
    };
    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };

    mockReplyRepository.checkAvailabilityReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });
    await deleteReplyUseCase.execute(
      mockThread.id,
      mockComment.id,
      mockReply.id,
      mockUser.id,
    );

    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      mockReply.id,
      mockUser.id,
    );
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      mockThread.id,
      mockComment.id,
      mockReply.id,
    );
  });
});
