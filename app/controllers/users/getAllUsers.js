const { fetchAllUsers } = require('../../models/users');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    return res.status(200).send({ users });
  } catch (err) {
    return next(err);
  }
};

module.exports = getAllUsers;
