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
  try {
  } catch (err) {
    return Promise.reject(err);
  }
};
