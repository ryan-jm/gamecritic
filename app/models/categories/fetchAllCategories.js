const db = require('../../../db/connection');

const fetchAllCategories = async () => {
  try {
    const res = await db.query('SELECT * FROM categories');
    return res.rows;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = fetchAllCategories;
