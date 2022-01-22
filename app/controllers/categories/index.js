const {
  fetchAllCategories,
  insertCategory,
} = require('../../models/categories');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await fetchAllCategories();
    return res.status(200).send({ categories });
  } catch (err) {
    return next(err);
  }
};

exports.postCategory = async (req, res, next) => {
  const { body } = req;
  try {
    const category = await insertCategory(body);
    if (category) return res.status(201).send({ category });
  } catch (err) {
    return next(err);
  }
};
