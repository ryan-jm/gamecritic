const reviewRouter = require('express').Router();
const {
  getAllReviews,
  getReviewById,
  patchReview,
} = require('../../controllers/reviews');

reviewRouter.get('/', getAllReviews);
reviewRouter.get('/:id', getReviewById);
reviewRouter.patch('/:id', patchReview);

module.exports = reviewRouter;
