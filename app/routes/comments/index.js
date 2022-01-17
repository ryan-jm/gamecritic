const { deleteComment } = require('../../controllers/comments');
const commentRouter = require('express').Router();

commentRouter.delete('/:id', deleteComment);

module.exports = commentRouter;
