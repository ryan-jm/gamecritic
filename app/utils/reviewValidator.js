const { idValidator } = require('./');
const { fetchAllReviews } = require('../models/reviews');

const reviewValidator = async (id) => {
  /* Check that the review_id is valid within the database */
  try {
    if (!idValidator(id)) return false;
    else {
      id = parseInt(id);
      if (id < 0) return false;
      const reviews = await fetchAllReviews({});
      return id <= reviews.length ? 200 : 404;
    }
  } catch (err) {
    return false;
  }
};

module.exports = reviewValidator;
