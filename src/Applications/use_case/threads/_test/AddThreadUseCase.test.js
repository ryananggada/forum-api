const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Indonesia Rupiah weakens due to inflation',
      body: 'Recently the conversion rate of US dollar to Indonesian Rupiah rises by 5% in this period.',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-456',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn(() =>
      Promise.resolve(mockAddedThread),
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(
      'user-123',
      useCasePayload,
    );

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-456',
        owner: 'user-123',
        title: useCasePayload.title,
      }),
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      'user-123',
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
    );
  });
});
