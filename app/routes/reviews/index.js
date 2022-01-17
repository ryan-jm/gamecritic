const reviewRouter = require('express').Router();
const { getReviewById, patchReview } = require('../../controllers/reviews');

reviewRouter.get('/:id', getReviewById);
reviewRouter.patch('/:id', patchReview);

module.exports = reviewRouter;
