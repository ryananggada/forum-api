const CommentDetail = require('../CommentDetail');

describe('CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      date: '2022-09-09T09:15:30.338Z',
      content: 'Nice article!',
      replies: [],
      likeCount: 0,
    };

    expect(() => new CommentDetail(payload)).toThrow(
      'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-456',
      date: '2022-09-09T09:15:30.338Z',
      content: 123,
      likeCount: 0,
      replies: [],
    };

    expect(() => new CommentDetail(payload)).toThrow(
      'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CommentDetail object correctly when isDeleted is false', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-456',
      date: '2022-09-09T09:15:30.338Z',
      content: 'Nice article!',
      replies: [],
      likeCount: 0,
      isDelete: false,
    };

    const { id, username, date, content, likeCount, replies } =
      new CommentDetail(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(likeCount).toEqual(payload.likeCount);
    expect(replies).toEqual(payload.replies);
  });

  it('should create CommentDetail object correctly when isDeleted is true', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-456',
      date: '2022-09-09T09:15:30.338Z',
      content: 'Nice article!',
      replies: [],
      likeCount: 0,
      isDelete: true,
    };

    const { id, username, date, content, likeCount, replies } =
      new CommentDetail(payload);

    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(likeCount).toEqual(0);
    expect(replies).toEqual(payload.replies);
  });
});
