const userRouter = require('express').Router();
const { getAllUsers, getUserById } = require('../../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.route('/:id').get(getUserById);

module.exports = userRouter;
