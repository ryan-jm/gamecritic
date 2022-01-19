const format = require('pg-format');
const db = require('../../../db/connection');
const categoryValidator = require('../../utils/categoryValidator');

const fetchAllReviews = async ({
  sort_by = 'created_at',
  order = 'desc',
  category = undefined,
}) => {
  let whereClause = '';

  if (category) {
    const categoryValid = await categoryValidator(category);
    if (!categoryValid)
      return Promise.reject({ status: 404, message: 'Category non-existent' });
    else whereClause = format(`WHERE reviews.category = %L`, category);
  }

  if (!/^asc$|^desc$/i.test(order))
    return Promise.reject({ status: 400, message: 'Invalid order query' });

  const query = format(
    `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments 
    ON comments.review_id = reviews.review_id
    %s
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes
    ORDER BY %s %s`,
    whereClause,
    `reviews.${sort_by}`,
    order.toUpperCase()
  );

  try {
    const res = await db.query(query);
    return res.rows;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = fetchAllReviews;
