const reviewRouter = require('express').Router();
const {
  getAllReviews,
  getReviewById,
  patchReview,
  getComments,
} = require('../../controllers/reviews');

reviewRouter.get('/', getAllReviews);
reviewRouter.get('/:id', getReviewById);
reviewRouter.patch('/:id', patchReview);

reviewRouter.get('/:id/comments', getComments);

module.exports = reviewRouter;
