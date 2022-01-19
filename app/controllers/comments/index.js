const { removeComment, editComment } = require('../../models/comments');

exports.deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const del = await removeComment(id);
    if (del) res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;

  try {
    const comment = await editComment(body, id);
    return res.status(200).send({ comment });
  } catch (err) {
    return next(err);
  }
};
