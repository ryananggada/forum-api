const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'ryananggada',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist adding thread and return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await threadRepositoryPostgres.addThread('user-123', newThread);

      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'Thread title',
        body: 'Thread body',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const addedThread = await threadRepositoryPostgres.addThread(
        'user-123',
        newThread,
      );

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'Thread title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById('thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return correct thread', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Thread title',
        body: 'Content of a thread',
        userId: 'user-123',
        createdAt: '2024-10-11T02:15:46.336Z',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'Thread title',
        body: 'Content of a thread',
        username: 'ryananggada',
        created_at: expect.any(Date),
      });
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError if thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw any error if thread is found', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Thread title',
        body: 'Content of a thread',
        userId: 'user-123',
        createdAt: '2024-10-11T02:15:46.336Z',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
