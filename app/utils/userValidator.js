const fetchAllUsers = require('../models/users/fetchAllUsers');

const userValidator = async (username) => {
  if (typeof username !== 'string') return false;
  const users = await fetchAllUsers();
  for (const user of users) {
    if (username === user.username) return 200;
  }

  return 404;
};

module.exports = userValidator;
