const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Unemployment on the rise',
    };

    expect(() => new NewThread(payload)).toThrow(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 123456,
      body: 'The ministry of Indonesia has reported that Gen Z are struggling to get new jobs.',
    };

    expect(() => new NewThread(payload)).toThrow(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'Unemployment on the rise',
      body: 'The ministry of Indonesia has reported that Gen Z are struggling to get new jobs.',
    };

    const { title, body } = new NewThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
