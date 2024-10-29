const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../../Domains/likes/LikeRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the like comment action correctly', async () => {
    const mockComment = {
      id: 'comment-123',
    };
    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread.id));
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment.id));
    mockLikeRepository.getHasLiked = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));
    mockLikeRepository.addLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addLikeResponse = await likeCommentUseCase.execute(
      mockUser.id,
      mockThread.id,
      mockComment.id,
    );

    expect(addLikeResponse).toStrictEqual({ status: 'success' });

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      mockThread.id,
    );
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      mockComment.id,
    );
    expect(mockLikeRepository.getHasLiked).toBeCalledWith(
      mockUser.id,
      mockThread.id,
      mockComment.id,
    );
    expect(mockLikeRepository.addLike).toBeCalledWith(
      mockUser.id,
      mockThread.id,
      mockComment.id,
    );
  });

  it('should orchestrating the unlike comment action correctly', async () => {
    const mockComment = {
      id: 'comment-123',
    };
    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread.id));
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockComment.id));
    mockLikeRepository.getHasLiked = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: 'like-123' }]));
    mockLikeRepository.deleteLikeById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ status: 'success' }));

    const likeCommentUseCase = new LikeCommentUseCase({
      likeRepository: mockLikeRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const removeLikeResponse = await likeCommentUseCase.execute(
      mockUser.id,
      mockThread.id,
      mockComment.id,
    );

    expect(removeLikeResponse).toStrictEqual({ status: 'success' });

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      mockThread.id,
    );
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(
      mockComment.id,
    );
    expect(mockLikeRepository.getHasLiked).toBeCalledWith(
      mockUser.id,
      mockThread.id,
      mockComment.id,
    );
    expect(mockLikeRepository.deleteLikeById).toBeCalledWith('like-123');
  });
});
