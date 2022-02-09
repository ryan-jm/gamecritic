const {
  fetchAllUsers,
  fetchSingleUser,
  fetchVotes,
  insertVote,
  removeVote,
} = require('../../models/users');

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

exports.getUserVotes = async (req, res, next) => {
  const { username } = req.params;
  const { type } = req.query;

  try {
    const votes = await fetchVotes(username, type);
    return res.status(200).send({ votes });
  } catch (err) {
    return next(err);
  }
};

exports.postVote = async (req, res, next) => {
  const { username } = req.params;
  const { review_id } = req.body;

  try {
    const vote = await insertVote(username, review_id);
    return res.status(201).send({ vote });
  } catch (err) {
    return next(err);
  }
};

exports.deleteVote = async (req, res, next) => {
  const { username } = req.params;
  const { review_id } = req.body;

  try {
    await removeVote(username, review_id);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};
