const { fetchAllUsers } = require('../../models/users');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAllUsers;
