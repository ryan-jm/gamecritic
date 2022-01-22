const validator = require('../../utils');
const db = require('../../../db/connection');

const insertReview = async (body) => {
  if (!body) {
    return Promise.reject({ status: 400, message: 'No valid body provided' });
  }

  const { owner, title, review_body, designer, category } = body;

  const userValid = await validator.userValidator(owner);
  const categoryValid = await validator.categoryValidator(category);

  if (userValid === 404) {
    return Promise.reject({ status: 400, message: 'User not found' });
  }

  if (!categoryValid) {
    return Promise.reject({ status: 400, message: 'Category invalid' });
  }

  try {
    const { rows } = await db.query(
      `
      INSERT INTO reviews
      (title, review_body, designer, category, owner)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [title, review_body, designer, category, owner]
    );
    if (rows.length !== 0) return rows[0];
    else return Promise.reject({ status: 408, message: 'POST failed.' });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = insertReview;
