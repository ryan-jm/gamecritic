const validator = require('../../utils');
const db = require('../../../db/connection');
const format = require('pg-format');

exports.removeComment = async (id) => {
  const isValid = await validator.commentValidator(id);
  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid comment id' });
  } else if (isValid === 404) {
    return Promise.reject({ status: 404, message: 'Comment does not exist' });
  } else {
    try {
      const res = await db.query(
        `DELETE FROM comments
        WHERE comment_id = $1;`,
        [id]
      );
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

exports.editComment = async ({ inc_votes, body = '' }, id) => {
  const commentValid = await validator.commentValidator(id);
  if (!inc_votes) inc_votes = 0;
  const votesValid = validator.idValidator(inc_votes);

  if (!votesValid && inc_votes !== 0) {
    return Promise.reject({ status: 400, message: 'Invalid inc_votes value' });
  }

  if (!commentValid) {
    return Promise.reject({ status: 400, message: 'Invalid comment id' });
  } else if (commentValid === 404) {
    return Promise.reject({ status: 404, message: 'Comment does not exist' });
  } else {
    let query = format(
      `
      UPDATE comments
      SET votes = votes + %L
      WHERE comments.comment_id = %L
      RETURNING *;`,
      inc_votes,
      id
    );
    if (body) {
      query = format(
        `
        UPDATE comments
        SET votes = votes + %L, body = %L
        WHERE comments.comment_id = %L
        RETURNING *;`,
        inc_votes,
        body,
        id
      );
    }
    try {
      const res = await db.query(query);
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
