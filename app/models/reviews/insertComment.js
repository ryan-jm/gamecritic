const format = require('pg-format');
const db = require('../../../db/connection');

const insertComment = async ({ username, body }, id) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username or comment body',
    });
  } else if (!id || !Boolean(parseInt(id))) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
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
