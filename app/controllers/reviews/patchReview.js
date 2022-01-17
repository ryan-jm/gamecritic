const { updateReview } = require('../../models/reviews');

const patchReview = async (req, res, next) => {
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

module.exports = patchReview;
