const db = require('../../../db/connection');
const validator = require('../../utils');
const { updateReview } = require('../reviews');

exports.fetchAllUsers = async () => {
  try {
    const res = await db.query('SELECT username FROM users;');
    return res.rows;
  } catch (err) {
    return Promise.reject(err);
  }
};

exports.fetchSingleUser = async (user) => {
  const isValid = await validator.userValidator(user);

  if (!isValid) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username provided',
    });
  } else if (isValid === 404) {
    return Promise.reject({
      status: 404,
      message: 'User does not exist',
    });
  } else {
    try {
      const res = await db.query(`SELECT * FROM users WHERE username = $1`, [
        user,
      ]);
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

exports.fetchVotes = async (username, type) => {
  const isValid = await validator.userValidator(username);

  if (!isValid) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username provided',
    });
  } else if (isValid === 404) {
    return Promise.reject({
      status: 404,
      message: 'User does not exist',
    });
  } else {
    try {
      const res = await db.query(`SELECT * FROM reviewvotes WHERE owner = $1`, [
        username,
      ]);
      return res.rows;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

exports.insertVote = async (username, review) => {
  const isValid = await validator.userValidator(username);

  if (!isValid) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username provided',
    });
  } else if (isValid === 404) {
    return Promise.reject({
      status: 404,
      message: 'User does not exist',
    });
  } else {
    try {
      await updateReview({ inc_votes: 1 }, review);
      const res = await db.query(
        `INSERT INTO reviewvotes (owner, review) VALUES ($1, $2) RETURNING *;`,
        [username, review]
      );
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

exports.removeVote = async (username, review_id) => {
  const isValid = await validator.userValidator(username);

  if (!isValid) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username provided',
    });
  } else if (isValid === 404) {
    return Promise.reject({
      status: 404,
      message: 'User does not exist',
    });
  } else {
    try {
      await db.query(
        `DELETE FROM reviewvotes WHERE owner = $1 AND review = $2;`,
        [username, review_id]
      );
      const res = await updateReview({ inc_votes: -1 }, review_id);
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
