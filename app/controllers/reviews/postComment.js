const { insertComment } = require('../../models/reviews');

const postComment = async (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;

  try {
    const comment = await insertComment(body, id);
    if (comment) return res.status(201).send({ comment });
  } catch (err) {
    return next(err);
  }
};

module.exports = postComment;
