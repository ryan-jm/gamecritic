const db = require('../../../db/connection');
const format = require('pg-format');
const { reviewValidator, idValidator } = require('../../utils');

const updateReview = async ({ inc_votes = 0 }, id) => {
  const voteInputValid = idValidator(inc_votes); // Confirms is a number or can be coerced to a number
  const reviewIdValid = await reviewValidator(id);

  if (!reviewIdValid || (!voteInputValid && inc_votes !== 0)) {
    let status, message;

    if (!reviewIdValid)
      (status = 400), (message = 'Invalid review_id provided');

    if (!voteInputValid)
      (status = 400), (message = 'Invalid inc_vote value provided');

    return Promise.reject({
      status,
      message,
    });
  } else {
    const query = format(
      `
      UPDATE reviews
      SET votes = votes + %L
      WHERE reviews.review_id = %L
      RETURNING *;`,
      inc_votes,
      id
    );

    try {
      const res = await db.query(query);
      if (res.rows.length === 0)
        return Promise.reject({ status: 404, message: 'No review found' });
      else return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = updateReview;
