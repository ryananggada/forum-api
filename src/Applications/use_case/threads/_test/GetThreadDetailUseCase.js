const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread detail action correctly', async () => {
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();
  });

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
    date: '2024-10-04T10:24:47.551Z',
    user_id: 'user-123',
  };

  const mockCommentData = [
    {
      id: 'comment-123',
      content: 'Test comment one',
      user_id: 'user-456',
      thread_id: 'thread-123',
      created_at: '2024-10-07T01:58:38.808Z',
      is_delete: false,
    },
    {
      id: 'comment-625',
      content: 'Test comment two',
      user_id: 'user-123',
      thread_id: 'thread-123',
      created_at: '2024-10-07T02:54:10.771Z',
      is_delete: false,
    },
  ];

  const mockReplyData = [
    {
      id: 'reply-123',
      content: 'Reply goes here',
      comment_id: 'comment-123',
      user_id: 'user-123',
      is_delete: false,
      created_at: '2024-10-07T02:54:38.565Z',
    },
    {
      id: 'reply-207',
      content: 'Reply goes here again',
      comment_id: 'comment-123',
      user_id: 'user-456',
      is_delete: false,
      created_at: '2024-10-07T02:55:46.810Z',
    },
  ];
});
