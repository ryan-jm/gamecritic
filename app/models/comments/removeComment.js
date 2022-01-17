const db = require('../../../db/connection');

const removeComment = async (id) => {
  if (!id || !Boolean(parseInt(id))) {
    return Promise.reject({ status: 400, message: 'Invalid comment id' });
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
