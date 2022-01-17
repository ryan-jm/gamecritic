const categoryRouter = require('express').Router();
const { getAllCategories } = require('../../controllers/categories');

categoryRouter.get('/', getAllCategories);

module.exports = categoryRouter;
