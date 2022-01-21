const { commentValidator, idValidator } = require('../../utils');
const db = require('../../../db/connection');
const format = require('pg-format');

const editComment = async ({ inc_votes }, id) => {
  const commentValid = await commentValidator(id);
  if (!inc_votes) inc_votes = 0;
  const votesValid = idValidator(inc_votes);

  if (!votesValid && inc_votes !== 0) {
    return Promise.reject({ status: 400, message: 'Invalid inc_votes value' });
  }

  if (!commentValid) {
    return Promise.reject({ status: 400, message: 'Invalid comment id' });
  } else if (commentValid === 404) {
    return Promise.reject({ status: 404, message: 'Comment does not exist' });
  } else {
    const query = format(
      `
      UPDATE comments
      SET votes = votes + %L
      WHERE comments.comment_id = %L
      RETURNING *;`,
      inc_votes,
      id
    );
    try {
      const res = await db.query(query);
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = editComment;
