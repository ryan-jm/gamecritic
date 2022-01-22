const format = require('pg-format');
const validator = require('../../utils');
const db = require('../../../db/connection');

const fetchAllReviews = async ({
  sort_by = 'created_at',
  order = 'desc',
  category = undefined,
  limit = 10,
  p = 1,
}) => {
  let whereClause = '';
  const limitValid = typeof limit === 'number' || typeof limit === 'string';
  const pageValid = typeof p === 'number' || typeof p === 'string';

  if (!limitValid) limit = 10;
  if (!pageValid) p = 1;

  const offset = p - 1;
  const pagination = `LIMIT ${limit} OFFSET ${offset * limit}`;

  if (category) {
    const categoryValid = await validator.categoryValidator(category);
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
    ORDER BY %s %s
    %s`,
    whereClause,
    `reviews.${sort_by}`,
    order.toUpperCase(),
    pagination
  );

  try {
    const res = await db.query(query);
    return { reviews: res.rows, limit, page: p };
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = fetchAllReviews;
