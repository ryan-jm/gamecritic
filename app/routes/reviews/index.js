const reviewRouter = require('express').Router();
const {
  getAllReviews,
  getReviewById,
  patchReview,
  getComments,
  postComment,
} = require('../../controllers/reviews');

reviewRouter.get('/', getAllReviews);
reviewRouter.get('/:id', getReviewById);
reviewRouter.patch('/:id', patchReview);

reviewRouter.get('/:id/comments', getComments);
reviewRouter.post('/:id/comments', postComment);

module.exports = reviewRouter;
