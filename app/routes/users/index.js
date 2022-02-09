const userRouter = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  getUserVotes,
  postVote,
  deleteVote,
} = require('../../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.route('/:username').get(getSingleUser);
userRouter.route('/:username/votes').get(getUserVotes).post(postVote);
userRouter.route('/:username/votes/:review_id').delete(deleteVote);

module.exports = userRouter;
