const validator = require('../../utils');
const db = require('../../../db/connection');
const format = require('pg-format');

exports.fetchReviewById = async (id) => {
  const isValid = await validator.reviewValidator(id);

  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid ID provided' });
  } else if (isValid === 200) {
    const query = `
    SELECT reviews.owner, reviews.title, reviews.review_id, reviews.designer, 
    reviews.review_img_url, reviews.category, reviews.review_body, reviews.created_at, reviews.votes, COUNT(comments.comment_id) AS comment_count
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

exports.updateReview = async ({ inc_votes = 0 }, id) => {
  const voteInputValid = validator.idValidator(inc_votes); // Confirms is a number or can be coerced to a number
  const reviewIdValid = await validator.reviewValidator(id);

  if (!reviewIdValid || (!voteInputValid && inc_votes !== 0)) {
    let status, message;

    if (!reviewIdValid) (status = 400), (message = 'Invalid review_id provided');

    if (!voteInputValid) (status = 400), (message = 'Invalid inc_vote value provided');

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

exports.fetchAllReviews = async ({
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

exports.fetchComments = async (id, { p, limit }) => {
  const isValid = await validator.reviewValidator(id);
  const limitValid = typeof limit === 'number' || typeof limit === 'string';
  const pageValid = typeof p === 'number' || typeof p === 'string';

  if (!limitValid) limit = 10;
  if (!pageValid) p = 1;

  const offset = p - 1;
  const pagination = `LIMIT ${limit} OFFSET ${offset * limit}`;

  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
  } else if (isValid === 404) {
    return Promise.reject({ status: 404, message: 'Review cannot be found' });
  } else {
    try {
      const query = format(
        `SELECT * FROM comments WHERE comments.review_id = %s %s;`,
        id,
        pagination
      );
      const res = await db.query(query);
      return res.rows;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

exports.insertComment = async ({ username, body }, id) => {
  const validReview = await validator.reviewValidator(id);
  const userValid = await validator.userValidator(username);

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username or comment body',
    });
  } else if (!validReview) {
    return Promise.reject({ status: 400, message: 'Invalid review id' });
  } else if (validReview === 404) {
    return Promise.reject({ status: 404, message: 'Review cannot be found' });
  } else if (userValid === 404) {
    return Promise.reject({ status: 404, message: 'User does not exist' });
  } else {
    try {
      const res = await db.query(
        `
        INSERT INTO comments
        (author, body, review_id, created_at)
        VALUES
        ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *;
        `,
        [username, body, id]
      );
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

exports.insertReview = async (body) => {
  if (!body) {
    return Promise.reject({ status: 400, message: 'No valid body provided' });
  }

  const { owner, title, review_body, designer, category, review_img_url } = body;

  const userValid = await validator.userValidator(owner);
  const categoryValid = await validator.categoryValidator(category);

  if (userValid === 404 || !userValid) {
    return Promise.reject({ status: 400, message: 'User invalid' });
  }

  if (!categoryValid) {
    return Promise.reject({ status: 400, message: 'Category invalid' });
  }

  try {
    const { rows } = await db.query(
      `
      INSERT INTO reviews
      (title, review_body, designer, category, owner, review_img_url)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [title, review_body, designer, category, owner, review_img_url]
    );
    if (rows.length !== 0) return rows[0];
    else return Promise.reject({ status: 408, message: 'POST failed.' });
  } catch (err) {
    return Promise.reject(err);
  }
};
