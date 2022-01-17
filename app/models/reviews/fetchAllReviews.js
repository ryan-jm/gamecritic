const format = require('pg-format');
const db = require('../../../db/connection');

const fetchAllReviews = async ({
  sort_by = 'created_at',
  order = 'desc',
  category = undefined,
}) => {
  let whereClause = '';
  if (category) whereClause = format(`WHERE reviews.category = %L`, category);
  if (!/^asc$|^desc$/i.test(order)) order = 'desc';

  const query = format(
    `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    JOIN comments 
    ON comments.review_id = reviews.review_id
    %s
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_body, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes
    ORDER BY %s %s`,
    whereClause,
    `reviews.${sort_by}`,
    order.toUpperCase()
  );

  try {
    const res = await db.query(query);
    if (res.rows.length === 0)
      return Promise.reject({ status: 404, message: 'No reviews found' });
    else return res.rows;
  } catch (err) {
    Promise.reject(err);
  }
};

module.exports = fetchAllReviews;
