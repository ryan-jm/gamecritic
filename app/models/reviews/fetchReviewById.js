const { reviewValidator } = require('../../utils');
const db = require('../../../db/connection');

const fetchReviewById = async (id) => {
  const isValid = await reviewValidator(id);
  console.log(isValid, id);

  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid ID provided' });
  } else if (isValid === 200) {
    const query = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments 
    ON comments.review_id = $1
    WHERE reviews.review_id = $1
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes`;

    try {
      const res = await db.query(query, [id]);
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.reject({ status: 404, message: 'No review found' });
  }
};

module.exports = fetchReviewById;
