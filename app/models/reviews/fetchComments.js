const db = require('../../../db/connection');
const { reviewValidator } = require('../../utils');

const fetchComments = async (id) => {
  const isValid = await reviewValidator(id);
  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
  } else {
    try {
      const res = await db.query(
        `SELECT * FROM comments
        WHERE comments.review_id = $1`,
        [id]
      );
      if (res.rows.length === 0)
        return Promise.reject({ status: 404, message: 'No comments found' });
      else return res.rows;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = fetchComments;
