const { fetchAllCategories } = require('../../models/categories');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await fetchAllCategories();
    return res.status(200).send({ categories });
  } catch (err) {
    return next(err);
  }
};

module.exports = getAllCategories;
