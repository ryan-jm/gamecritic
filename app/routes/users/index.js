const userRouter = require('express').Router();
const { getAllUsers, getSingleUser } = require('../../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.route('/:username').get(getSingleUser);

module.exports = userRouter;
