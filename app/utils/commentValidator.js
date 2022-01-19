const { idValidator } = require('./');
const db = require('../../db/connection');

const commentValidator = async (id) => {
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
};

module.exports = commentValidator;
