const categoryRouter = require('express').Router();
const {
  getAllCategories,
  postCategory,
} = require('../../controllers/categories');

categoryRouter.route('/').get(getAllCategories).post(postCategory);

module.exports = categoryRouter;
