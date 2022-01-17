const db = require('../../../db/connection');

const fetchAllCategories = async () => {
  try {
    const res = await db.query('SELECT * FROM categories');
    return res.rows;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = fetchAllCategories;
