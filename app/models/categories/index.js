const validator = require('../../utils');
const db = require('../../../db/connection');

exports.fetchAllCategories = async () => {
  try {
    const res = await db.query('SELECT * FROM categories;');
    return res.rows;
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.insertCategory = async (body) => {
  const { slug, description } = body;

  if (!slug) {
    return Promise.reject({ status: 400, message: 'Invalid or missing slug' });
  }

  if (!description) {
    return Promise.reject({
      status: 400,
      message: 'Invalid or missing description',
    });
  }

  const categoryExists = await validator.categoryValidator(slug);
  if (categoryExists) {
    return Promise.reject({ status: 400, message: 'Category already exists' });
  }

  try {
    const { rows } = await db.query(
      `
    INSERT INTO categories
    (slug, description)
    VALUES
    ($1, $2)
    RETURNING *;
    `,
      [slug, description]
    );
    if (rows) return rows[0];
  } catch (err) {
    return Promise.reject(err);
  }
};
