const { deleteComment } = require('../../controllers/comments');
const commentRouter = require('express').Router();

commentRouter.route('/:id').delete(deleteComment);

module.exports = commentRouter;
