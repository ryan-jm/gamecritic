const format = require('pg-format');
const db = require('../../../db/connection');
const validator = require('../../utils');

const fetchComments = async (id, { p, limit }) => {
  const isValid = await validator.reviewValidator(id);
  const limitValid = typeof limit === 'number' || typeof limit === 'string';
  const pageValid = typeof p === 'number' || typeof p === 'string';

  if (!limitValid) limit = 10;
  if (!pageValid) p = 1;

  const offset = p - 1;
  const pagination = `LIMIT ${limit} OFFSET ${offset * limit}`;

  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
  } else if (isValid === 404) {
    return Promise.reject({ status: 404, message: 'Review cannot be found' });
  } else {
    try {
      const query = format(
        `SELECT * FROM comments WHERE comments.review_id = %s %s;`,
        id,
        pagination
      );
      const res = await db.query(query);
      return res.rows;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = fetchComments;
