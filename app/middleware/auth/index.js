const jwt = require('jsonwebtoken');

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../../../.env.${ENV}`,
});

const secret = process.env.JWTSECRET;

if (!secret) {
  throw new Error('JWTSECRET not set');
}

const auth = async (req, res, next) => {
  if (req.originalUrl === '/api/auth' || req.originalUrl === '/api')
    return next();
  else {
    const { token } = req.headers;

    if (token) {
      try {
        const verified = jwt.verify(token, secret);
        if (verified) return next();
      } catch (err) {
        return next({
          status: 401,
          message:
            'Unauthorized. Make a GET request to /api/auth to get an access token.',
        });
      }
    } else {
      return next({
        status: 401,
        message:
          'Unauthorized. Make a GET request to /api/auth to get an access token.',
      });
    }
  }
};

module.exports = auth;
