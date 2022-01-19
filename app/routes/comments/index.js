const { deleteComment, patchComment } = require('../../controllers/comments');
const commentRouter = require('express').Router();

commentRouter.route('/:id').patch(patchComment).delete(deleteComment);

module.exports = commentRouter;
