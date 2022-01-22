const { userValidator } = require('../../utils');
const db = require('../../../db/connection');

const insertReview = async (body) => {
  if (!body) {
    return Promise.reject({ status: 400, message: 'No valid body provided' });
  }

  const { owner, title, review_body, designer, category } = body;

  const userValid = await userValidator(owner);
  if (userValid === 404) {
    return Promise.reject({ status: 400, message: 'User not found' });
  }
};

module.exports = insertReview;
