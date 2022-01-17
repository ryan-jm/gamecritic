const { fetchAllReviews } = require('../../models/reviews');

const getAllReviews = async (req, res, next) => {
  const { query } = req;

  try {
    const reviews = await fetchAllReviews(query);
    return res.status(200).send({ reviews });
  } catch (err) {
    return next(err);
  }
};

module.exports = getAllReviews;
