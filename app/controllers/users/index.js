const { fetchAllUsers, fetchSingleUser } = require('../../models/users');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchAllUsers();
    return res.status(200).send({ users });
  } catch (err) {
    return next(err);
  }
};

exports.getSingleUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchSingleUser(username);
    return res.status(200).send({ user });
  } catch (err) {
    return next(err);
  }
};
