const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'Nice article!',
    };

    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-456',
      content: useCasePayload.content,
      owner: mockUser.id,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      mockThread.id,
      mockUser.id,
      useCasePayload,
    );

    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-456',
        content: useCasePayload.content,
        owner: mockUser.id,
      }),
    );

    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      mockThread.id,
    );
    expect(mockCommentRepository.addComment).toBeCalledWith(
      mockThread.id,
      mockUser.id,
      new NewComment({
        content: useCasePayload.content,
      }),
    );
  });
});
