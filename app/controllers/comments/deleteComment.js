const { removeComment } = require('../../models/comments');

const deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const del = await removeComment(id);
    if (del) res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteComment;
