const reviewRouter = require('express').Router();
const { getReviewById } = require('../../controllers/reviews');

reviewRouter.get('/:id', getReviewById);

module.exports = reviewRouter;
