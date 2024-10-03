const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-456',
    };

    expect(() => new AddedReply(payload)).toThrow(
      'ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      content: [],
      owner: 'user-456',
    };

    expect(() => new AddedReply(payload)).toThrow(
      'ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'Nice article!',
      owner: 'user-456',
    };

    const { id, content, owner } = new AddedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
