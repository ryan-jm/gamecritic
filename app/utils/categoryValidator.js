const { fetchAllCategories } = require('../models/categories');

const categoryValidator = async (input) => {
  const categories = await fetchAllCategories();

  for (const category of categories) {
    if (input === category.slug) return true;
  }

  return false;
};

module.exports = categoryValidator;
