const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
    await ThreadsTableTestHelper.addThread({ id: threadId, userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      threadId,
      userId,
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist adding reply and return added reply correctly', async () => {
      const newReply = new NewReply({
        content: 'My reply',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await replyRepositoryPostgres.addReply(
        'user-123',
        'comment-123',
        newReply,
      );

      const reply = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      const newReply = new NewReply({
        content: 'My reply',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedReply = await replyRepositoryPostgres.addReply(
        'user-123',
        'comment-123',
        newReply,
      );
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'My reply',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('shoud return correct replies', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });
      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123',
      );
      expect(replies).toHaveLength(2);
    });

    it('should return empty replies but does not throw error', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123',
      );

      expect(Array.isArray(replies)).toBeTruthy();
      expect(replies).toHaveLength(0);
    });
  });

  describe('checkAvailabilityReply function', () => {
    it('should throw error if reply is not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.checkAvailabilityReply('reply-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error if reply is available', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(
        replyRepositoryPostgres.checkAvailabilityReply('reply-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should be able to delete reply', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      replyRepositoryPostgres.deleteReplyById(
        'thread-123',
        'comment-123',
        'reply-123',
      );

      const replies = await replyRepositoryPostgres.getRepliesByCommentId(
        'comment-123',
      );
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError if not the owner of reply', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error if user is the owner of reply', async () => {
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        commentId: 'comment-123',
        threadId: 'thread-123',
        userId: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      await expect(
        replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'),
      ).resolves.toBe();
    });
  });
});
