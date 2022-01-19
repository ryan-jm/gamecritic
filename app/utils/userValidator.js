const db = require('../../db/connection');
const fetchAllUsers = require('../models/users/fetchAllUsers');

const userValidator = async (input = '') => {
  if (typeof input !== 'string') return false;
  const users = await fetchAllUsers();

  for (const user of users) {
    if (input === user.username) return true;
  }

  return false;
};

module.exports = userValidator;
