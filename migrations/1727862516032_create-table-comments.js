/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    thread: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
