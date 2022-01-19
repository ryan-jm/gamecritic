const { fetchSingleUser } = require('../../models/users');

const getSingleUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await fetchSingleUser(username);
    return res.status(200).send({ user });
  } catch (err) {
    return next(err);
  }
};

module.exports = getSingleUser;
