const userValidator = require('../../utils/userValidator');
const db = require('../../../db/connection');

const fetchUserById = async (id) => {
  const isValid = await userValidator(id);

  if (!isValid) {
    return Promise.reject({ status: 400, message: 'Invalid user id provided' });
  } else if (isValid === 404) {
    return Promise.reject({
      status: 404,
      message: 'User does not exist',
    });
  } else {
    try {
      const res = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
        id,
      ]);
      return res.rows[0];
    } catch (err) {
      return Promise.reject(err);
    }
  }
};

module.exports = fetchUserById;
