const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();

    const userA = {
      id: 'user-123',
      username: 'johncena',
      fullname: 'John Cena',
    };

    const userB = {
      id: 'user-456',
      username: 'ryananggada',
      fullname: 'Ryan Anggada',
    };

    const mockThreadData = {
      id: 'thread-123',
      title: 'My thread',
      body: 'Thread content goes here.',
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
        is_delete: false,
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
        is_delete: false,
        created_at: '2024-10-07T02:55:46.810Z',
        username: 'ryananggada',
      },
    ];

    mockUserRepository.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === 'user-123') {
        return Promise.resolve(userA);
      }

      if (userId === 'user-456') {
        return Promise.resolve(userB);
      }

      return Promise.resolve({});
    });
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadData));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation((threadId) => {
        if (threadId === 'thread-123') {
          return Promise.resolve(mockCommentData);
        }

        return Promise.resolve([]);
      });
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

    expect(threadDetail.comments).toHaveLength(2);
    expect(threadDetail.comments[0].username).toEqual(userB.username);
    expect(threadDetail.comments[1].username).toEqual(userA.username);
    expect(threadDetail.comments[0].replies).toHaveLength(2);
    expect(threadDetail.comments[1].replies).toHaveLength(0);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
});
