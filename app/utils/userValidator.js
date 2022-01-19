const db = require('../../db/connection');
const fetchAllUsers = require('../models/users/fetchAllUsers');
const idValidator = require('./idValidator');

const userValidator = async (id) => {
  if (!idValidator(id)) return false;
  else id = parseInt(id);
  const users = await fetchAllUsers();

  return id <= users.length ? 200 : 404;
};

module.exports = userValidator;
