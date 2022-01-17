module.exports = {
  version: 1.0,
  GET: {
    categories: {
      params: [],
      queries: [],
      response: 'All categories',
    },
    reviews: {
      params: [':id', ':id/comments'],
      queries: {
        '?sort_by': [
          'owner',
          'title',
          'review_id',
          'category',
          'created_at',
          'votes',
          'comment_count',
        ],
        '?order': ['asc', 'desc'],
        '?category': [
          'strategy',
          'hidden-roles',
          'dexterity',
          'push-your-luck',
          'roll-and-write',
          'deck-building',
          'engine-building',
        ],
      },
      response: 'All reviews or review(s) corresponding to params / queries',
    },
    api: 'Lists all endpoints',
  },
  POST: {},
  PATCH: {},
};
