const format = require('pg-format');
const db = require('../../../db/connection');

const fetchReviewById = async (id) => {
  if (!Boolean(parseInt(id))) {
    return Promise.reject({ status: 400, message: 'Invalid ID provided' });
  } else {
    const query = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    JOIN comments 
    ON comments.review_id = $1
    WHERE reviews.review_id = $1
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes`;

    try {
      const res = await db.query(query, [id]);
      if (res.rows.length === 0)
        return Promise.reject({ status: 404, message: 'No review found' });
      else return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = fetchReviewById;
