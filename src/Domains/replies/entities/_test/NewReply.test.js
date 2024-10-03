const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new NewReply(payload)).toThrow(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: true,
    };

    expect(() => new NewReply(payload)).toThrow(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewReply object correctly', () => {
    const payload = {
      content: 'Nice article!',
    };

    const { content } = new NewReply(payload);

    expect(content).toEqual(payload.content);
  });
});
