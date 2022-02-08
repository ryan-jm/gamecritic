const userRouter = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  getUserVotes,
  postVote,
} = require('../../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.route('/:username').get(getSingleUser);
userRouter.route('/:username/votes').get(getUserVotes).post(postVote);

module.exports = userRouter;
