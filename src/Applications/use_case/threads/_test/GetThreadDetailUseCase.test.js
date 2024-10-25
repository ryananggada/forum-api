const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action with comments and replies correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    const mockThreadData = {
      id: 'thread-123',
      title: 'My thread',
      body: 'Thread content goes here',
      created_at: '2024-10-04T10:24:47.551Z',
      username: 'johncena',
    };

    const mockCommentData = [
      {
        id: 'comment-123',
        content: 'Test comment one',
        thread_id: 'thread-123',
        created_at: '2024-10-07T01:58:38.808Z',
        is_delete: false,
        username: 'ryananggada',
      },
      {
        id: 'comment-625',
        content: 'Test comment two',
        thread_id: 'thread-123',
        created_at: '2024-10-07T02:54:10.771Z',
        is_delete: true,
        username: 'johncena',
      },
    ];

    const mockReplyData = [
      {
        id: 'reply-123',
        content: 'Reply goes here',
        comment_id: 'comment-123',
        is_delete: false,
        created_at: '2024-10-07T02:54:38.565Z',
        username: 'johncena',
      },
      {
        id: 'reply-207',
        content: 'Reply goes here again',
        comment_id: 'comment-123',
        is_delete: true,
        created_at: '2024-10-07T02:55:46.810Z',
        username: 'ryananggada',
      },
    ];

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentData));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-123') {
          return Promise.resolve(mockReplyData);
        }

        return Promise.resolve([]);
      });

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      'thread-123',
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      'comment-123',
    );

    expect(threadDetail.id).toEqual('thread-123');
    expect(threadDetail.title).toEqual('My thread');
    expect(threadDetail.body).toEqual('Thread content goes here');
    expect(threadDetail.username).toEqual('johncena');

    expect(threadDetail.comments).toHaveLength(2);

    expect(threadDetail.comments[0].id).toEqual('comment-123');
    expect(threadDetail.comments[0].username).toEqual('ryananggada');
    expect(threadDetail.comments[0].content).toEqual('Test comment one');

    expect(threadDetail.comments[1].id).toEqual('comment-625');
    expect(threadDetail.comments[1].username).toEqual('johncena');
    expect(threadDetail.comments[1].content).toEqual(
      '**komentar telah dihapus**',
    );

    expect(threadDetail.comments[0].replies).toHaveLength(2);

    expect(threadDetail.comments[0].replies[0].id).toEqual('reply-123');
    expect(threadDetail.comments[0].replies[0].username).toEqual('johncena');
    expect(threadDetail.comments[0].replies[0].content).toEqual(
      'Reply goes here',
    );

    expect(threadDetail.comments[0].replies[1].id).toEqual('reply-207');
    expect(threadDetail.comments[0].replies[1].username).toEqual('ryananggada');
    expect(threadDetail.comments[0].replies[1].content).toEqual(
      '**balasan telah dihapus**',
    );

    expect(threadDetail.comments[1].replies).toHaveLength(0);
  });

  it('should orchestrating the get thread detail action without comments and replies correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    const mockThreadData = {
      id: 'thread-123',
      title: 'My thread',
      body: 'Thread content goes here',
      created_at: '2024-10-04T10:24:47.551Z',
      username: 'johncena',
    };

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadDetailUseCase.execute('thread-123');

    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');

    expect(threadDetail.id).toEqual('thread-123');
    expect(threadDetail.title).toEqual('My thread');
    expect(threadDetail.body).toEqual('Thread content goes here');
    expect(threadDetail.username).toEqual('johncena');
    expect(threadDetail.comments).toHaveLength(0);
  });
});
