const reviewRouter = require('express').Router();
const {
  getAllReviews,
  getReviewById,
  patchReview,
  getComments,
  postComment,
  postReview,
} = require('../../controllers/reviews');

reviewRouter.route('/').get(getAllReviews).post(postReview);
reviewRouter.route('/:id').get(getReviewById).patch(patchReview);
reviewRouter.route('/:id/comments').get(getComments).post(postComment);

module.exports = reviewRouter;
