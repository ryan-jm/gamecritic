const reviewRouter = require('express').Router();
const {
  getAllReviews,
  getReviewById,
  patchReview,
  getComments,
  postComment,
} = require('../../controllers/reviews');

reviewRouter.get('/', getAllReviews);
reviewRouter.route('/:id').get(getReviewById).patch(patchReview);
reviewRouter.route('/:id/comments').get(getComments).post(postComment);

module.exports = reviewRouter;
