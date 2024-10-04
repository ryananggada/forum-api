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

    const mockAddedComment = new AddedComment({
      id: 'comment-456',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn(() =>
      Promise.resolve(mockAddedComment),
    );
    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve(mockThreadRepository),
    );

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      'thread-456',
      'user-123',
      useCasePayload,
    );

    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-456',
        content: useCasePayload.content,
        owner: 'user-123',
      }),
    );

    expect(mockCommentRepository.addComment).toBeCalledWith(
      'thread-456',
      'user-123',
      new NewComment({
        content: useCasePayload.content,
      }),
    );
  });
});
