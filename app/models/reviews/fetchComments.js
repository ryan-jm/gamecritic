const db = require('../../../db/connection');
const { reviewValidator } = require('../../utils');

const fetchComments = async (id) => {
  const isValid = await reviewValidator(id);
  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
  } else if (isValid === 404) {
    return Promise.reject({ status: 404, message: 'Review cannot be found' });
  } else {
    try {
      const res = await db.query(
        `SELECT * FROM comments
        WHERE comments.review_id = $1`,
        [id]
      );
      return res.rows;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = fetchComments;
