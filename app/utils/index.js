const fetchAllReviews = require('../models/reviews/fetchAllReviews');
const fetchAllUsers = require('../models/users/fetchAllUsers');
const db = require('../../db/connection');

function idValidator(id) {
  if (typeof id !== 'string' && typeof id !== 'number') return false;
  return Boolean(parseInt(id));
}

async function reviewValidator(id) {
  /* Check that the review_id is valid within the database */
  try {
    if (!idValidator(id)) return false;
    else {
      id = parseInt(id);
      if (id < 0) return false;
      const reviews = await fetchAllReviews({});
      return id <= reviews.length ? 200 : 404;
    }
  } catch (err) {
    return false;
  }
}

async function userValidator(username) {
  if (typeof username !== 'string') return false;

  const coercable = idValidator(username);
  if (coercable) return false;

  const users = await fetchAllUsers();
  for (const user of users) {
    if (username === user.username) return 200;
  }

  return 404;
}

async function commentValidator(id) {
  /* Check that the comment_id is valid within the database */

  try {
    if (!idValidator(id)) return false;
    else {
      id = parseInt(id);
      if (id < 0) return false;
      /* Will turn this into an endpoint using MVC pattern at some point */
      const { rows: comments } = await db.query(`SELECT * FROM comments;`);
      return id <= comments.length ? 200 : 404;
    }
  } catch (err) {
    return false;
  }
}

module.exports = {
  idValidator,
  reviewValidator,
  userValidator,
  commentValidator,
};
