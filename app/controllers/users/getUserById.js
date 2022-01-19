const { fetchUserById } = require('../../models/users');

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await fetchUserById(id);
    return res.status(200).send({ user });
  } catch (err) {
    return next(err);
  }
};

module.exports = getUserById;
