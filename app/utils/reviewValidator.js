const { idValidator } = require('./');
const fetchAllReviews = require('../models/reviews/fetchAllReviews');

const reviewValidator = async (id) => {
  /* Check that the review_id is valid within the database */
  try {
    if (!idValidator(id)) return false;
    else {
      id = parseInt(id);
      if (id < 0) return false;
      const reviews = await fetchAllReviews({});
      console.log(reviews);
      return Boolean(id <= reviews.length) ? 200 : 404;
    }
  } catch (err) {
    console.log('This happens', err);
    return false;
  }
};

module.exports = reviewValidator;
