const {
  fetchAllReviews,
  fetchComments,
  fetchReviewById,
  updateReview,
  insertComment,
  insertReview,
} = require('../../models/reviews');

exports.getReviewById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await fetchReviewById(id);
    return res.status(200).send({ review });
  } catch (err) {
    return next(err);
  }
};

exports.patchReview = async (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;

  try {
    const updatedReview = await updateReview(body, id);
    return res.status(200).send({ review: updatedReview });
  } catch (err) {
    return next(err);
  }
};

exports.getAllReviews = async (req, res, next) => {
  const { query } = req;

  try {
    const { reviews, limit, page } = await fetchAllReviews(query);
    return res.status(200).send({ reviews, limit, page });
  } catch (err) {
    return next(err);
  }
};

exports.getComments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const comments = await fetchComments(id, req.query);
    return res.status(200).send({ comments });
  } catch (err) {
    return next(err);
  }
};

exports.postComment = async (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;

  try {
    const comment = await insertComment(body, id);
    if (comment) return res.status(201).send({ comment });
  } catch (err) {
    return next(err);
  }
};

exports.postReview = async (req, res, next) => {
  const { body } = req;

  try {
    const review = await insertReview(body);
    if (review) return res.status(201).send({ review });
  } catch (err) {
    return next(err);
  }
};
