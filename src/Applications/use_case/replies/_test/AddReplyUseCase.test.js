const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../../Domains/replies/entities/NewReply');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'My reply',
    };

    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };
    const mockComment = {
      id: 'comment-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-325',
      content: useCasePayload.content,
      owner: mockUser.id,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.checkAvailabilityComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    const addedReply = await addReplyUseCase.execute(
      mockComment.id,
      mockThread.id,
      mockUser.id,
      useCasePayload,
    );

    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'reply-325',
        content: useCasePayload.content,
        owner: mockUser.id,
      }),
    );

    expect(mockThreadRepository.getThreadById).toBeCalledWith(mockThread.id);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      mockUser.id,
      mockComment.id,
      new NewReply({
        content: useCasePayload.content,
      }),
    );
  });
});
