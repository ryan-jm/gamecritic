const authRouter = require('express').Router();
const { getAuthInfo, postAuthInfo } = require('../../controllers/auth');

authRouter.route('/').get(getAuthInfo).post(postAuthInfo);

module.exports = authRouter;
