const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
  },
  {
    method: 'GET',
    path: '/threads',
    handler: handler.getThreadByIdHandler,
  },
];

module.exports = routes;
