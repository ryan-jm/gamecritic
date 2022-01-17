const { fetchComments } = require('../../models/reviews');

const getComments = async (req, res, next) => {
  const { id } = req.params;

  try {
    const comments = await fetchComments(id);
    return res.status(200).send({ comments });
  } catch (err) {
    return next(err);
  }
};

module.exports = getComments;
