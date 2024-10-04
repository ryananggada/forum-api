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

  /*
  "id": "thread-AqVg2b9JyQXR6wSQ2TmH4",
            "title": "sebuah thread",
            "body": "sebuah body thread",
            "date": "2021-08-08T07:59:16.198Z",
            "username": "dicoding",
            "comments": [
                {
                    "id": "comment-q_0uToswNf6i24RDYZJI3",
                    "username": "dicoding",
                    "date": "2021-08-08T07:59:18.982Z",
                    "replies": [
                        {
                            "id": "reply-BErOXUSefjwWGW1Z10Ihk",
                            "content": "**balasan telah dihapus**",
                            "date": "2021-08-08T07:59:48.766Z",
                            "username": "johndoe"
                        },
                        {
                            "id": "reply-xNBtm9HPR-492AeiimpfN",
                            "content": "sebuah balasan",
                            "date": "2021-08-08T08:07:01.522Z",
                            "username": "dicoding"
                        }
                    ],
                    "content": "sebuah comment"
                }
  */

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
    username: 'johncena',
  };
  /*
  const mockCommentData = {
    comments: [
      {
        id: "comment-q_0uToswNf6i24RDYZJI3",
                    "username": "dicoding",
                    "date": "2021-08-08T07:59:18.982Z",
                    "replies": [
                        {
                            "id": "reply-BErOXUSefjwWGW1Z10Ihk",
                            "content": "**balasan telah dihapus**",
                            "date": "2021-08-08T07:59:48.766Z",
                            "username": "johndoe"
                        },
                        {
                            "id": "reply-xNBtm9HPR-492AeiimpfN",
                            "content": "sebuah balasan",
                            "date": "2021-08-08T08:07:01.522Z",
                            "username": "dicoding"
                        }
                    ],
                    "content": "sebuah comment"
      },
      {

      }
    ]
  }
    */
});
