const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'ryananggada',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'A thread title',
      body: 'Content goes here',
      userId: 'user-123',
    });
    await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      content: 'New comment',
      threadId: 'thread-123',
      userId: 'user-123',
    });
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist adding like correctly and return added like correctly', async () => {
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await likeRepositoryPostgres.addLike(
        'user-123',
        'thread-123',
        'comment-123',
      );
      const like = await LikesTableTestHelper.findLikesById('like-123');

      expect(like).toHaveLength(1);
      expect(like[0]).toStrictEqual({
        id: 'like-123',
        user_id: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
      });
    });
  });

  describe('deleteLikeById', () => {
    it('should be able to delete like', async () => {
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const response = likeRepositoryPostgres.deleteLikeById('like-123');

      expect(response).resolves.toBeDefined();
    });
  });

  describe('getHasLiked', () => {
    it('should be able to get has liked', async () => {
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const like = await likeRepositoryPostgres.getHasLiked(
        'user-123',
        'thread-123',
        'comment-123',
      );

      expect(like).toHaveLength(1);
      expect(like[0].id).toBe('like-123');
    });
  });

  describe('getLikesByThreadId', () => {
    it('should be able to get likes by thread id', async () => {
      await LikesTableTestHelper.addLike({
        id: 'like-123',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const likes = await likeRepositoryPostgres.getLikesByThreadId(
        'thread-123',
      );

      expect(likes).toHaveLength(1);
      expect(likes[0]).toStrictEqual({
        id: 'like-123',
        user_id: 'user-123',
        thread_id: 'thread-123',
        comment_id: 'comment-123',
      });
    });
  });
});
