const authRouter = require('express').Router();
const { getAuthInfo, postAuthInfo } = require('../../controllers/auth');

authRouter.get('/', getAuthInfo).post(postAuthInfo);

module.exports = authRouter;
