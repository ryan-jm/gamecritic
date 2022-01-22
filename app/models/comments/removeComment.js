const db = require('../../../db/connection');
const validator = require('../../utils');

const removeComment = async (id) => {
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

module.exports = removeComment;
