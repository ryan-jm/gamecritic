const jwt = require('jsonwebtoken');

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/../../../.env.${ENV}`,
});

const secret = process.env.JWTSECRET;

exports.verifyCredentials = async (user, password) => {
  if (!user || !password) {
    return Promise.reject({ status: 400, message: 'Missing credentials' });
  } else {
    try {
      const token = jwt.sign(user + password, secret);
      return token;
    } catch (err) {
      return Promise.reject({
        status: 503,
        message: 'Could not verify credentials or generate JWT.',
      });
    }
  }
};
