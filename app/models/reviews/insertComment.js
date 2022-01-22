const db = require('../../../db/connection');
const validator = require('../../utils/');

const insertComment = async ({ username, body }, id) => {
  const validReview = await validator.reviewValidator(id);
  const userValid = await validator.userValidator(username);

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username or comment body',
    });
  } else if (!validReview) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
  } else if (validReview === 404) {
    return Promise.reject({ status: 404, message: 'Review cannot be found' });
  } else if (userValid === 404) {
    return Promise.reject({ status: 404, message: 'User does not exist' });
  } else {
    try {
      const res = await db.query(
        `
        INSERT INTO comments
        (author, body, review_id, created_at)
        VALUES
        ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *;
        `,
        [username, body, id]
      );
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = insertComment;
