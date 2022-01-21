const authRouter = require('express').Router();
const rateLimit = require('express-rate-limit');
const { getAuthInfo, postAuthInfo } = require('../../controllers/auth');

const authRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  handler = (req, res, next) => next({status: 429, message: 'Rate limit exceeded'}),
});

authRouter.use(authRateLimit);

authRouter.route('/').get(getAuthInfo).post(postAuthInfo);

module.exports = authRouter;
