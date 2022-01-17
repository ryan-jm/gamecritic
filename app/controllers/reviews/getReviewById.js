const { fetchReviewById } = require('../../models/reviews');

const getReviewById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const review = await fetchReviewById(id);
    return res.status(200).send({ review });
  } catch (err) {
    return next(err);
  }
};

module.exports = getReviewById;
