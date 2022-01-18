module.exports = {
  version: '1.0',
  GET: {
    '/api': {
      params: [],
      queries: [],
      response: 'Lists all endpoints',
    },
    '/api/categories': {
      params: [],
      queries: [],
      response: 'All categories',
    },
    '/api/reviews': {
      params: ['/:id', '/:id/comments'],
      queries: ['?sort_by', '?order', '?limit', '?p', '?category'],
      response: 'All reviews or review(s) corresponding to params / queries',
    },
  },
  POST: {
    '/api/reviews/:id/comments': {
      expeced: {
        username: 'A unique, valid username',
        body: 'The comment body',
      },
      response: 'The posted comment',
    },
  },
  PATCH: {
    '/api/reviews/:id': {
      expected: {
        inc_votes: '<int>',
      },
      response: 'The patched review',
    },
  },
  DELETE: {
    '/api/comments/:id': {
      response: 'Status code 204 & no content',
    },
  },
};
