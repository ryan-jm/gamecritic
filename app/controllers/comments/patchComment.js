const { editComment } = require('../../models/comments');

const patchComment = async (req, res, next) => {
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

module.exports = patchComment;
