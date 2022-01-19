const { userValidator } = require('../../utils');
const db = require('../../../db/connection');

const fetchSingleUser = async (user) => {
  console.log(userValidator);
  const isValid = await userValidator(user);

  if (!isValid) {
    return Promise.reject({
      status: 400,
      message: 'Invalid username provided',
    });
  } else if (isValid === 404) {
    return Promise.reject({
      status: 404,
      message: 'User does not exist',
    });
  } else {
    try {
      const res = await db.query(`SELECT * FROM users WHERE username = $1`, [
        user,
      ]);
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = fetchSingleUser;
